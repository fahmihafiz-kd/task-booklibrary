import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    publicationYear: Int
    genre: String
    ISBN: String!
  }

  type Query {
    getAllBooks: [Book]
    getBookById(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!, publicationYear: Int, genre: String, ISBN: String!): Book
    updateBook(id: ID!, title: String, author: String, publicationYear: Int, genre: String, ISBN: String): Book
    deleteBook(id: ID!): Boolean
  }
`;
