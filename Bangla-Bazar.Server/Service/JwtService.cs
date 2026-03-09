// using Microsoft.IdentityModel.Tokens;
// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;
// using Bangla_Bazar.Server.Models;
// namespace Bangla_Bazar.Server.Service
// {
//     public class JwtService
//     {
//         private readonly IConfiguration _config;
//         public JwtService(IConfiguration config)
//         {
//             _config = config;
//         }
//         public string GenerateToken(User user)
//         {
//             var claims = new[]
//             {
//             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//             new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
//             new Claim(ClaimTypes.Role, user.Role)
//         };

//             var key = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
//             var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//             var token = new JwtSecurityToken(
//                 claims: claims,
//                 expires: DateTime.UtcNow.AddDays(7),
//                 signingCredentials: creds
//             );

//             return new JwtSecurityTokenHandler().WriteToken(token);
//         }
//     }
// }
