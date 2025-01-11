import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';
import db from './config/connection.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Tell the server to understand JSON and URLs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make a new GraphQL server with our rules (typeDefs) and actions (resolvers)
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Turn on the GraphQL server
await server.start();

// Let the front-end talk to our server
app.use(
	'/graphql',
	cors({
		origin: 'http://localhost:3000', // Allow requests from our React app
		credentials: true, // Allow sending cookies
	}),
	expressMiddleware(server, {
		context: authMiddleware, // Check if user is logged in
	})
);

// For when we put this online - serve the React website
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../../client/dist')));

	app.get('*', (_req, res) => {
		res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
	});
}

// Connect to the database and then start listening for requests
db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`🌍 Now listening on localhost:${PORT}`);
		console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
	});
});
