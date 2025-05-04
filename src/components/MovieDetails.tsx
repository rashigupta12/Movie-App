// components/movies/MovieDetails.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useMovieStore } from "@/store/movieStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Edit, Star, Film, Calendar, User, Tag } from "lucide-react";

interface MovieDetailsProps {
  id: number;
}

export const MovieDetails = ({ id }: MovieDetailsProps) => {
  const router = useRouter();
  const { selectedMovie, isLoading, error, getMovie } = useMovieStore();

  useEffect(() => {
    getMovie(id);
  }, [id, getMovie]);

  // Function to render stars for ratings
  const renderRating = (rating: number | undefined) => {
    if (!rating) return 'Not rated';
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-5 w-5 inline ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return <div className="flex mt-1">{stars}</div>;
  };

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

  if (!selectedMovie && !isLoading) return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">Movie not found. The requested movie may have been removed or is unavailable.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Button>
        
        {selectedMovie && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/movies/edit/${selectedMovie.id}`)}
            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 ml-auto"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading movie details...</div>
        </div>
      ) : selectedMovie && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster Column */}
          <div className="md:col-span-1">
            {selectedMovie.poster ? (
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                <img
                  src={selectedMovie.poster}
                  alt={`${selectedMovie.title} poster`}
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-gray-200">
                <Film className="h-16 w-16 mb-2 text-blue-200" />
                <p className="text-sm">No poster available</p>
              </div>
            )}
          </div>
          
          {/* Details Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-bold text-gray-800">{selectedMovie.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {selectedMovie.genre}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                  {selectedMovie.releaseYear}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Director</span>
                </div>
                <p className="font-medium text-gray-800">{selectedMovie.director}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Release Year</span>
                </div>
                <p className="font-medium text-gray-800">{selectedMovie.releaseYear}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">Genre</span>
                </div>
                <p className="font-medium text-gray-800">{selectedMovie.genre}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">Rating</span>
                </div>
                {renderRating(selectedMovie.rating ?? undefined)}
              </div>
            </div>
            
            {selectedMovie.description && (
              <div className="space-y-2 mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {selectedMovie.description}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="pt-6 flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/movies/edit/${selectedMovie.id}`)}
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
                Edit Details
              </Button>
              <Button 
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Collection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};