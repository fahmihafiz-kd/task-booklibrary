"use client";

import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import '../../styles/Home.css';
import Search from '../../components/Search';
import Modal from '../../components/Modal';
import { Book } from '../../types';
import Snackbar from '../../components/Snackbar';

// GraphQL queries and mutations
const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    getAllBooks {
      id
      title
      author
      publicationYear
      genre
      ISBN
      imageUrl
    }
  }
`;

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error'; isOpen: boolean }>({
    message: '',
    type: 'success',
    isOpen: false,
  });
  const booksPerPage = 16;

  // Fetching data using Apollo Client's useQuery hook
  const { loading, error, data, refetch } = useQuery<{ getAllBooks: Book[] }>(GET_ALL_BOOKS);
  const router = useRouter();

  useEffect(() => {
    if (data?.getAllBooks) {
      console.log(data); // Debugging: check the fetched data
      setBooks(data.getAllBooks);
      setFilteredBooks(data.getAllBooks);
    }
  }, [data]);

  const handleBookAdded = () => {
    refetch();
    setSnackbar({ message: 'Book added successfully', type: 'success', isOpen: true });
  };

  const handleFilteredBooks = (filteredBooks: Book[]) => {
    setFilteredBooks(filteredBooks);
    setCurrentPage(1);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBookClick = (id: string) => {
    router.push(`/details/${id}`);
  };

  // Error and loading state handling
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Apollo Client Error:', error); // Log the error
    return <p>Error: {error.message}</p>;
  }

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="book-list">
      <div className="header">
        <h1>Book List</h1>
        <button className="add-button" onClick={openModal}>+</button>
      </div>
      <Search books={books} onFilteredBooks={handleFilteredBooks} />
      <div className="books-container">
        {currentBooks && currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div
              key={book.id}
              className="book-box"
              onClick={() => handleBookClick(book.id)} // Navigate on click
            >
              <div className="book-image-placeholder">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} />
                ) : (
                  <p>Image Placeholder</p>
                )}
              </div>

              <h2 className="book-title">{book.title}</h2>
            </div>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onBookAddedOrUpdated={handleBookAdded}
      />
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default Home;
