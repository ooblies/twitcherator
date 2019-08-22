using System;
using System.Numerics;
using RestSharp;


namespace TwitcheratorServer
{
    public class Twitcherator
    {
        private readonly string ClientId = "eo171si6zugwlanaf2it4wuo3mg6y7";        
        private readonly string UserId = "452018475";
        private readonly string ClientSecret = "1u9f21tz495eg388gu7ads9rok69nl";
        private readonly string UserName = "TwitchMakesABigNumber";

        public Twitcherator()
        {
            var client = new RestClient("");
        }

        public bool GetMessage(TwitcheratorMessage oldMsg, out TwitcheratorMessage newMsg)
        {
            TwitcheratorMessage msg = new TwitcheratorMessage
            {
                Followers = GetFollowers(),
                Subscribers = GetSubscribers(),
                Viewers = GetViewers(),
                BitsInLast5 = GetBits(),
            };

            msg.Increment = GetIncrement(msg.Viewers, msg.Followers, msg.Subscribers);

            newMsg = msg;

            return !oldMsg.Equals(newMsg);
        }

        private int GetFollowers()
        {
            int f = 0;

            return f < 1 ? 1 : f;
        }
        private int GetSubscribers()
        {
            int s = 0;

            return s < 1 ? 1 : s;
        }
        private int GetViewers()
        {
            int v = 0;

            return v < 1 ? 1 : v;
        }
        private int GetBits()
        {
            return 0;
        }

        private string GetIncrement(int viewers, int followers, int subs)
        {
            BigInteger big = BigInteger.Pow(BigInteger.Multiply(viewers, followers), subs);

            return big.ToString();
        }
    }
}