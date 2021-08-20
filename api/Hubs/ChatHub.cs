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
    }
}