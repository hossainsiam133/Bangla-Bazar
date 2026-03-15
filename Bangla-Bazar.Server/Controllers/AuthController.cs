using Microsoft.AspNetCore.Mvc;
using Bangla_Bazar.Server.Models;
using Bangla_Bazar.Server.Context;
using Bangla_Bazar.Server.Service;
using Microsoft.EntityFrameworkCore;

namespace Bangla_Bazar.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwt;
        private readonly EmailOtpService _emailOtpService;

        public AuthController(AppDbContext context, JwtService jwt, EmailOtpService emailOtpService)
        {
            _context = context;
            _jwt = jwt;
            _emailOtpService = emailOtpService;
        }

        public sealed class SendEmailOtpRequest
        {
            public string Email { get; set; } = "";
        }

        public sealed class VerifyEmailOtpRequest
        {
            public string Email { get; set; } = "";
            public string Otp { get; set; } = "";
        }

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }

        private static bool IsGmailAddress(string email)
        {
            return email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase);
        }

        [HttpPost("send-email-otp")]
        public async Task<IActionResult> SendEmailOtp([FromBody] SendEmailOtpRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required." });

            var email = NormalizeEmail(request.Email);

            if (!IsGmailAddress(email))
                return BadRequest(new { message = "Only Gmail accounts are allowed." });

            var rnd = new Random();
            var otp = rnd.Next(100000, 999999).ToString();

            var code = new OtpCode
            {
                Email = email,
                Code = otp,
                ExpireAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };

            _context.OtpCodes.Add(code);
            await _context.SaveChangesAsync();

            var delivery = await _emailOtpService.SendOtpAsync(email, otp);

            if (!delivery.Success)
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = delivery.Message });

            return Ok(new
            {
                message = "OTP sent successfully.",
                expiresInSeconds = 300,
                deliveryMode = delivery.Mode,
                otp = delivery.DebugOtp
            });
        }


        [HttpPost("verify-email-otp")]
        public async Task<IActionResult> VerifyEmailOtp([FromBody] VerifyEmailOtpRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp))
                return BadRequest(new { message = "Email and OTP are required." });

            var email = NormalizeEmail(request.Email);

            var record = await _context.OtpCodes
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync(x => x.Email == email && x.Code == request.Otp && !x.IsUsed);

            if (record == null || record.ExpireAt < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired OTP." });

            record.IsUsed = true;

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    Name = email.Split('@')[0],
                    Role = "User"
                };

                _context.Users.Add(user);
            }

            await _context.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                },
                redirectTo = string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase)
                    ? "/admin"
                    : "/home"
            });
        }
    }
}