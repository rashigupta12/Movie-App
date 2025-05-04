// src/app/api/movies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { movies, NewMovie} from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET all movies or a specific movie by ID
export async function GET(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get('id');
  
  try {
    if (movieId) {
      // Fetch specific movie by ID
      const movie = await db.select().from(movies).where(eq(movies.id, parseInt(movieId, 10)));
      
      if (!movie.length) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(movie[0]);
    } else {
      // Fetch all movies
      const allMovies = await db.select().from(movies);
      return NextResponse.json(allMovies);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST a new movie
export async function POST(request: NextRequest) {
  try {
    const movieData: NewMovie = await request.json();

    // Validate required fields
    if (!movieData.title || !movieData.director || !movieData.releaseYear || !movieData.genre) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const insertedMovies = await db.insert(movies).values(movieData).returning();
    return NextResponse.json(insertedMovies[0], { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}

// PUT to update an existing movie
export async function PUT(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get('id');
  
  if (!movieId) {
    return NextResponse.json(
      { error: 'Missing movie ID' },
      { status: 400 }
    );
  }
  
  try {
    const movieData = await request.json();
    
    // Validate at least one field is provided for update
    if (Object.keys(movieData).length === 0) {
      return NextResponse.json(
        { error: 'No update fields provided' },
        { status: 400 }
      );
    }
    
    const updatedMovies = await db
      .update(movies)
      .set(movieData)
      .where(eq(movies.id, parseInt(movieId, 10)))
      .returning();
    
    if (!updatedMovies.length) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedMovies[0]);
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// DELETE a movie by ID
export async function DELETE(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get('id');
  
  if (!movieId) {
    return NextResponse.json(
      { error: 'Missing movie ID' },
      { status: 400 }
    );
  }
  
  try {
    const deletedMovies = await db
      .delete(movies)
      .where(eq(movies.id, parseInt(movieId, 10)))
      .returning();

    if (!deletedMovies.length) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(deletedMovies[0]);
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}