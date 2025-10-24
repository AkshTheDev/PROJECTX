// src/components/GstReportsScreen.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  FileSpreadsheet,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Helper component for Summary Cards
const SummaryCard = ({ title, value, bgColor, textColor, valueColor }: any) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
    <p className={`text-2xl font-bold ${valueColor} mt-1`}>{value}</p>
  </div>
);

export function GstReportsScreen() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#333333] dark:text-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-b-gray-700 px-4 sm:px-6 lg:px-10 py-3 bg-white dark:bg-background-dark">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 sm:gap-4 text-primary">
            {/* SVG Icon for GST Pro */}
            <svg
              className="size-6 sm:size-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
            <h2 className="text-lg sm:text-xl font-bold">GST Pro</h2>
          </div>
          <nav className="hidden md:flex items-center gap-6 sm:gap-9">
            <a
              className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary"
              href="#"
            >
              Invoices
            </a>
            <a className="text-sm font-medium text-primary" href="#">
              Reports
            </a>
            <a
              className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary"
              href="#"
            >
              Clients
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden p-2">
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button className="h-10 px-4 text-sm font-bold">
              New Invoice
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-10 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-sm font-medium">
              <a
                className="text-gray-500 dark:text-gray-400 hover:text-primary"
                href="#"
              >
                Home
              </a>
              <span className="text-gray-500 dark:text-gray-400">/</span>
              <a
                className="text-gray-500 dark:text-gray-400 hover:text-primary"
                href="#"
              >
                Reports
              </a>
              <span className="text-gray-500 dark:text-gray-400">/</span>
              <span className="text-gray-800 dark:text-white">GST Reports</span>
            </div>

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.033em] text-gray-900 dark:text-white">
                GST Reports
              </h1>
              <div className="flex gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10 px-4 text-sm font-bold"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10 px-4 text-sm font-bold"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Download Excel</span>
                </Button>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Select Date Range
              </h2>
              {/* Simplified Calendar Display */}
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <Calendar
                  mode="range"
                  // Add selected range state here
                  className="rounded-md"
                />
              </div>
            </div>

            {/* GST Summary */}
            <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                GST Summary for Selected Period
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <SummaryCard
                  title="Total Sales"
                  value="₹1,25,430.00"
                  bgColor="bg-blue-50 dark:bg-blue-900/30"
                  textColor="text-blue-800 dark:text-blue-300"
                  valueColor="text-blue-900 dark:text-blue-100"
                />
                <SummaryCard
                  title="Total GST Collected"
                  value="₹22,577.40"
                  bgColor="bg-green-50 dark:bg-green-900/30"
                  textColor="text-green-800 dark:text-green-300"
                  valueColor="text-green-900 dark:text-green-100"
                />
                <SummaryCard
                  title="Total Input Tax Credit"
                  value="₹15,230.50"
                  bgColor="bg-yellow-50 dark:bg-yellow-900/30"
                  textColor="text-yellow-800 dark:text-yellow-300"
                  valueColor="text-yellow-900 dark:text-yellow-100"
                />
                <SummaryCard
                  title="Net GST Payable"
                  value="₹7,346.90"
                  bgColor="bg-red-50 dark:bg-red-900/30"
                  textColor="text-red-800 dark:text-red-300"
                  valueColor="text-red-900 dark:text-red-100"
                />
              </div>
            </div>

            {/* Detailed Report Table */}
            <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detailed Report
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute inset-y-0 left-3 flex items-center h-full w-5 text-gray-500" />
                  <Input
                    className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-gray-700"
                    placeholder="Search invoices..."
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <TableRow>
                      <TableHead className="px-6 py-3">Invoice #</TableHead>
                      <TableHead className="px-6 py-3">Date</TableHead>
                      <TableHead className="px-6 py-3">Customer</TableHead>
                      <TableHead className="px-6 py-3 text-right">
                        Taxable Amount
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right">
                        CGST
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right">
                        SGST
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right">
                        IGST
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        INV-00123
                      </TableCell>
                      <TableCell className="px-6 py-4">2024-07-28</TableCell>
                      <TableCell className="px-6 py-4">ABC Corp</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹10,000.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹900.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹900.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹0.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-bold">
                        ₹11,800.00
                      </TableCell>
                    </TableRow>
                    {/* ... other rows ... */}
                    <TableRow className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        INV-00126
                      </TableCell>
                      <TableCell className="px-6 py-4">2024-07-22</TableCell>
                      <TableCell className="px-6 py-4">Evergreen Co.</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹21,000.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹1,890.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹1,890.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ₹0.00
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-bold">
                        ₹24,780.00
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}