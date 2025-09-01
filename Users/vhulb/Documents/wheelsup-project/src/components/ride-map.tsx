
"use client";

import { useEffect, useRef } from 'react';
import type { LatLng } from '../lib/types';

interface RideMapProps {
    origin: LatLng;
    destination: LatLng;
}

export function RideMap({ origin, destination }: RideMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const routingControl = useRef<any>(null); // To hold the routing control instance

    useEffect(() => {
        // Prevent initialization on the server
        if (typeof window === 'undefined') {
            return;
        }

        // Dynamically import Leaflet to ensure it's client-side only
        import('leaflet').then(L => {
            // This needs to be required after Leaflet is loaded
            require('leaflet-routing-machine');

            // Fix for default icon issue with webpack
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            
            if (mapRef.current && !mapInstance.current) {
                const map = L.map(mapRef.current).setView(origin, 13);
                mapInstance.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
            }
            
            // Add or update the routing line
            if (mapInstance.current) {
                 if (routingControl.current) {
                    mapInstance.current.removeControl(routingControl.current);
                }

                routingControl.current = L.Routing.control({
                    waypoints: [
                        L.latLng(origin[0], origin[1]),
                        L.latLng(destination[0], destination[1])
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    fitSelectedRoutes: true,
                    show: false,
                    lineOptions: {
    extendToWaypoints: false,
    missingRouteTolerance: 0,
styles: [{ color: 'hsl(var(--primary))', opacity: 0.8, weight: 6 }]
                    },
                    createMarker: function() { return null; } 
                }).addTo(mapInstance.current);
            }
        }).catch(error => console.error("Could not load Leaflet", error));

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                routingControl.current = null;
            }
        };
    }, [origin, destination]); // Rerun effect if origin or destination changes

    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
