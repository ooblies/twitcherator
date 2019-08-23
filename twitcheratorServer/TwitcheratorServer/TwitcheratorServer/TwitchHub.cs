using System;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Threading;

namespace TwitcheratorServer
{
    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> _instance = new Lazy<Broadcaster>(() => new Broadcaster());

        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(5000);
        private readonly IHubContext _hubContext;

        private Timer _breadcastLoop;
        private TwitcheratorMessage _model;
        private Twitcherator _twitcherator;
        private bool _modelUpdated;

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<TwitchHub>();
            _model = new TwitcheratorMessage();
            _twitcherator = new Twitcherator();
            _modelUpdated = false;

            _breadcastLoop = new Timer(
                BroadcastObject,
                null,
                BroadcastInterval,
                BroadcastInterval);
        }

        public void BroadcastObject(object obj)
        {
            _modelUpdated = _twitcherator.GetMessage(_model, out _model);

            if (_modelUpdated)
            {
                _hubContext.Clients.All.receiveMessage(_model);
            }
        }

        public static Broadcaster Instance
        {
            get
            {
                return _instance.Value;
            }
        }
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
    }
}