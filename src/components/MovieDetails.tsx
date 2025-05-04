// components/movies/MovieDetails.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMovieStore } from "@/store/movieStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MovieDetailsProps {
  id: number;
}

export const MovieDetails = ({ id }: MovieDetailsProps) => {
  const router = useRouter();
  const { selectedMovie, isLoading, error, getMovie } = useMovieStore();

  useEffect(() => {
    getMovie(id);
  }, [id, getMovie]);

  if (isLoading) return <div>Loading movie details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedMovie) return <div>Movie not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/movies")}>
          Back to list
        </Button>
        <h2 className="text-2xl font-bold">Movie Details</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/movies/edit/${selectedMovie.id}`)}
        >
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedMovie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Director</p>
                    <p>{selectedMovie.director}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Release Year</p>
                    <p>{selectedMovie.releaseYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Genre</p>
                    <p>{selectedMovie.genre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p>{selectedMovie.rating || "Not rated"}</p>
                  </div>
                </div>

                {selectedMovie.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="whitespace-pre-line">
                      {selectedMovie.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedMovie.poster ? (
            <img
              src={selectedMovie.poster}
              alt={`${selectedMovie.title} poster`}
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              No poster available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};