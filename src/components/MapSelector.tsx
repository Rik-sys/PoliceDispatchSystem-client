
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { MapPin, Zap, Users, Play, Square, Send, Loader2, Shield, AlertCircle } from 'lucide-react';
// import { toast } from '@/components/ui/sonner';

// // Fix for default markers in Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// // Custom police icon (blue)
// const policeIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
//   className: 'police-marker'
// });

// interface MapSelectorProps {
//   onAreaSelected?: (coordinates: number[][]) => void;
//   onRunAlgorithm?: (area: number[][], officerCount: number) => void;
//   requiredOfficers?: number;
// }

// const MapSelector: React.FC<MapSelectorProps> = ({ 
//   onAreaSelected, 
//   onRunAlgorithm, 
//   requiredOfficers = 5 
// }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);
//   const [selectedBounds, setSelectedBounds] = useState<L.LatLngBounds | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
//   const [currentRect, setCurrentRect] = useState<L.Rectangle | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [isFirstUploadDone, setIsFirstUploadDone] = useState(false);
//   const [lastUploadWasRepair, setLastUploadWasRepair] = useState(false);
//   const [officerCount, setOfficerCount] = useState(requiredOfficers);
//   const [policeLocations, setPoliceLocations] = useState<any[]>([]);
//   const [maxResponseTime, setMaxResponseTime] = useState<number | null>(null);
//   const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);
//   const [maxNodes, setMaxNodes] = useState<number | null>(null);

//   useEffect(() => {
//     if (!mapRef.current || mapInstanceRef.current) return;

//     // Initialize map centered on Israel
//     const map = L.map(mapRef.current).setView([31.7683, 35.2137], 13);
//     mapInstanceRef.current = map;

//     // Add OpenStreetMap tiles
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(map);

//     // Rectangle drawing functionality
//     const handleMapClick = (e: L.LeafletMouseEvent) => {
//       if (!isDrawing) return;
      
//       if (!startPoint) {
//         setStartPoint(e.latlng);
//         // Create initial rectangle
//         const bounds = L.latLngBounds(e.latlng, e.latlng);
//         const rect = L.rectangle(bounds, {
//           color: '#3388ff',
//           weight: 3,
//           fillOpacity: 0.2,
//           dashArray: '5, 5'
//         }).addTo(map);
//         setCurrentRect(rect);
//       } else {
//         // Complete rectangle
//         const finalBounds = L.latLngBounds(startPoint, e.latlng);
//         setSelectedBounds(finalBounds);
//         setIsDrawing(false);
//         setStartPoint(null);
        
//         // Remove temporary rectangle
//         if (currentRect) {
//           map.removeLayer(currentRect);
//           setCurrentRect(null);
//         }
        
//         // Add final rectangle
//         L.rectangle(finalBounds, {
//           color: '#3388ff',
//           weight: 3,
//           fillOpacity: 0.3
//         }).addTo(map);

//         // Notify parent component
//         const coordinates = [
//           [finalBounds.getNorth(), finalBounds.getWest()],
//           [finalBounds.getNorth(), finalBounds.getEast()],
//           [finalBounds.getSouth(), finalBounds.getEast()],
//           [finalBounds.getSouth(), finalBounds.getWest()]
//         ];
//         onAreaSelected?.(coordinates);
//       }
//     };

//     const handleMouseMove = (e: L.LeafletMouseEvent) => {
//       if (!isDrawing || !startPoint || !currentRect) return;
      
//       const bounds = L.latLngBounds(startPoint, e.latlng);
//       currentRect.setBounds(bounds);
//     };

//     // Set up event listeners when drawing
//     if (isDrawing) {
//       map.on('click', handleMapClick);
//       map.on('mousemove', handleMouseMove);
//       map.getContainer().style.cursor = 'crosshair';
//     } else {
//       map.off('click', handleMapClick);
//       map.off('mousemove', handleMouseMove);
//       map.getContainer().style.cursor = '';
//     }

//     return () => {
//       map.off('click', handleMapClick);
//       map.off('mousemove', handleMouseMove);
//       map.remove();
//       mapInstanceRef.current = null;
//     };
//   }, [isDrawing, startPoint, onAreaSelected]);

//   // Download OSM data function
//   const downloadOsmData = async (bounds: L.LatLngBounds) => {
//     setIsDownloading(true);
//     try {
//       const south = bounds.getSouth();
//       const north = bounds.getNorth();
//       const west = bounds.getWest();
//       const east = bounds.getEast();
      
//       const query = `
//         [out:xml][timeout:180];
//         (
//           way["highway"]
//             (${south},${west},${north},${east});
//           relation["highway"]
//             (${south},${west},${north},${east});
//         );
//         (._;>;);
//         out meta;
//       `;

//       const overpassUrl = 'https://overpass-api.de/api/interpreter';
      
//       console.log("מוריד נתוני OSM מהגבולות:", { south, west, north, east });
      
//       const response = await fetch(overpassUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `data=${encodeURIComponent(query)}`
//       });

//       if (!response.ok) {
//         throw new Error(`Overpass API שגיאה: ${response.status}`);
//       }

//       const osmData = await response.text();
//       console.log("התקבלו נתוני OSM בגודל:", osmData.length, "תווים");
//       return osmData;
//     } catch (error) {
//       console.error('שגיאה בהורדת נתוני OSM:', error);
//       toast.error(`שגיאה בהורדת נתוני OSM: ${(error as Error).message}`);
//       throw error;
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // Export area to server
//   const exportAreaToPBF = async () => {
//     if (!selectedBounds) {
//       toast.error('אנא בחר אזור במפה לפני שליחה');
//       return;
//     }
    
//     try {
//       setIsLoading(true);
//       const serverBaseUrl = 'https://localhost:7163';
//       const osmData = await downloadOsmData(selectedBounds);
      
//       const formData = new FormData();
//       const osmBlob = new Blob([osmData], { type: 'application/xml' });
//       formData.append('file', osmBlob, 'area.osm');
      
//       formData.append('minLat', selectedBounds.getSouth().toString());
//       formData.append('maxLat', selectedBounds.getNorth().toString());
//       formData.append('minLon', selectedBounds.getWest().toString());
//       formData.append('maxLon', selectedBounds.getEast().toString());
      
//       const endpoint = !isFirstUploadDone 
//         ? `${serverBaseUrl}/api/Graph/upload-osm` 
//         : `${serverBaseUrl}/api/Graph/repair-osm`;
        
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         body: formData
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`שגיאה בשליחת קובץ: ${errorText}`);
//       }
      
//       const result = await response.json();
//       const isConnected = result.IsConnected || result.isConnected || false;
//       const message = result.Message || result.message || 'אין הודעה מהשרת';
//       setMaxNodes(result.NodeCount || result.nodeCount || 100);

//       if ((result.NodeCount || result.nodeCount) && officerCount > (result.NodeCount || result.nodeCount)) {
//         setOfficerCount(result.NodeCount || result.nodeCount);
//         toast.warning(`המספר המקסימלי של שוטרים הוא ${result.NodeCount || result.nodeCount}, המספר תוקן בהתאם`);
//       }

//       if (!isFirstUploadDone) {
//         setIsFirstUploadDone(true);
//         isConnected ? toast.success(message) : toast.warning(message);
//       } else if (!lastUploadWasRepair) {
//         setLastUploadWasRepair(true);
//         isConnected ? toast.success(message) : toast.error(message);
//       }
      
