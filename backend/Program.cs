using backend.data;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//adds controllers to the container
builder.Services.AddControllers();

//adds the database context to the container
builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

//adds CORS to the container
builder.Services.AddCors();

//builds the application
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
//allows the application to access the database
app.UseCors(x => x.WithOrigins("http://localhost:3232"));
//redirects to the https protocol
app.UseHttpsRedirection();
//allows the application to use authorization
app.UseAuthorization();
//maps the controllers to the application
app.MapControllers();

app.Run();

