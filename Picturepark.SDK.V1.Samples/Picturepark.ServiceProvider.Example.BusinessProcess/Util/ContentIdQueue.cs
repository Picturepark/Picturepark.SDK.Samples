using System.Collections.Generic;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Picturepark.ServiceProvider.Example.BusinessProcess.Util;

internal class ContentIdQueue
{
    private readonly Channel<string> _channel = Channel.CreateUnbounded<string>();

    public async Task Enqueue(string contentId)
    {
        await _channel.Writer.WriteAsync(contentId);
    }

   public IAsyncEnumerable<string> ReadAll(CancellationToken cancellationToken)
    {
        return _channel.Reader.ReadAllAsync(cancellationToken);
    }

    public void Complete()
    {
        _channel.Writer.Complete();
    }
}
