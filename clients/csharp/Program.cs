using System;
using System.Text;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Diagnostics;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DnxConsole
{
    public class Program
    {
        private static string BaseUrl = "http://localhost:10000";

        public static void Main(string[] args)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            var urls = GetPostsUrls();
            Console.WriteLine("there are {0} posts in all.", urls.Length);
            var md5s = new string[urls.Length];
            Parallel.ForEach(urls, new ParallelOptions { MaxDegreeOfParallelism = 10 }, (url, pls, i) => {
                md5s[i] = FetchAndHash(url);
            });
            Console.WriteLine("final md5: " + GetMd5(String.Join("", md5s)));
            Console.WriteLine("time elapsed: " + stopWatch.ElapsedMilliseconds);
        }

        private static string GetHTTPBody(string url)
        {
            using (var client = new HttpClient())
            {
                var response = client.GetAsync(url).Result;
                return response.Content.ReadAsStringAsync().Result;
            }
        }

        private static string[] GetPostsUrls()
        {
            return JsonConvert.DeserializeObject<String[]>(GetHTTPBody("http://localhost:10000/posts"));
        }

        private static string GetMd5(string content)
        {
            using (MD5 md5 = new MD5CryptoServiceProvider())
            {
                var bytesToHash = Encoding.UTF8.GetBytes(content);
                var result = md5.ComputeHash(bytesToHash);
                var sb = new StringBuilder();
                for (int i = 0; i < result.Length; i++)
                {
                    sb.Append(result[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }

        private static string FetchAndHash(string url)
        {
            return GetMd5(GetHTTPBody("http://localhost:10000" + url));
        }
    }
}
