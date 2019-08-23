
using Newtonsoft.Json;

namespace TwitcheratorServer
{
    public class TwitcheratorMessage
    {
        [JsonProperty("viewers")]
        public int Viewers { get; set; }
        [JsonProperty("followers")]
        public int Followers { get; set; }
        [JsonProperty("subscribers")]
        public int Subscribers { get; set; }
        [JsonProperty("bitsInLast5")]
        public int BitsInLast5 { get; set; }
        [JsonProperty("increment")]
        public string Increment { get; set; }
        [JsonIgnore]
        public string LastUpdatedBy { get; set; }
    }
}