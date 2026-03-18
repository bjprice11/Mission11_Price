using Microsoft.EntityFrameworkCore;

namespace backend.data;

//this sets up the database context, using DbContext
public class BookDbContext: DbContext
{
    //this is the constructor for the database context - how the database context is created
    public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
    {
        
    }
    //this is the database set for the books - this is the table in the database
    public DbSet<Book> Books { get; set; }
}