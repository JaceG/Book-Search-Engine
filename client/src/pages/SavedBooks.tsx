import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
	// Use GraphQL to get the user's data when page loads
	const { loading, data } = useQuery(GET_ME);
	// Set up the function to remove books
	const [removeBook] = useMutation(REMOVE_BOOK);

	// Get the user data from our query results
	const userData: User = data?.me || {};

	// Function that runs when delete button is clicked
	const handleDeleteBook = async (bookId: string) => {
		// Make sure user is logged in
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			// Use GraphQL to remove the book
			await removeBook({
				variables: { bookId },
			});

			// Also remove the book from browser storage
			removeBookId(bookId);
		} catch (err) {
			console.error(err);
		}
	};

	// Show loading message while getting data
	if (loading) {
		return <h2>LOADING...</h2>;
	}

	return (
		<>
			<div className='text-light bg-dark p-5'>
				<Container fluid>
					<h1>Viewing saved books!</h1>
				</Container>
			</div>
			<Container>
				<h2 className='pt-5'>
					{userData.savedBooks?.length
						? `Viewing ${userData.savedBooks.length} saved ${
								userData.savedBooks.length === 1
									? 'book'
									: 'books'
						  }:`
						: 'You have no saved books!'}
				</h2>
				<Row>
					{userData.savedBooks?.map((book) => {
						return (
							<Col md='4' key={book.bookId}>
								<Card border='dark'>
									{book.image ? (
										<Card.Img
											src={book.image}
											alt={`The cover for ${book.title}`}
											variant='top'
										/>
									) : null}
									<Card.Body>
										<Card.Title>{book.title}</Card.Title>
										<p className='small'>
											Authors: {book.authors}
										</p>
										<Card.Text>
											{book.description}
										</Card.Text>
										<Button
											className='btn-block btn-danger'
											onClick={() =>
												handleDeleteBook(book.bookId)
											}>
											Delete this Book!
										</Button>
									</Card.Body>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Container>
		</>
	);
};

export default SavedBooks;