//       if (isConnected) {
//         setPoliceLocations([]);
//         setMaxResponseTime(null);
//       }
//     } catch (error) {
//       console.error('שגיאה:', error);
//       toast.error(`שגיאה כללית: ${(error as Error).message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Calculate officer locations
//   const calculateOfficerLocations = async () => {
//     if (!isFirstUploadDone) {
//       toast.warning('יש להעלות קובץ OSM ולוודא שהגרף קשיר לפני חישוב מיקומי השוטרים');
//       return;
//     }

//     try {
//       setIsLoadingOfficers(true);
//       const serverBaseUrl = 'https://localhost:7163';
//       const kCenterEndpoint = `${serverBaseUrl}/api/KCenter/distribute?k=${officerCount}`;
      
//       const response = await fetch(kCenterEndpoint, {
//         method: 'POST'
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`שגיאה בחישוב מיקומי השוטרים (${response.status}): ${errorText}`);
//       }

//       const result = await response.json();
//       const centers = result.policePositions || result.centers || result.Centers || [];

//       if (centers.length > 0) {
//         toast.info(`מקבל מיקומי קואורדינטות עבור ${centers.length} שוטרים...`);
//         let policeData = [];

//         if (typeof centers[0] === 'number') {
//           const nodeLocationsPromises = centers.map(async (nodeId: number) => {
//             try {
//               const locationEndpoint = `${serverBaseUrl}/api/Graph/get-node-location?nodeId=${nodeId}`;
//               const locationResponse = await fetch(locationEndpoint);

//               if (!locationResponse.ok) {
//                 console.error(`שגיאה בקבלת מיקום צומת ${nodeId}:`, locationResponse.status);
//                 return null;
//               }

//               const locationData = await locationResponse.json();
//               return {
//                 nodeId: nodeId,
//                 lat: locationData.Lat || locationData.lat,
//                 lon: locationData.Lon || locationData.lon
//               };
//             } catch (error) {
//               console.error(`שגיאה בקבלת מיקום צומת ${nodeId}:`, error);
//               return null;
//             }
//           });

//           const results = await Promise.all(nodeLocationsPromises);
//           policeData = results.filter(data => data !== null);
//         } else if (typeof centers[0] === 'object') {
//           policeData = centers.map((center: any) => ({
//             nodeId: center.nodeId || center.NodeId,
//             lat: center.latitude || center.lat || center.Lat,
//             lon: center.longitude || center.lon || center.Lon
//           }));
//         }

//         if (policeData.length > 0) {
//           setPoliceLocations(policeData);
//           setMaxResponseTime(result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds || null);
          
//           // Add police markers to map
//           if (mapInstanceRef.current) {
//             policeData.forEach((officer, index) => {
//               const marker = L.marker([officer.lat, officer.lon], { icon: policeIcon })
//                 .addTo(mapInstanceRef.current!)
//                 .bindPopup(`שוטר ${index + 1}<br/>מיקום: ${officer.lat.toFixed(5)}, ${officer.lon.toFixed(5)}<br/>מזהה צומת: ${officer.nodeId}`);
              
//               // Add coverage circle
//               if (maxResponseTime) {
//                 L.circle([officer.lat, officer.lon], {
//                   radius: maxResponseTime * 13.89,
//                   color: '#0062ff',
//                   fillColor: '#0062ff',
//                   fillOpacity: 0.1,
//                   weight: 1
//                 }).addTo(mapInstanceRef.current!);
//               }
//             });

//             // Fit map to show all officers
//             const bounds = L.latLngBounds(policeData.map(officer => [officer.lat, officer.lon]));
//             mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
//           }

//           toast.success(`הוצגו ${policeData.length} מיקומים אופטימליים לשוטרים`);
//           //onRunAlgorithm?.([], officerCount);
//           onRunAlgorithm?.(selectedBounds ? [
//   [selectedBounds.getNorth(), selectedBounds.getWest()],
//   [selectedBounds.getNorth(), selectedBounds.getEast()],
//   [selectedBounds.getSouth(), selectedBounds.getEast()],
//   [selectedBounds.getSouth(), selectedBounds.getWest()]
// ] : [], officerCount);

//           if (result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds) {
//             const responseTime = result.maxResponseTimeInSeconds || result.MaxResponseTimeInSeconds;
//             toast.info(`זמן תגובה מקסימלי: ${responseTime.toFixed(2)} שניות`);
//           }
//         } else {
//           toast.error('לא התקבלו מיקומים תקינים מהשרת');
//         }
//       } else {
//         toast.warning('לא התקבלו מיקומי שוטרים מהשרת');
//       }

//     } catch (error) {
//       console.error("שגיאה בחישוב מיקומי השוטרים:", error);
//       toast.error(`שגיאה בחישוב מיקומי השוטרים: ${(error as Error).message}`);
//     } finally {
//       setIsLoadingOfficers(false);
//     }
//   };

//   const clearSelection = () => {
//     setSelectedBounds(null);
//     setIsFirstUploadDone(false);
//     setLastUploadWasRepair(false);
//     setPoliceLocations([]);
//     setMaxResponseTime(null);
//     setStartPoint(null);
    
//     if (currentRect && mapInstanceRef.current) {
//       mapInstanceRef.current.removeLayer(currentRect);
//       setCurrentRect(null);
//     }
    
//     // Clear all layers from map
//     if (mapInstanceRef.current) {
//       mapInstanceRef.current.eachLayer((layer) => {
//         if (layer instanceof L.Rectangle || layer instanceof L.Marker || layer instanceof L.Circle) {
//           mapInstanceRef.current!.removeLayer(layer);
//         }
//       });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Map Container */}
//       <Card className="command-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="w-5 h-5 text-command-blue" />
//             מפת תיחום אזור ריבועי
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="relative">
//             <div 
//               ref={mapRef} 
//               className="w-full h-96 rounded-xl border border-command-slate-200 modern-shadow"
//             />
            
//             {/* Status overlay */}
//             {isDrawing && (
//               <div className="absolute top-4 left-4 z-[1000]">
//                 <Badge className="command-gradient text-white">
//                   🖱️ לחץ פעם ראשונה להתחלה, פעם שנייה לסיום הריבוע
//                 </Badge>
//               </div>
//             )}

//             {/* Control Panel */}
//             <div className="absolute top-4 right-4 z-[1000]">
//               <Card className="p-4 bg-white/90 shadow-lg">
//                 <div className="space-y-4">
//                   <Button 
//                     onClick={() => setIsDrawing(!isDrawing)}
//                     className={`flex items-center gap-2 w-full ${isDrawing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
//                     disabled={isDrawing || isLoading || isDownloading}
//                   >
//                     <Square className="h-5 w-5" />
//                     {isDrawing ? 'מצב ציור פעיל' : 'בחירת אזור ריבועי'}
//                   </Button>

//                   {selectedBounds && (
//                     <div className="space-y-2">
//                       <div className="text-sm text-right">
//                         <div>צפון-מערב: {selectedBounds.getNorthWest().lat.toFixed(4)}, {selectedBounds.getNorthWest().lng.toFixed(4)}</div>
//                         <div>דרום-מזרח: {selectedBounds.getSouthEast().lat.toFixed(4)}, {selectedBounds.getSouthEast().lng.toFixed(4)}</div>
//                       </div>
                      
//                       <div className="flex gap-2">
//                         <Button 
//                           onClick={clearSelection} 
//                           variant="destructive" 
//                           size="sm"
//                           disabled={isLoading || isDownloading || isLoadingOfficers}
//                         >
//                           נקה
//                         </Button>
//                       </div>

