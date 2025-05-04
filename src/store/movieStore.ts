import { create } from 'zustand';
import { Movie, NewMovie } from '@/db/schema';

interface MovieState {
  // State
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  selectedMovie: Movie | null;
  
  // Actions
  fetchMovies: () => Promise<void>;
  getMovie: (id: number) => Promise<void>;
  addMovie: (movie: NewMovie) => Promise<void>;
  updateMovie: (id: number, movie: Partial<NewMovie>) => Promise<void>;
  deleteMovie: (id: number) => Promise<void>;
  setSelectedMovie: (movie: Movie | null) => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  // Initial state
  movies: [],
  isLoading: false,
  error: null,
  selectedMovie: null,
  
  // Actions
  fetchMovies: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/movies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const movies = await response.json();
      set({ movies, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  getMovie: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/movies?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie');
      }
      
      const movie = await response.json();
      set({ selectedMovie: movie, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  addMovie: async (movie: NewMovie) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add movie');
      }
      
      const newMovie = await response.json();
      set((state) => ({ 
        movies: [...state.movies, newMovie],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  updateMovie: async (id: number, movieData: Partial<NewMovie>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/movies?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update movie');
      }
      
      const updatedMovie = await response.json();
      set((state) => ({
        movies: state.movies.map((movie) => 
          movie.id === id ? updatedMovie : movie
        ),
        selectedMovie: get().selectedMovie?.id === id ? updatedMovie : get().selectedMovie,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  deleteMovie: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/movies/?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }
      
      set((state) => ({
        movies: state.movies.filter((movie) => movie.id !== id),
        selectedMovie: get().selectedMovie?.id === id ? null : get().selectedMovie,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  setSelectedMovie: (movie: Movie | null) => {
    set({ selectedMovie: movie });
  },
}));