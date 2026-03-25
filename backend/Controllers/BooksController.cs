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
    [HttpGet("GetBookCategories")]
     public IActionResult GetBookCategories()
     {
         var bookCategories = _context.Books
             .Select(b => b.Category)
             .Distinct()
             .ToList();
         return Ok(bookCategories);
    }
}