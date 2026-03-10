using Bangla_Bazar.Server.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("BanglaBazarDB")));
builder.Services.AddOpenApi();
builder.Services.AddCors();
builder.Services.AddControllers();
var app = builder.Build();

app.UseCors(builder =>
    builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
);
app.UseStaticFiles();
if (app.Environment.IsDevelopment())
    app.MapOpenApi();
else
    app.UseHttpsRedirection();
app.MapControllers();
app.Run();
