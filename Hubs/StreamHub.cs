using Echo.Models;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Threading.Tasks;
namespace Echo.Hubs
{
    public class StreamHub : Hub
    {

        public async Task NewUser(string username)
        {
            var user = new User()
            {
                Username = username,
                ConnectionId = Context.ConnectionId
            };
            await Clients.Others.SendAsync("NewUserArrived", JsonSerializer.Serialize(user));
        }

        public async Task HelloUser(string username, string recipient)
        {
            var user = new User()
            {
                Username = username,
                ConnectionId = Context.ConnectionId
            };
            await Clients.Client(recipient).SendAsync("UserSaidHello", JsonSerializer.Serialize(user));
        }

        public async Task SendSignal(string signal, string recipient)
        {
            await Clients.Client(recipient).SendAsync("SendSignal", Context.ConnectionId, signal);

        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            await Clients.All.SendAsync("UserDisconnect", Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}