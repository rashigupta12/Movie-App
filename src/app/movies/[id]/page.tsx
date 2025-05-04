// app/(movies)/[id]/page.tsx
import { MovieDetails } from '@/components/MovieDetails';
import { Suspense } from 'react';

export default function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading movie details...</div>}>
        <MovieDetails id={parseInt(params.id)} />
      </Suspense>
    </div>
  );
}