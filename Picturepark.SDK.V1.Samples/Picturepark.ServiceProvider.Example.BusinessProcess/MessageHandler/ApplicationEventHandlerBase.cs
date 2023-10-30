using System.Threading.Tasks;
using Picturepark.SDK.V1.Contract;

namespace Picturepark.ServiceProvider.Example.BusinessProcess.MessageHandler;

internal abstract class ApplicationEventHandlerBase<T> : IApplicationEventHandler where T : ApplicationEvent
{
    public bool Accept(ApplicationEvent applicationEvent)
    {
        return applicationEvent is T;
    }

    public Task Handle(ApplicationEvent applicationEvent)
    {
        return Handle((T)applicationEvent);
    }

    protected abstract Task Handle(T applicationEvent);
}
