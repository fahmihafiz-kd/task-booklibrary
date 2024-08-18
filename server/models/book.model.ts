import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  publicationYear?: number;
  genre?: string;
  ISBN: string;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationYear: { type: Number },
  genre: { type: String },
  ISBN: { type: String, unique: true, required: true },
});

export const Book = mongoose.model<IBook>('Book', BookSchema);