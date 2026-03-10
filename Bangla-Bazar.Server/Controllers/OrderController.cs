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
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext? _orderContext;
        public OrderController(AppDbContext orderContext)
        {
            _orderContext = orderContext;
        }
        [HttpGet()]
        public async Task<ActionResult<Order>> GetOrder()
        {
            if (_orderContext?.Orders == null)
                return NotFound();
            var order = await _orderContext.Orders.ToListAsync();
            return Ok(order);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            if (_orderContext?.Orders == null)
                return NotFound();
            var order = await _orderContext.Orders.FindAsync(id);
            if (order == null)
                return NotFound();
            return Ok(order);
        }
        [HttpPost()]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            if (_orderContext?.Orders == null)
                return NotFound();
            _orderContext.Orders.Add(order);
            await _orderContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> PutOrder(int id, Order order)
        {
            if (_orderContext?.Orders == null)
                return NotFound();
            if (id != order.Id)
                return BadRequest();
            _orderContext.Entry(order).State = EntityState.Modified;
            try
            {
                await _orderContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            if (_orderContext?.Orders == null)
                return NotFound();
            var order = await _orderContext.Orders.FindAsync(id);
            if (order == null)
                return NotFound();
            _orderContext.Orders.Remove(order);
            await _orderContext.SaveChangesAsync();
            return Ok();
        }
    }
}