import express, { Application, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http'; // Import createServer from http
import connectDB from './config/database';
import dotenv from 'dotenv';
import { typeDefs } from './schemas/book.schema';
import { resolvers } from './resolvers/book.resolvers';
import { execute, subscribe } from 'graphql'; // Import execute and subscribe
import { SubscriptionServer } from 'subscriptions-transport-ws'; // Import SubscriptionServer
import { makeExecutableSchema } from '@graphql-tools/schema'; // Import makeExecutableSchema

// Load environment variables
dotenv.config();

const app: Application = express(); // Explicitly typing the Express app as Application
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create an executable schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Connect to MongoDB
connectDB().then(async () => {
    // Set up Apollo Server
    const server = new ApolloServer({ schema });
    await server.start();
    server.applyMiddleware({ app });

    // Create an HTTP server
    const httpServer = createServer(app);

    // Set up the WebSocket for handling GraphQL subscriptions
    SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect: () => {
                console.log('Connected to WebSocket');
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
        },
        {
            server: httpServer,
            path: server.graphqlPath,
        }
    );

    // Start the HTTP server only after the database connection is successful
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`Subscriptions are running on ws://localhost:${PORT}${server.graphqlPath}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process with failure
});

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});