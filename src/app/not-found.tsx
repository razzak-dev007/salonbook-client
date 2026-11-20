import Link from 'next/link';
import { Scissors, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-rose-100 salon-card-shadow space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <Scissors className="w-8 h-8 rotate-45" />
        </div>
        <div>
          <span className="text-4xl font-black bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            404
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            The salon page or route you are looking for does not exist or has been relocated.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