//                       <Button 
//                         onClick={exportAreaToPBF}
//                         variant="default"
//                         className="w-full flex items-center justify-center gap-2"
//                         disabled={isLoading || isDownloading || isLoadingOfficers}
//                       >
//                         {isLoading || isDownloading ? (
//                           <>
//                             <Loader2 className="h-5 w-5 animate-spin" />
//                             {isDownloading ? 'מוריד נתוני מפה...' : 'שולח לשרת...'}
//                           </>
//                         ) : (
//                           <>
//                             <Send className="h-5 w-5" />
//                             {!isFirstUploadDone 
//                               ? 'שליחה לשרת' 
//                               : !lastUploadWasRepair 
//                                 ? 'תיקון הגרף' 
//                                 : 'ניסיון תיקון נוסף'}
//                           </>
//                         )}
//                       </Button>
                      
//                       {/* Police Distribution Section */}
//                       {isFirstUploadDone && (
//                         <div className="border-t pt-3 mt-3">
//                           <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
//                             <Shield className="w-4 h-4" />
//                             פיזור שוטרים
//                           </h3>
//                           <div className="flex items-center gap-2 mb-2">
//                             <Label htmlFor="officers" className="text-sm">מספר שוטרים:</Label>
//                             <Input 
//                               id="officers" 
//                               type="number" 
//                               min="1" 
//                               max={maxNodes || undefined} 
//                               value={officerCount} 
//                               onChange={(e) => {
//                                 const value = parseInt(e.target.value);
//                                 if (!isNaN(value)) {
//                                   if (maxNodes && value > maxNodes) {
//                                     setOfficerCount(maxNodes);
//                                     toast.warning(`הוזנו יותר שוטרים ממספר הצמתים. עודכן ל-${maxNodes}`);
//                                   } else {
//                                     setOfficerCount(value);
//                                   }
//                                 } else {
//                                   setOfficerCount(1);
//                                 }
//                               }}
//                               className="w-20 text-left"
//                             />
//                           </div>
                          
//                           <Button 
//                             onClick={calculateOfficerLocations}
//                             variant="secondary"
//                             className="w-full flex items-center justify-center gap-2"
//                             disabled={isLoading || isDownloading || isLoadingOfficers}
//                           >
//                             {isLoadingOfficers ? (
//                               <>
//                                 <Loader2 className="h-5 w-5 animate-spin" />
//                                 מחשב מיקומים...
//                               </>
//                             ) : (
//                               <>
//                                 <Shield className="h-5 w-5" />
//                                 פזר שוטרים על המפה
//                               </>
//                             )}
//                           </Button>
                          
//                           {maxResponseTime && (
//                             <div className="mt-2 text-sm text-center p-2 bg-blue-50 rounded-md">
//                               זמן תגובה מקסימלי: <span className="font-bold">{maxResponseTime.toFixed(2)}</span> שניות
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </div>
//           </div>
          
