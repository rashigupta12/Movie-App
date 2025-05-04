# Movie Collection App

A full-stack application for managing your movie collection with CRUD operations. Built with Next.js, Zustand for state management, Drizzle ORM, and Neon PostgreSQL database.

![Movie Collection App](https://via.placeholder.com/800x400?text=Movie+Collection+App)

## Features

- **Full CRUD operations**: Create, read, update, and delete movies
- **Responsive design**: Mobile-friendly interface with Tailwind CSS
- **Global state management**: Using Zustand for efficient state updates
- **Type-safe database access**: With Drizzle ORM
- **Serverless PostgreSQL database**: Using Neon for persistence
- **API routes**: RESTful API endpoints for data manipulation

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **State Management**: Zustand
- **Database ORM**: Drizzle ORM
- **Database**: Neon (PostgreSQL)
- **API**: Next.js API Routes
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- NPM or Yarn
- Neon PostgreSQL database (or any PostgreSQL database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rashigupta12/Movie-collection-App
   cd movie-collection-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your Neon database URL.

4. Create the database schema:
   ```bash
   npx drizzle-kit push:pg
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## Project Structure

```
movie-app/
├── .env                  # Environment variables
├── drizzle.config.ts     # Drizzle ORM configuration
├── package.json          # Project dependencies
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Home page
│   │   ├── movies/       # Movies routes
│   │   │   ├── page.tsx  # Movies list page
│   │   │   ├── [id]/     # Movie details page
│   │   │   └── ...       # Other movie-related pages
│   │   ├── api/          # API routes
│   │   │   └── movies/   # Movie API endpoints
│   ├── components/       # React components
│   │   ├── MovieForm.tsx # Form for adding/editing movies
│   │   ├── MovieItem.tsx # Single movie item component
│   │   └── MovieList.tsx # List of movies component
│   ├── db/               # Database related files
│   │   ├── index.ts      # Database connection
│   │   ├── schema.ts     # Database schema definition
│   │   └── migrations/   # Database migrations
│   └── store/            # Zustand store
│       └── movieStore.ts # Movie state management
└── tsconfig.json         # TypeScript configuration
```

## Database Schema

The database schema for the movie collection is defined as follows:

```typescript
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
```

## State Management with Zustand

Zustand is used for state management throughout the application. The store is defined in `src/store/movieStore.ts`:

```typescript
// Example of Zustand store usage
const { movies, isLoading, error, fetchMovies } = useMovieStore();

// Example of updating the store
const { addMovie } = useMovieStore();
await addMovie({
  title: "The Matrix",
  director: "The Wachowskis",
  releaseYear: 1999,
  genre: "Sci-Fi"
});
```

## API Routes

The application provides the following API endpoints:

- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create a new movie
- `GET /api/movies/[id]` - Get a movie by ID
- `PATCH /api/movies/[id]` - Update a movie
- `DELETE /api/movies/[id]` - Delete a movie

## Zustand and Drizzle Integration

The Zustand store communicates with the database through the API routes:

1. Zustand actions trigger API calls
2. API routes use Drizzle ORM to interact with the database
3. The response is used to update the Zustand store
4. React components re-render with the updated state

## Deployment

This application can be deployed to any platform that supports Next.js, such as:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)

For the database, you can continue using Neon PostgreSQL which is designed for serverless environments.

## Customization

### Adding New Fields

To add new fields to the movie schema:

1. Update the schema in `src/db/schema.ts`
2. Generate a new migration:
   ```bash
   npx drizzle-kit generate:pg
   ```
3. Apply the migration:
   ```bash
   npx drizzle-kit push:pg
   ```
4. Update relevant components and the Zustand store

### Theming

The application uses Tailwind CSS for styling. You can customize the theme by modifying the `tailwind.config.js` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Neon Database](https://neon.tech/)
- [Tailwind CSS](https://tailwindcss.com/)