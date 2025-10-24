// src/components/DashboardScreen.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart,
  Settings,
  LogOut,
  Search,
  Bell,
  PlusCircle,
  UserPlus,
  BarChart3,
  TrendingUp,
  Hourglass,
  Landmark,
  ArrowUp,
} from "lucide-react";

// Helper component for Stat Cards
const StatCard = ({ title, value, icon, iconClass }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-medium text-gray-500 dark:text-gray-400">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${iconClass}`}>{value}</div>
    </CardContent>
  </Card>
);

// Helper component for Recent Invoices Table Row
const InvoiceRow = ({ id, client, date, amount, status, statusClass }: any) => (
  <TableRow className="cursor-pointer">
    <TableCell className="font-medium text-primary">{id}</TableCell>
    <TableCell>{client}</TableCell>
    <TableCell className="text-gray-500 dark:text-gray-400">{date}</TableCell>
    <TableCell>{amount}</TableCell>
    <TableCell>
      <span
        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
      >
        {status}
      </span>
    </TableCell>
  </TableRow>
);

export function DashboardScreen() {
  const chartData = [
    { height: "60%" },
    { height: "40%" },
    { height: "80%", active: true },
    { height: "50%" },
    { height: "70%" },
    { height: "30%" },
    { height: "90%" },
  ];
  const chartLabels = [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Week 6",
    "Week 7",
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row bg-background-light dark:bg-background-dark text-[#111618] dark:text-white">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-700">
        <div className="flex h-full min-h-0 flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2">
              <div className="flex items-center gap-2 text-primary">
                <Receipt className="h-8 w-8" />
                <h2 className="text-[#111618] dark:text-white text-xl font-bold">
                  GST Invoice
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/20"
              >
                <LayoutDashboard className="h-5 w-5" />
                <p className="text-sm font-medium">Dashboard</p>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                <Receipt className="h-5 w-5" />
                <p className="text-sm font-medium">Invoices</p>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                <Users className="h-5 w-5" />
                <p className="text-sm font-medium">Clients</p>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                <BarChart className="h-5 w-5" />
                <p className="text-sm font-medium">Reports</p>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
            >
              <Settings className="h-5 w-5" />
              <p className="text-sm font-medium">Settings</p>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
            >
              <LogOut className="h-5 w-5" />
              <p className="text-sm font-medium">Log Out</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 bg-white dark:bg-background-dark">
          <div className="flex items-center gap-4 lg:hidden">
            <Receipt className="h-8 w-8 text-primary" />
            <h2 className="text-[#111618] dark:text-white text-xl font-bold">
              GST Invoice
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                className="w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 h-10 placeholder:text-gray-500 dark:placeholder-gray-400 px-10 text-sm font-normal"
                placeholder="Search invoices..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center rounded-full h-10 w-10 bg-background-light dark:bg-gray-800 text-[#111618] dark:text-white"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col">
                <p className="text-[#111618] dark:text-white text-sm font-medium">
                  Tarun
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Acme Inc.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex flex-col">
              <h1 className="text-[#111618] dark:text-white text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Here's a summary of your business.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold">
                <PlusCircle className="h-5 w-5" />
                <span>Create New Invoice</span>
              </Button>
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-[#111618] dark:text-white text-sm font-bold"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add New Client</span>
              </Button>
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-[#111618] dark:text-white text-sm font-bold"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Generate GST Report</span>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Total Invoices"
              value="1,250"
              icon={<TrendingUp className="text-green-500 h-5 w-5" />}
            />
            <StatCard
              title="Pending Payments"
              value="₹50,000"
              icon={<Hourglass className="text-orange-500 h-5 w-5" />}
            />
            <StatCard
              title="GST Collected/Paid"
              value="₹12.5k / ₹7.5k"
              icon={<Landmark className="text-blue-500 h-5 w-5" />}
            />
          </div>

          {/* Invoice Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Invoice Summary - Last 30 Days
              </CardTitle>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold">₹1,20,000</p>
                <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  <span>10%</span>
                </p>
              </div>
            </CardHeader>
            <CardContent className="h-60">
              <div className="grid h-full grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center">
                {chartData.map((bar, index) => (
                  <div
                    key={index}
                    className={`${
                      bar.active
                        ? "bg-primary"
                        : "bg-primary/20 dark:bg-primary/40"
                    } w-full rounded-t-lg`}
                    style={{ height: bar.height }}
                  ></div>
                ))}
                {chartLabels.map((label, index) => (
                  <p
                    key={index}
                    className="text-gray-500 dark:text-gray-400 text-xs text-center"
                  >
                    {label}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices Table */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Recent Invoices</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <InvoiceRow
                      id="INV-001"
                      client="Innovate Inc."
                      date="15 Aug, 2023"
                      amount="₹15,000"
                      status="Paid"
                      statusClass="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                    />
                    <InvoiceRow
                      id="INV-002"
                      client="Future Forward"
                      date="12 Aug, 2023"
                      amount="₹8,500"
                      status="Pending"
                      statusClass="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                    />
                    <InvoiceRow
                      id="INV-003"
                      client="Quantum Leap"
                      date="05 Aug, 2023"
                      amount="₹22,000"
                      status="Overdue"
                      statusClass="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                    />
                    <InvoiceRow
                      id="INV-004"
                      client="Synergy Solutions"
                      date="01 Aug, 2023"
                      amount="₹5,000"
                      status="Paid"
                      statusClass="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                    />
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}