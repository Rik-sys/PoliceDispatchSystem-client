
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Users, Calendar, Bell, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : { name: 'מוקדנית', role: 'operator' };
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'operator') {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Mock data for dashboard
  const activeEvents = [
    { id: 1, name: 'אירוע בטחוני - רח׳ הרצל', officers: 5, status: 'פעיל', priority: 'גבוהה' },
    { id: 2, name: 'פטרולים - צפון העיר', officers: 8, status: 'מתבצע', priority: 'רגילה' },
    { id: 3, name: 'אבטחת אירוע - כיכר רבין', officers: 12, status: 'הוקצה', priority: 'גבוהה' }
  ];

  const activeCalls = [
    { id: 1, location: 'רח׳ בן גוריון 45', priority: 'דחוף', time: '14:23', event: 'אירוע בטחוני - רח׳ הרצל' },
    { id: 2, location: 'שד׳ רוטשילד 12', priority: 'רגיל', time: '14:45', event: 'פטרולים - צפון העיר' }
  ];

  const onlineOfficers = [
    { id: 1, name: 'אפרת כהן', badge: '1234', status: 'זמין', location: 'אירוע בטחוני - רח׳ הרצל' },
    { id: 2, name: 'דני לוי', badge: '5678', status: 'בקריאה', location: 'רח׳ בן גוריון 45' },
    { id: 3, name: 'מיכל רוזן', badge: '9012', status: 'זמין', location: 'פטרולים - צפון העיר' },
    { id: 4, name: 'יוסי אברהם', badge: '3456', status: 'לא זמין', location: 'מחוץ לשירות' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-police-blue rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">מערכת פיקוד חכמה</h1>
                <p className="text-sm text-gray-500">מוקד פיקוד ובקרה</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                מחובר
              </Badge>
              <span className="text-sm text-gray-700">שלום, {userData.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">אירועים פעילים</p>
                  <p className="text-2xl font-bold text-police-blue">{activeEvents.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-police-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">שוטרים מחוברים</p>
                  <p className="text-2xl font-bold text-green-600">{onlineOfficers.filter(o => o.status !== 'לא זמין').length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">קריאות פתוחות</p>
                  <p className="text-2xl font-bold text-orange-600">{activeCalls.length}</p>
                </div>
                <Bell className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">יעילות המערכת</p>
                  <p className="text-2xl font-bold text-police-blue">94%</p>
                </div>
                <Settings className="w-8 h-8 text-police-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="control">מפת בקרה</TabsTrigger>
            <TabsTrigger value="events">ניהול אירועים</TabsTrigger>
            <TabsTrigger value="calls">קריאות חדשות</TabsTrigger>
            <TabsTrigger value="history">היסטוריה</TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Area */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    מפת בקרה
                  </CardTitle>
                  <CardDescription>הצגה ויזואלית של כל הפעילות הנוכחית</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>מפה אינטראקטיביו תוטמע כאן</p>
                      <p className="text-sm">תציג שוטרים, אירועים וקריאות בזמן אמת</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Online Officers */}
              <Card>
                <CardHeader>
                  <CardTitle>שוטרים מחוברים</CardTitle>
                  <CardDescription>{onlineOfficers.length} שוטרים במערכת</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onlineOfficers.map((officer) => (
                      <div key={officer.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium text-sm">{officer.name}</p>
                          <p className="text-xs text-gray-500">תג #{officer.badge}</p>
                        </div>
                        <div className="text-left">
                          <Badge 
                            variant={officer.status === 'זמין' ? 'default' : officer.status === 'בקריאה' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {officer.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{officer.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">ניהול אירועים</h3>
              <Button onClick={() => navigate('/create-event')} className="police-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                אירוע חדש
              </Button>
            </div>
            
            <div className="grid gap-4">
              {activeEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.officers} שוטרים מוקצים</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.priority === 'גבוהה' ? 'destructive' : 'secondary'}>
                          {event.priority}
                        </Badge>
                        <Badge variant="outline">{event.status}</Badge>
                        <Button variant="outline" size="sm">
                          ערוך
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">קריאות פתוחות</h3>
              <Button onClick={() => navigate('/create-call')} className="police-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                קריאה חדשה
              </Button>
            </div>
            
            <div className="grid gap-4">
              {activeCalls.map((call) => (
                <Card key={call.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{call.location}</h4>
                        <p className="text-sm text-gray-600">משויך ל: {call.event}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={call.priority === 'דחוף' ? 'destructive' : 'secondary'}>
                          {call.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">{call.time}</span>
                        <Button variant="outline" size="sm">
                          טפל
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h3 className="text-lg font-semibold">היסטוריית אירועים</h3>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500 py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>טבלת היסטוריה תוטמע כאן</p>
                  <p className="text-sm">תכלול פילטרים וחיפוש מתקדם</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorDashboard;
