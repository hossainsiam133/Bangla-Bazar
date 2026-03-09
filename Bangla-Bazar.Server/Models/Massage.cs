using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bangla_Bazar.Server.Models
{
    public class Massage
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Massages { get; set; } = "";
        public User? User { get; set; }
    }
}