using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bangla_Bazar.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }
}