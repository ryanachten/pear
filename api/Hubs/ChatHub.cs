using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using api.Models;
using api.Hubs.Clients;

namespace api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }
        public async Task SendStream(object stream)
        {
            await Clients.All.ReceiveStream(stream);
        }
        public async Task SendSignal(object signal)
        {
            await Clients.All.ReceiveSignal(signal);
        }
    }
}