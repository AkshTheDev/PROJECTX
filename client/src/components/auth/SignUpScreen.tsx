// src/components/SignUpScreen.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Eye, Phone } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

function SignUpScreen() {
  
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newAccount: any) => {
      return api.post('/auth/register', newAccount);
    },
    onSuccess: () => {
      navigate('/login'); // Redirect to login on success
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, companyName, password });
  };

  // ... (return statement)
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1 w-full">
        <div className="flex flex-1 flex-col justify-center items-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <a
                className="inline-flex items-center gap-2 text-2xl font-bold text-dark-gray dark:text-white"
                href="#"
              >
                <Receipt className="h-8 w-8 text-primary" />
                <span>Biz-Invoice</span>
              </a>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-dark-gray dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Create Your Business Account
                </p>
                <p className="text-medium-gray dark:text-gray-300 text-base font-normal leading-normal">
                  Join thousands of businesses streamlining their invoicing
                  process securely.
                </p>
              </div>
              <Tabs defaultValue="signup" className="pb-3">
                <TabsList className="grid w-full grid-cols-2 gap-8 border-b border-light-gray dark:border-gray-700 rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="login"
                    className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary pb-[13px] pt-4 text-sm font-bold text-medium-gray dark:text-gray-400"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary pb-[13px] pt-4 text-sm font-bold"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-dark-gray dark:text-gray-200 text-base font-medium leading-normal"
                  >
                    Business Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your business email address"
                    className="h-14 p-[15px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="company"
                    className="text-dark-gray dark:text-gray-200 text-base font-medium leading-normal"
                  >
                    Company Name
                  </label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your company name"
                    className="h-14 p-[15px]"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-dark-gray dark:text-gray-200 text-base font-medium leading-normal"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create your password"
                      className="h-14 p-[15px] pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-12 w-12 text-medium-gray dark:text-gray-400"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-normal leading-normal text-medium-gray dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <a className="underline hover:text-primary" href="#">
                    Terms of Service
                  </a>{" "}
                  and confirm that you have read our{" "}
                  <a className="underline hover:text-primary" href="#">
                    Privacy Policy
                  </a>
                  .
                </p>
                <Button
                  type="submit"
                  className="h-14 text-base font-bold"
                  disabled={mutation.isPending}
                >
                 {mutation.isPending ? 'Creating...' : 'Create Account'}
                </Button>
                <div className="flex items-center gap-4">
                  <hr className="flex-1 border-t border-light-gray dark:border-gray-700" />
                  <p className="text-medium-gray dark:text-gray-400 text-sm">
                    or
                  </p>
                  <hr className="flex-1 border-t border-light-gray dark:border-gray-700" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-14 text-base font-medium"
                >
                  <Phone className="mr-3 h-5 w-5" />
                  Request a Demo
                </Button>
              </form>
              <div className="flex justify-center gap-4 mt-4">
                <img
                  alt="Security Badge 1"
                  className="h-10"
                  src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/login/signup_1/badge1.png"
                />
                <img
                  alt="Security Badge 2"
                  className="h-10"
                  src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/login/signup_1/badge2.png"
                />
                <img
                  alt="Security Badge 3"
                  className="h-10"
                  src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/login/signup_1/badge1.png"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-accent-blue/10 dark:bg-accent-blue/20 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <img
              src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/login/signup_1/illustration.png"
              alt="Illustration of secure data management"
              className="w-full max-w-xs mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-4">
              Secure & Compliant Business Invoicing
            </h2>
            <p className="text-medium-gray dark:text-gray-300">
              Our platform ensures enterprise-grade security and full
              compliance with industry regulations, safeguarding your financial
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}
export default SignUpScreen
