import './CategoryFilter.css';
import { useState, useEffect } from 'react';
import { apiBase } from '../apiBase';


type CategoryFilterProps = {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    setPageNumber: (pageNumber: number) => void;
};

// Sidebar filter 
function CategoryFilter({selectedCategories, setSelectedCategories, setPageNumber}: CategoryFilterProps) {
    // Distinct category names returned from backend (not the same as "selected")
    const [categories, setCategories] = useState<string[]>([]);

    // Run once on mount — [] dependency array means no re-fetch on every render
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Matches BooksController route [HttpGet("GetBookCategories")]
                const response = await fetch(`${apiBase}/Books/GetBookCategories`);
                const data = await response.json();
                console.log("Categories:", data);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const handleCategoryChange = (target: {target: HTMLInputElement}) => {
        // Toggle: if already selected, remove it; else add the clicked value to the array
        const updatedCategories = selectedCategories.includes(target.target.value) 
        ? selectedCategories.filter(category => category !== target.target.value) 
        : [...selectedCategories, target.target.value];
        console.log("Selected categories:", updatedCategories);
        setSelectedCategories(updatedCategories);

        // Changing filters changes result count — jump back to page 1 so you don't land on an empty page
        setPageNumber(1);
    };

    return (
        <div className="category-filter">
            <h2>Category Filter</h2>
            <div className="category-list">
                {categories.map((category) => (
                    // key={category} assumes category strings are unique (true for Distinct() from API)
                    <div className="category-item" key={category}>
                        {/* checked is controlled by BooksPage state so selections survive navigation/remount */}
                        {/* id + htmlFor links the label click to the checkbox for accessibility */}
                        <input id={category} type="checkbox" className="category-checkbox" value={category} checked={selectedCategories.includes(category)} onChange={handleCategoryChange} />
                        <label htmlFor={category} className="category-label" >{category}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryFilter;
