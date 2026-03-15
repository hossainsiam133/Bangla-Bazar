using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Bangla_Bazar.Server.Context;
using Bangla_Bazar.Server.Models;
using Microsoft.EntityFrameworkCore;
namespace Bangla_Bazar.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext? _userContext;
        public UserController(AppDbContext userContext)
        {
            _userContext = userContext;
        }
        [HttpGet()]
        public async Task<ActionResult<User>> GetUser()
        {
            if (_userContext?.Users == null)
                return NotFound();
            var users = await _userContext.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (_userContext.Users == null)
                return NotFound();
            var user = await _userContext.Users.FindAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPost()]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _userContext.Users.Add(user);
            await _userContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
                return BadRequest();
            _userContext.Entry(user).State = EntityState.Modified;
            try
            {
                await _userContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            if (_userContext.Users == null)
                return NotFound();
            var user = await _userContext.Users.FindAsync(id);
            if (user == null)
                return NotFound();
            _userContext.Users.Remove(user);
            await _userContext.SaveChangesAsync();
            return Ok();
        }
    }
}