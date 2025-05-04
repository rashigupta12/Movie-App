import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// Define the movies table schema
export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  director: text('director').notNull(),
  releaseYear: integer('release_year').notNull(),
  genre: text('genre').notNull(),
  poster: text('poster'),
  description: text('description'),
  rating: integer('rating'),
  isFavorite: boolean('is_favorite').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types based on the schema
export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;