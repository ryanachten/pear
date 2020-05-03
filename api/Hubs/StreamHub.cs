using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
namespace api.Hubs
{
    public class StreamHub : Hub
    {
        public async Task NewMessage(string message)
        {
            await Clients.All.SendAsync("messageReceived", message);
        }
    }
}