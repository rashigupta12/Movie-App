// app/(movies)/[id]/page.tsx
'use client';
import { MovieDetails } from '@/components/MovieDetails';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading movie details...</div>}>
        <MovieDetails id={parseInt(id)} />
      </Suspense>
    </div>
  );
}