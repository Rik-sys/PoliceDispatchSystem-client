// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { ArrowRight, Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import MapSelector from '@/components/MapSelector';

// const CreateEvent = () => {
//   const navigate = useNavigate();
//   const [eventData, setEventData] = useState({
//     name: '',
//     description: '',
//     priority: '',
//     startDate: '',
//     endDate: '',
//     startTime: '',
//     endTime: '',
//     requiredOfficers: '',
//     location: ''
//   });
//   const [selectedArea, setSelectedArea] = useState<number[][]>([]);

//   // const handleSubmit = (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   console.log('Creating event:', { ...eventData, selectedArea });
//   //   navigate('/operator-dashboard');
//   // };
//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // נוודא שיש בדיוק 4 נקודות לתחום
//   if (selectedArea.length < 4) {
//     alert("יש לבחור לפחות 4 נקודות לאזור");
//     return;
//   }

//   const body = {
//     name: eventData.name,
//     description: eventData.description,
//     priority: eventData.priority,
//     startDate: eventData.startDate,
//     endDate: eventData.endDate,
//     startTime: eventData.startTime,
//     endTime: eventData.endTime,
//     requiredOfficers: parseInt(eventData.requiredOfficers),
//     selectedArea: selectedArea.slice(0, 4) // נשלח רק את 4 הראשונות
//   };

//   try {
//     const response = await fetch("https://localhost:7163/api/Event/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(body)
//     });

//     if (response.ok) {
//       const result = await response.json();
//       alert(`✅ נוצר אירוע עם ${result.officerCount} שוטרים`);
//       navigate("/operator-dashboard");
//     } else {
//       const error = await response.text();
//       alert("❌ שגיאה מהשרת:\n" + error);
//     }
//   } catch (err) {
//     console.error("❌ שגיאת רשת:", err);
//     alert("❌ שגיאת רשת");
//   }
// };


//   const handleAreaSelected = (coordinates: number[][]) => {
//     setSelectedArea(coordinates);
//     console.log('Area selected:', coordinates);
//   };

