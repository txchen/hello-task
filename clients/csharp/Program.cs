using System;
using System.Text;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DnxConsole
{
    public class Program
    {
        public static void Main(string[] args)
        {
            MainAsync().Wait();
        }

        private static async Task MainAsync()
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            var urls = await GetPostsUrls();
            Console.WriteLine("there are {0} posts in all.", urls.Length);
            var md5s = new string[urls.Length];

            using (var semaphore = new SemaphoreSlim(10))
            {
                var tasks = urls.Select(async (url, i) => {
                    await semaphore.WaitAsync();
                    try
                    {
                        md5s[i] = await FetchAndHash(url);
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                });
                await Task.WhenAll(tasks);
            }
            Console.WriteLine("final md5: " + GetMd5(String.Join("", md5s)));
            Console.WriteLine("time elapsed: " + stopWatch.ElapsedMilliseconds);
            await Task.FromResult(0);
        }

        private static async Task<string> GetHTTPBody(string url)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);
                return await response.Content.ReadAsStringAsync();
            }
        }

        private static async Task<string[]> GetPostsUrls()
        {
            return JsonConvert.DeserializeObject<String[]>(await GetHTTPBody("http://localhost:10000/posts"));
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

        private static async Task<string> FetchAndHash(string url)
        {
            return GetMd5(await GetHTTPBody("http://localhost:10000" + url));
        }
    }
}
