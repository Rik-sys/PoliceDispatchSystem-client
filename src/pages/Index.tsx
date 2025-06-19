
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Shield, Zap, Map, Users } from 'lucide-react';


// const Index = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is already logged in
//     const userRole = localStorage.getItem('userRole');
//     if (userRole === 'operator') {
//       navigate('/operator-dashboard');
//     } else if (userRole === 'police') {
//       navigate('/police-dashboard');
//     }
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-command-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-20 w-72 h-72 command-gradient rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-glow"></div>
//         <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-glow animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-glow animation-delay-4000"></div>
//       </div>
      
//       <div className="relative z-10 flex min-h-screen">
//         {/* Hero Section */}
//         <div className="flex-1 flex items-center justify-center px-8">
//           <div className="max-w-2xl text-center space-y-8 slide-in">
//             {/* Logo */}
//             <div className="mx-auto w-24 h-24 command-gradient rounded-2xl flex items-center justify-center modern-shadow cyber-glow">
//               <Shield className="w-12 h-12 text-white" />
//             </div>
            
//             {/* Heading */}
//             <div className="space-y-4">
//               <h1 className="text-5xl font-bold bg-gradient-to-r from-command-blue via-command-indigo to-command-purple bg-clip-text text-transparent leading-tight">
//                 מערכת פיקוד חכמה
//               </h1>
//               <p className="text-xl text-command-slate-600 leading-relaxed">
//                 פיזור שוטרים אינטליגנטי על בסיס אלגוריתם K-Center
//               </p>
//               <p className="text-command-slate-500 max-w-lg mx-auto">
//                 מערכת מתקדמת לניהול כוחות, תיחום אזורים והקצאה אופטימלית של משאבים בזמן אמת
//               </p>
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
//               <div className="text-center space-y-2">
//                 <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                   <Map className="w-6 h-6 text-command-blue" />
//                 </div>
//                 <p className="text-sm text-command-slate-600 font-medium">תיחום אזורים</p>
//               </div>
//               <div className="text-center space-y-2">
//                 <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
//                   <Zap className="w-6 h-6 text-command-indigo" />
//                 </div>
//                 <p className="text-sm text-command-slate-600 font-medium">אלגוריתם חכם</p>
//               </div>
//               <div className="text-center space-y-2">
//                 <div className="mx-auto w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                   <Users className="w-6 h-6 text-command-purple" />
//                 </div>
//                 <p className="text-sm text-command-slate-600 font-medium">פיזור אופטימלי</p>
//               </div>
//             </div>

//             {/* CTA Button */}
//             <div className="space-y-6">
//               <Button 
//                 onClick={() => navigate('/login')} 
//                 className="command-gradient text-white hover:scale-105 transition-all duration-200 py-4 px-8 text-lg font-semibold rounded-xl modern-shadow cyber-glow"
//               >
//                 כניסה למערכת
//                 <Shield className="w-5 h-5 mr-2" />
//               </Button>
              
//               <div className="text-sm text-command-slate-500 space-y-2">
//                 <div className="flex items-center justify-center gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-command-blue rounded-full"></div>
//                     <span>מוקדנית - ניהול מלא של אירועים וקריאות</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-center gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-command-indigo rounded-full"></div>
//                     <span>שוטר - ממשק שטח פשוט ויעיל</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;


// import React from 'react';
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import InteractiveMap from '../components/InteractiveMap';

// const Index = () => {
//   return (
//     <div className="min-h-screen bg-background p-4">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-2" dir="rtl">
//           <h1 className="text-4xl font-bold">מוקד משטרה - דאשבורד מוקדנית</h1>
//           <p className="text-xl text-muted-foreground">מפה אינטראקטיבית לניהול כוחות ואירועים בזמן אמת</p>
//           <Badge className="bg-green-100 text-green-800 border-green-300">
//             🟢 מערכת פעילה
//           </Badge>
//         </div>

//         {/* Interactive Map */}
//         <Card className="p-6">
//           <div className="h-[calc(100vh-200px)]">
//             <InteractiveMap />
//           </div>
//         </Card>

//         {/* Instructions */}
//         <Card className="p-4 bg-blue-50 border-blue-200">
//           <div className="space-y-2" dir="rtl">
//             <h3 className="font-semibold text-blue-900">הוראות שימוש:</h3>
//             <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
//               <li>השתמש בבקרות בחלק העליון כדי לסנן ולהתאים את התצוגה</li>
//               <li>לחץ על סמנים במפה כדי לראות פרטים נוספים</li>
//               <li>המפה מתעדכנת אוטומטיה כל 30 שניות (ניתן לשנות)</li>
//               <li>השתמש בכפתורי הניווט במפה כדי לזום ולנווט</li>
//               <li>הסמנים הצבעוניים מייצגים סטטוסים שונים - ראה את המקרא</li>
//             </ul>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Index;

import InteractiveMap from "@/components/InteractiveMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">דאשבורד מוקדנית - מערכת ניטור זמן אמת</h1>
        <InteractiveMap />
      </div>
    </div>
  );
};

export default Index;