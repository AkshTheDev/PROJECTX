// src/components/LoginScreen.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Eye, Chrome } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

function LoginScreen() {
   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth(); // Get from context

  const mutation = useMutation({
    mutationFn: (credentials: any) => {
      return api.post('/auth/login', credentials);
    },
    onSuccess: (data) => {
      setToken(data.data.token); // Save token
      navigate('/dashboard'); // Redirect to dashboard
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  // ... (return statement)
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1 w-full">
        <div className="flex flex-1 flex-col justify-center items-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <a
                className="inline-flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white"
                href="#"
              >
                <Receipt className="h-8 w-8 text-primary" />
                <span>GST-Invoice</span>
              </a>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-[#111618] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Welcome Back
                </p>
                <p className="text-[#617c89] dark:text-gray-300 text-base font-normal leading-normal">
                  Login to your account to manage your invoices.
                </p>
              </div>
              <Tabs defaultValue="login" className="pb-3">
                <TabsList className="grid w-full grid-cols-2 gap-8 border-b border-[#dbe2e6] dark:border-gray-700 rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="login"
                    className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary pb-[13px] pt-4 text-sm font-bold"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary pb-[13px] pt-4 text-sm font-bold text-[#617c89] dark:text-gray-400"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <form className="flex flex-col gap-6 " onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[#111618] dark:text-gray-200 text-base font-medium leading-normal"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="h-14 p-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-[#111618] dark:text-gray-200 text-base font-medium leading-normal"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-14 p-[15px] pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-12 w-12 text-[#617c89] dark:text-gray-400"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-primary text-sm font-normal leading-normal self-start underline cursor-pointer"
                >
                  Forgot Password?
                </a>
                <Button
                  type="submit"
                  className="h-14 text-base font-bold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
                <div className="flex items-center gap-4">
                  <hr className="flex-1 border-t border-[#dbe2e6] dark:border-gray-700" />
                  <p className="text-[#617c89] dark:text-gray-400 text-sm">or</p>
                  <hr className="flex-1 border-t border-[#dbe2e6] dark:border-gray-700" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-14 text-base font-medium"
                >
                  <Chrome className="mr-3 h-6 w-6" />
                  Continue with Google
                </Button>
              </form>
            </div>
            <div className="mt-8 text-center text-sm text-[#617c89] dark:text-gray-400">
              <p>
                <a className="underline hover:text-primary" href="#">
                  Terms of Service
                </a>{" "}
                •{" "}
                <a className="underline hover:text-primary" href="#">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-primary/10 dark:bg-primary/20 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <img
              src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/login/signup_2/illustration.png"
              alt="Illustration of a person analyzing financial charts"
              className="w-full max-w-xs mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold text-[#111618] dark:text-white mb-4">
              Simplify Your GST Invoicing
            </h2>
            <p className="text-[#617c89] dark:text-gray-300">
              Create, send, and track GST-compliant invoices in minutes. Join
              thousands of businesses who trust us to streamline their finances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
    
}
export default LoginScreen