// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { MapControls } from './MapControls';
// import { MapLegend } from './MapLegend';
// import { MapStats } from './MapStats';
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { 
//   PoliceOfficerLocation, 
//   CallLocation, 
//   EventZone, 
//   StrategicZone,
//   MapFilters 
// } from '../types/mapTypes';

// interface InteractiveMapProps {
//   mapboxToken?: string;
// }

// const InteractiveMap: React.FC<InteractiveMapProps> = ({ mapboxToken }) => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [tokenInput, setTokenInput] = useState('');
  
//   // Data states
//   const [policeOfficers, setPoliceOfficers] = useState<PoliceOfficerLocation[]>([]);
//   const [calls, setCalls] = useState<CallLocation[]>([]);
//   const [eventZones, setEventZones] = useState<EventZone[]>([]);
//   const [strategicZones, setStrategicZones] = useState<StrategicZone[]>([]);
  
//   // Filter states
//   const [filters, setFilters] = useState<MapFilters>({
//     showOfficers: true,
//     showCalls: true,
//     showEventZones: true,
//     showStrategicZones: true,
//     urgencyFilter: 'all',
//     statusFilter: 'all'
//   });

//   // Auto refresh state
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

//   const currentMapboxToken = mapboxToken || tokenInput;

//   // Initialize map
//   useEffect(() => {
//     if (!mapContainer.current || !currentMapboxToken) return;

//     mapboxgl.accessToken = currentMapboxToken;
    
//     try {
//       map.current = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: 'mapbox://styles/mapbox/light-v11',
//         center: [34.8516, 31.0461], // Israel center coordinates
//         zoom: 8,
//         pitch: 0,
//         bearing: 0
//       });

//       // Add navigation controls
//       map.current.addControl(
//         new mapboxgl.NavigationControl({
//           visualizePitch: true,
//         }),
//         'top-right'
//       );

//       // Add fullscreen control
//       map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

//       map.current.on('load', () => {
//         setIsLoaded(true);
//         toast.success("המפה נטענה בהצלחה!");
//         console.log("Map loaded successfully");
//       });

//       map.current.on('error', (e) => {
//         console.error("Map error:", e);
//         toast.error("שגיאה בטעינת המפה. אנא בדוק את ה-Token של Mapbox");
//       });

//     } catch (error) {
//       console.error("Failed to initialize map:", error);
//       toast.error("נכשל באתחול המפה");
//     }

//     return () => {
//       map.current?.remove();
//     };
//   }, [currentMapboxToken]);

//   // Mock data fetching functions (replace with actual API calls)
//   const fetchPoliceOfficers = async (): Promise<PoliceOfficerLocation[]> => {
//     // Replace with actual API call
//     console.log("Fetching police officers...");
//     return [
//       {
//         id: 1,
//         latitude: 31.0461,
//         longitude: 34.8516,
//         vehicleType: 'רכב סיור',
//         status: 'פנוי',
//         lastUpdate: new Date()
//       },
//       {
//         id: 2,
//         latitude: 31.0561,
//         longitude: 34.8616,
//         vehicleType: 'אופנוע',
//         status: 'בדרך',
//         lastUpdate: new Date()
//       }
//     ];
//   };

//   const fetchCalls = async (): Promise<CallLocation[]> => {
//   try {
//     const response = await fetch("https://localhost:7163/api/Call/all");
//     if (!response.ok) throw new Error("שגיאה בשליפת הקריאות");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching calls:", error);
//     toast.error("שגיאה בטעינת קריאות");
//     return [];
//   }
// };


//   const fetchEventZones = async (): Promise<EventZone[]> => {
//   try {
//     const response = await fetch("https://localhost:7163/api/Event/allZones");
//     if (!response.ok) throw new Error("שגיאה בשליפת אזורי האירועים");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching event zones:", error);
//     toast.error("שגיאה בטעינת אזורי האירועים");
//     return [];
//   }
// };

//   const fetchStrategicZones = async (): Promise<StrategicZone[]> => {
//   try {
//     const response = await fetch("https://localhost:7163/api/StrategicZone/all");
//     if (!response.ok) throw new Error("שגיאה בשליפת אזורים אסטרטגיים");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching strategic zones:", error);
//     toast.error("שגיאה בטעינת האזורים האסטרטגיים");
//     return [];
//   }
// };


//   // Data fetching effect
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [officersData, callsData, eventZonesData, strategicZonesData] = await Promise.all([
//           fetchPoliceOfficers(),
//           fetchCalls(),
//           fetchEventZones(),
//           fetchStrategicZones()
//         ]);
        
//         setPoliceOfficers(officersData);
//         setCalls(callsData);
//         setEventZones(eventZonesData);
//         setStrategicZones(strategicZonesData);
        
//         console.log("Data loaded:", { officersData, callsData, eventZonesData, strategicZonesData });
//       } catch (error) {
//         console.error("Error loading data:", error);
//         toast.error("שגיאה בטעינת הנתונים");
//       }
//     };

//     if (isLoaded) {
//       loadData();
//     }
//   }, [isLoaded]);

//   // Auto refresh effect
//   useEffect(() => {
//     if (!autoRefresh || !isLoaded) return;

//     const interval = setInterval(async () => {
//       try {
//         const [officersData, callsData, eventZonesData, strategicZonesData] = await Promise.all([
//           fetchPoliceOfficers(),
//           fetchCalls(),
//           fetchEventZones(),
//           fetchStrategicZones()
//         ]);
        
//         setPoliceOfficers(officersData);
//         setCalls(callsData);
//         setEventZones(eventZonesData);
//         setStrategicZones(strategicZonesData);
        
//         console.log("Data refreshed automatically");
//       } catch (error) {
//         console.error("Error refreshing data:", error);
//       }
//     }, refreshInterval);

//     return () => clearInterval(interval);
//   }, [autoRefresh, refreshInterval, isLoaded]);

//   // Update map markers when data changes
//   useEffect(() => {
//     if (!map.current || !isLoaded) return;

//     // Clear existing markers
//     const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
//     existingMarkers.forEach(marker => marker.remove());

//     // Add police officers
//     if (filters.showOfficers) {
//       policeOfficers.forEach(officer => {
//         const el = document.createElement('div');
//         el.className = 'police-marker';
//         el.style.cssText = `
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background-color: ${officer.status === 'פנוי' ? '#22c55e' : officer.status === 'בדרך' ? '#f59e0b' : '#ef4444'};
//           border: 2px solid white;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.3);
//           cursor: pointer;
//         `;

//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//           <div style="direction: rtl; font-family: Arial;">
//             <h3>שוטר #${officer.id}</h3>
//             <p><strong>סטטוס:</strong> ${officer.status}</p>
//             <p><strong>סוג רכב:</strong> ${officer.vehicleType}</p>
//             <p><strong>עדכון אחרון:</strong> ${officer.lastUpdate.toLocaleTimeString('he-IL')}</p>
//           </div>
//         `);

//         new mapboxgl.Marker(el)
//           .setLngLat([officer.longitude, officer.latitude])
//           .setPopup(popup)
//           .addTo(map.current!);
//       });
//     }

//     // Add calls
//     if (filters.showCalls) {
//       calls.forEach(call => {
//         const el = document.createElement('div');
//         el.className = 'call-marker';
//         const urgencyColor = call.urgencyLevel >= 3 ? '#dc2626' : call.urgencyLevel >= 2 ? '#f59e0b' : '#22c55e';
//         el.style.cssText = `
//           width: 24px;
//           height: 24px;
//           background-color: ${urgencyColor};
//           border: 2px solid white;
//           border-radius: 4px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.3);
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: bold;
//           font-size: 12px;
//         `;
//         el.textContent = '!';

//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//           <div style="direction: rtl; font-family: Arial;">
//             <h3>קריאה #${call.id}</h3>
//             <p><strong>רמת דחיפות:</strong> ${call.urgencyLevel}/3</p>
//             <p><strong>סטטוס:</strong> ${call.status}</p>
//             <p><strong>שוטרים נדרשים:</strong> ${call.requiredOfficers}</p>
//             <p><strong>זמן קריאה:</strong> ${call.callTime.toLocaleTimeString('he-IL')}</p>
//             <p><strong>טלפון ליצירת קשר:</strong> ${call.contactPhone}</p>
//           </div>
//         `);

//         new mapboxgl.Marker(el)
//           .setLngLat([call.longitude, call.latitude])
//           .setPopup(popup)
//           .addTo(map.current!);
//       });
//     }

//     // Add strategic zones
//     if (filters.showStrategicZones) {
//       strategicZones.forEach(zone => {
//         const el = document.createElement('div');
//         el.className = 'strategic-zone-marker';
//         el.style.cssText = `
//           width: 16px;
//           height: 16px;
//           background-color: #8b5cf6;
//           border: 2px solid white;
//           border-radius: 2px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.3);
//           cursor: pointer;
//         `;

//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//           <div style="direction: rtl; font-family: Arial;">
//             <h3>אזור אסטרטגי #${zone.id}</h3>
//             <p><strong>אירוע:</strong> #${zone.eventId}</p>
//             <p><strong>רמת אסטרטגיה:</strong> ${zone.strategyLevel}</p>
//           </div>
//         `);

//         new mapboxgl.Marker(el)
//           .setLngLat([zone.longitude, zone.latitude])
//           .setPopup(popup)
//           .addTo(map.current!);
//       });
//     }

//     // Add event zones (polygons)
//     if (filters.showEventZones) {
//       eventZones.forEach(zone => {
//         if (map.current!.getSource(`event-zone-${zone.id}`)) {
//           map.current!.removeLayer(`event-zone-${zone.id}`);
//           map.current!.removeSource(`event-zone-${zone.id}`);
//         }

//         map.current!.addSource(`event-zone-${zone.id}`, {
//           type: 'geojson',
//           data: {
//             type: 'Feature',
//             properties: { id: zone.id, eventId: zone.eventId },
//             geometry: {
//               type: 'Polygon',
//               coordinates: [zone.coordinates.map(coord => [coord[0], coord[1]])]
//             }
//           }
//         });

//         map.current!.addLayer({
//           id: `event-zone-${zone.id}`,
//           type: 'fill',
//           source: `event-zone-${zone.id}`,
//           paint: {
//             'fill-color': '#3b82f6',
//             'fill-opacity': 0.3
//           }
//         });

//         map.current!.addLayer({
//           id: `event-zone-border-${zone.id}`,
//           type: 'line',
//           source: `event-zone-${zone.id}`,
//           paint: {
//             'line-color': '#1d4ed8',
//             'line-width': 2
//           }
//         });
//       });
//     }

//   }, [policeOfficers, calls, eventZones, strategicZones, filters, isLoaded]);

//   if (!currentMapboxToken) {
//     return (
//       <Card className="p-6 max-w-md mx-auto">
//         <div className="space-y-4" dir="rtl">
//           <h3 className="text-lg font-semibold">הזן Mapbox Token</h3>
//           <p className="text-sm text-muted-foreground">
//             כדי להציג את המפה, אנא הזן את ה-Token של Mapbox שלך
//           </p>
//           <div className="space-y-2">
//             <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
//             <Input
//               id="mapbox-token"
//               type="text"
//               value={tokenInput}
//               onChange={(e) => setTokenInput(e.target.value)}
//               placeholder="pk.eyJ1..."
//               dir="ltr"
//             />
//           </div>
//           <p className="text-xs text-muted-foreground">
//             ניתן למצוא את ה-Token ב-
//             <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//               Mapbox Dashboard
//             </a>
//           </p>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col space-y-4" dir="rtl">
//       {/* Header with stats */}
//       <MapStats 
//         policeCount={policeOfficers.length}
//         callsCount={calls.length}
//         eventZonesCount={eventZones.length}
//         strategicZonesCount={strategicZones.length}
//       />

//       {/* Controls */}
//       <MapControls 
//         filters={filters}
//         onFiltersChange={setFilters}
//         autoRefresh={autoRefresh}
//         onAutoRefreshChange={setAutoRefresh}
//         refreshInterval={refreshInterval}
//         onRefreshIntervalChange={setRefreshInterval}
//         onManualRefresh={() => {
//           // Trigger manual refresh
//           setPoliceOfficers([]); // This will trigger a re-fetch
//         }}
//       />

//       {/* Map container */}
//       <div className="flex-1 relative">
//         <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
        
//         {/* Legend overlay */}
//         <div className="absolute bottom-4 left-4 z-10">
//           <MapLegend />
//         </div>

//         {/* Loading overlay */}
//         {!isLoaded && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
//             <div className="bg-white p-4 rounded-lg shadow-lg">
//               <p>טוען מפה...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InteractiveMap;
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import MapStats from './MapStats';
import type { MapData, MapSettings } from '../types/mapTypes';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons using CSS filters like your existing code
const officerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'officer-marker'
});

const callIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'call-marker'
});

const urgentCallIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'urgent-call-marker'
});

const strategicZoneIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'strategic-marker'
});

const InteractiveMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ officers: L.Marker[], calls: L.Marker[], strategic: L.Marker[], eventZones: L.Polygon[] }>({
    officers: [],
    calls: [],
    strategic: [],
    eventZones: []
  });

  const [apiBaseUrl, setApiBaseUrl] = useState('https://localhost:7163/api');
  const [mapConfigured, setMapConfigured] = useState(true);
  
  const [mapData, setMapData] = useState<MapData>({
    officers: [],
    calls: [],
    eventZones: [],
    strategicZones: []
  });

  const [settings, setSettings] = useState<MapSettings>({
    showOfficers: true,
    showCalls: true,
    showEventZones: true,
    showStrategicZones: true,
    autoRefresh: true,
    refreshInterval: 30
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

const map = L.map(mapRef.current).setView([32.0512, 34.9535], 15);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add custom CSS for marker styling
    const style = document.createElement('style');
    style.textContent = `
      .officer-marker {
        filter: hue-rotate(120deg) saturate(1.5);
      }
      .call-marker {
        filter: hue-rotate(45deg) saturate(1.5);
      }
      .urgent-call-marker {
        filter: hue-rotate(0deg) saturate(2) brightness(1.2);
      }
      .strategic-marker {
        filter: hue-rotate(270deg) saturate(1.5);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const clearMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear all existing markers
    Object.values(markersRef.current).forEach(markers => {
      markers.forEach(marker => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
    });

    // Reset markers arrays
    markersRef.current = {
      officers: [],
      calls: [],
      strategic: [],
      eventZones: []
    };
  };

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current) return;

    clearMarkers();
    const map = mapInstanceRef.current;

    // Add officer markers
    if (settings.showOfficers) {
      mapData.officers.forEach(officer => {
        const marker = L.marker([officer.latitude, officer.longitude], { icon: officerIcon })
          .addTo(map)
          .bindPopup(`
            <div style="direction: rtl;">
              <strong>שוטר ${officer.policeOfficerID}</strong><br />
              רכב: ${officer.vehicleType || 'לא צוין'}
            </div>
          `);
        markersRef.current.officers.push(marker);
      });
    }

    // Add call markers
    if (settings.showCalls) {
      mapData.calls.forEach(call => {
        const icon = call.urgencyLevel >= 3 ? urgentCallIcon : callIcon;
        const marker = L.marker([call.latitude, call.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="direction: rtl;">
              <strong>קריאה ${call.callID}</strong><br />
              דחיפות: ${call.urgencyLevel}/5<br />
              סטטוס: ${call.status}<br />
              שעה: ${new Date(call.callTime).toLocaleTimeString('he-IL')}
            </div>
          `);
        markersRef.current.calls.push(marker);
      });
    }

    // Add strategic zone markers
    if (settings.showStrategicZones) {
      mapData.strategicZones.forEach(zone => {
        const marker = L.marker([zone.latitude, zone.longitude], { icon: strategicZoneIcon })
          .addTo(map)
          .bindPopup(`
            <div style="direction: rtl;">
              <strong>אזור אסטרטגי ${zone.strategicZoneID}</strong><br />
              רמת אסטרטגיה: ${zone.strategyLevel}
            </div>
          `);
        markersRef.current.strategic.push(marker);
      });
    }

    // Add event zone polygons
    if (settings.showEventZones) {
      mapData.eventZones.forEach(zone => {
        const polygon = L.polygon([
          [zone.latitude1, zone.longitude1],
          [zone.latitude2, zone.longitude2],
          [zone.latitude3, zone.longitude3],
          [zone.latitude4, zone.longitude4]
        ], {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.3
        }).addTo(map)
          .bindPopup(`
            <div style="direction: rtl;">
              <strong>אזור אירוע ${zone.zoneID}</strong><br />
              אירוע: ${zone.eventID}
            </div>
          `);
        markersRef.current.eventZones.push(polygon);
      });
    }
  };

  // Update markers when data or settings change
  useEffect(() => {
    if (mapConfigured) {
      updateMapMarkers();
    }
  }, [mapData, settings, mapConfigured]);

  const fetchMapData = async () => {
    if (!apiBaseUrl) return;
    
    try {
      console.log('Fetching map data from:', apiBaseUrl);
      
      // Fetch officer locations
      const officersResponse = await fetch(`${apiBaseUrl}/officers/locations`);
      const officers = officersResponse.ok ? await officersResponse.json() : [];
      
      // Fetch calls
      const callsResponse = await fetch(`${apiBaseUrl}/Call/all`);
      const calls = callsResponse.ok ? await callsResponse.json() : [];
      
      // Fetch event zones
      const eventZonesResponse = await fetch(`${apiBaseUrl}/Event/allZones`);
      const eventZones = eventZonesResponse.ok ? await eventZonesResponse.json() : [];
      
      // Fetch strategic zones
      const strategicZonesResponse = await fetch(`${apiBaseUrl}/StrategicZone/all`);
      const strategicZones = strategicZonesResponse.ok ? await strategicZonesResponse.json() : [];

      setMapData({ officers, calls, eventZones, strategicZones });
      console.log('Map data updated:', { officers: officers.length, calls: calls.length });
      
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
  };

  useEffect(() => {
    if (mapConfigured) {
      fetchMapData();
    }
  }, [mapConfigured, apiBaseUrl]);

  // Auto refresh
  useEffect(() => {
    if (settings.autoRefresh && mapConfigured) {
      const interval = setInterval(fetchMapData, settings.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [settings.autoRefresh, settings.refreshInterval, mapConfigured]);

  if (!mapConfigured) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">הגדרת המפה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-right">
              המפה משתמשת בשרת OpenStreetMap וספריית Leaflet.
              <br />
              הכניסי את כתובת ה-API שלך להתחלת העבודה.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">כתובת שרת ה-API שלך:</label>
            <Input 
              placeholder="http://localhost:7163/api"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              dir="rtl"
            />
          </div>
          
          <Button 
            onClick={() => setMapConfigured(true)} 
            disabled={!apiBaseUrl}
            className="w-full"
          >
            הפעל מפה
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 h-[600px]">
        <div className="flex-1 relative">
          <div 
            ref={mapRef}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          />
        </div>
        
        <div className="w-80 flex flex-col gap-4">
  <div className="flex gap-2">
    <MapStats data={mapData} />
    <MapLegend />
  </div>
  <MapControls 
    settings={settings} 
    onSettingsChange={setSettings}
    onRefresh={fetchMapData}
  />
</div>

      </div>
      
     
    </div>
  );
};

export default InteractiveMap;