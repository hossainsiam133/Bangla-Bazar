using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bangla_Bazar.Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Method { get; set; } = "";
        public string Address { get; set; } = "";
        public float TotalProducts { get; set; }
        public float TotalPrice { get; set; }
        public DateTime PlacedOn { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public User? User { get; set; }
    }
}