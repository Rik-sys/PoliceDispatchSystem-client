import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MapLegend = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מקרא</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
       <div className="space-y-2" dir="rtl">
  {/* <h2 className="text-lg font-bold">מקרא</h2> */}

  <div className="flex items-center gap-2">
    <span>שוטרים</span>
    <span className="w-3 h-3 rounded-full bg-green-500" />
  </div>

  <div className="flex items-center gap-2">
    <span>קריאות רגילות</span>
    <span className="w-3 h-3 rounded-full bg-yellow-500" />
  </div>

  <div className="flex items-center gap-2">
    <span>קריאות דחופות</span>
    <span className="w-3 h-3 rounded-full bg-red-500" />
  </div>

  <div className="flex items-center gap-2">
    <span>אזורי אירועים</span>
    <span className="w-4 h-4 bg-blue-300" />
  </div>

  <div className="flex items-center gap-2">
    <span>אזורים אסטרטגיים</span>
    <span className="w-3 h-3 rounded-full bg-purple-500" />
  </div>
</div>

      </CardContent>
    </Card>
  );
};

export default MapLegend;