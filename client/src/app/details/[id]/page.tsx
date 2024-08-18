'use client';

import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { Book } from '../../../../types';
import '../../../../styles/Details.css';
import PlaceholderImage from '../../../../components/PlaceholderImage';
import Modal from '../../../../components/Modal';
import Snackbar from '../../../../components/Snackbar';

const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    getBookById(id: $id) {
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

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

const BookDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { loading, error, data } = useQuery<{ getBookById: Book }>(GET_BOOK_BY_ID, {
    variables: { id },
  });

  const [deleteBook] = useMutation(DELETE_BOOK);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error'; isOpen: boolean }>({
    message: '',
    type: 'success',
    isOpen: false,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const book = data?.getBookById;

  const handleEditClick = () => {
    if (book) {
      setBookToEdit(book);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setBookToEdit(undefined);
  };

  const handleBookUpdated = () => {
    setSnackbar({ message: 'Book updated successfully', type: 'success', isOpen: true });
    handleModalClose();
  };

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this book?');
    if (isConfirmed) {
      try {
        await deleteBook({ variables: { id } });
        setSnackbar({ message: 'Book deleted successfully', type: 'error', isOpen: true });

        // Wait for a short duration so the Snackbar is visible before redirecting
        setTimeout(() => {
          router.push('/home');
        }, 1500); // Adjust the timeout duration as needed
      } catch (error) {
        setSnackbar({ message: 'Failed to delete book', type: 'error', isOpen: true });
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="book-details-container">
      <div className="image-container">
        <PlaceholderImage width={400} height={400} />
      </div>
      <div className="details-container">
        <h1>{book?.title}</h1>
        <div className="author-info">
          <PlaceholderImage width={50} height={50} className="author-image" />
          <span className="author-name">{book?.author}</span>
        </div>
        <div className="stars">
          ★★★★★
        </div>
        <div className="details-column">
          <p><strong>Genre:</strong> {book?.genre}</p>
          <p><strong>ISBN:</strong> {book?.ISBN}</p>
          <p><strong>Publication Year:</strong> {book?.publicationYear}</p>
        </div>
        <div className="button-group">
          <button className="button" onClick={handleDeleteClick}>
            <i className="fas fa-trash-alt"></i>
          </button>
          <button className="edit-button" onClick={handleEditClick}>
            <i className="fas fa-wrench"></i>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onBookAddedOrUpdated={handleBookUpdated}
          book={bookToEdit}
        />
      )}

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default BookDetails;