//   const handleRunAlgorithm = (area: number[][], officerCount: number) => {
//     console.log('Running K-Center algorithm:', { area, officerCount });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-command-slate-50 via-blue-50 to-indigo-50">
//       {/* Header */}
//       <header className="glass-effect border-b border-white/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center h-16">
//             <Button 
//               variant="ghost" 
//               onClick={() => navigate('/operator-dashboard')} 
//               className="mr-4 hover:bg-white/50 transition-colors"
//             >
//               <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
//               חזור למוקד
//             </Button>
//             <div>
//               <h1 className="text-lg font-semibold bg-gradient-to-r from-command-blue to-command-indigo bg-clip-text text-transparent">
//                 יצירת אירוע חדש
//               </h1>
//               <p className="text-sm text-command-slate-600">הגדרת אזור ותיחום לפיזור שוטרים</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Form */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="command-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="w-5 h-5 text-command-blue" />
//                   פרטי האירוע
//                 </CardTitle>
//                 <CardDescription>הכנס את המידע הבסיסי לאירוע</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="text-command-slate-700 font-medium">שם האירוע</Label>
//                     <Input
//                       id="name"
//                       value={eventData.name}
//                       onChange={(e) => setEventData({...eventData, name: e.target.value})}
//                       placeholder="לדוגמה: אבטחת הפגנה, פטרול שכונתי"
//                       required
//                       className="text-right border-command-slate-200 focus:border-command-blue"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-command-slate-700 font-medium">תיאור האירוע</Label>
//                     <Textarea
//                       id="description"
//                       value={eventData.description}
//                       onChange={(e) => setEventData({...eventData, description: e.target.value})}
//                       placeholder="פרט על מטרת האירוע, הנחיות מיוחדות וכל מידע רלוונטי"
//                       rows={3}
//                       className="text-right border-command-slate-200 focus:border-command-blue"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="priority" className="text-command-slate-700 font-medium">רמת עדיפות</Label>
//                       <Select value={eventData.priority} onValueChange={(value) => setEventData({...eventData, priority: value})}>
//                         <SelectTrigger className="border-command-slate-200 focus:border-command-blue">
//                           <SelectValue placeholder="בחר עדיפות" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="low">נמוכה</SelectItem>
//                           <SelectItem value="normal">רגילה</SelectItem>
//                           <SelectItem value="high">גבוהה</SelectItem>
//                           <SelectItem value="urgent">דחופה</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="officers" className="text-command-slate-700 font-medium">מספר שוטרים נדרש</Label>
//                       <Input
//                         id="officers"
//                         type="number"
//                         value={eventData.requiredOfficers}
//                         onChange={(e) => setEventData({...eventData, requiredOfficers: e.target.value})}
//                         placeholder="5"
//                         min="1"
//                         required
//                         className="text-right border-command-slate-200 focus:border-command-blue"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="startDate">תאריך התחלה</Label>
//                       <Input
//                         id="startDate"
//                         type="date"
//                         value={eventData.startDate}
//                         onChange={(e) => setEventData({...eventData, startDate: e.target.value})}
//                         required
//                       />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="endDate">תאריך סיום</Label>
//                       <Input
//                         id="endDate"
//                         type="date"
//                         value={eventData.endDate}
//                         onChange={(e) => setEventData({...eventData, endDate: e.target.value})}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="startTime">שעת התחלה</Label>
//                       <Input
//                         id="startTime"
//                         type="time"
//                         value={eventData.startTime}
//                         onChange={(e) => setEventData({...eventData, startTime: e.target.value})}
//                         required
//                       />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="endTime">שעת סיום</Label>
//                       <Input
//                         id="endTime"
//                         type="time"
//                         value={eventData.endTime}
//                         onChange={(e) => setEventData({...eventData, endTime: e.target.value})}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Map Selector */}
//             <MapSelector 
//               onAreaSelected={handleAreaSelected}
//               onRunAlgorithm={handleRunAlgorithm}
//               requiredOfficers={parseInt(eventData.requiredOfficers) || 5}
//             />
//           </div>

//           {/* Summary Sidebar */}
//           <div className="space-y-6">
//             <Card className="command-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="w-5 h-5 text-command-indigo" />
//                   סיכום האירוע
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div>
//                   <Label className="text-sm text-command-slate-600">שם האירוע</Label>
//                   <p className="font-medium text-command-slate-800">{eventData.name || 'לא הוגדר'}</p>
//                 </div>
                
//                 <div>
//                   <Label className="text-sm text-command-slate-600">עדיפות</Label>
//                   <div className="mt-1">
//                     {eventData.priority ? (
//                       <Badge variant={eventData.priority === 'urgent' || eventData.priority === 'high' ? 'destructive' : 'secondary'}>
//                         {eventData.priority === 'low' && 'נמוכה'}
//                         {eventData.priority === 'normal' && 'רגילה'}
//                         {eventData.priority === 'high' && 'גבוהה'}
//                         {eventData.priority === 'urgent' && 'דחופה'}
//                       </Badge>
//                     ) : (
//                       <span className="text-command-slate-400">לא נבחר</span>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-sm text-command-slate-600">תאריכים</Label>
//                   <p className="text-sm">
//                     {eventData.startDate && eventData.endDate 
//                       ? `${eventData.startDate} עד ${eventData.endDate}`
//                       : 'לא הוגדר'
//                     }
//                   </p>
//                 </div>

//                 <div>
//                   <Label className="text-sm text-command-slate-600">שעות</Label>
//                   <p className="text-sm">
//                     {eventData.startTime && eventData.endTime 
//                       ? `${eventData.startTime} - ${eventData.endTime}`
//                       : 'לא הוגדר'
//                     }
//                   </p>
//                 </div>

