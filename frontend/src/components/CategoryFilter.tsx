import './CategoryFilter.css';
import { useState, useEffect } from 'react';
import { apiBase } from '../apiBase';

// Props all come from BooksPage — parent owns selectedCategories and pageNumber
type CategoryFilterProps = {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    setPageNumber: (pageNumber: number) => void;
};

function CategoryFilter({selectedCategories, setSelectedCategories, setPageNumber}: CategoryFilterProps) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
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
        const updatedCategories = selectedCategories.includes(target.target.value) 
        ? selectedCategories.filter(category => category !== target.target.value) 
        : [...selectedCategories, target.target.value];
        console.log("Selected categories:", updatedCategories);
        setSelectedCategories(updatedCategories);

        // Tells BooksPage to reset page — BookList refetches with new categories from props
        setPageNumber(1);
    };

    return (
        <div className="category-filter">
            <h2>Category Filter</h2>
            <div className="category-list">
                {categories.map((category) => (
                    <div className="category-item" key={category}>
                        {/* checked/read from BooksPage via selectedCategories prop */}
                        <input id={category} type="checkbox" className="category-checkbox" value={category} checked={selectedCategories.includes(category)} onChange={handleCategoryChange} />
                        <label htmlFor={category} className="category-label" >{category}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryFilter;
