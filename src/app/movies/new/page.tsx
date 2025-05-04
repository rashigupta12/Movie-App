// app/(movies)/new/page.tsx
import { MovieForm } from '@/components/MovieForm';
import { Suspense } from 'react';

export default function NewMoviePage() {
  return (
    <div className="container py-5 max-w-full mx-auto px-4">
      {/* Hero section matching home page */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Add to Your Collection</h1>
        <p className="text-blue-100">Create a new entry for your favorite films</p>
      </div>
      
      {/* Movie form with styled container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Suspense fallback={
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-lg">Loading form...</div>
          </div>
        }>
          <MovieForm />
        </Suspense>
      </div>
    </div>
  );
}