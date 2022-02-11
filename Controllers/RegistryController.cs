using Karcis.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace Karcis.Controllers
{
    public class RegistryController : Controller
    {

        public async Task<IActionResult> Login()
        {
            return View();
        }
        public async Task<IActionResult> Logout()
        {
            HttpContext.Session.Clear();

            return RedirectToAction("Index", "Home");
        }
        [HttpPost]
        public async Task<IActionResult> LoginRequest([FromBody] UserModel User)
        {
            try
            {
                var client = new HttpClient();

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri("http://localhost:42069/user/login"),
                    Content = new StringContent("{\"UserEmail\":\"" + User.UserEmail + "\", \"UserPassword\":\"" + User.UserPassword + "\"}", Encoding.UTF8, MediaTypeNames.Application.Json /* or "application/json" in older versions */),
                };

                var response = await client.SendAsync(request).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

                var user = JsonConvert.DeserializeObject<UserModel>(responseBody);

                Console.WriteLine(user.UserRole.ToString());

                HttpContext.Session.SetInt32("UserID", user.UserID);
                HttpContext.Session.SetString("UserName", user.UserName);
                HttpContext.Session.SetString("Token", user.Token);
                HttpContext.Session.SetString("UserRole", user.UserRole.ToString());
                ViewBag.UserName = user.UserName;
                ViewData["UserName"] = user.UserName;
                return Json(new
                {
                    Status = true,
                    Message = "Logged in!"
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    Status = false,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail([FromBody] UserModel User)
        {
            var client = new HttpClient();

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("http://localhost:42069/user/register"),
                Content = new StringContent(
                "{\"UserEmail\":\"" + User.UserEmail + "\"," +
                " \"UserPassword\":\"" + User.UserPassword + "\"," +
                "\"UserName\":\""+User.UserName + "\"," +
                "\"UserDOB\":\""+User.UserDOB + "\"," +
                "\"UserPhone\":\""+User.UserPhone +"\"}"
                , Encoding.UTF8, MediaTypeNames.Application.Json /* or "application/json" in older versions */),
            };

            var response = await client.SendAsync(request).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            var token = JsonConvert.DeserializeObject<string>(responseBody);
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            
            smtpClient.Credentials = new NetworkCredential("rogerforsendingemail@gmail.com", "A0l1f5j6mnbv");

            //smtpClient.UseDefaultCredentials = true; // uncomment tanpa credentials
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.EnableSsl = true;
            MailMessage mail = new MailMessage();

            //Setting From , To and CC
            mail.From = new MailAddress("info@karcis.com", "Karcis.com");
            mail.To.Add(new MailAddress(User.UserEmail));
            mail.Body = "https://localhost:44333/Registry/Verify?Token=" + token;
            mail.Subject = "Karcis.com Email Verification";

            Console.WriteLine(mail.Body);

            smtpClient.Send(mail);

            return Json(new
            {
                Status = true,
                Message = "Registered!"
            }); ;
        }
        public async Task<IActionResult> Verify(string Token)
        {
            try
            {
                var client = new HttpClient();

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri("http://localhost:42069/user/verify?Token=" + Token),
                    Content = new StringContent("", Encoding.UTF8, MediaTypeNames.Application.Json /* or "application/json" in older versions */),
                };

                var response = await client.SendAsync(request).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

            }
            return View("Login");
        }

        public IActionResult Register()
        {
            return View();
        }
    }
}
