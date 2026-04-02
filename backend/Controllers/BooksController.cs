using System.Collections;
using backend.data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Controllers;

//Tells the controller what route to use
[Route("[controller]")]
[ApiController]
//Tells the controller what type of controller it is
public class BooksController : ControllerBase
{
    //This is the context for the database
    private BookDbContext _context;
    
    //allows the controller to access the database
    public  BooksController(BookDbContext context)
    {
        _context = context;
    }

    //This is the method that gets the books from the database
    [HttpGet]
    //This is the parameter that gets the books from the database
    public IActionResult GetBooks(int pageSize = 5, int pageNumber = 1, string orderBy = "", [FromQuery] List<string>? bookCategories = null)
    {
        var query = _context.Books.AsQueryable();

        if (bookCategories != null && bookCategories.Any())
        {
            query = query.Where(b => bookCategories.Contains(b.Category));
        }
        //This is the total number of books in the database
        var totalNumBooks = query.Count();
        //This is the method that gets the books from the database in ascending order
        if (orderBy == "ascending")
        {
            var books = query
                .OrderBy(b => b.Title)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }
        //This is the method that gets the books from the database in descending order
        if (orderBy == "descending")
        {
            var books = query
                .OrderByDescending(b => b.Title)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }
        //This is the method that gets the books from the database in no order
        else
        {
            var books = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }
    } 
    //This is the method that gets the book categories from the database
    [HttpGet("GetBookCategories")]
     public IActionResult GetBookCategories()
     {
         var bookCategories = _context.Books
             .Select(b => b.Category)
             .Distinct()
             .ToList();
         return Ok(bookCategories);
    }

    //This is the method that adds a book to the database
    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook){
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(newBook);
    }

    //This is the method that updates a book in the database
    [HttpPut("UpdateBook/{id}")]
    public IActionResult UpdateBook(int id, [FromBody] Book updatedBook){
    
        var existingBook = _context.Books.Find(id);
        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;
        _context.Books.Update(existingBook);
        _context.SaveChanges();
        return Ok(existingBook);
    }

    //This is the method that deletes a book from the database
    [HttpDelete("DeleteBook/{id}")]
    public IActionResult DeleteBook(int id) {
        var book = _context.Books.Find(id);
        if (book == null)
        {
            return NotFound();
        }
        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}