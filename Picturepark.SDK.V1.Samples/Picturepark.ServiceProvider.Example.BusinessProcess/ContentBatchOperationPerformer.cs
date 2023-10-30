using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Picturepark.SDK.V1.Contract;
using Picturepark.ServiceProvider.Example.BusinessProcess.BusinessProcess;
using Picturepark.ServiceProvider.Example.BusinessProcess.Config;
using Picturepark.ServiceProvider.Example.BusinessProcess.Util;
using Channel = System.Threading.Channels.Channel;

namespace Picturepark.ServiceProvider.Example.BusinessProcess;

internal class ContentBatchDownloadService : IHostedService, IDisposable
{
    private readonly ILogger<ContentBatchDownloadService> _logger;
    private readonly ContentIdQueue _contentQueue;
    private readonly IOptions<SampleConfiguration> _config;
    private readonly Func<IPictureparkService> _clientFactory;
    private readonly IBusinessProcessCancellationManager _cancellationManager;
    private readonly CancellationTokenSource _taskCancellationTokenSource;
    private readonly Channel<string[]> _batches = Channel.CreateUnbounded<string[]>();

    private Task _batchingTask;
    private Task _downloadTask;

    public ContentBatchDownloadService(
        ILogger<ContentBatchDownloadService> logger,
        ContentIdQueue contentQueue,
        IOptions<SampleConfiguration> config,
        Func<IPictureparkService> clientFactory,
        IBusinessProcessCancellationManager cancellationManager)
    {
        _logger = logger;
        _contentQueue = contentQueue;
        _config = config;
        _clientFactory = clientFactory;
        _cancellationManager = cancellationManager;
        _taskCancellationTokenSource = new CancellationTokenSource();
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _batchingTask = Task.Run(GatherBatches, CancellationToken.None);
        _downloadTask = Task.Run(DownloadBatches, CancellationToken.None);
        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        _contentQueue.Complete();
        _taskCancellationTokenSource.Cancel();

        var batchingTask = _batchingTask ?? Task.CompletedTask;
        var downloadTask = _downloadTask ?? Task.CompletedTask;

        await Task.WhenAll(batchingTask, downloadTask);
    }

    public void Dispose()
    {
        _batchingTask?.Dispose();
        _taskCancellationTokenSource?.Dispose();
    }

    private async Task GatherBatches()
    {
        while (!_taskCancellationTokenSource.IsCancellationRequested)
        {
            _logger.LogInformation("Waiting for work...");

            using var ctsBatchTimeout = CancellationTokenSource.CreateLinkedTokenSource(_taskCancellationTokenSource.Token);
            ctsBatchTimeout.CancelAfter(_config.Value.InactivityTimeout);

            var batch = new List<string>(_config.Value.BatchSize);

            try
            {
                await foreach (var contentId in _contentQueue.ReadAll(ctsBatchTimeout.Token))
                {
                    batch.Add(contentId);
                    if (batch.Count >= _config.Value.BatchSize)
                        break;
                }
            }
            catch (OperationCanceledException)
            {
                // expected on inactivityTimeout
            }

            if (ctsBatchTimeout.IsCancellationRequested)
                _logger.LogInformation("Inactivity period elapsed or shutdown requested");

            if (batch.Count > 0)
            {
                _logger.LogInformation("Got {BatchCount} content ids to download original", batch.Count);
                await _batches.Writer.WriteAsync(batch.ToArray(), CancellationToken.None);
            }
        }

        _batches.Writer.Complete();
    }

    private async Task DownloadBatches()
    {
        try
        {
            await foreach (var batch in _batches.Reader.ReadAllAsync(CancellationToken.None))
            {
                _logger.LogInformation("Downloading batch consisting of {BatchLength} items", batch.Length);

                TranslatedStringDictionary GetTitle(string state) => new() { { "en", $"Content carbon copy {state}" } };
                TranslatedStringDictionary GetProgress(int n) => new() { { "en", $"Downloaded {n}/{batch.Length} contents" } };

                var client = _clientFactory();

                var businessProcess = await client.BusinessProcess.CreateAsync(
                    new BusinessProcessCreateRequest
                    {
                        SupportsCancellation = true,
                        InitialState = "InProgress",
                        Notification = new BusinessProcessNotificationUpdate
                        {
                            EventType = NotificationEventType.InProgress,
                            Title = GetTitle("in progress"),
                            Message = GetProgress(0)
                        }
                    });

                if (!Directory.Exists(_config.Value.OutputDownloadDirectory))
                    Directory.CreateDirectory(_config.Value.OutputDownloadDirectory);

                var done = 0;
                var cancelled = false;

                foreach (var contentId in batch)
                {
                    if (_cancellationManager.IsCancelled(businessProcess.Id))
                    {
                        cancelled = true;
                        break;
                    }

                    var response = await client.Content.DownloadAsync(contentId, "Original");

                    await using (var fs = new FileStream(Path.Combine(_config.Value.OutputDownloadDirectory, contentId + $"{DateTime.Now:yy-MM-dd-HH-mm-ss}.jpg"), FileMode.CreateNew))
                    {
                        await response.Stream.CopyToAsync(fs);
                    }

                    await client.BusinessProcess.UpdateNotificationAsync(
                        businessProcess.Id,
                        new BusinessProcessNotificationUpdateRequest
                        {
                            EventType = NotificationEventType.InProgress,
                            Title = GetTitle("in progress"),
                            Message = GetProgress(++done)
                        });

                    await Task.Delay(TimeSpan.FromSeconds(1)); // make task artificially slower to demonstrate cancellation in the UI
                }

                await client.BusinessProcess.ChangeStateAsync(
                    businessProcess.Id,
                    new BusinessProcessStateChangeRequest
                    {
                        LifeCycle = cancelled ? BusinessProcessLifeCycle.Cancelled : BusinessProcessLifeCycle.Succeeded,
                        State = cancelled ? "Cancelled" : "Finished",
                        Notification = new BusinessProcessNotificationUpdate
                        {
                            EventType = cancelled ? NotificationEventType.Warning : NotificationEventType.Success,
                            Title = GetTitle(cancelled ? "cancelled" : "finished"),
                            Message = GetProgress(done),
                            NavigationLink = "https://www.picturepark.com"
                        }
                    });
            }
        }
        catch (OperationCanceledException)
        {
            // ignored
        }

        _logger.LogInformation("Shutdown completed");
    }
}
