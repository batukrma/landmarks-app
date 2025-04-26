'use client';

import dynamic from 'next/dynamic';
import Loading from './Loading';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <Loading />,
});

interface ClientMapProps {
  onSignOut: () => Promise<void>;
}

export default function ClientMap({ onSignOut }: ClientMapProps) {
  return (
    <div className="relative">
      <button
        onClick={onSignOut}
        className="absolute bottom-4 left-4 z-50 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors border border-gray-200 cursor-pointer"
      >
        Sign Out
      </button>
      <Map />
    </div>
  );
}
