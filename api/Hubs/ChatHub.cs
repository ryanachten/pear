using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using api.Models;
using api.Hubs.Clients;
using System.Collections.Generic;
using System;

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

        public async Task SendConnected(SignalRequest peer)
        {
            Console.WriteLine($"\n New peer connected: ${peer.Sender} \n");
            await Clients.Others.ReceiveNewPeer(peer);
        }

        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

        public async Task SendNewInitiator(SignalRequest peer)
        {
            Console.WriteLine($"\nSendNewInitiator: ${peer.Sender}\n");

            await Clients.Client(peer.Receiver).ReceiveNewInitiator(peer);
        }

        //  Send message to client to initiate a connection
        //  The sender has already setup a peer connection receiver
        public async Task SendSignal(SignalRequest request)
        {
            // sender = connection ID -> receiver = receiver in payload
            Console.WriteLine($"\nSendSignal: from ${Context.ConnectionId} to ${request.Receiver} ${request.Data.ToString()}\n");

            await Clients.Client(request.Receiver).ReceiveSignal(new SignalRequest
            {
                Sender = Context.ConnectionId,
                Data = request.Data
            });
        }
    }
}