// src/components/ProfileScreen.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Lock, Info } from "lucide-react";

export function ProfileScreen() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-6xl flex-1">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Side Navigation */}
            <aside className="hidden lg:flex lg:w-1/4">
              <div className="w-full">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary"
                  >
                    <User className="h-5 w-5" />
                    <p className="text-sm font-medium">Personal Information</p>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Briefcase className="h-5 w-5" />
                    <p className="text-sm font-medium">Business Information</p>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Lock className="h-5 w-5" />
                    <p className="text-sm font-medium">Security</p>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="w-full lg:w-3/4">
              <div className="mb-6">
                <p className="text-4xl font-black leading-tight tracking-tight">
                  My Profile
                </p>
              </div>

              {/* Mobile Tabs */}
              <div className="lg:hidden mb-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-border-light dark:border-border-dark p-0">
                    <TabsTrigger
                      value="personal"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                    >
                      Personal
                    </TabsTrigger>
                    <TabsTrigger
                      value="business"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                    >
                      Business
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                    >
                      Security
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Personal Information */}
              <div className="space-y-8" id="personal">
                <div className="p-6 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark">
                  <div className="flex w-full flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                          <p className="text-2xl font-bold">Rakesh Sharma</p>
                          <p className="text-base text-gray-500 dark:text-gray-400">
                            rakesh.sharma@example.com
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className="h-10 px-4 text-sm font-bold w-full sm:w-auto"
                      >
                        Upload new picture
                      </Button>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="fullName"
                          defaultValue="Rakesh Sharma"
                          className="h-12"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          defaultValue="rakesh.sharma@example.com"
                          className="h-12 bg-gray-50 dark:bg-gray-800/50"
                          readOnly
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="+91 98765 43210"
                          className="h-12"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-8 mt-8" id="business">
                <div className="p-6 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark">
                  <h3 className="text-xl font-bold mb-4">
                    Business Information
                  </h3>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col md:col-span-2 space-y-2">
                      <label
                        htmlFor="businessName"
                        className="text-sm font-medium"
                      >
                        Business Name
                      </label>
                      <Input
                        id="businessName"
                        defaultValue="Sharma Enterprises"
                        className="h-12"
                      />
                    </div>
                    <div className="flex flex-col md:col-span-2 space-y-2">
                      <label
                        htmlFor="businessAddress"
                        className="text-sm font-medium"
                      >
                        Business Address
                      </label>
                      <Textarea
                        id="businessAddress"
                        defaultValue="123, Business Avenue, Commerce City, Mumbai, 400001"
                        className="min-h-24"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="gstin"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        GSTIN
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The Goods and Services Tax Identification Number
                                (GSTIN) is a 15-digit PAN-based unique
                                identification number.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        id="gstin"
                        defaultValue="27ABCDE1234F1Z5"
                        className="h-12"
                      />
                    </div>
                  </form>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-8 mt-8" id="security">
                <div className="p-6 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark">
                  <h3 className="text-xl font-bold mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last changed on 12 Jan 2024
                        </p>
                      </div>
                      <Button
                        variant="link"
                        className="text-primary font-bold text-sm"
                      >
                        Change Password
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable email notifications for invoices.
                        </p>
                      </div>
                      <Switch
                        id="notifications-toggle"
                        defaultChecked={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <Button
                  variant="secondary"
                  className="h-12 px-6 text-sm font-bold"
                >
                  Cancel
                </Button>
                <Button className="h-12 px-6 text-sm font-bold">
                  Save Changes
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}