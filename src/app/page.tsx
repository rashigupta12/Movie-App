// app/(movies)/page.tsx
import { MovieList } from '@/components/MovieList';
import { Suspense } from 'react';

export default function MoviesPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading movies...</div>}>
        <MovieList />
      </Suspense>
    </div>
  );
}