//           {/* Map instructions */}
//           <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <h4 className="font-medium text-command-blue mb-2">הוראות שימוש:</h4>
//             <ol className="text-sm text-command-slate-600 space-y-1">
//               <li>1. לחץ על כפתור "בחירת אזור ריבועי" כדי להתחיל</li>
//               <li>2. לחץ על המפה במיקום הפינה הראשונה של הריבוע</li>
//               <li>3. לחץ על המפה במיקום הפינה הנגדית לסיום הציור</li>
//               <li>4. לחץ על "שליחה לשרת" כדי לעבד את האזור</li>
//               <li>5. לחץ על "פזר שוטרים על המפה" כדי לראות את הפיזור האופטימלי</li>
//             </ol>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Algorithm Results */}
//       {policeLocations.length > 0 && (
//         <Card className="command-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="w-5 h-5 text-command-indigo" />
//               תוצאות הפיזור - אלגוריתם K-Center
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {policeLocations.map((officer, index) => (
//                 <div key={officer.nodeId || index} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-command-slate-800">שוטר {index + 1}</span>
//                     <Badge variant="outline" className="text-command-indigo border-indigo-300">
//                       צומת #{officer.nodeId}
//                     </Badge>
//                   </div>
//                   <p className="text-xs text-command-slate-600 mt-1">
//                     {officer.lat.toFixed(5)}, {officer.lon.toFixed(5)}
//                   </p>
//                 </div>
//               ))}
//             </div>
            
//             {maxResponseTime && (
//               <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-center">
//                 <p className="text-sm text-green-700">
//                   <strong>זמן תגובה מקסימלי:</strong> {maxResponseTime.toFixed(2)} שניות
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">
//                   הפיזור מבטיח כיסוי אופטימלי של כל האזור
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default MapSelector;
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { MapPin, Zap, Users, Play, Square, Send, Loader2, Shield, AlertCircle } from 'lucide-react';
// import { toast } from '@/components/ui/sonner';

// // Fix for default markers in Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// // Custom police icon (blue)
// const policeIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
//   className: 'police-marker'
// });

// // interface MapSelectorProps {
// //   onAreaSelected?: (coordinates: number[][]) => void;
// //   onRunAlgorithm?: (area: number[][], officerCount: number) => void;
// //   requiredOfficers?: number;
// // }
// interface MapSelectorProps {
//   onAreaSelected?: (coordinates: number[][]) => void;
//   onRunAlgorithm?: (area: number[][], officerCount: number) => void;
//   requiredOfficers?: number;
//   onStrategicZoneClick?: (lat: number, lng: number) => void;
//   isMarkingStrategic?: boolean;
//   strategicZones?: { latitude: number; longitude: number }[];
// }

// const MapSelector: React.FC<MapSelectorProps> = ({ 
//   onAreaSelected, 
//   onRunAlgorithm, 
//   requiredOfficers = 5 
// }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);
//   const rectangleLayerRef = useRef<L.Rectangle | null>(null);
//   const policeMarkersRef = useRef<L.Marker[]>([]);
//   const policeCirclesRef = useRef<L.Circle[]>([]);
  
//   const [selectedBounds, setSelectedBounds] = useState<L.LatLngBounds | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
//   const [currentRect, setCurrentRect] = useState<L.Rectangle | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [isFirstUploadDone, setIsFirstUploadDone] = useState(false);
//   const [lastUploadWasRepair, setLastUploadWasRepair] = useState(false);
//   const [officerCount, setOfficerCount] = useState(requiredOfficers);
//   const [policeLocations, setPoliceLocations] = useState<any[]>([]);
//   const [maxResponseTime, setMaxResponseTime] = useState<number | null>(null);
//   const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);
//   const [maxNodes, setMaxNodes] = useState<number | null>(null);

//   // Initialize map only once
//   useEffect(() => {
//     if (!mapRef.current || mapInstanceRef.current) return;

//     // Initialize map centered on Israel
//     const map = L.map(mapRef.current).setView([31.7683, 35.2137], 13);
//     mapInstanceRef.current = map;

//     // Add OpenStreetMap tiles
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(map);

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []); // רק פעם אחת בלבד!

//   // Handle drawing mode changes
//   useEffect(() => {
//     if (!mapInstanceRef.current) return;

//     const map = mapInstanceRef.current;

//     const handleMapClick = (e: L.LeafletMouseEvent) => {
//       if (!isDrawing) return;
      
//       if (!startPoint) {
//         // התחלת ציור - נקודה ראשונה
//         setStartPoint(e.latlng);
//         const bounds = L.latLngBounds(e.latlng, e.latlng);
//         const rect = L.rectangle(bounds, {
//           color: '#3388ff',
//           weight: 3,
//           fillOpacity: 0.2,
//           dashArray: '5, 5' // קו מקווקו
//         }).addTo(map);
//         setCurrentRect(rect);
//       } else {
//         // סיום ציור - נקודה שנייה
//         const finalBounds = L.latLngBounds(startPoint, e.latlng);
//         setSelectedBounds(finalBounds);
//         setIsDrawing(false);
//         setStartPoint(null);
        
//         // הסרת הריבוע הזמני
//         if (currentRect) {
//           map.removeLayer(currentRect);
//           setCurrentRect(null);
//         }
        
//         // הוספת הריבוע הסופי
//         if (rectangleLayerRef.current) {
//           map.removeLayer(rectangleLayerRef.current);
//         }
        
//         const finalRect = L.rectangle(finalBounds, {
//           color: '#3388ff',
//           weight: 3,
//           fillOpacity: 0.3 // קו רציף
//         }).addTo(map);
//         rectangleLayerRef.current = finalRect;

//         // הודעה לקומפוננטה האב
//         const coordinates = [
//           [finalBounds.getNorth(), finalBounds.getWest()],
//           [finalBounds.getNorth(), finalBounds.getEast()],
//           [finalBounds.getSouth(), finalBounds.getEast()],
//           [finalBounds.getSouth(), finalBounds.getWest()]
//         ];
//         onAreaSelected?.(coordinates);
//       }
//     };

//     const handleMouseMove = (e: L.LeafletMouseEvent) => {
//       if (!isDrawing || !startPoint || !currentRect) return;
      
//       const bounds = L.latLngBounds(startPoint, e.latlng);
//       currentRect.setBounds(bounds);
//     };

//     if (isDrawing) {
//       map.on('click', handleMapClick);
//       map.on('mousemove', handleMouseMove);
//       map.getContainer().style.cursor = 'crosshair';
//     } else {
//       map.off('click', handleMapClick);
//       map.off('mousemove', handleMouseMove);
//       map.getContainer().style.cursor = '';
//     }

//     return () => {
//       map.off('click', handleMapClick);
//       map.off('mousemove', handleMouseMove);
//     };
//   }, [isDrawing, startPoint, onAreaSelected]);

//   // Download OSM data function
//   const downloadOsmData = async (bounds: L.LatLngBounds) => {
//     setIsDownloading(true);
//     try {
//       const south = bounds.getSouth();
//       const north = bounds.getNorth();
//       const west = bounds.getWest();
//       const east = bounds.getEast();
      
//       const query = `
//         [out:xml][timeout:180];
//         (
//           way["highway"]
//             (${south},${west},${north},${east});
//           relation["highway"]
//             (${south},${west},${north},${east});
//         );
//         (._;>;);
//         out meta;
//       `;

//       const overpassUrl = 'https://overpass-api.de/api/interpreter';
      
//       console.log("מוריד נתוני OSM מהגבולות:", { south, west, north, east });
      
//       const response = await fetch(overpassUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `data=${encodeURIComponent(query)}`
//       });

//       if (!response.ok) {
//         throw new Error(`Overpass API שגיאה: ${response.status}`);
//       }

//       const osmData = await response.text();
//       console.log("התקבלו נתוני OSM בגודל:", osmData.length, "תווים");
//       return osmData;
//     } catch (error) {
//       console.error('שגיאה בהורדת נתוני OSM:', error);
//       toast.error(`שגיאה בהורדת נתוני OSM: ${(error as Error).message}`);
//       throw error;
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // Export area to server
//   const exportAreaToPBF = async () => {
//     if (!selectedBounds) {
//       toast.error('אנא בחר אזור במפה לפני שליחה');
//       return;
//     }
    
//     try {
//       setIsLoading(true);
//       const serverBaseUrl = 'https://localhost:7163';
//       const osmData = await downloadOsmData(selectedBounds);
      
//       const formData = new FormData();
//       const osmBlob = new Blob([osmData], { type: 'application/xml' });
//       formData.append('file', osmBlob, 'area.osm');
      
//       formData.append('minLat', selectedBounds.getSouth().toString());
//       formData.append('maxLat', selectedBounds.getNorth().toString());
//       formData.append('minLon', selectedBounds.getWest().toString());
//       formData.append('maxLon', selectedBounds.getEast().toString());
      
//       const endpoint = !isFirstUploadDone 
//         ? `${serverBaseUrl}/api/Graph/upload-osm` 
//         : `${serverBaseUrl}/api/Graph/repair-osm`;
        
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         body: formData
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`שגיאה בשליחת קובץ: ${errorText}`);
//       }
      
//       const result = await response.json();
//       const isConnected = result.IsConnected || result.isConnected || false;
//       const message = result.Message || result.message || 'אין הודעה מהשרת';
//       setMaxNodes(result.NodeCount || result.nodeCount || 100);

//       if ((result.NodeCount || result.nodeCount) && officerCount > (result.NodeCount || result.nodeCount)) {
//         setOfficerCount(result.NodeCount || result.nodeCount);
//         toast.warning(`המספר המקסימלי של שוטרים הוא ${result.NodeCount || result.nodeCount}, המספר תוקן בהתאם`);
//       }

//       if (!isFirstUploadDone) {
//         setIsFirstUploadDone(true);
//         isConnected ? toast.success(message) : toast.warning(message);
//       } else if (!lastUploadWasRepair) {
//         setLastUploadWasRepair(true);
//         isConnected ? toast.success(message) : toast.error(message);
//       }
      
//       if (isConnected) {
//         clearPoliceMarkers();
//         setPoliceLocations([]);
//         setMaxResponseTime(null);
//       }
//     } catch (error) {
//       console.error('שגיאה:', error);
//       toast.error(`שגיאה כללית: ${(error as Error).message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Clear police markers from map
//   const clearPoliceMarkers = () => {
//     if (mapInstanceRef.current) {
//       policeMarkersRef.current.forEach(marker => {
//         mapInstanceRef.current!.removeLayer(marker);
//       });
//       policeCirclesRef.current.forEach(circle => {
//         mapInstanceRef.current!.removeLayer(circle);
//       });
//     }
//     policeMarkersRef.current = [];
//     policeCirclesRef.current = [];
//   };

//   // Calculate officer locations
//   const calculateOfficerLocations = async () => {
//     if (!isFirstUploadDone) {
//       toast.warning('יש להעלות קובץ OSM ולוודא שהגרף קשיר לפני חישוב מיקומי השוטרים');
//       return;
//     }

//     try {
//       setIsLoadingOfficers(true);
//       clearPoliceMarkers(); // נקה סימנים קיימים
      
//       const serverBaseUrl = 'https://localhost:7163';
//       const kCenterEndpoint = `${serverBaseUrl}/api/KCenter/distribute?k=${officerCount}`;
      
//       const response = await fetch(kCenterEndpoint, {
//         method: 'POST'
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`שגיאה בחישוב מיקומי השוטרים (${response.status}): ${errorText}`);
//       }

//       const result = await response.json();
//       const centers = result.policePositions || result.centers || result.Centers || [];

//       if (centers.length > 0) {
//         toast.info(`מקבל מיקומי קואורדינטות עבור ${centers.length} שוטרים...`);
//         let policeData = [];

//         if (typeof centers[0] === 'number') {
//           const nodeLocationsPromises = centers.map(async (nodeId: number) => {
//             try {
//               const locationEndpoint = `${serverBaseUrl}/api/Graph/get-node-location?nodeId=${nodeId}`;
//               const locationResponse = await fetch(locationEndpoint);

