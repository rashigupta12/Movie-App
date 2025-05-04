// app/(movies)/new/page.tsx
import { MovieForm } from '@/components/MovieForm';
import { Suspense } from 'react';

export default function NewMoviePage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading form...</div>}>
        <MovieForm />
      </Suspense>
    </div>
  );
}