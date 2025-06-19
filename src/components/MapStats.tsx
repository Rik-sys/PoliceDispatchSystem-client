import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MapData } from '../types/mapTypes';

interface MapStatsProps {
  data: MapData;
}

const MapStats = ({ data }: MapStatsProps) => {
  const urgentCalls = data.calls.filter(call => call.urgencyLevel >= 3).length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">סטטיסטיקות</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold">{data.officers.length}</span>
          <span className="text-sm">שוטרים פעילים</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">{data.calls.length}</span>
          <span className="text-sm">קריאות פעילות</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold text-red-600">{urgentCalls}</span>
          <span className="text-sm">קריאות דחופות</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">{data.eventZones.length}</span>
          <span className="text-sm">אזורי אירועים</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">{data.strategicZones.length}</span>
          <span className="text-sm">אזורים אסטרטגיים</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapStats;