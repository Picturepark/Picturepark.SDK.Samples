using System.Threading.Tasks;
using Picturepark.SDK.V1.Contract;
using Picturepark.ServiceProvider.Example.BusinessProcess.BusinessProcess;

namespace Picturepark.ServiceProvider.Example.BusinessProcess.MessageHandler;

internal class BusinessProcessCancellationRequestedEventHandler  : ApplicationEventHandlerBase<BusinessProcessCancellationRequestedEvent>
{
    private readonly IBusinessProcessCancellationManager _cancellationManager;

    public BusinessProcessCancellationRequestedEventHandler(IBusinessProcessCancellationManager cancellationManager)
    {
        _cancellationManager = cancellationManager;
    }

    protected override Task Handle(BusinessProcessCancellationRequestedEvent applicationEvent)
    {
        var businessProcessId = applicationEvent.BusinessProcessId;
        _cancellationManager.MarkToBeCancelled(businessProcessId);
        return Task.CompletedTask;
    }
}
