
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, Package } from "lucide-react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({ onLogin, isLoading = false, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white/20 rounded-3xl animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 border border-white/15 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/3 w-16 h-16 border-2 border-white/20 rounded-lg animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/20"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-2xl shadow-lg transform hover:scale-105 transition-transform">
              <Package className="w-8 h-8" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Inventory System
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to access your inventory dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10 h-12 border-2 focus:border-[#667eea]"
                  required
                  data-testid="input-username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 border-2 focus:border-[#667eea]"
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" data-testid="alert-error" className="border-2">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl text-center">
            <p className="text-sm text-blue-900 font-medium">
              Secure Authentication
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Your credentials are encrypted and protected
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