//                 <div>
//                   <Label className="text-sm text-command-slate-600">שוטרים נדרשים</Label>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Users className="w-4 h-4 text-command-blue" />
//                     <span className="font-medium text-command-slate-800">{eventData.requiredOfficers || '0'}</span>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-sm text-command-slate-600">אזור תיחום</Label>
//                   <div className="mt-1">
//                     {selectedArea.length > 0 ? (
//                       <Badge className="command-gradient text-white">
//                         {selectedArea.length} נקודות נבחרו
//                       </Badge>
//                     ) : (
//                       <span className="text-command-slate-400">לא הוגדר</span>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="space-y-3">
//               <Button 
//                 onClick={handleSubmit}
//                 className="w-full command-gradient text-white hover:scale-105 transition-all duration-200"
//                 disabled={!eventData.name || !eventData.priority || !eventData.requiredOfficers || selectedArea.length === 0}
//               >
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 צור אירוע
//               </Button>
//               <Button 
//                 variant="outline" 
//                 onClick={() => navigate('/operator-dashboard')} 
//                 className="w-full border-command-slate-200 hover:bg-command-slate-50"
//               >
//                 ביטול
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;

// בלי אזורים אסטרטגיים
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { ArrowRight, Calendar, Sparkles, Users } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import MapSelector from '@/components/MapSelector';

// const CreateEvent = () => {
//   const navigate = useNavigate();

//   const [eventData, setEventData] = useState({
//     name: '',
//     description: '',
//     priority: '',
//     startDate: '',
//     endDate: '',
//     startTime: '',
//     endTime: ''
//   });

//   const [selectedArea, setSelectedArea] = useState<number[][]>([]);
//   const [officerCount, setOfficerCount] = useState<number>(0);

//   const handleAreaSelected = (coordinates: number[][]) => {
//     setSelectedArea(coordinates);
//   };

//   const handleRunAlgorithm = (area: number[][], officerCount: number) => {
//     setSelectedArea(area);
//     setOfficerCount(officerCount);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (selectedArea.length < 4 || officerCount <= 0) {
//       alert("יש לבחור לפחות 4 נקודות ולפזר שוטרים");
//       return;
//     }

//     const body = {
//       name: eventData.name,
//       description: eventData.description,
//       priority: eventData.priority,
//       startDate: eventData.startDate,
//       endDate: eventData.endDate,
//       startTime: eventData.startTime,
//       endTime: eventData.endTime,
//       requiredOfficers: officerCount,
//       selectedArea: selectedArea.slice(0, 4)
//     };

//     try {
//       const response = await fetch("https://localhost:7163/api/Event/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body)
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert(`✅ נוצר אירוע עם ${result.officerCount} שוטרים`);
//         navigate("/operator-dashboard");
//       } else {
//         const error = await response.text();
//         alert("❌ שגיאה מהשרת:\n" + error);
//       }
//     } catch (err) {
//       console.error("❌ שגיאת רשת:", err);
//       alert("❌ שגיאת רשת");
//     }
//   };

//   return (
//    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
//       <header className="glass-effect border-b border-white/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center h-16">
//             <Button variant="ghost" onClick={() => navigate('/operator-dashboard')} className="mr-4 hover:bg-white/50">
//               <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
//               חזור למוקד
//             </Button>
//             <div>
//               <h1 className="text-lg font-semibold bg-gradient-to-r from-command-blue to-command-indigo bg-clip-text text-transparent">
//                 יצירת אירוע חדש
//               </h1>
//               <p className="text-sm text-command-slate-600">הגדרת אזור ותיחום לפיזור שוטרים</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* טופס פרטי האירוע */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="command-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="w-5 h-5 text-command-blue" />
//                   פרטי האירוע
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">שם האירוע</Label>
//                     <Input
//                       id="name"
//                       value={eventData.name}
//                       onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description">תיאור</Label>
//                     <Textarea
//                       id="description"
//                       value={eventData.description}
//                       onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
//                       rows={3}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>רמת עדיפות</Label>
//                     <Select value={eventData.priority} onValueChange={(value) => setEventData({ ...eventData, priority: value })}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="בחר עדיפות" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="low">נמוכה</SelectItem>
//                         <SelectItem value="normal">רגילה</SelectItem>
//                         <SelectItem value="high">גבוהה</SelectItem>
//                         <SelectItem value="urgent">דחופה</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="startDate">תאריך התחלה</Label>
//                       <Input
//                         type="date"
//                         id="startDate"
//                         value={eventData.startDate}
//                         onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="endDate">תאריך סיום</Label>
//                       <Input
//                         type="date"
//                         id="endDate"
//                         value={eventData.endDate}
//                         onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="startTime">שעת התחלה</Label>
//                       <Input
//                         type="time"
//                         id="startTime"
//                         value={eventData.startTime}
//                         onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="endTime">שעת סיום</Label>
//                       <Input
//                         type="time"
//                         id="endTime"
//                         value={eventData.endTime}
//                         onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* בחירת תחום מפה */}
//             <MapSelector 
//               onAreaSelected={handleAreaSelected}
//               onRunAlgorithm={handleRunAlgorithm}
//               requiredOfficers={officerCount}
//             />
//           </div>

