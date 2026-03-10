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
        public async Task<ActionResult<Massage>> GetMassage()
        {
            if (_massageContext?.Massages == null)
                return NotFound();
            var massage = await _massageContext.Massages.ToListAsync();
            return Ok(massage);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Massage>> GetMassage(int id)
        {
            if (_massageContext?.Massages == null)
                return NotFound();
            var massage = await _massageContext.Massages.FindAsync(id);
            if (massage == null)
                return NotFound();
            return Ok(massage);
        }
        [HttpPost()]
        public async Task<ActionResult<Order>> PostMassage(Massage massage)
        {
            if (_massageContext?.Massages == null)
                return NotFound();
            _massageContext.Massages.Add(massage);
            await _massageContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMassage), new { id = massage.Id }, massage);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> PutMassage(int id, Massage massage)
        {
            if (massage?.Massages == null)
                return NotFound();
            if (id != massage.Id)
                return BadRequest();
            _massageContext?.Entry(massage).State = EntityState.Modified;
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