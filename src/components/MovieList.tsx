// components/movies/MovieList.tsx
'use client';

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMovieStore } from "@/store/movieStore";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export const MovieList = () => {
  const { movies, isLoading, error, fetchMovies, deleteMovie } = useMovieStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (isLoading) return <div>Loading movies...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Movie Catalog</h2>
        <Link href="/movies/new">
          <Button>Add New Movie</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className="font-medium">
                  <Link href={`/movies/${movie.id}`} className="hover:underline">
                    {movie.title}
                  </Link>
                </TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>{movie.releaseYear}</TableCell>
                <TableCell>{movie.genre}</TableCell>
                <TableCell>{movie.rating || '-'}</TableCell>
                <TableCell className="flex space-x-2">
                  <Link href={`/movies/edit/${movie.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMovie(movie.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};