//           {/* סיכום האירוע */}
//           <div className="space-y-6">
//             <Card className="command-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="w-5 h-5 text-command-indigo" />
//                   סיכום האירוע
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p><strong>שם:</strong> {eventData.name || '—'}</p>
//                 <p><strong>עדיפות:</strong> {eventData.priority || '—'}</p>
//                 <p><strong>תאריכים:</strong> {eventData.startDate} עד {eventData.endDate}</p>
//                 <p><strong>שעות:</strong> {eventData.startTime} - {eventData.endTime}</p>
//                 <p><strong>שוטרים שנבחרו:</strong> {officerCount}</p>
//                 <p><strong>נקודות תיחום:</strong> {selectedArea.length}</p>
//               </CardContent>
//             </Card>

//             <Button
//               onClick={handleSubmit}
//               disabled={!eventData.name || !eventData.priority || officerCount <= 0 || selectedArea.length < 4}
//               className="w-full command-gradient text-white hover:scale-105 transition-all"
//             >
//               <Sparkles className="w-4 h-4 mr-2" />
//               צור אירוע
//             </Button>
//             <Button variant="outline" onClick={() => navigate('/operator-dashboard')} className="w-full">
//               ביטול
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Sparkles, Users, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapSelector from '@/components/MapSelector';

// הגדרת הטייפ כאן במקום לייבא אותו
interface StrategicZone {
  latitude: number;
  longitude: number;
}

