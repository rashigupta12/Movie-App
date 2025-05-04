// app/(movies)/edit/[id]/page.tsx
'use client';
import { MovieForm } from '@/components/MovieForm';
import { useParams } from 'next/navigation';
import { Suspense, use } from 'react';

export default function EditMoviePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading movie data...</div>}>
        <MovieForm movieId={parseInt(id)} />
      </Suspense>
    </div>
  );
}