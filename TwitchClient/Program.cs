using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TwitchClient
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                IPHostEntry ipHostInfo = Dns.Resolve("localhost");
                IPAddress ipAddress = ipHostInfo.AddressList[0];
                IPEndPoint ipe = new IPEndPoint(ipAddress, 8080);
                Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                socket.Bind(ipe);
                socket.Listen(2);
                socket.Send(Encoding.UTF8.GetBytes("hello"));
                Thread.Sleep(5000);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