const CreateEvent = () => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  const [selectedArea, setSelectedArea] = useState<number[][]>([]);
  const [officerCount, setOfficerCount] = useState<number>(0);
  const [strategicZones, setStrategicZones] = useState<StrategicZone[]>([]); // ✨ חדש

  const handleAreaSelected = (coordinates: number[][]) => {
    setSelectedArea(coordinates);
  };

  // ✨ עדכון הפונקציה לקבלת האזורים האסטרטגיים
  const handleRunAlgorithm = (area: number[][], officerCount: number, strategicZones?: StrategicZone[]) => {
    setSelectedArea(area);
    setOfficerCount(officerCount);
    if (strategicZones) {
      setStrategicZones(strategicZones);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedArea.length < 4 || officerCount <= 0) {
      alert("יש לבחור לפחות 4 נקודות ולפזר שוטרים");
      return;
    }

    // ✨ הוספת האזורים האסטרטגיים לבקשה
    const body = {
      Name: eventData.name,  // ✨ שימוש באותיות גדולות כמו בקונטרולר
      Description: eventData.description,
      Priority: eventData.priority,
      StartDate: eventData.startDate,
      EndDate: eventData.endDate,
      StartTime: eventData.startTime,
      EndTime: eventData.endTime,
      RequiredOfficers: officerCount,
      SelectedArea: selectedArea.slice(0, 4),
      StrategicZones: strategicZones.map(zone => ({  // ✨ הוספת האזורים האסטרטגיים
        Latitude: zone.latitude,
        Longitude: zone.longitude,
        EventId: 0 // יוגדר על ידי השרת
      }))
    };

    console.log('🚀 שולח בקשה ליצירת אירוע:', body); // ✨ לדיבוג

    try {
      const response = await fetch("https://localhost:7163/api/Event/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        
        // ✨ הודעה משופרת עם פירוט
        let message = `✅ נוצר אירוע עם ${result.OfficerCount || result.officerCount} שוטרים`;
        
        if (result.StrategicOfficers && result.StrategicOfficers > 0) {
          message += `\n🎯 ${result.StrategicOfficers} שוטרים באזורים אסטרטגיים`;
          message += `\n👮 ${result.RegularOfficers} שוטרים נוספים`;
        }
        
        alert(message);
        navigate("/operator-dashboard");
      } else {
        const error = await response.text();
        alert("❌ שגיאה מהשרת:\n" + error);
      }
    } catch (err) {
      console.error("❌ שגיאת רשת:", err);
      alert("❌ שגיאת רשת");
    }
  };

  return (
   <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <header className="glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/operator-dashboard')} className="mr-4 hover:bg-white/50">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              חזור למוקד
            </Button>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-command-blue to-command-indigo bg-clip-text text-transparent">
                יצירת אירוע חדש
              </h1>
              <p className="text-sm text-command-slate-600">הגדרת אזור ותיחום לפיזור שוטרים</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* טופס פרטי האירוע */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="command-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-command-blue" />
                  פרטי האירוע
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם האירוע</Label>
                    <Input
                      id="name"
                      value={eventData.name}
                      onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">תיאור</Label>
                    <Textarea
                      id="description"
                      value={eventData.description}
                      onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>רמת עדיפות</Label>
                    <Select value={eventData.priority} onValueChange={(value) => setEventData({ ...eventData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר עדיפות" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">נמוכה</SelectItem>
                        <SelectItem value="Medium">בינונית</SelectItem>
                        <SelectItem value="High">גבוהה</SelectItem>
                        <SelectItem value="Critical">קריטית</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">תאריך התחלה</Label>
                      <Input
                        type="date"
                        id="startDate"
                        value={eventData.startDate}
                        onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">תאריך סיום</Label>
                      <Input
                        type="date"
                        id="endDate"
                        value={eventData.endDate}
                        onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">שעת התחלה</Label>
                      <Input
                        type="time"
                        id="startTime"
                        value={eventData.startTime}
                        onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">שעת סיום</Label>
                      <Input
                        type="time"
                        id="endTime"
                        value={eventData.endTime}
                        onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* בחירת תחום מפה */}
            <MapSelector 
              onAreaSelected={handleAreaSelected}
              onRunAlgorithm={handleRunAlgorithm}
              requiredOfficers={officerCount}
            />
          </div>

          {/* סיכום האירוע */}
          <div className="space-y-6">
            <Card className="command-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-command-indigo" />
                  סיכום האירוע
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><strong>שם:</strong> {eventData.name || '—'}</p>
                <p><strong>עדיפות:</strong> {eventData.priority || '—'}</p>
                <p><strong>תאריכים:</strong> {eventData.startDate} עד {eventData.endDate}</p>
                <p><strong>שעות:</strong> {eventData.startTime} - {eventData.endTime}</p>
                <p><strong>שוטרים שנבחרו:</strong> {officerCount}</p>
                <p><strong>נקודות תיחום:</strong> {selectedArea.length}</p>
                
                {/* ✨ הצגת מידע על אזורים אסטרטגיים */}
                {strategicZones.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">אזורים אסטרטגיים</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      נבחרו {strategicZones.length} אזורים אסטרטגיים
                    </p>
                    <div className="mt-2 max-h-20 overflow-y-auto">
                      {strategicZones.map((zone, index) => (
                        <div key={index} className="text-xs text-orange-600">
                          אזור {index + 1}: {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              disabled={!eventData.name || !eventData.priority || officerCount <= 0 || selectedArea.length < 4}
              className="w-full command-gradient text-white hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              צור אירוע
              {strategicZones.length > 0 && (
                <Badge variant="secondary" className="mr-2">
                  עם {strategicZones.length} אזורים אסטרטגיים
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/operator-dashboard')} className="w-full">
              ביטול
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;