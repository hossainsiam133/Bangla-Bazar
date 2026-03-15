using System.Net;
using System.Net.Mail;

namespace Bangla_Bazar.Server.Service
{
    public sealed class EmailOtpService
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<EmailOtpService> _logger;

        public EmailOtpService(
            IConfiguration configuration,
            IWebHostEnvironment environment,
            ILogger<EmailOtpService> logger)
        {
            _configuration = configuration;
            _environment = environment;
            _logger = logger;
        }

        public sealed class EmailOtpDeliveryResult
        {
            public bool Success { get; init; }
            public string Message { get; init; } = "";
            public string Mode { get; init; } = "smtp";
            public string? DebugOtp { get; init; }
        }

        private static bool IsPlaceholder(string value)
        {
            var normalized = value.Trim().ToLowerInvariant();

            return normalized.Contains("your-email") ||
                   normalized.Contains("your-app-password") ||
                   normalized.Contains("changeme") ||
                   normalized == "example@example.com";
        }

        private EmailOtpDeliveryResult BuildDevelopmentFallback(string email, string otp, string reason)
        {
            _logger.LogWarning("Using development OTP fallback for {Email}. Reason: {Reason}. OTP: {Otp}", email, reason, otp);

            return new EmailOtpDeliveryResult
            {
                Success = true,
                Message = $"SMTP unavailable ({reason}). OTP generated in development mode.",
                Mode = "development-console",
                DebugOtp = otp
            };
        }

        public async Task<EmailOtpDeliveryResult> SendOtpAsync(string email, string otp)
        {
            var host = _configuration["Email:Smtp:Host"];
            var username = _configuration["Email:Smtp:Username"];
            var password = _configuration["Email:Smtp:Password"];
            var senderEmail = _configuration["Email:Sender:Email"];
            var senderName = _configuration["Email:Sender:Name"] ?? "Bangla Bazar";
            var portValue = _configuration["Email:Smtp:Port"];
            var enableSslValue = _configuration["Email:Smtp:EnableSsl"];
            var allowDevFallbackValue = _configuration["Email:AllowDevelopmentFallback"];

            var allowDevelopmentFallback = _environment.IsDevelopment() &&
                                           (!bool.TryParse(allowDevFallbackValue, out var parsed) || parsed);

            var hasPlaceholders = !string.IsNullOrWhiteSpace(username) && IsPlaceholder(username) ||
                                  !string.IsNullOrWhiteSpace(password) && IsPlaceholder(password) ||
                                  !string.IsNullOrWhiteSpace(senderEmail) && IsPlaceholder(senderEmail);

            if (string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(senderEmail) ||
                !int.TryParse(portValue, out var port) ||
                hasPlaceholders)
            {
                if (allowDevelopmentFallback)
                {
                    return BuildDevelopmentFallback(email, otp, "SMTP config is missing or placeholder values are still set");
                }

                return new EmailOtpDeliveryResult
                {
                    Success = false,
                    Message = "SMTP email settings are missing or invalid. Configure real Gmail SMTP credentials."
                };
            }

            var enableSsl = !string.IsNullOrWhiteSpace(enableSslValue) && bool.TryParse(enableSslValue, out var parsedSsl)
                ? parsedSsl
                : true;

            if (host.Contains("smtp.gmail.com", StringComparison.OrdinalIgnoreCase) &&
                !senderEmail.Equals(username, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Sender email adjusted to SMTP username for Gmail compatibility.");
                senderEmail = username;
            }

            using var message = new MailMessage();
            message.From = new MailAddress(senderEmail, senderName);
            message.To.Add(email);
            message.Subject = "Your Bangla Bazar login OTP";
            message.IsBodyHtml = true;
            message.Body = $@"
                <div style='font-family:Segoe UI,Tahoma,sans-serif;padding:24px;color:#222;'>
                    <h2 style='color:#f5871f;margin-bottom:12px;'>Bangla Bazar Login Verification</h2>
                    <p style='margin-bottom:8px;'>Use this OTP to complete your login.</p>
                    <div style='font-size:32px;font-weight:700;letter-spacing:8px;color:#111;margin:20px 0;'>{otp}</div>
                    <p style='margin-bottom:0;'>This OTP will expire in 5 minutes.</p>
                </div>";

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(username, password)
            };

            try
            {
                await client.SendMailAsync(message);
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, "SMTP failure while sending OTP to {Email}", email);

                if (allowDevelopmentFallback)
                {
                    return BuildDevelopmentFallback(email, otp, "SMTP authentication failed");
                }

                return new EmailOtpDeliveryResult
                {
                    Success = false,
                    Message = "SMTP authentication failed. For Gmail, enable 2-Step Verification and use a 16-digit App Password."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected mail error while sending OTP to {Email}", email);

                if (allowDevelopmentFallback)
                {
                    return BuildDevelopmentFallback(email, otp, "unexpected SMTP error");
                }

                return new EmailOtpDeliveryResult
                {
                    Success = false,
                    Message = "Could not send OTP email due to an unexpected mail server error."
                };
            }

            return new EmailOtpDeliveryResult
            {
                Success = true,
                Message = "OTP sent successfully.",
                Mode = "smtp"
            };
        }
    }
}