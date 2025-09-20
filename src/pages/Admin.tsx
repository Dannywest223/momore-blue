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
      // Debug logging
      console.log("=== LOGIN DEBUG INFO ===");
      console.log("API Base URL:", import.meta.env.VITE_API_URL);
      console.log("Login data being sent:", {
        email: loginData.email,
        password: loginData.password ? '***' : 'EMPTY'
      });
      console.log("Email length:", loginData.email.length);
      console.log("Password length:", loginData.password.length);
      console.log("Email trimmed:", `'${loginData.email.trim()}'`);
      console.log("========================");

      await login(loginData.email.toLowerCase().trim(), loginData.password);

      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setLoginData({ email: "", password: "" });
    } catch (error: any) {
      console.error("Login error in component:", error);
      console.log("Error message:", error.message);
      console.log("Error object:", error);
      
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
      console.log("=== REGISTER DEBUG INFO ===");
      console.log("Registration data:", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password ? '***' : 'EMPTY'
      });
      console.log("===========================");

      await register(
        registerData.name.trim(),
        registerData.email.toLowerCase().trim(),
        registerData.password
      );
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      
      // Clear form
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

  // Test connection function
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">MOMORE Admin</h1>
          <p className="text-white/80">Manage your premium e-commerce store</p>
          
          {/* Debug info - remove in production */}
          <div className="mt-4 p-2 bg-black/20 rounded text-xs text-white/60">
            <div>API URL: {import.meta.env.VITE_API_URL}</div>
            <button 
              onClick={testConnection}
              className="mt-1 px-2 py-1 bg-white/10 rounded text-white/80 hover:bg-white/20"
            >
              Test Connection
            </button>
          </div>
        </div>

        <Card className="border-0 shadow-large">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-foreground">
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
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
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
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
                        className="w-full pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-hero-primary"
                    disabled={isLoading}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-primary">
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
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
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-foreground mb-2">
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
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-foreground mb-2">
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
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
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
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-hero-primary"
                    disabled={isLoading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Secure admin access for MOMORE store management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;