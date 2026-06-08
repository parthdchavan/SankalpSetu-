import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 text-center">
      <Heart className="w-16 h-16 text-primary-200 fill-current mb-6" />
      <h1 className="text-6xl font-bold text-neutral-900 mb-2">404</h1>
      <p className="text-xl text-neutral-600 mb-2">Page not found</p>
      <p className="text-neutral-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
