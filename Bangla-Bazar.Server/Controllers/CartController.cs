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
    public class CartController : ControllerBase
    {
        private readonly AppDbContext? _cartContext;
        public CartController(AppDbContext cartContext)
        {
            _cartContext = cartContext;
        }

        [HttpGet()]
        public async Task<ActionResult<Cart>> GetCart()
        {
            if (_cartContext?.Carts == null)
                return NotFound();
            var cart = await _cartContext.Carts.ToListAsync();
            return Ok(cart);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            if (_cartContext?.Carts == null)
                return NotFound();
            var cart = await _cartContext.Carts.FindAsync(id);
            if (cart == null)
                return NotFound();
            return Ok(cart);
        }
        [HttpPost()]
        public async Task<ActionResult<Cart>> PostCart(Cart cart)
        {
            if (_cartContext?.Carts == null)
                return NotFound();
            _cartContext.Carts.Add(cart);
            await _cartContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCart), new { id = cart.Id }, cart);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> PutCart(int id, Cart cart)
        {
            if (_cartContext?.Carts == null)
                return NotFound();
            if (id != cart.Id)
                return BadRequest();
            _cartContext?.Entry(cart).State = EntityState.Modified;
            try
            {
                await _cartContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCart(int id)
        {
            if (_cartContext?.Carts == null)
                return NotFound();
            var cart = await _cartContext.Carts.FindAsync(id);
            if (cart == null)
                return NotFound();
            _cartContext.Carts.Remove(cart);
            await _cartContext.SaveChangesAsync();
            return Ok();
        }
    }
}