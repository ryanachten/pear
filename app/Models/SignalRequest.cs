using System;

namespace Echo.Models
{
    public class SignalRequest
    {
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public object Data { get; set; }
    }
}