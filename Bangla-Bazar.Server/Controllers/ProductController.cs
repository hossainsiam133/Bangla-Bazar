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
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext? _productContext;
        public ProductController(AppDbContext productContext)
        {
            _productContext = productContext;
        }
        [HttpGet()]
        public async Task<ActionResult<Product>> GetProduct()
        {
            if (_productContext?.Products == null)
                return NotFound();
            var products = await _productContext.Products.ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            if (_productContext?.Products == null)
                return NotFound();
            var products = await _productContext.Products.FindAsync(id);
            if (products == null)
                return NotFound();
            return Ok(products);
        }

        [HttpPost()]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (_productContext?.Products == null)
                return NotFound();
            _productContext?.Products.Add(product);
            await _productContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> PutProduct(int id, Product product)
        {
            if (_productContext?.Products == null)
                return NotFound();
            if (id != product.Id)
                return BadRequest();
            _productContext?.Entry(product).State = EntityState.Modified;
            try
            {
                await _productContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            if (_productContext?.Products == null)
                return NotFound();
            var product = await _productContext.Products.FindAsync(id);
            if (product == null)
                return NotFound();
            _productContext.Products.Remove(product);
            await _productContext.SaveChangesAsync();
            return Ok();
        }
    }
}