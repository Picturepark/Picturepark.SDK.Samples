using System;
using System.Reactive;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Picturepark.SDK.V1.ServiceProvider;
using Picturepark.SDK.V1.ServiceProvider.Buffer;
using Picturepark.ServiceProvider.Example.BusinessProcess.Config;
using Picturepark.ServiceProvider.Example.BusinessProcess.MessageHandler;

namespace Picturepark.ServiceProvider.Example.BusinessProcess;

public class LiveStreamSubscriber : IHostedService, IAsyncDisposable
{
    private readonly ILogger<LiveStreamSubscriber> _logger;
    private readonly IApplicationEventHandlerFactory _eventHandlerFactory;
    private readonly Configuration _serviceProviderConfiguration;

    private ServiceProviderClient _client;
    private IDisposable _subscription;

    public LiveStreamSubscriber(ILogger<LiveStreamSubscriber> logger, IOptions<SampleConfiguration> config, IApplicationEventHandlerFactory eventHandlerFactory)
    {
        _logger = logger;
        _eventHandlerFactory = eventHandlerFactory;

        _serviceProviderConfiguration = new Picturepark.SDK.V1.ServiceProvider.Configuration
        {
            Host = config.Value.IntegrationHost,
            Port = config.Value.IntegrationPort.ToString(),
            NodeId = Environment.MachineName,
            ServiceProviderId = config.Value.ServiceProviderId,
            User = config.Value.ServiceProviderId,
            Password = config.Value.Secret,
            UseSsl = config.Value.UseSsl
        };
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Subscribing to live stream");
        _client = new ServiceProviderClient(_serviceProviderConfiguration);
        _subscription = (await _client.GetLiveStreamObserver(cancellationToken: cancellationToken)).Subscribe(OnLiveStreamEvent);
    }

    private void OnLiveStreamEvent(EventPattern<EventArgsLiveStreamMessage> e)
    {
        var applicationEvent = e.EventArgs.Message.ApplicationEvent;

        if (applicationEvent != null)
        {
            var handler = _eventHandlerFactory.Get(applicationEvent);
            handler?.Handle(applicationEvent);

            e.EventArgs.Ack();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public async ValueTask DisposeAsync()
    {
        if(_client is not null)
            await _client.DisposeAsync();
        _subscription?.Dispose();
    }
}