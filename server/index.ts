import express, { Application, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import connectDB from './config/database';
import dotenv from 'dotenv';
import { typeDefs } from './schemas/book.schema';
import { resolvers } from './resolvers/book.resolvers';

// Load environment variables
dotenv.config();

const app: Application = express();  // Explicitly typing the Express app as Application
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB().then(async () => {
    // Set up Apollo Server
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    // Start the server only after the database connection is successful
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process with failure
});

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
