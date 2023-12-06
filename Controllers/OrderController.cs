using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebAppOrder.Models;

namespace WebAppOrder.Controllers
{
    public class OrderController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public OrderController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            string receivedKeyword = HttpContext.Request.Query["key"];
            ViewData["IsAdmin"] = receivedKeyword;
            return View();
        }
    }
}