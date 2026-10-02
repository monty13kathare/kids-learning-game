import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF6ED] px-4 text-center">
      <div className="w-24 h-24 rounded-3xl bg-pink-100 flex items-center justify-center text-5xl mb-4 animate-bounce">
        🎈
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">Oops! Page Floated Away!</h2>
      <p className="text-sm font-bold text-slate-500 max-w-sm mb-6">
        We could not find the page you are looking for. Let&apos;s go back to playing fun games!
      </p>
      <Link
        href="/"
        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-base shadow-md active:scale-95 transition-transform"
      >
        Back to Home 🏠
      </Link>
    </div>
  );
}
