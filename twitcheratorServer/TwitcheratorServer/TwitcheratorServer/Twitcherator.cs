using System;
using System.Numerics;
using RestSharp;
using Newtonsoft.Json;
using System.Json;
using System.Collections.Generic;
using System.Linq;

namespace TwitcheratorServer
{
    public class Twitcherator
    {
        private readonly string _clientId = "eo171si6zugwlanaf2it4wuo3mg6y7";
        private readonly string _userId = "452018475";
        private readonly string _clientSecret = "1u9f21tz495eg388gu7ads9rok69nl";
        private readonly string _userName = "TwitchMakesABIGNumber";
        private string _authToken = "";
        private string _expiration = "";
        private RestClient _client;
        private RestClient _authClient;
        private TwitcheratorMessage _oldMessage;
        private List<BitLog> _bitList;

        public class BitLog {
            public int bits;
            public DateTime date;
        }

        public Twitcherator()
        {
            _client = new RestClient("https://api.twitch.tv");
            _authClient = new RestClient("https://id.twitch.tv");
            _bitList = new List<BitLog>();
        }

        public string GetToken()
        {
            if (_authToken == "")
            {
                Authorize();
            }

            return _authToken;
        }

        public void LogBits(int b)
        {
            _bitList.Add(new BitLog
            {
                bits = b,
                date = DateTime.Now
            });
        }

        private int GetBitsInLast5()
        {
            int bl5 = 0;

            try
            {
                bl5 = Convert.ToInt32(_bitList.Where(bl => bl.date > DateTime.Now.AddMinutes(-5)).Sum(b => b.bits));
            }
            catch (Exception ex)
            {
                bl5 = 0;
            }

            return bl5;
        }

        public bool GetMessage(TwitcheratorMessage oldMsg, out TwitcheratorMessage newMsg)
        {
            _oldMessage = oldMsg;
            TwitcheratorMessage msg = new TwitcheratorMessage
            {
                Followers = GetFollowers(),
                Subscribers = GetSubscribers(),
                Viewers = GetViewers(),
                BitsInLast5 = GetBits(),
            };

            msg.Increment = GetIncrement(msg.Viewers, msg.Followers, msg.Subscribers);

            newMsg = msg;

            return true;// !oldMsg.Equals(newMsg);
        }

        private int GetFollowers()
        {
            int f = 0;

            try
            {
                var request = new RestRequest("helix/users/follows", Method.GET);
                request.AddParameter("to_id", _userId);
                request.AddHeader("client-id", _clientId);

                IRestResponse response = _client.Execute(request);
                var content = response.Content;

                f = Convert.ToInt32(JsonValue.Parse(content)["total"].ToString());

            }
            catch (Exception ex)
            {
                f = _oldMessage.Followers;
            }
            
            return f;
        }

        private void AuthScopes()
        {
            var request = new RestRequest("oauth2/authorize", Method.GET);
            request.AddParameter("client_id", _clientId);
            request.AddParameter("redirect_uri", "http://localhost:63049/client/index.html");
            request.AddParameter("response_type", "token");
            request.AddParameter("scope", "channel:read:subscriptions bits:read chat:read");

            IRestResponse response = _authClient.Execute(request);
            var content = response.Content;
        }

        private void Authorize()
        {
            var request = new RestRequest("oauth2/token", Method.POST);
            request.AddParameter("client_id", _clientId);
            request.AddParameter("client_secret", _clientSecret);
            request.AddParameter("grant_type", "client_credentials");
            request.AddParameter("scope", "channel:read:subscriptions bits:read chat:read");            

            IRestResponse response = _authClient.Execute(request);
            var content = response.Content;

            //AuthScopes();

            _authToken = JsonValue.Parse(content)["access_token"];
            _expiration = JsonValue.Parse(content)["expires_in"].ToString();
        }

        private int GetSubscribers()
        {
            int s = 0;

            try
            {
                var request = new RestRequest("helix/subscriptions");
                request.AddParameter("broadcaster_id", _userId);
                request.AddParameter("user_id", _userId);
                request.AddHeader("client-id", _clientId);
                request.AddHeader("Authorization", "Bearer " + _authToken);

                IRestResponse response = _client.Execute(request);
                var content = response.Content;

                //if Unauthorized message, re-authenticate
                if (JsonValue.Parse(content).ContainsKey("error") && JsonValue.Parse(content)["error"] == "Unauthorized")
                {
                    Authorize();

                    response = _client.Execute(request);
                    content = response.Content;
                }

                s = JsonValue.Parse(content)["data"].Count;
            }
            catch (Exception ex)
            {
                s = _oldMessage.Subscribers;
            }

            return s;
        }
        private int GetViewers()
        {
            int v = 0;

            try
            {
                var request = new RestRequest("helix/streams", Method.GET);
                request.AddParameter("user_id", _userId);
                request.AddHeader("client-id", _clientId);

                IRestResponse response = _client.Execute(request);
                var content = response.Content;

                //only works when channel is live, will error otherwise.
                v = Convert.ToInt32(JsonValue.Parse(content)["data"][0]["viewer_count"].ToString());

            }
            catch (Exception ex)
            {
                v = _oldMessage.Viewers;
            }
            
            return v;
        }
        private int GetBits()
        {
            int b = 0;

            try
            {
                b = GetBitsInLast5();
            }
            catch (Exception ex)
            {
                b = _oldMessage.BitsInLast5;
            }

            return b;
        }

        private string GetIncrement(int viewers, int followers, int subs)
        {
            BigInteger big = BigInteger.Multiply(viewers, followers);
            big = BigInteger.Pow(big, subs < 1 ? 1 : subs);
            if (big.CompareTo(1) == -1)
            {
                return "1";
            }

            return big.ToString();
        }
    }
}