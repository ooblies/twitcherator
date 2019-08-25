using System;
using WebSocketSharp;
using Newtonsoft.Json;
using System.Json;
using System.Web.Script.Serialization;



namespace TwitcheratorServer
{
    public class TwitchEventHandler
    {
        public static void Main(string[] args)
        {
            Twitcherator tw = new Twitcherator();

            Message listen = new Message();

            string[] topics = new string[1];
            topics[0] = "channel-bits-events-v2.452018475";

            listen.type = "LISTEN";
            listen.nonce = "12345A";
            listen.data = new MessageData
            {
                topics = topics,
                auth_token = tw.GetToken(),
            };

            JavaScriptSerializer jss = new JavaScriptSerializer();

            string JSONListen = jss.Serialize(listen);

            using (var ws = new WebSocket("wss://pubsub-edge.twitch.tv"))
            {
                ws.OnMessage += (sender, e) =>
                    Console.WriteLine("Messaged Receieved: " + e.Data);

                ws.Connect();
                ws.Send(JSONListen);
                Console.ReadKey(true);
            }
        }

        public class Message
        {
            public string type;
            public string nonce;
            public MessageData data;
        }

        public class MessageData
        {
            public string[] topics;
            public string auth_token;
        }
    }
}