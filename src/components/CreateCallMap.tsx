// import React, { useRef, useEffect, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { MapPin } from 'lucide-react';

// // Fix for default markers in Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// // Custom red icon for emergency calls
// const emergencyIcon = new L.Icon({
//   iconUrl: 'data:image/svg+xml;base64,' + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2">
//       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
//       <circle cx="12" cy="10" r="3"/>
//     </svg>
//   `),
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// interface CreateCallMapProps {
//   onLocationSelect: (lat: number, lng: number) => void;
// }

// const CreateCallMap: React.FC<CreateCallMapProps> = ({ onLocationSelect }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);
//   const markerRef = useRef<L.Marker | null>(null);
//   const [isMapReady, setIsMapReady] = useState(false);

//   useEffect(() => {
//     if (!mapRef.current || mapInstanceRef.current) return;

//     // Initialize map centered on Israel
//     const map = L.map(mapRef.current).setView([31.7683, 35.2137], 13);
//     mapInstanceRef.current = map;

//     // Add OpenStreetMap tiles
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(map);

//     // Handle map clicks to place emergency marker
//     const handleMapClick = (e: L.LeafletMouseEvent) => {
//       const { lat, lng } = e.latlng;
      
//       // Remove existing marker if any
//       if (markerRef.current) {
//         map.removeLayer(markerRef.current);
//       }
      
//       // Add new marker at clicked location
//       markerRef.current = L.marker([lat, lng], { icon: emergencyIcon })
//         .addTo(map)
//         .bindPopup(`
//           <div style="text-align: center; font-family: Arial, sans-serif;">
//             <strong style="color: #ef4444;">📞 מיקום הקריאה</strong><br/>
//             <small>רוחב: ${lat.toFixed(5)}</small><br/>
//             <small>אורך: ${lng.toFixed(5)}</small>
//           </div>
//         `)
//         .openPopup();
      
//       // Notify parent component
//       onLocationSelect(lat, lng);
//     };

//     map.on('click', handleMapClick);
//     setIsMapReady(true);

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [onLocationSelect]);

//   return (
//     <div className="relative w-full h-full">
//       <div ref={mapRef} className="w-full h-full rounded-lg" />
      
//       {isMapReady && (
//         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
//           <div className="flex items-center gap-2 text-sm">
//             <MapPin className="w-4 h-4 text-red-500" />
//             <span className="font-medium text-slate-700">לחץ על המפה לבחירת מיקום</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateCallMap;
import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom red icon for emergency calls
const emergencyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Event {
  eventId: number;
  eventName: string;
  description: string;
  priority: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  requiredOfficers: number;
}

interface EventZone {
  zoneId: number;
  eventId: number;
  latitude1: number;
  longitude1: number;
  latitude2: number;
  longitude2: number;
  latitude3: number;
  longitude3: number;
  latitude4: number;
  longitude4: number;
}

interface CreateCallMapProps {
  onLocationSelect: (lat: number, lng: number, eventId?: number) => void;
}

const CreateCallMap: React.FC<CreateCallMapProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const eventZoneRef = useRef<L.Polygon | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedEventZone, setSelectedEventZone] = useState<EventZone | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingZone, setIsLoadingZone] = useState(false);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const response = await fetch('https://localhost:7163/api/Event/allEvents');
        if (!response.ok) {
          throw new Error('שגיאה בטעינת רשימת האירועים');
        }
        const eventsData = await response.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('שגיאה בטעינת רשימת האירועים');
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Israel
    const map = L.map(mapRef.current).setView([31.7683, 35.2137], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch event zone when event is selected
  useEffect(() => {
    if (!selectedEventId || !mapInstanceRef.current) return;

    const fetchEventZone = async () => {
      setIsLoadingZone(true);
      try {
        const response = await fetch(`https://localhost:7163/api/Event/${selectedEventId}/zone`);
        if (!response.ok) {
          throw new Error('שגיאה בטעינת אזור האירוע');
        }
        const zoneData = await response.json();
        setSelectedEventZone(zoneData);
      } catch (error) {
        console.error('Error fetching event zone:', error);
        toast.error('שגיאה בטעינת אזור האירוע');
      } finally {
        setIsLoadingZone(false);
      }
    };

    fetchEventZone();
  }, [selectedEventId]);

  // Draw event zone on map and setup click handler
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing zone
    if (eventZoneRef.current) {
      map.removeLayer(eventZoneRef.current);
      eventZoneRef.current = null;
    }

    // Remove existing marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    // Remove existing click handler
    map.off('click');

    if (selectedEventZone) {
      // Create polygon from zone coordinates
      const zoneCoords: L.LatLngTuple[] = [
        [selectedEventZone.latitude1, selectedEventZone.longitude1],
        [selectedEventZone.latitude2, selectedEventZone.longitude2],
        [selectedEventZone.latitude3, selectedEventZone.longitude3],
        [selectedEventZone.latitude4, selectedEventZone.longitude4]
      ];

      // Draw red zone
      eventZoneRef.current = L.polygon(zoneCoords, {
        color: '#ef4444',
        weight: 3,
        fillOpacity: 0.2,
        fillColor: '#ef4444'
      }).addTo(map);

      // Fit map to zone
      map.fitBounds(eventZoneRef.current.getBounds());

      // Add click handler for placing calls within zone
      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        
        // Check if click is within the event zone
        const point = L.latLng(lat, lng);
        const isInsideZone = eventZoneRef.current?.getBounds().contains(point);
        
        if (!isInsideZone) {
          toast.warning('ניתן לבחור מיקום רק בתוך אזור האירוע שנבחר');
          return;
        }
        
        // Remove existing marker if any
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        
        // Add new marker at clicked location
        markerRef.current = L.marker([lat, lng], { icon: emergencyIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; font-family: Arial, sans-serif;">
              <strong style="color: #ef4444;">📞 מיקום הקריאה</strong><br/>
              <small>רוחב: ${lat.toFixed(5)}</small><br/>
              <small>אורך: ${lng.toFixed(5)}</small>
            </div>
          `)
          .openPopup();
        
        // Notify parent component with event ID
        onLocationSelect(lat, lng, parseInt(selectedEventId));
      };

      map.on('click', handleMapClick);
    }
  }, [selectedEventZone, selectedEventId, onLocationSelect]);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    // Reset marker when event changes
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Event selector */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg min-w-[250px]">
        <Label htmlFor="event-select" className="text-sm font-medium text-slate-700">
          בחר אירוע
        </Label>
        <Select value={selectedEventId} onValueChange={handleEventSelect}>
          <SelectTrigger className="mt-1 bg-white">
            <SelectValue placeholder={isLoadingEvents ? "טוען אירועים..." : "בחר אירוע"} />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-[2000]">
            {events.map((event) => (
              <SelectItem key={event.eventId} value={event.eventId.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{event.eventName}</span>
                  <span className="text-xs text-slate-500">{event.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoadingZone && (
          <div className="mt-2 text-xs text-blue-600">
            טוען אזור האירוע...
          </div>
        )}
      </div>

      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {isMapReady && selectedEventZone && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="font-medium text-slate-700">לחץ בתוך האזור האדום לבחירת מיקום</span>
          </div>
        </div>
      )}

      {isMapReady && !selectedEventId && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-slate-700">בחר אירוע תחילה</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCallMap;
