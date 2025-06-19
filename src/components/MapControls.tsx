import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import type { MapSettings } from '../types/mapTypes';

interface MapControlsProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
  onRefresh: () => void;
}

const MapControls = ({ settings, onSettingsChange, onRefresh }: MapControlsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">בקרת מפה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-officers">הצג שוטרים</Label>
          <Switch
            id="show-officers"
            checked={settings.showOfficers}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showOfficers: checked })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-calls">הצג קריאות</Label>
          <Switch
            id="show-calls"
            checked={settings.showCalls}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showCalls: checked })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-event-zones">הצג אזורי אירועים</Label>
          <Switch
            id="show-event-zones"
            checked={settings.showEventZones}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showEventZones: checked })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-strategic-zones">הצג אזורים אסטרטגיים</Label>
          <Switch
            id="show-strategic-zones"
            checked={settings.showStrategicZones}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showStrategicZones: checked })
            }
          />
        </div>
        
        {/* <div className="flex items-center justify-between">
          <Label htmlFor="auto-refresh">רענון אוטומטי</Label>
          <Switch
            id="auto-refresh"
            checked={settings.autoRefresh}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, autoRefresh: checked })
            }
          />
        </div> */}
        
        {/* <div className="space-y-2">
          <Label htmlFor="refresh-interval">מרווח רענון (שניות)</Label>
          <Input
            id="refresh-interval"
            type="number"
            min="5"
            max="300"
            value={settings.refreshInterval}
            onChange={(e) => 
              onSettingsChange({ ...settings, refreshInterval: parseInt(e.target.value) || 30 })
            }
          />
        </div>
         */}
        {/* <Button onClick={onRefresh} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          רענן נתונים
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default MapControls;