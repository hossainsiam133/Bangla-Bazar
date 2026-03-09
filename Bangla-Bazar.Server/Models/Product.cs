using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bangla_Bazar.Server.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public float Price { get; set; }
        public string ProductDetails { get; set; } = String.Empty;
        public string ImageUrl { get; set; } = String.Empty;
    }
}