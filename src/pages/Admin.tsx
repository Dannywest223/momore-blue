import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      console.log("=== LOGIN DEBUG INFO ===");
      console.log("API Base URL:", import.meta.env.VITE_API_URL);
      console.log("Login data being sent:", {
        email: loginData.email,
        password: loginData.password ? '***' : 'EMPTY'
      });
      console.log("========================");

      await login(loginData.email.toLowerCase().trim(), loginData.password);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setLoginData({ email: "", password: "" });
    } catch (error: any) {
      console.error("Login error in component:", error);
      
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(
        registerData.name.trim(),
        registerData.email.toLowerCase().trim(),
        registerData.password
      );
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Registration error in component:", error);
      
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const testConnection = async () => {
    try {
      console.log("Testing API connection...");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test`);
      console.log("Test response status:", response.status);
      console.log("Test response:", await response.text());
    } catch (error) {
      console.error("Connection test failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/30 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .golden-line {
          background: linear-gradient(90deg, transparent, #d97706, #b45309, #d97706, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
        <div className="inline-block mb-4 mt-12">
  <span className="text-sm font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-6 py-2.5 rounded-full border-2 border-amber-200">
    Admin Portal
  </span>
</div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-3">
            MOMORE
          </h1>
          <p className="text-stone-600 text-lg">Manage your premium store</p>
          <div className="w-24 h-1 golden-line mx-auto mt-4 rounded-full"></div>
          
          {/* Debug info */}
          
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden animate-fade-in bg-white" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="bg-gradient-to-r from-amber-700 to-amber-800 text-white pb-8 pt-8">
            <CardTitle className="text-center text-3xl font-bold">
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-amber-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-white data-[state=active]:text-amber-900 rounded-lg font-semibold"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-white data-[state=active]:text-amber-900 rounded-lg font-semibold"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-6 mt-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      required
                      placeholder="admin@momore.com"
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        required
                        placeholder="Enter your password"
                        className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl pr-12"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 text-amber-700 hover:text-amber-900 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg"
                    disabled={isLoading}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-amber-700 hover:text-amber-900 font-semibold">
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="space-y-6 mt-8">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={registerData.name}
                      onChange={handleRegisterInputChange}
                      required
                      placeholder="Your full name"
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-bold text-stone-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      required
                      placeholder="admin@momore.com"
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-bold text-stone-700 mb-2">
                      Password
                    </label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      required
                      placeholder="Create a strong password (min 6 chars)"
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-bold text-stone-700 mb-2">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      required
                      placeholder="Confirm your password"
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg"
                    disabled={isLoading}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-stone-600 text-sm bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl inline-block border border-amber-200">
            Secure admin access for MOMORE store management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;