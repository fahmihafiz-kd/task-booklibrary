import { Book } from '../models/book.model';
import { pubsub } from '../pubsub'

export const resolvers = {
  Query: {
    getAllBooks: async () => {
      return await Book.find();
    },
    getBookById: async (_: any, { id }: { id: string }) => {
      return await Book.findById(id);
    },
  },
  Mutation: {
    addBook: async (
      _: any,
      args: {
        title: string;
        author: string;
        publicationYear?: number;
        genre?: string;
        ISBN: string;
        imageUrl?: string; // Add imageUrl here
      }
    ) => {
      const newBook = new Book(args);
      const savedBook = await newBook.save();
      pubsub.publish('BOOK_ADDED', { bookAdded: savedBook }); // Publish the event to the subscription
      return savedBook;
    },
    updateBook: async (
      _: any,
      {
        id,
        ...args
      }: {
        id: string;
        title?: string;
        author?: string;
        publicationYear?: number;
        genre?: string;
        ISBN?: string;
        imageUrl?: string; // Add imageUrl here
      }
    ) => {
      return await Book.findByIdAndUpdate(id, args, {
        new: true,
        runValidators: true,
      });
    },
    deleteBook: async (_: any, { id }: { id: string }) => {
      const deleted = await Book.findByIdAndDelete(id);
      return deleted ? true : false;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};