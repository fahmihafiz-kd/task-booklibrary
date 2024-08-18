import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import '../styles/Modal.css';
import { Book } from '../types';

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $publicationYear: Int!, $genre: String!, $ISBN: String!) {
    addBook(title: $title, author: $author, publicationYear: $publicationYear, genre: $genre, ISBN: $ISBN) {
      id
      title
      author
      publicationYear
      genre
      ISBN
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $author: String!, $publicationYear: Int!, $genre: String!, $ISBN: String!) {
    updateBook(id: $id, title: $title, author: $author, publicationYear: $publicationYear, genre: $genre, ISBN: $ISBN) {
      id
      title
      author
      publicationYear
      genre
      ISBN
    }
  }
`;

const Modal: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onBookAddedOrUpdated: () => void,
  book?: Book // Optional book prop for editing
}> = ({ isOpen, onClose, onBookAddedOrUpdated, book }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');

  const [addBook] = useMutation(ADD_BOOK);
  const [updateBook] = useMutation(UPDATE_BOOK);

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setPublicationYear(book.publicationYear?.toString() || '');
      setGenre(book.genre || '');
      setIsbn(book.ISBN || '');
    } else {
      // Reset the fields when there's no book (e.g., when adding a new book)
      setTitle('');
      setAuthor('');
      setPublicationYear('');
      setGenre('');
      setIsbn('');
    }
  }, [book]);
  

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (book) {
        await updateBook({
          variables: {
            id: book.id,
            title,
            author,
            publicationYear: parseInt(publicationYear),
            genre,
            ISBN: isbn,
          },
        });
      } else {
        await addBook({
          variables: {
            title,
            author,
            publicationYear: parseInt(publicationYear),
            genre,
            ISBN: isbn,
          },
        });
      }
      onBookAddedOrUpdated(); // Trigger refetch or update the list after the book is added or updated
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error adding or updating book:", error);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>{book ? 'Edit Book' : 'Add a New Book'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input 
              type="text" 
              id="author" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="publicationYear">Publication Year</label>
            <input 
              type="number" 
              id="publicationYear" 
              value={publicationYear} 
              onChange={(e) => setPublicationYear(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input 
              type="text" 
              id="genre" 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input 
              type="text" 
              id="isbn" 
              value={isbn} 
              onChange={(e) => setIsbn(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="submit-button">
            {book ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;