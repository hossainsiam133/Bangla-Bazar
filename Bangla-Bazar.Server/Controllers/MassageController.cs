using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Bangla_Bazar.Server.Models;
using Bangla_Bazar.Server.Context;
using Microsoft.EntityFrameworkCore;
namespace Bangla_Bazar.Server.Controllers
{
    public class CreateMassageRequest
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    public class ReplyMassageRequest
    {
        public string Replies { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class MassageController : ControllerBase
    {
        private readonly AppDbContext? _massageContext;
        public MassageController(AppDbContext massageContext)
        {
            _massageContext = massageContext;
        }
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<object>>> GetMassage()
        {
            if (_massageContext?.Massages == null)
                return NotFound();

            var massage = await _massageContext.Massages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderByDescending(m => m.SentAt)
                .Select(m => new
                {
                    m.Id,
                    m.SenderId,
                    m.ReceiverId,
                    m.Content,
                    m.Replies,
                    m.SentAt,
                    m.IsRead,
                    Sender = m.Sender == null ? null : new
                    {
                        m.Sender.Id,
                        m.Sender.Name,
                        m.Sender.Email,
                        m.Sender.Role
                    },
                    Receiver = m.Receiver == null ? null : new
                    {
                        m.Receiver.Id,
                        m.Receiver.Name,
                        m.Receiver.Email,
                        m.Receiver.Role
                    }
                })
                .ToListAsync();

            return Ok(massage);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetMassage(int id)
        {
            if (_massageContext?.Massages == null)
                return NotFound();

            var massage = await _massageContext.Massages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.Id == id)
                .Select(m => new
                {
                    m.Id,
                    m.SenderId,
                    m.ReceiverId,
                    m.Content,
                    m.Replies,
                    m.SentAt,
                    m.IsRead,
                    Sender = m.Sender == null ? null : new
                    {
                        m.Sender.Id,
                        m.Sender.Name,
                        m.Sender.Email,
                        m.Sender.Role
                    },
                    Receiver = m.Receiver == null ? null : new
                    {
                        m.Receiver.Id,
                        m.Receiver.Name,
                        m.Receiver.Email,
                        m.Receiver.Role
                    }
                })
                .FirstOrDefaultAsync();

            if (massage == null)
                return NotFound();

            return Ok(massage);
        }
        
        [HttpGet("count")]
        public async Task<ActionResult<int>> CountMassage()
        {
            if (_massageContext?.Massages == null)
                return NotFound();
            var count = await _massageContext.Massages.CountAsync();
            return Ok(count);
        }
        [HttpPost()]
        public async Task<ActionResult<Massage>> PostMassage(CreateMassageRequest request)
        {
            if (_massageContext?.Massages == null)
                return NotFound();

            if (request.SenderId <= 0 || request.ReceiverId <= 0)
                return BadRequest("SenderId and ReceiverId are required.");

            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Content is required.");

            var massage = new Massage
            {
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                Content = request.Content.Trim(),
                Replies = string.Empty,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            _massageContext.Massages.Add(massage);
            await _massageContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMassage), new { id = massage.Id }, massage);
        }

        [HttpPut("{id}/reply")]
        public async Task<ActionResult> ReplyMassage(int id, ReplyMassageRequest request)
        {
            if (_massageContext?.Massages == null)
                return NotFound();

            var massage = await _massageContext.Massages.FindAsync(id);
            if (massage == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(request.Replies))
                return BadRequest("Replies is required.");

            massage.Replies = request.Replies.Trim();
            massage.IsRead = true;

            await _massageContext.SaveChangesAsync();
            return Ok(massage);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutMassage(int id, Massage massage)
        {
            if (_massageContext?.Massages == null)
                return NotFound();
            if (id != massage.Id)
                return BadRequest();

            var existingMassage = await _massageContext.Massages.FindAsync(id);
            if (existingMassage == null)
                return NotFound();

            existingMassage.Content = string.IsNullOrWhiteSpace(massage.Content)
                ? existingMassage.Content
                : massage.Content.Trim();
            existingMassage.Replies = massage.Replies?.Trim() ?? existingMassage.Replies;
            existingMassage.IsRead = massage.IsRead;

            try
            {
                await _massageContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMassage(int id)
        {
            if (_massageContext?.Massages == null)
                return NotFound();
            var massage = await _massageContext.Massages.FindAsync(id);
            if (massage == null)
                return NotFound();
            _massageContext.Massages.Remove(massage);
            await _massageContext.SaveChangesAsync();
            return Ok();
        }
    }
}