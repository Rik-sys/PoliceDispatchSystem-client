
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { MapPin, Plus, Users, Calendar, Bell, Settings, User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const OperatorDashboard = () => {
//   const navigate = useNavigate();
//   const [userData] = useState(() => {
//     const stored = localStorage.getItem('userData');
//     return stored ? JSON.parse(stored) : { name: 'מוקדנית', role: 'operator' };
//   });

//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     if (userRole !== 'operator') {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const logout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   // Mock data for dashboard
//   const activeEvents = [
//     { id: 1, name: 'אירוע בטחוני - רח׳ הרצל', officers: 5, status: 'פעיל', priority: 'גבוהה' },
//     { id: 2, name: 'פטרולים - צפון העיר', officers: 8, status: 'מתבצע', priority: 'רגילה' },
//     { id: 3, name: 'אבטחת אירוע - כיכר רבין', officers: 12, status: 'הוקצה', priority: 'גבוהה' }
//   ];

//   const activeCalls = [
//     { id: 1, location: 'רח׳ בן גוריון 45', priority: 'דחוף', time: '14:23', event: 'אירוע בטחוני - רח׳ הרצל' },
//     { id: 2, location: 'שד׳ רוטשילד 12', priority: 'רגיל', time: '14:45', event: 'פטרולים - צפון העיר' }
//   ];

//   const onlineOfficers = [
//     { id: 1, name: 'אפרת כהן', badge: '1234', status: 'זמין', location: 'אירוע בטחוני - רח׳ הרצל' },
//     { id: 2, name: 'דני לוי', badge: '5678', status: 'בקריאה', location: 'רח׳ בן גוריון 45' },
//     { id: 3, name: 'מיכל רוזן', badge: '9012', status: 'זמין', location: 'פטרולים - צפון העיר' },
//     { id: 4, name: 'יוסי אברהם', badge: '3456', status: 'לא זמין', location: 'מחוץ לשירות' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 text-right" dir="rtl">

//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-police-blue rounded-lg flex items-center justify-center">
//                 <User className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-semibold text-gray-900">מערכת פיקוד חכמה</h1>
//                 <p className="text-sm text-gray-500">מוקד פיקוד ובקרה</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <Badge variant="outline" className="flex items-center gap-1">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 מחובר
//               </Badge>
//               <span className="text-sm text-gray-700">שלום, {userData.name}</span>
//               <Button variant="outline" size="sm" onClick={logout}>
//                 התנתק
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">אירועים פעילים</p>
//                   <p className="text-2xl font-bold text-police-blue">{activeEvents.length}</p>
//                 </div>
//                 <Calendar className="w-8 h-8 text-police-blue" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">שוטרים מחוברים</p>
//                   <p className="text-2xl font-bold text-green-600">{onlineOfficers.filter(o => o.status !== 'לא זמין').length}</p>
//                 </div>
//                 <Users className="w-8 h-8 text-green-600" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">קריאות פתוחות</p>
//                   <p className="text-2xl font-bold text-orange-600">{activeCalls.length}</p>
//                 </div>
//                 <Bell className="w-8 h-8 text-orange-600" />
//               </div>
//             </CardContent>
//           </Card>
          
//           {/* <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">יעילות המערכת</p>
//                   <p className="text-2xl font-bold text-police-blue">94%</p>
//                 </div>
//                 <Settings className="w-8 h-8 text-police-blue" />
//               </div>
//             </CardContent>
//           </Card> */}
//         </div>

//         {/* Main Dashboard */}
//         <Tabs defaultValue="control" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="control">מפת בקרה</TabsTrigger>
//             <TabsTrigger value="events">ניהול אירועים</TabsTrigger>
//             <TabsTrigger value="calls">קריאות חדשות</TabsTrigger>
//             <TabsTrigger value="history">היסטוריה</TabsTrigger>
//           </TabsList>

//           <TabsContent value="control" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Map Area */}
//               <Card className="lg:col-span-2">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <MapPin className="w-5 h-5" />
//                     מפת בקרה
//                   </CardTitle>
//                   <CardDescription>הצגה ויזואלית של כל הפעילות הנוכחית</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
//                     <div className="text-center text-gray-500">
//                       <MapPin className="w-12 h-12 mx-auto mb-2" />
//                       <p>מפה אינטראקטיביו תוטמע כאן</p>
//                       <p className="text-sm">תציג שוטרים, אירועים וקריאות בזמן אמת</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Online Officers */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>שוטרים מחוברים</CardTitle>
//                   <CardDescription>{onlineOfficers.length} שוטרים במערכת</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {onlineOfficers.map((officer) => (
//                       <div key={officer.id} className="flex items-center justify-between p-3 rounded-lg border">
//                         <div>
//                           <p className="font-medium text-sm">{officer.name}</p>
//                           <p className="text-xs text-gray-500">תג #{officer.badge}</p>
//                         </div>
//                         <div className="text-left">
//                           <Badge 
//                             variant={officer.status === 'זמין' ? 'default' : officer.status === 'בקריאה' ? 'destructive' : 'secondary'}
//                             className="text-xs"
//                           >
//                             {officer.status}
//                           </Badge>
//                           <p className="text-xs text-gray-500 mt-1">{officer.location}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="events" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">ניהול אירועים</h3>
//               <Button onClick={() => navigate('/create-event')} className="police-gradient text-white">
//                 <Plus className="w-4 h-4 mr-2" />
//                 אירוע חדש
//               </Button>
//             </div>
            
//             <div className="grid gap-4">
//               {activeEvents.map((event) => (
//                 <Card key={event.id}>
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-semibold">{event.name}</h4>
//                         <p className="text-sm text-gray-600">{event.officers} שוטרים מוקצים</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge variant={event.priority === 'גבוהה' ? 'destructive' : 'secondary'}>
//                           {event.priority}
//                         </Badge>
//                         <Badge variant="outline">{event.status}</Badge>
//                         <Button variant="outline" size="sm">
//                           ערוך
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="calls" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">קריאות פתוחות</h3>
//               <Button onClick={() => navigate('/create-call')} className="police-gradient text-white">
//                 <Plus className="w-4 h-4 mr-2" />
//                 קריאה חדשה
//               </Button>
//             </div>
            
//             <div className="grid gap-4">
//               {activeCalls.map((call) => (
//                 <Card key={call.id}>
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-semibold">{call.location}</h4>
//                         <p className="text-sm text-gray-600">משויך ל: {call.event}</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge variant={call.priority === 'דחוף' ? 'destructive' : 'secondary'}>
//                           {call.priority}
//                         </Badge>
//                         <span className="text-sm text-gray-500">{call.time}</span>
//                         <Button variant="outline" size="sm">
//                           טפל
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="history" className="space-y-6">
//             <h3 className="text-lg font-semibold">היסטוריית אירועים</h3>
//             <Card>
//               <CardContent className="p-6">
//                 <div className="text-center text-gray-500 py-12">
//                   <Calendar className="w-12 h-12 mx-auto mb-4" />
//                   <p>טבלת היסטוריה תוטמע כאן</p>
//                   {/* <p className="text-sm">תכלול פילטרים וחיפוש מתקדם</p> */}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default OperatorDashboard;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Users, Calendar, Bell, Settings, User, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from '@/components/InteractiveMap';

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : { name: 'מוקדנית', role: 'operator' };
  });

  // State for event history
  const [eventHistory, setEventHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'operator') {
      navigate('/login');
    }
  }, [navigate]);

  // Function to fetch event history
  const fetchEventHistory = async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const response = await fetch('https://localhost:7163/api/Event/allEvents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEventHistory(data);
    } catch (error) {
      console.error('Error fetching event history:', error);
      setHistoryError('שגיאה בטעינת היסטוריית האירועים');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load history when component mounts or when history tab is accessed
  useEffect(() => {
    fetchEventHistory();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper function to get priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'גבוהה':
        return 'destructive';
      case 'medium':
      case 'בינונית':
        return 'default';
      case 'low':
      case 'נמוכה':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Helper function to translate priority
  const translatePriority = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'גבוהה';
      case 'medium':
        return 'בינונית';
      case 'low':
        return 'נמוכה';
      default:
        return priority || 'לא צוין';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  // Mock data for dashboard (keeping existing data)
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
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">אירועים פעילים</p>
                  <p className="text-2xl font-bold text-blue-600">{activeEvents.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card> */}
          
          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">שוטרים מחוברים</p>
                  <p className="text-2xl font-bold text-green-600">{onlineOfficers.filter(o => o.status !== 'לא זמין').length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card> */}
          
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
                  <p className="text-sm font-medium text-gray-600">סה״כ אירועים</p>
                  <p className="text-2xl font-bold text-purple-600">{eventHistory.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
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
<Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dir=rtl">
                    <MapPin className="w-5 h-5 dir=rtl" />
                    מפת בקרה
                  </CardTitle>
                  <CardDescription>הצגה ויזואלית של כל הפעילות הנוכחית</CardDescription>
                </CardHeader>
                <CardContent className="p-0" style={{ height: "600px" }}>
  <InteractiveMap />
</CardContent>

              </Card>

              {/* Online Officers */}
              {/* <Card>
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
              </Card> */}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">ניהול אירועים</h3>
              <Button onClick={() => navigate('/create-event')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
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
              <Button onClick={() => navigate('/create-call')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">היסטוריית אירועים</h3>
              <Button onClick={fetchEventHistory} variant="outline" size="sm" disabled={isLoadingHistory}>
                {isLoadingHistory ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                רענן
              </Button>
            </div>

            {historyError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>{historyError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoadingHistory ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
                      <p className="text-gray-500">טוען היסטוריית אירועים...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : eventHistory.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500 py-12">
                    <Calendar className="w-12 h-12 mx-auto mb-4" />
                    <p>אין אירועים להצגה</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {eventHistory.map((event) => (
                  <Card key={event.eventId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{event.eventName}</h4>
                            <Badge variant={getPriorityVariant(event.priority)}>
                              {translatePriority(event.priority)}
                            </Badge>
                          </div>
                          {event.description && (
                            <p className="text-gray-600 text-sm">{event.description}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">תאריך:</span>
                              <span>{formatDate(event.eventDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">שעות:</span>
                              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">שוטרים נדרשים:</span>
                              <span>{event.requiredOfficers}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          #{event.eventId}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorDashboard;