using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Bangla_Bazar.Server.Models;
using Bangla_Bazar.Server.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace Bangla_Bazar.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly AppDbContext? _otpContext;
        private readonly IWebHostEnvironment? _environment;

        public OtpController(AppDbContext otpContext, IWebHostEnvironment environment)
        {
            _otpContext = otpContext;
            _environment = environment;
        }
        [HttpGet()]
        public async Task<ActionResult<OtpCode>> GetOtp()
        {
            if (_otpContext?.OtpCodes == null)
                return NotFound();
            var otp = await _otpContext.OtpCodes.ToListAsync();
            return Ok(otp);
        }
    }
}