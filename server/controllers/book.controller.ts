import { Request, Response } from 'express';
import { Book } from '../models/book.model';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve book' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add book', error: (error as Error).message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (updatedBook) {
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update book', error: (error as Error).message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    console.log("here");
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
};
