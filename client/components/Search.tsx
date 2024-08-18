import React, { useState } from 'react';
import { Book } from '../types';

interface SearchProps {
  books: Book[];
  onFilteredBooks: (filteredBooks: Book[]) => void;
}

const Search: React.FC<SearchProps> = ({ books, onFilteredBooks }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);

    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value) ||
      (book.publicationYear && book.publicationYear.toString().includes(value)) ||
      (book.genre && book.genre.toLowerCase().includes(value)) ||
      book.ISBN.toLowerCase().includes(value)
    );

    onFilteredBooks(filteredBooks);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by title, author, year, genre, or ISBN..."
      />
    </div>
  );
};

export default Search;
