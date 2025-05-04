'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useMovieStore } from "@/store/movieStore";
import { Edit, Trash2, Plus, Search, Star, Filter, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EnhancedMoviePage() {
  // Using your existing store
  const { movies, isLoading, error, fetchMovies, deleteMovie } = useMovieStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  
  // Extract unique genres for filter
  const genres = ['All', ...new Set(movies.map(movie => movie.genre))];
  
  // Filter movies based on search and genre
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Function to render stars for ratings
  const renderRating = (rating: number | null) => {
    if (!rating) return '-';
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 inline ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading your movie collection...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full mx-auto p-4 ">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Movie Collection</h1>
        <p className="text-blue-100 mb-6">Track, rate, and organize your favorite films all in one place</p>
        <Link href="/movies/new">
          <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
        </Link>
      </div>
      
      {/* Search and filter section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by title or director..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 h-4 w-4" />
          <select
            className="border rounded-md p-2 bg-white"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Movies</p>
          <p className="text-2xl font-bold">{movies.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Genres</p>
          <p className="text-2xl font-bold">{new Set(movies.map(m => m.genre)).size}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Avg Rating</p>
          <p className="text-2xl font-bold">
            {(movies.reduce((acc, movie) => acc + (movie.rating || 0), 0) / movies.length || 0).toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Recent Additions</p>
          <p className="text-2xl font-bold">{movies.filter(m => m.id > movies.length - 3).length}</p>
        </div>
      </div>
      
      {/* Movies table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Poster</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Director</TableHead>
              <TableHead className="font-semibold">Year</TableHead>
              <TableHead className="font-semibold">Genre</TableHead>
              <TableHead className="font-semibold">Rating</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <TableRow key={movie.id} className="hover:bg-gray-50">
                  <TableCell className="w-16">
                    {movie.poster ? (
                      <div className="relative h-16 w-12 overflow-hidden rounded">
                        <Image
                          src={movie.poster}
                          alt={`${movie.title} poster`}
                          fill
                          sizes="48px"
                          style={{ objectFit: 'cover' }}
                          className="transition-transform hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-12 items-center justify-center bg-gray-100 rounded">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/movies/${movie.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {movie.title}
                    </Link>
                  </TableCell>
                  <TableCell>{movie.director}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {movie.genre}
                    </span>
                  </TableCell>
                  <TableCell>{renderRating(movie.rating)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/movies/edit/${movie.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this movie?')) {
                            deleteMovie(movie.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  No movies found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Empty state */}
        {movies.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <div className="mb-4 p-4 rounded-full bg-blue-50">
              <svg className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">Your movie collection is empty</h3>
            <p className="mb-4 text-sm">Start by adding your favorite movies to your catalog</p>
            <Link href="/movies/new">
              <Button>Add Your First Movie</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}