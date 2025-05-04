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
import { ArrowLeft, Film, Upload } from "lucide-react";

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
  rating: z.coerce.number().min(0).max(5).optional(),
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

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500  rounded my-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Movie title" {...field} className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Director</FormLabel>
                      <FormControl>
                        <Input placeholder="Director name" {...field} className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Release Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Genre</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="5" {...field} className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      </FormControl>
                      <FormDescription className="text-gray-500 text-xs">
                        Rate the movie from 0 to 5 stars
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Poster Image</FormLabel>
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors">
                        <MovieUpload onUploadSuccess={handlePosterUpload} />
                      </div>
                      
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a short description of the movie..."
                        className="resize-none min-h-32 border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-xs">
                      Optional detailed description of the movie.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Saving..." : "Save Movie"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium mb-4 text-gray-700 flex items-center gap-2">
              <Film className="h-5 w-5 text-blue-500" />
              Movie Poster Preview
            </h3>
            {form.watch("poster") ? (
              <img
                src={form.watch("poster")}
                alt="Movie poster preview"
                className="w-full rounded-md border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="bg-gray-50 aspect-[2/3] rounded-md flex flex-col items-center justify-center text-gray-400 border border-gray-200">
                <Upload className="h-12 w-12 mb-2 " />
                <p>No poster uploaded</p>
                <p className="text-xs text-gray-400 mt-2">Upload to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};