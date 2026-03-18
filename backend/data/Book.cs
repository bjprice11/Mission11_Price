using System.ComponentModel.DataAnnotations;
namespace backend.data;

//This is the class for the book object
public class Book
{
    //This is the key for the book object - the rest of the properties are the book information
    [Key]
    public int BookId { get; set; }
    [Required]
    public string? Title { get; set; }
    [Required]
    public string? Author { get; set; }
    [Required]
    public string? Publisher { get; set; }
    [Required]
    public string? ISBN { get; set; }
    [Required]
    public string? Classification { get; set; }
    [Required]
    public string? Category { get; set; }
    [Required]
    public int? PageCount { get; set; }
    [Required]
    public float? Price { get; set; }
    
}