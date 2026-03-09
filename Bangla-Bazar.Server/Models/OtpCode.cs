using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bangla_Bazar.Server.Models
{
    public class OtpCode
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; } = "";
        public string Code { get; set; } = "";
        public DateTime ExpireAt { get; set; }
    }
}