// components/movies/MovieForm.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieUpload } from "./MovieUpload";
import { useMovieStore } from "@/store/movieStore";
import { useRouter } from "next/navigation";
import { GENRES } from "@/lib/constants";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  director: z.string().min(2, {
    message: "Director name must be at least 2 characters.",
  }),
  releaseYear: z.coerce.number().min(1888, {
    message: "Release year must be after 1888.",
  }),
  genre: z.string().min(1, {
    message: "Please select a genre.",
  }),
  description: z.string().optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  poster: z.string().optional(),
});

interface MovieFormProps {
  movieId?: number;
}

export const MovieForm = ({ movieId }: MovieFormProps) => {
  const router = useRouter();
  const {
    selectedMovie,
    isLoading,
    error,
    getMovie,
    addMovie,
    updateMovie,
  } = useMovieStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      director: "",
      releaseYear: new Date().getFullYear(),
      genre: "",
      description: "",
      rating: undefined,
      poster: "",
    },
  });

  useEffect(() => {
    if (movieId) {
      getMovie(movieId);
    }
  }, [movieId, getMovie]);

  useEffect(() => {
    if (selectedMovie && movieId) {
      form.reset({
        title: selectedMovie.title,
        director: selectedMovie.director,
        releaseYear: selectedMovie.releaseYear,
        genre: selectedMovie.genre,
        description: selectedMovie.description || "",
        rating: selectedMovie.rating || undefined,
        poster: selectedMovie.poster || "",
      });
    }
  }, [selectedMovie, movieId, form]);

  const handlePosterUpload = (url: string) => {
    form.setValue("poster", url);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (movieId) {
        await updateMovie(movieId, values);
      } else {
        await addMovie(values);
      }
      router.push("/");
    } catch (error) {
      console.error("Failed to save movie:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
        >
          Back to list
        </Button>
        <h2 className="text-2xl font-bold">
          {movieId ? "Edit Movie" : "Add New Movie"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Movie title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director</FormLabel>
                      <FormControl>
                        <Input placeholder="Director name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENRES.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poster Image</FormLabel>
                      <MovieUpload onUploadSuccess={handlePosterUpload} />
                      {field.value && (
                        <div className="mt-2">
                          <img
                            src={field.value}
                            alt="Poster preview"
                            className="h-40 rounded-md object-cover"
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Movie description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional detailed description of the movie.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Movie"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Movie Poster Preview</h3>
            {form.watch("poster") ? (
              <img
                src={form.watch("poster")}
                alt="Movie poster preview"
                className="w-full rounded-md"
              />
            ) : (
              <div className="bg-gray-100 aspect-[2/3] rounded-md flex items-center justify-center text-gray-400">
                No poster uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};