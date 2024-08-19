import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    publicationYear: Int
    genre: String
    ISBN: String!
    imageUrl: String
  }

  type Query {
    getAllBooks: [Book]
    getBookById(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!, publicationYear: Int, genre: String, ISBN: String!, imageUrl: String): Book  # Add imageUrl
    updateBook(id: ID!, title: String, author: String, publicationYear: Int, genre: String, ISBN: String, imageUrl: String): Book  # Add imageUrl
    deleteBook(id: ID!): Boolean
  }

  type Subscription {
    bookAdded: Book  # Add subscription for bookAdded
  }
`;