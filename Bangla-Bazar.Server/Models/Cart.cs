using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Bangla_Bazar.Server.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public float Quantity { get; set; }
        public Product? Product { get; set; }
    }
}