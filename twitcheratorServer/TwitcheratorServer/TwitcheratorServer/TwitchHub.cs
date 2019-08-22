using System;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Threading;

namespace TwitcheratorServer
{
    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> _instance = new Lazy<Broadcaster>(() => new Broadcaster());

        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(40);
        private readonly IHubContext _hubContext;

        private Timer _breadcastLoop;
        private twitcheratorModel _model;
        private bool _modelUpdated;

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<TwitchHub>();
            _model = new twitcheratorModel();
            _modelUpdated = false;

            _breadcastLoop = new Timer(
                BroadcastObject,
                null,
                BroadcastInterval,
                BroadcastInterval);
        }

        public void BroadcastObject(object obj)
        {
            if (true)//_modelUpdated)
            {
                _hubContext.Clients.All().receiveUpdate(_model);
                _modelUpdated = false;
            }
        }

        public void UpdateObject(twitcheratorModel clientModel)
        {
            _model = clientModel;
            _modelUpdated = true;
        }
        public static Broadcaster Instance
        {
            get
            {
                return _instance.Value;
            }
        }
    }
    public class twitcheratorModel
    {
        [JsonProperty("viewers")]
        public int Viewers { get; set; }
        [JsonProperty("followers")]
        public int Followers { get; set; }
        [JsonProperty("subscribers")]
        public int Subscribers { get; set; }
    }

    public class TwitchHub : Hub
    {
        private Broadcaster _broadcaster;
        public TwitchHub() :this(Broadcaster.Instance)
        {

        }
        public TwitchHub(Broadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }
        public void UpdateModel(twitcheratorModel clientModel)
        {
            _broadcaster.UpdateObject(clientModel);
        }

        public void Hello()
        {
            Clients.All.hello();
        }

        public void Hi()
        {
            int i = 0;
        }
    }
}