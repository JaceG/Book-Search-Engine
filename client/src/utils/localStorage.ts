// Functions to save and get book IDs from browser storage

// Get saved book IDs from localStorage
export const getSavedBookIds = () => {
	const savedBookIds = localStorage.getItem('saved_books')
		? JSON.parse(localStorage.getItem('saved_books')!)
		: [];

	return savedBookIds;
};

// Save book IDs to localStorage
export const saveBookIds = (bookIdArr: string[]) => {
	if (bookIdArr.length) {
		localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
	} else {
		localStorage.removeItem('saved_books');
	}
};

// Remove a book ID from localStorage
export const removeBookId = (bookId: string) => {
	const savedBookIds = localStorage.getItem('saved_books')
		? JSON.parse(localStorage.getItem('saved_books')!)
		: null;

	if (!savedBookIds) {
		return false;
	}

	// Filter out the book ID we want to remove
	const updatedSavedBookIds = savedBookIds?.filter(
		(savedBookId: string) => savedBookId !== bookId
	);
	localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

	return true;
};
