using System;

namespace api.Models
{
    public class SignalRequest
    {
        public string Sender { get; set; }
        public object Data { get; set; }
    }
}