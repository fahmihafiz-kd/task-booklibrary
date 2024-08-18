import { Router } from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/book.controller';

const router = Router();

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

export default router;