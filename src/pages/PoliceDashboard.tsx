
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Clock, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : { name: 'שוטר', role: 'police', badgeNumber: '1234' };
  });

  const [officerStatus, setOfficerStatus] = useState<'available' | 'busy' | 'offline'>('available');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'police') {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Mock current assignment
  const currentAssignment = {
    type: 'event',
    name: 'אירוע בטחוני - רח׳ הרצל',
    location: 'רח׳ הרצל 25, תל אביב',
    priority: 'גבוהה',
    assignedTime: '13:45',
    description: 'פטרול באזור מרכז העיר - דרישת נוכחות מוגברת'
  };

  const statusColors = {
    available: 'bg-green-500',
    busy: 'bg-orange-500', 
    offline: 'bg-red-500'
  };

  const statusText = {
    available: 'זמין',
    busy: 'תפוס',
    offline: 'לא זמין'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-police-blue rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">מערכת שוטרים</h1>
                <p className="text-sm text-gray-500">ממשק שטח</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusColors[officerStatus]} badge-pulse`}></div>
                <span className="text-sm font-medium">{statusText[officerStatus]}</span>
              </div>
              <Badge variant="outline">תג #{userData.badgeNumber}</Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              שלום, {userData.name}
            </CardTitle>
            <CardDescription>עדכן את הסטטוס שלך והיה מעודכן במשימות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant={officerStatus === 'available' ? 'default' : 'outline'}
                onClick={() => setOfficerStatus('available')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                זמין
              </Button>
              <Button
                variant={officerStatus === 'busy' ? 'default' : 'outline'}
                onClick={() => setOfficerStatus('busy')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                תפוס
              </Button>
              <Button
                variant={officerStatus === 'offline' ? 'default' : 'outline'}
                onClick={() => setOfficerStatus('offline')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                לא זמין
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Assignment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              המשימה הנוכחית
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{currentAssignment.name}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {currentAssignment.location}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    הוקצה בשעה {currentAssignment.assignedTime}
                  </p>
                </div>
                <Badge variant={currentAssignment.priority === 'גבוהה' ? 'destructive' : 'secondary'}>
                  {currentAssignment.priority}
                </Badge>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-police-blue">
                <p className="text-sm">{currentAssignment.description}</p>
              </div>
              
              <div className="flex gap-3">
                <Button className="police-gradient text-white">
                  הגעתי למיקום
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  צור קשר עם המוקד
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>המיקום הנוכחי</CardTitle>
            <CardDescription>המערכת עוקבת אחר המיקום שלך לצורך תיאום</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>מפת מיקום אישית</p>
                <p className="text-sm">תציג את המיקום הנוכחי ונתיב לייעד</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>פעולות מהירות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                <Phone className="w-6 h-6" />
                <span>קריאת חירום</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>דווח מיקום</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                <Clock className="w-6 h-6" />
                <span>סיום משימה</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                <User className="w-6 h-6" />
                <span>פרופיל אישי</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceDashboard;