//               if (!locationResponse.ok) {
//                 console.error(`שגיאה בקבלת מיקום צומת ${nodeId}:`, locationResponse.status);
//                 return null;
//               }

//               const locationData = await locationResponse.json();
//               return {
//                 nodeId: nodeId,
//                 lat: locationData.Lat || locationData.lat,
//                 lon: locationData.Lon || locationData.lon
//               };
//             } catch (error) {
//               console.error(`שגיאה בקבלת מיקום צומת ${nodeId}:`, error);
//               return null;
//             }
//           });

//           const results = await Promise.all(nodeLocationsPromises);
//           policeData = results.filter(data => data !== null);
//         } else if (typeof centers[0] === 'object') {
//           policeData = centers.map((center: any) => ({
//             nodeId: center.nodeId || center.NodeId,
//             lat: center.latitude || center.lat || center.Lat,
//             lon: center.longitude || center.lon || center.Lon
//           }));
//         }

//         if (policeData.length > 0) {
//           setPoliceLocations(policeData);
//           setMaxResponseTime(result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds || null);
          
//           // הוספת סימני שוטרים למפה
//           if (mapInstanceRef.current) {
//             const map = mapInstanceRef.current;
//             const newMarkers: L.Marker[] = [];
//             const newCircles: L.Circle[] = [];
            
//             policeData.forEach((officer, index) => {
//               // הוספת סימן שוטר
//               const marker = L.marker([officer.lat, officer.lon], { icon: policeIcon })
//                 .addTo(map)
//                 .bindPopup(`שוטר ${index + 1}<br/>מיקום: ${officer.lat.toFixed(5)}, ${officer.lon.toFixed(5)}<br/>מזהה צומת: ${officer.nodeId}`);
              
//               newMarkers.push(marker);
              
//               // הוספת עיגול כיסוי
//               if (result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds) {
//                 const responseTime = result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds;
//                 const circle = L.circle([officer.lat, officer.lon], {
//                   radius: responseTime * 13.89,
//                   color: '#0062ff',
//                   fillColor: '#0062ff',
//                   fillOpacity: 0.1,
//                   weight: 1
//                 }).addTo(map);
                
//                 newCircles.push(circle);
//               }
//             });

//             policeMarkersRef.current = newMarkers;
//             policeCirclesRef.current = newCircles;

//             // התאמת המפה להציג את כל השוטרים
//             const bounds = L.latLngBounds(policeData.map(officer => [officer.lat, officer.lon]));
//             map.fitBounds(bounds, { padding: [50, 50] });
//           }

//           toast.success(`הוצגו ${policeData.length} מיקומים אופטימליים לשוטרים`);
          
//           onRunAlgorithm?.(selectedBounds ? [
//             [selectedBounds.getNorth(), selectedBounds.getWest()],
//             [selectedBounds.getNorth(), selectedBounds.getEast()],
//             [selectedBounds.getSouth(), selectedBounds.getEast()],
//             [selectedBounds.getSouth(), selectedBounds.getWest()]
//           ] : [], officerCount);

//           if (result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds) {
//             const responseTime = result.maxResponseTimeInSeconds || result.MaxResponseTimeInSeconds;
//             toast.info(`זמן תגובה מקסימלי: ${responseTime.toFixed(2)} שניות`);
//           }
//         } else {
//           toast.error('לא התקבלו מיקומים תקינים מהשרת');
//         }
//       } else {
//         toast.warning('לא התקבלו מיקומי שוטרים מהשרת');
//       }

//     } catch (error) {
//       console.error("שגיאה בחישוב מיקומי השוטרים:", error);
//       toast.error(`שגיאה בחישוב מיקומי השוטרים: ${(error as Error).message}`);
//     } finally {
//       setIsLoadingOfficers(false);
//     }
//   };

//   const clearSelection = () => {
//     setSelectedBounds(null);
//     setIsFirstUploadDone(false);
//     setLastUploadWasRepair(false);
//     setPoliceLocations([]);
//     setMaxResponseTime(null);
//     setStartPoint(null);
    
//     if (currentRect && mapInstanceRef.current) {
//       mapInstanceRef.current.removeLayer(currentRect);
//       setCurrentRect(null);
//     }
    
//     if (rectangleLayerRef.current && mapInstanceRef.current) {
//       mapInstanceRef.current.removeLayer(rectangleLayerRef.current);
//       rectangleLayerRef.current = null;
//     }
    
//     clearPoliceMarkers();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Map Container */}
//       <Card className="command-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="w-5 h-5 text-command-blue" />
//             מפת תיחום אזור ריבועי
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="relative">
//             <div 
//               ref={mapRef} 
//               className="w-full h-96 rounded-xl border border-command-slate-200 modern-shadow"
//             />
            
//             {/* Status overlay */}
//             {isDrawing && (
//               <div className="absolute top-4 left-4 z-[1000]">
//                 <Badge className="command-gradient text-white">
//                   🖱️ {!startPoint ? 'לחץ לנקודה הראשונה' : 'לחץ לנקודה השנייה לסיום'}
//                 </Badge>
//               </div>
//             )}

//             {/* Control Panel */}
//             <div className="absolute top-4 right-4 z-[1000]">
//               <Card className="p-4 bg-white/90 shadow-lg">
//                 <div className="space-y-4">
//                   <Button 
//                     onClick={() => setIsDrawing(!isDrawing)}
//                     className={`flex items-center gap-2 w-full ${isDrawing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
//                     disabled={isLoading || isDownloading}
//                   >
//                     <Square className="h-5 w-5" />
//                     {isDrawing ? 'מצב ציור פעיל' : 'בחירת אזור ריבועי'}
//                   </Button>

//                   {selectedBounds && (
//                     <div className="space-y-2">
//                       <div className="text-sm text-right">
//                         <div>צפון-מערב: {selectedBounds.getNorthWest().lat.toFixed(4)}, {selectedBounds.getNorthWest().lng.toFixed(4)}</div>
//                         <div>דרום-מזרח: {selectedBounds.getSouthEast().lat.toFixed(4)}, {selectedBounds.getSouthEast().lng.toFixed(4)}</div>
//                       </div>
                      
//                       <div className="flex gap-2">
//                         <Button 
//                           onClick={clearSelection} 
//                           variant="destructive" 
//                           size="sm"
//                           disabled={isLoading || isDownloading || isLoadingOfficers}
//                         >
//                           נקה
//                         </Button>
//                       </div>

//                       <Button 
//                         onClick={exportAreaToPBF}
//                         variant="default"
//                         className="w-full flex items-center justify-center gap-2"
//                         disabled={isLoading || isDownloading || isLoadingOfficers}
//                       >
//                         {isLoading || isDownloading ? (
//                           <>
//                             <Loader2 className="h-5 w-5 animate-spin" />
//                             {isDownloading ? 'מוריד נתוני מפה...' : 'שולח לשרת...'}
//                           </>
//                         ) : (
//                           <>
//                             <Send className="h-5 w-5" />
//                             {!isFirstUploadDone 
//                               ? 'שליחה לשרת' 
//                               : !lastUploadWasRepair 
//                                 ? 'תיקון הגרף' 
//                                 : 'ניסיון תיקון נוסף'}
//                           </>
//                         )}
//                       </Button>
                      
