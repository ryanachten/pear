using System.Threading.Tasks;
using Echo.Models;

namespace Echo.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
        Task ReceiveNewPeer(SignalRequest peer);
        Task ReceiveNewInitiator(SignalRequest peer);
        Task ReceiveSignal(SignalRequest stream);
        Task ReceivePeerDisconnected(SignalRequest peer);
    }
}