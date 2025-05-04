// app/(movies)/[id]/page.tsx
'use client';
import { MovieDetails } from '@/components/MovieDetails';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container py-8 max-w-full mx-auto px-4">
      {/* Hero section matching home page */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Movie Details</h1>
        <p className="text-blue-100">View complete information about this film</p>
      </div>
      
      {/* Movie details with styled container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Suspense fallback={
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-lg">Loading movie details...</div>
          </div>
        }>
          <MovieDetails id={parseInt(id)} />
        </Suspense>
      </div>
    </div>
  );
}