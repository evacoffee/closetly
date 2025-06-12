import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-900 to-coffee-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full bg-surface/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-coffee-800/50">
      <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-caramel/10 blur-xl"></div>
      <div className="absolute top-1/4 right-8 w-24 h-24 rounded-full bg-caramel/5 blur-xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-caramel/15 blur-lg"></div>
    </div>
  );
}
