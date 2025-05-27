
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Shield, User, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'operator' | 'police'>('operator');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    badgeNumber: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login/Register:', { ...formData, role, isLogin });
    
    // Simulate authentication
    localStorage.setItem('userRole', role);
    localStorage.setItem('userData', JSON.stringify({
      name: formData.name || 'משתמש',
      email: formData.email,
      role: role,
      badgeNumber: formData.badgeNumber
    }));
    
    // Navigate based on role
    if (role === 'operator') {
      navigate('/operator-dashboard');
    } else {
      navigate('/police-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-command-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 command-gradient rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-glow"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-glow animation-delay-2000"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="mx-auto w-20 h-20 command-gradient rounded-2xl flex items-center justify-center modern-shadow cyber-glow">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-command-blue to-command-indigo bg-clip-text text-transparent">
                מערכת פיקוד חכמה
              </h1>
              <p className="text-command-slate-600 mt-2">
                {isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="command-card border-0 modern-shadow">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl text-command-slate-800 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-command-blue" />
                {isLogin ? 'ברוכים הבאים' : 'הצטרפו אלינו'}
              </CardTitle>
              <CardDescription className="text-command-slate-600">
                {isLogin ? 'היכנסו לחשבון שלכם' : 'צרו חשבון חדש במערכת'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-command-slate-700 font-medium">שם מלא</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="text-right border-command-slate-200 focus:border-command-blue focus:ring-command-blue/20"
                      placeholder="הכנס שם מלא"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-command-slate-700 font-medium">אימייל</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="text-right border-command-slate-200 focus:border-command-blue focus:ring-command-blue/20"
                    placeholder="הכנס אימייל"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-command-slate-700 font-medium">סיסמא</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="text-right border-command-slate-200 focus:border-command-blue focus:ring-command-blue/20"
                    placeholder="הכנס סיסמא"
                  />
                </div>
                
                {!isLogin && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-command-slate-700 font-medium">תפקיד במערכת</Label>
                      <RadioGroup value={role} onValueChange={(value: 'operator' | 'police') => setRole(value)} className="space-y-3">
                        <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg border border-command-slate-200 hover:border-command-blue transition-colors">
                          <RadioGroupItem value="operator" id="operator" className="text-command-blue" />
                          <Label htmlFor="operator" className="flex items-center gap-3 cursor-pointer flex-1">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-command-blue" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-command-slate-800">מוקדנית</div>
                              <div className="text-sm text-command-slate-600">ניהול ופיקוד מלא</div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-command-blue border-blue-200">
                              ניהול
                            </Badge>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg border border-command-slate-200 hover:border-command-indigo transition-colors">
                          <RadioGroupItem value="police" id="police" className="text-command-indigo" />
                          <Label htmlFor="police" className="flex items-center gap-3 cursor-pointer flex-1">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-command-indigo" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-command-slate-800">שוטר</div>
                              <div className="text-sm text-command-slate-600">ממשק שטח</div>
                            </div>
                            <Badge variant="outline" className="border-indigo-200 text-command-indigo">
                              שטח
                            </Badge>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {role === 'police' && (
                      <div className="space-y-2">
                        <Label htmlFor="badgeNumber" className="text-command-slate-700 font-medium">מספר תג</Label>
                        <Input
                          id="badgeNumber"
                          type="text"
                          value={formData.badgeNumber}
                          onChange={(e) => setFormData({...formData, badgeNumber: e.target.value})}
                          required={role === 'police'}
                          className="text-right border-command-slate-200 focus:border-command-indigo focus:ring-command-indigo/20"
                          placeholder="הכנס מספר תג"
                        />
                      </div>
                    )}
                  </>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full command-gradient text-white hover:scale-105 transition-all duration-200 py-3 text-base font-semibold rounded-xl modern-shadow"
                >
                  {isLogin ? 'התחבר למערכת' : 'הירשם למערכת'}
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </form>
              
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-command-blue hover:text-command-indigo font-medium"
                >
                  {isLogin ? 'אין לך חשבון? הירשם כאן' : 'יש לך חשבון? התחבר כאן'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
