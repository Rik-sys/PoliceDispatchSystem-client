import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Clock, Users, AlertCircle, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import CreateCallMap from '@/components/CreateCallMap';

const CreateCall = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    priority: '',
    eventId: '',
    requiredOfficers: 2,
    callerName: '',
    callerPhone: '',
    callTime: new Date().toISOString().slice(0, 16)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    toast.success(`מיקום נבחר: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast.error('יש לבחור מיקום על המפה');
      return;
    }

    if (!formData.description || !formData.priority || !formData.eventId) {
      toast.error('יש למלא את כל השדות הנדרשים');
      return;
    }

    setIsSubmitting(true);

    try {
      const callDto = {
        callId: 0,
        eventId: parseInt(formData.eventId),
        requiredOfficers: formData.requiredOfficers,
        contactPhone: formData.callerPhone,
        urgencyLevel: parseInt(formData.priority),
        callTime: new Date(formData.callTime).toISOString(),  // רמת דחיפות
        status: "Open",
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng
};


      // Here you would normally call your API
      console.log('Creating call with data:', callDto);
      
      // Simulate API call
     const response = await fetch("https://localhost:7163/api/Call/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(callDto)
});

if (!response.ok) {
  const errorText = await response.text();
  console.error('Server error:', errorText);
  throw new Error(`API error (${response.status}): ${errorText}`);
}


const data = await response.json();
console.log("API response:", data);

      
      toast.success('הקריאה נוצרה בהצלחה ושוטרים שובצו');
      navigate('/operator-dashboard');
      
    } catch (error) {
      console.error('Error creating call:', error);
      toast.error('שגיאה ביצירת הקריאה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                יצירת קריאה חדשה
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/operator-dashboard')}
              className="flex items-center gap-2"
            >
              חזרה למוקד
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <Card className="lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                בחירת מיקום הקריאה
              </CardTitle>
              <p className="text-sm text-slate-600">
                לחצו על המפה כדי לבחור את מיקום הקריאה
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 relative rounded-b-lg overflow-hidden">
                <CreateCallMap onLocationSelect={handleLocationSelect} />
                {selectedLocation && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div className="text-sm">
                        <div className="font-medium">מיקום נבחר</div>
                        <div className="text-slate-600">
                          {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="lg:order-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                פרטי הקריאה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">תיאור הקריאה *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="תאר את אופי הקריאה..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">רמת דחיפות *</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="בחר דחיפות" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">נמוכה</SelectItem>
                          <SelectItem value="2">בינונית</SelectItem>
                          <SelectItem value="3">גבוהה</SelectItem>
                          <SelectItem value="4">קריטית</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="eventId">מזהה אירוע *</Label>
                      <Input
                        id="eventId"
                        type="number"
                        value={formData.eventId}
                        onChange={(e) => setFormData({...formData, eventId: e.target.value})}
                        placeholder="123"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requiredOfficers">מספר שוטרים נדרש</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      <Input
                        id="requiredOfficers"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.requiredOfficers}
                        onChange={(e) => setFormData({...formData, requiredOfficers: parseInt(e.target.value) || 1})}
                        className="w-24"
                      />
                      <span className="text-sm text-slate-600">שוטרים</span>
                    </div>
                  </div>
                </div>

                {/* Caller Info */}
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium text-slate-900">פרטי המתקשר</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="callerName">שם המתקשר</Label>
                      <Input
                        id="callerName"
                        value={formData.callerName}
                        onChange={(e) => setFormData({...formData, callerName: e.target.value})}
                        placeholder="שם מלא"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="callerPhone">מספר טלפון</Label>
                      <Input
                        id="callerPhone"
                        value={formData.callerPhone}
                        onChange={(e) => setFormData({...formData, callerPhone: e.target.value})}
                        placeholder="05X-XXXXXXX"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="callTime">זמן הקריאה</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <Input
                        id="callTime"
                        type="datetime-local"
                        value={formData.callTime}
                        onChange={(e) => setFormData({...formData, callTime: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedLocation}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        יוצר קריאה...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        צור קריאה ושבץ שוטרים
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCall;