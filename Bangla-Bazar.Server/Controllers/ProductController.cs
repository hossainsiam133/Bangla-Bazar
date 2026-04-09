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
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext? _productContext;
        private readonly IWebHostEnvironment? _environment;
        
        public ProductController(AppDbContext productContext, IWebHostEnvironment environment)
        {
            _productContext = productContext;
            _environment = environment;
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
        
        [HttpGet("count")]
        public async Task<ActionResult<int>> CountProduct()
        {
            if (_productContext?.Products == null)
                return NotFound();
            var count = await _productContext.Products.CountAsync();
            return Ok(count);
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

        [HttpPost("upload-image")]
        public async Task<ActionResult<object>> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            // Allowed image extensions
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            
            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest(new { message = "Only image files are allowed" });

            try
            {
                // Create Assets folder if it doesn't exist
                var assetsPath = Path.Combine(_environment.WebRootPath, "Assets");
                if (!Directory.Exists(assetsPath))
                    Directory.CreateDirectory(assetsPath);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(assetsPath, fileName);

                // Save the file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL path
                var imageUrl = $"/Assets/{fileName}";
                return Ok(new { imageUrl, fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
            }
        }
    }
}