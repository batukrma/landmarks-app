'use client'

import dynamic from 'next/dynamic'

// 👇 Dynamically import MapSelector without SSR
const MapSelector = dynamic(() => import('@/components/MapSelector'), {
  ssr: false,
})

export default function Page() {
  return (
    <div className="p-6 space-y-4">
      <MapSelector />
    </div>
  )
}