//                       {/* Police Distribution Section */}
//                       {isFirstUploadDone && (
//                         <div className="border-t pt-3 mt-3">
//                           <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
//                             <Shield className="w-4 h-4" />
//                             פיזור שוטרים
//                           </h3>
//                           <div className="flex items-center gap-2 mb-2">
//                             <Label htmlFor="officers" className="text-sm">מספר שוטרים:</Label>
//                             <Input 
//                               id="officers" 
//                               type="number" 
//                               min="1" 
//                               max={maxNodes || undefined} 
//                               value={officerCount} 
//                               onChange={(e) => {
//                                 const value = parseInt(e.target.value);
//                                 if (!isNaN(value)) {
//                                   if (maxNodes && value > maxNodes) {
//                                     setOfficerCount(maxNodes);
//                                     toast.warning(`הוזנו יותר שוטרים ממספר הצמתים. עודכן ל-${maxNodes}`);
//                                   } else {
//                                     setOfficerCount(value);
//                                   }
//                                 } else {
//                                   setOfficerCount(1);
//                                 }
//                               }}
//                               className="w-20 text-left"
//                             />
//                           </div>
                          
//                           <Button 
//                             onClick={calculateOfficerLocations}
//                             variant="secondary"
//                             className="w-full flex items-center justify-center gap-2"
//                             disabled={isLoading || isDownloading || isLoadingOfficers}
//                           >
//                             {isLoadingOfficers ? (
//                               <>
//                                 <Loader2 className="h-5 w-5 animate-spin" />
//                                 מחשב מיקומים...
//                               </>
//                             ) : (
//                               <>
//                                 <Shield className="h-5 w-5" />
//                                 פזר שוטרים על המפה
//                               </>
//                             )}
//                           </Button>
                          
//                           {maxResponseTime && (
//                             <div className="mt-2 text-sm text-center p-2 bg-blue-50 rounded-md">
//                               זמן תגובה מקסימלי: <span className="font-bold">{maxResponseTime.toFixed(2)}</span> שניות
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </div>
//           </div>
          
//           {/* Map instructions */}
//           <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <h4 className="font-medium text-command-blue mb-2">הוראות שימוש:</h4>
//             <ol className="text-sm text-command-slate-600 space-y-1">
//               <li>1. לחץ על כפתור "בחירת אזור ריבועי" כדי להתחיל</li>
//               <li>2. לחץ על המפה במיקום הפינה הראשונה של הריבוע</li>
//               <li>3. לחץ על המפה במיקום הפינה הנגדית לסיום הציור</li>
//               <li>4. לחץ על "שליחה לשרת" כדי לעבד את האזור</li>
//               <li>5. לחץ על "פזר שוטרים על המפה" כדי לראות את הפיזור האופטימלי</li>
//             </ol>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Algorithm Results */}
//       {policeLocations.length > 0 && (
//         <Card className="command-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="w-5 h-5 text-command-indigo" />
//               תוצאות הפיזור - אלגוריתם K-Center
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {policeLocations.map((officer, index) => (
//                 <div key={officer.nodeId || index} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-command-slate-800">שוטר {index + 1}</span>
//                     <Badge variant="outline" className="text-command-indigo border-indigo-300">
//                       צומת #{officer.nodeId}
//                     </Badge>
//                   </div>
//                   <p className="text-xs text-command-slate-600 mt-1">
//                     {officer.lat.toFixed(5)}, {officer.lon.toFixed(5)}
//                   </p>
//                 </div>
//               ))}
//             </div>
            
//             {maxResponseTime && (
//               <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-center">
//                 <p className="text-sm text-green-700">
//                   <strong>זמן תגובה מקסימלי:</strong> {maxResponseTime.toFixed(2)} שניות
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">
//                   הפיזור מבטיח כיסוי אופטימלי של כל האזור
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default MapSelector;
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Zap, Users, Play, Square, Send, Loader2, Shield, AlertCircle, Target } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom police icon (blue)
const policeIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'police-marker'
});

// Custom strategic zone icon (red)
const strategicIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'strategic-marker'
});

interface StrategicZone {
  latitude: number;
  longitude: number;
}

interface MapSelectorProps {
  onAreaSelected?: (coordinates: number[][]) => void;
  onRunAlgorithm?: (area: number[][], officerCount: number, strategicZones?: StrategicZone[]) => void;
  requiredOfficers?: number;
}

const MapSelector: React.FC<MapSelectorProps> = ({ 
  onAreaSelected, 
  onRunAlgorithm, 
  requiredOfficers = 5 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const rectangleLayerRef = useRef<L.Rectangle | null>(null);
  const policeMarkersRef = useRef<L.Marker[]>([]);
  const policeCirclesRef = useRef<L.Circle[]>([]);
  const strategicMarkersRef = useRef<L.Marker[]>([]);
  
  const [selectedBounds, setSelectedBounds] = useState<L.LatLngBounds | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [currentRect, setCurrentRect] = useState<L.Rectangle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFirstUploadDone, setIsFirstUploadDone] = useState(false);
  const [lastUploadWasRepair, setLastUploadWasRepair] = useState(false);
  const [officerCount, setOfficerCount] = useState(requiredOfficers);
  const [policeLocations, setPoliceLocations] = useState<any[]>([]);
  const [maxResponseTime, setMaxResponseTime] = useState<number | null>(null);
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);
  const [maxNodes, setMaxNodes] = useState<number | null>(null);
  
  // Strategic zones state
  const [isMarkingStrategic, setIsMarkingStrategic] = useState(false);
  const [strategicZones, setStrategicZones] = useState<StrategicZone[]>([]);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Israel
    const map = L.map(mapRef.current).setView([31.7683, 35.2137], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add custom CSS for marker styling
    const style = document.createElement('style');
    style.textContent = `
      .strategic-marker {
        filter: hue-rotate(0deg) saturate(2) brightness(0.8);
      }
      .police-marker {
        filter: hue-rotate(200deg) saturate(1.5);
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

  // Handle drawing mode changes and strategic zone marking
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      // Strategic zone marking mode
      if (isMarkingStrategic) {
        // Check if click is within selected bounds
        if (selectedBounds && selectedBounds.contains(e.latlng)) {
          const newZone: StrategicZone = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          };
          
          setStrategicZones(prev => [...prev, newZone]);
          
          // Add marker to map
          const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: strategicIcon })
            .addTo(map)
            .bindPopup(`אזור אסטרטגי<br/>מיקום: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
          
          strategicMarkersRef.current.push(marker);
          toast.success('נוסף אזור אסטרטגי');
        } else {
          toast.warning('יש לבחור אזור אסטרטגי בתוך התחום הנבחר');
        }
        return;
      }

      // Rectangle drawing mode
      if (!isDrawing) return;
      
      if (!startPoint) {
        // התחלת ציור - נקודה ראשונה
        setStartPoint(e.latlng);
        const bounds = L.latLngBounds(e.latlng, e.latlng);
        const rect = L.rectangle(bounds, {
          color: '#3388ff',
          weight: 3,
          fillOpacity: 0.2,
          dashArray: '5, 5' // קו מקווקו
        }).addTo(map);
        setCurrentRect(rect);
      } else {
        // סיום ציור - נקודה שנייה
        const finalBounds = L.latLngBounds(startPoint, e.latlng);
        setSelectedBounds(finalBounds);
        setIsDrawing(false);
        setStartPoint(null);
        
        // הסרת הריבוע הזמני
        if (currentRect) {
          map.removeLayer(currentRect);
          setCurrentRect(null);
        }
        
        // הוספת הריבוע הסופי
        if (rectangleLayerRef.current) {
          map.removeLayer(rectangleLayerRef.current);
        }
        
        const finalRect = L.rectangle(finalBounds, {
          color: '#3388ff',
          weight: 3,
          fillOpacity: 0.3 // קו רציף
        }).addTo(map);
        rectangleLayerRef.current = finalRect;

        // הודעה לקומפוננטה האב
        const coordinates = [
          [finalBounds.getNorth(), finalBounds.getWest()],
          [finalBounds.getNorth(), finalBounds.getEast()],
          [finalBounds.getSouth(), finalBounds.getEast()],
          [finalBounds.getSouth(), finalBounds.getWest()]
        ];
        onAreaSelected?.(coordinates);
      }
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!isDrawing || !startPoint || !currentRect) return;
      
      const bounds = L.latLngBounds(startPoint, e.latlng);
      currentRect.setBounds(bounds);
    };

    if (isDrawing || isMarkingStrategic) {
      map.on('click', handleMapClick);
      if (isDrawing) {
        map.on('mousemove', handleMouseMove);
      }
      map.getContainer().style.cursor = isMarkingStrategic ? 'crosshair' : 'crosshair';
    } else {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.getContainer().style.cursor = '';
    }

    return () => {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
    };
  }, [isDrawing, startPoint, onAreaSelected, isMarkingStrategic, selectedBounds]);

  // Download OSM data function
  const downloadOsmData = async (bounds: L.LatLngBounds) => {
    setIsDownloading(true);
    try {
      const south = bounds.getSouth();
      const north = bounds.getNorth();
      const west = bounds.getWest();
      const east = bounds.getEast();
      
      const query = `
        [out:xml][timeout:180];
        (
          way["highway"]
            (${south},${west},${north},${east});
          relation["highway"]
            (${south},${west},${north},${east});
        );
        (._;>;);
        out meta;
      `;

      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      
      console.log("מוריד נתוני OSM מהגבולות:", { south, west, north, east });
      
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API שגיאה: ${response.status}`);
      }

      const osmData = await response.text();
      console.log("התקבלו נתוני OSM בגודל:", osmData.length, "תווים");
      return osmData;
    } catch (error) {
      console.error('שגיאה בהורדת נתוני OSM:', error);
      toast.error(`שגיאה בהורדת נתוני OSM: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  // Export area to server
  const exportAreaToPBF = async () => {
    if (!selectedBounds) {
      toast.error('אנא בחר אזור במפה לפני שליחה');
      return;
    }
    
    try {
      setIsLoading(true);
      const serverBaseUrl = 'https://localhost:7163';
      const osmData = await downloadOsmData(selectedBounds);
      
      const formData = new FormData();
      const osmBlob = new Blob([osmData], { type: 'application/xml' });
      formData.append('file', osmBlob, 'area.osm');
      
      formData.append('minLat', selectedBounds.getSouth().toString());
      formData.append('maxLat', selectedBounds.getNorth().toString());
      formData.append('minLon', selectedBounds.getWest().toString());
      formData.append('maxLon', selectedBounds.getEast().toString());
      
      const endpoint = !isFirstUploadDone 
        ? `${serverBaseUrl}/api/Graph/upload-osm` 
        : `${serverBaseUrl}/api/Graph/repair-osm`;
        
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`שגיאה בשליחת קובץ: ${errorText}`);
      }
      
      const result = await response.json();
      const isConnected = result.IsConnected || result.isConnected || false;
      const message = result.Message || result.message || 'אין הודעה מהשרת';
      setMaxNodes(result.NodeCount || result.nodeCount || 100);

      if ((result.NodeCount || result.nodeCount) && officerCount > (result.NodeCount || result.nodeCount)) {
        setOfficerCount(result.NodeCount || result.nodeCount);
        toast.warning(`המספר המקסימלי של שוטרים הוא ${result.NodeCount || result.nodeCount}, המספר תוקן בהתאם`);
      }

      if (!isFirstUploadDone) {
        setIsFirstUploadDone(true);
        isConnected ? toast.success(message) : toast.warning(message);
      } else if (!lastUploadWasRepair) {
        setLastUploadWasRepair(true);
        isConnected ? toast.success(message) : toast.error(message);
      }
      
      if (isConnected) {
        clearPoliceMarkers();
        setPoliceLocations([]);
        setMaxResponseTime(null);
      }
    } catch (error) {
      console.error('שגיאה:', error);
      toast.error(`שגיאה כללית: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear police markers from map
  const clearPoliceMarkers = () => {
    if (mapInstanceRef.current) {
      policeMarkersRef.current.forEach(marker => {
        mapInstanceRef.current!.removeLayer(marker);
      });
      policeCirclesRef.current.forEach(circle => {
        mapInstanceRef.current!.removeLayer(circle);
      });
    }
    policeMarkersRef.current = [];
    policeCirclesRef.current = [];
  };

  // Clear strategic markers from map
  const clearStrategicMarkers = () => {
    if (mapInstanceRef.current) {
      strategicMarkersRef.current.forEach(marker => {
        mapInstanceRef.current!.removeLayer(marker);
      });
    }
    strategicMarkersRef.current = [];
    setStrategicZones([]);
  };

  // Calculate officer locations
  const calculateOfficerLocations = async () => {
    if (!isFirstUploadDone) {
      toast.warning('יש להעלות קובץ OSM ולוודא שהגרף קשיר לפני חישוב מיקומי השוטרים');
      return;
    }

    try {
      setIsLoadingOfficers(true);
      clearPoliceMarkers(); // נקה סימנים קיימים
      
      const serverBaseUrl = 'https://localhost:7163';
      const kCenterEndpoint = `${serverBaseUrl}/api/KCenter/distribute?k=${officerCount}`;
      
      const response = await fetch(kCenterEndpoint, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`שגיאה בחישוב מיקומי השוטרים (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      const centers = result.policePositions || result.centers || result.Centers || [];

      if (centers.length > 0) {
        toast.info(`מקבל מיקומי קואורדינטות עבור ${centers.length} שוטרים...`);
        let policeData = [];

        if (typeof centers[0] === 'number') {
          const nodeLocationsPromises = centers.map(async (nodeId: number) => {
            try {
              const locationEndpoint = `${serverBaseUrl}/api/Graph/get-node-location?nodeId=${nodeId}`;
              const locationResponse = await fetch(locationEndpoint);

              if (!locationResponse.ok) {
                console.error(`שגיאה בקבלת מיקום צומת ${nodeId}:`, locationResponse.status);
                return null;
              }

              const locationData = await locationResponse.json();
              return {
                nodeId: nodeId,
                lat: locationData.Lat || locationData.lat,
                lon: locationData.Lon || locationData.lon
              };
            } catch (error) {
              console.error(`שגיאה בקבלת מיקום צומת ${nodeId}:`, error);
              return null;
            }
          });

          const results = await Promise.all(nodeLocationsPromises);
          policeData = results.filter(data => data !== null);
        } else if (typeof centers[0] === 'object') {
          policeData = centers.map((center: any) => ({
            nodeId: center.nodeId || center.NodeId,
            lat: center.latitude || center.lat || center.Lat,
            lon: center.longitude || center.lon || center.Lon
          }));
        }

        if (policeData.length > 0) {
          setPoliceLocations(policeData);
          setMaxResponseTime(result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds || null);
          
          // הוספת סימני שוטרים למפה
          if (mapInstanceRef.current) {
            const map = mapInstanceRef.current;
            const newMarkers: L.Marker[] = [];
            const newCircles: L.Circle[] = [];
            
            policeData.forEach((officer, index) => {
              // הוספת סימן שוטר
              const marker = L.marker([officer.lat, officer.lon], { icon: policeIcon })
                .addTo(map)
                .bindPopup(`שוטר ${index + 1}<br/>מיקום: ${officer.lat.toFixed(5)}, ${officer.lon.toFixed(5)}<br/>מזהה צומת: ${officer.nodeId}`);
              
              newMarkers.push(marker);
              
              // הוספת עיגול כיסוי
              if (result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds) {
                const responseTime = result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds;
                const circle = L.circle([officer.lat, officer.lon], {
                  radius: responseTime * 13.89,
                  color: '#0062ff',
                  fillColor: '#0062ff',
                  fillOpacity: 0.1,
                  weight: 1
                }).addTo(map);
                
                newCircles.push(circle);
              }
            });

            policeMarkersRef.current = newMarkers;
            policeCirclesRef.current = newCircles;

            // התאמת המפה להציג את כל השוטרים
            const bounds = L.latLngBounds(policeData.map(officer => [officer.lat, officer.lon]));
            map.fitBounds(bounds, { padding: [50, 50] });
          }

          toast.success(`הוצגו ${policeData.length} מיקומים אופטימליים לשוטרים`);
          
          onRunAlgorithm?.(selectedBounds ? [
            [selectedBounds.getNorth(), selectedBounds.getWest()],
            [selectedBounds.getNorth(), selectedBounds.getEast()],
            [selectedBounds.getSouth(), selectedBounds.getEast()],
            [selectedBounds.getSouth(), selectedBounds.getWest()]
          ] : [], officerCount, strategicZones);

          if (result.MaxResponseTimeInSeconds || result.maxResponseTimeInSeconds) {
            const responseTime = result.maxResponseTimeInSeconds || result.MaxResponseTimeInSeconds;
            toast.info(`זמן תגובה מקסימלי: ${responseTime.toFixed(2)} שניות`);
          }
        } else {
          toast.error('לא התקבלו מיקומים תקינים מהשרת');
        }
      } else {
        toast.warning('לא התקבלו מיקומי שוטרים מהשרת');
      }

    } catch (error) {
      console.error("שגיאה בחישוב מיקומי השוטרים:", error);
      toast.error(`שגיאה בחישוב מיקומי השוטרים: ${(error as Error).message}`);
    } finally {
      setIsLoadingOfficers(false);
    }
  };

  const clearSelection = () => {
    setSelectedBounds(null);
    setIsFirstUploadDone(false);
    setLastUploadWasRepair(false);
    setPoliceLocations([]);
    setMaxResponseTime(null);
    setStartPoint(null);
    
    if (currentRect && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(currentRect);
      setCurrentRect(null);
    }
    
    if (rectangleLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(rectangleLayerRef.current);
      rectangleLayerRef.current = null;
    }
    
    clearPoliceMarkers();
    clearStrategicMarkers();
  };

  const toggleStrategicMarking = () => {
    if (!selectedBounds) {
      toast.warning('יש לבחור אזור תחילה לפני בחירת אזורים אסטרטגיים');
      return;
    }
    setIsMarkingStrategic(!isMarkingStrategic);
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card className="command-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-command-blue" />
            מפת תיחום אזור ריבועי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-xl border border-command-slate-200 modern-shadow"
            />
            
            {/* Status overlay */}
            {isDrawing && (
              <div className="absolute top-4 left-4 z-[1000]">
                <Badge className="command-gradient text-white">
                  🖱️ {!startPoint ? 'לחץ לנקודה הראשונה' : 'לחץ לנקודה השנייה לסיום'}
                </Badge>
              </div>
            )}

            {isMarkingStrategic && (
              <div className="absolute top-4 left-4 z-[1000]">
                <Badge className="bg-red-600 text-white">
                  🎯 לחץ בתוך התחום לבחירת אזור אסטרטגי
                </Badge>
              </div>
            )}

            {/* Control Panel */}
            <div className="absolute top-4 right-4 z-[1000]">
              <Card className="p-4 bg-white/90 shadow-lg">
                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`flex items-center gap-2 w-full ${isDrawing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    disabled={isLoading || isDownloading || isMarkingStrategic}
                  >
                    <Square className="h-5 w-5" />
                    {isDrawing ? 'מצב ציור פעיל' : 'בחירת אזור ריבועי'}
                  </Button>

                  {selectedBounds && (
                    <div className="space-y-2">
                      <Button 
                        onClick={toggleStrategicMarking}
                        className={`flex items-center gap-2 w-full ${isMarkingStrategic ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                        disabled={isLoading || isDownloading || isDrawing}
                      >
                        <Target className="h-5 w-5" />
                        {isMarkingStrategic ? 'מצב אזורים אסטרטגיים פעיל' : 'בחירת אזורים אסטרטגיים'}
                      </Button>

                      {strategicZones.length > 0 && (
                        <div className="flex items-center justify-between">
                          <Badge className="bg-orange-100 text-orange-800">
                            {strategicZones.length} אזורים אסטרטגיים
                          </Badge>
                          <Button 
                            onClick={clearStrategicMarkers}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            נקה
                          </Button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2">
                        <Label className="text-sm font-medium">מספר שוטרים נדרש:</Label>
                        <Input
                          type="number"
                          min="1"
                          max={maxNodes || 100}
                          value={officerCount}
                          onChange={(e) => setOfficerCount(parseInt(e.target.value) || 1)}
                          className="text-center"
                        />
                        {maxNodes && (
                          <div className="text-xs text-gray-500">
                            מקסימום: {maxNodes} שוטרים
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={exportAreaToPBF}
                        className="flex items-center gap-2 w-full command-gradient"
                        disabled={isLoading || isDownloading}
                      >
                        {isLoading || isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {isDownloading ? 'מוריד נתונים...' : isLoading ? 'מעלה לשרת...' : 'שליחת אזור לשרת'}
                      </Button>

                      {isFirstUploadDone && (
                        <Button 
                          onClick={calculateOfficerLocations}
                          className="flex items-center gap-2 w-full bg-green-600 hover:bg-green-700"
                          disabled={isLoadingOfficers}
                        >
                          {isLoadingOfficers ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                          {isLoadingOfficers ? 'מחשב מיקומים...' : 'פיזור שוטרים'}
                        </Button>
                      )}

                      <Button 
                        onClick={clearSelection}
                        variant="outline"
                        className="w-full"
                      >
                        נקה הכל
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Info Cards */}
          {selectedBounds && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold">אזורים אסטרטגיים</h3>
                    <p className="text-sm text-gray-600">
                      {strategicZones.length} נקודות נבחרו
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">שוטרים</h3>
                    <p className="text-sm text-gray-600">
                      {policeLocations.length > 0 ? `${policeLocations.length} ממוקמים` : `${officerCount} נדרשים`}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results Display */}
          {policeLocations.length > 0 && (
            <Card className="mt-4 p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">תוצאות פיזור שוטרים</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700">
                    <strong>מספר שוטרים ממוקמים:</strong> {policeLocations.length}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>אזורים אסטרטגיים:</strong> {strategicZones.length}
                  </p>
                </div>
                {maxResponseTime && (
                  <div>
                    <p className="text-sm text-green-700">
                      <strong>זמן תגובה מקסימלי:</strong> {maxResponseTime.toFixed(2)} שניות
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSelector;



