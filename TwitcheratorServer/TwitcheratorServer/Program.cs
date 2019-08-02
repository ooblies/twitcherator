using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace TwitcheratorServer
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                try
                {
                    Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                    IPHostEntry host = Dns.GetHostEntry("localhost");
                    IPAddress iPAddress = host.AddressList.First();
                    String IpAddressString = IPAddress.Loopback.ToString();
                    IPEndPoint ipe = new IPEndPoint(iPAddress, 10000);
                    socket.Connect(ipe);
                    socket.Send(Encoding.UTF8.GetBytes("hello"));
                    Thread.Sleep(5000);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }
    }
}
