// components/Map/MapClient.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
  }
);

const MapContent = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
});


export default function MapClient({ routeData }: any) {
  return (
    <Suspense fallback={<div className="h-[500px] w-full bg-gray-100 animate-pulse" />}>
      <MapContainer
        
        zoom={12}
        style={{ height: '500px', width: '100%' }}
        className="leaflet-container"
      >
        <MapContent routeData={routeData} />
      </MapContainer>
    </Suspense>
  );
}