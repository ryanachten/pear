using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using api.Models;
using api.Hubs.Clients;
using System.Collections.Generic;
using System;
using System.Linq;

namespace api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();

        public override Task OnConnectedAsync()
        {
            ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            ConnectedIds.Remove(Context.ConnectionId);
            Clients.All.ReceivePeerDisconnected(new SignalRequest()
            {
                Sender = Context.ConnectionId
            });
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

        public async Task SendNewPeer(SignalRequest peer)
        {
            Console.WriteLine($"\nSendNewPeer: ${peer.Sender}\n");

            await Clients.All.ReceiveNewPeer(peer);

            foreach (var connectionId in ConnectedIds.Where(x => x != Context.ConnectionId))
            {
                await Clients.Client(Context.ConnectionId).ReceiveNewPeer(new SignalRequest()
                {
                    Sender = connectionId,
                });
            }
        }

        public async Task SendNewInitiator(SignalRequest peer)
        {
            Console.WriteLine($"\nSendNewInitiator: ${peer.Sender}\n");

            await Clients.All.ReceiveNewInitiator(peer);
        }

        public async Task SendSignal(SignalRequest signal)
        {
            Console.WriteLine($"\nSendSignal: ${signal.Sender} ${signal.Data.ToString()}\n");

            await Clients.Others.ReceiveSignal(signal);
        }
    }
}