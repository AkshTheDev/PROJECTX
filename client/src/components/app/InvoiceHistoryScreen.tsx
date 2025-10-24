// src/components/InvoiceHistoryScreen.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Receipt,
  Search,
  CalendarIcon,
  X,
  Edit,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

// Helper component for Stat Cards
const StatCard = ({ title, value, valueClass = "" }: any) => (
  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-gray-800">
    <p className="text-[#333333] dark:text-gray-300 text-base font-medium leading-normal">
      {title}
    </p>
    <p
      className={`tracking-light text-2xl font-bold leading-tight ${
        valueClass || "text-[#333333] dark:text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

// Helper component for Invoice Row
const InvoiceRow = ({ id, customer, invoiceDate, dueDate, amount, status }: any) => {
  let statusClass = "";
  let dotClass = "";
  switch (status) {
    case "Paid":
      statusClass = "bg-green-100 text-green-800";
      dotClass = "bg-green-500";
      break;
    case "Overdue":
      statusClass = "bg-orange-100 text-orange-800";
      dotClass = "bg-orange-500";
      break;
    case "Unpaid":
      statusClass = "bg-blue-100 text-blue-800";
      dotClass = "bg-blue-500";
      break;
    case "Draft":
      statusClass = "bg-gray-100 text-gray-800";
      dotClass = "bg-gray-500";
      break;
  }

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell>{customer}</TableCell>
      <TableCell className="text-gray-600 dark:text-gray-300">
        {invoiceDate}
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-300">
        {dueDate}
      </TableCell>
      <TableCell className="font-medium text-right">{amount}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
        >
          <span className={`w-2 h-2 mr-1.5 ${dotClass} rounded-full`}></span>
          {status}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
            title="Edit Invoice"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
            title="Download PDF"
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500"
            title="Delete Invoice"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export function InvoiceHistoryScreen() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#333333] dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e0e0e0] dark:border-b-gray-700 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Receipt className="h-8 w-8" />
            <h2 className="text-[#333333] dark:text-white text-lg font-bold">
              GST Invoicing
            </h2>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-9">
          <a
            className="text-[#333333] dark:text-gray-300 text-sm font-medium leading-normal"
            href="#"
          >
            Dashboard
          </a>
          <a
            className="text-primary text-sm font-bold leading-normal"
            href="#"
          >
            Invoice History
          </a>
          <a
            className="text-[#333333] dark:text-gray-300 text-sm font-medium leading-normal"
            href="#"
          >
            Create Invoice
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-primary/20 text-primary gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
          >
            <User className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <p className="text-3xl md:text-4xl font-black tracking-tight">
              Invoice History
            </p>
          </div>

          {/* Stat Cards */}
          <div className="flex flex-wrap gap-4 mb-6">
            <StatCard title="Total Invoiced" value="₹1,25,000" />
            <StatCard title="Total Paid" value="₹1,00,000" />
            <StatCard
              title="Total Outstanding"
              value="₹25,000"
              valueClass="text-orange-500"
            />
          </div>

          {/* Filters & Table Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  className="h-12 pl-10"
                  placeholder="Search by Invoice # or Customer"
                />
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full h-12 justify-between text-left font-normal"
                    >
                      <span>Select Date Range</span>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                Invoice # : INV-00123
                <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                  <X className="h-4 w-4" />
                </Button>
              </span>
              <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                Status : Unpaid
                <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                  <X className="h-4 w-4" />
                </Button>
              </span>
              <Button
                variant="link"
                className="text-primary text-sm font-medium ml-2 p-0"
              >
                Clear All
              </Button>
            </div>

            {/* Invoice Table */}
            <div className="overflow-x-auto rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <InvoiceRow
                    id="INV-00123"
                    customer="Acme Corporation"
                    invoiceDate="15 Jul 2024"
                    dueDate="30 Jul 2024"
                    amount="15,000.00"
                    status="Paid"
                  />
                  <InvoiceRow
                    id="INV-00124"
                    customer="Innovate LLC"
                    invoiceDate="12 Jul 2024"
                    dueDate="27 Jul 2024"
                    amount="5,000.00"
                    status="Overdue"
                  />
                  <InvoiceRow
                    id="INV-00125"
                    customer="Quantum Solutions"
                    invoiceDate="10 Jul 2024"
                    dueDate="25 Jul 2024"
                    amount="20,000.00"
                    status="Unpaid"
                  />
                  <InvoiceRow
                    id="INV-00126"
                    customer="Apex Designs"
                    invoiceDate="05 Jul 2024"
                    dueDate="20 Jul 2024"
                    amount="8,500.00"
                    status="Draft"
                  />
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing 1 to 4 of 25 invoices
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="p-2"
                  disabled
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  className="px-4 py-2 text-sm font-medium"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium"
                >
                  3
                </Button>
                <Button variant="outline" size="icon" className="p-2">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 GST Invoicing Inc. All rights reserved.</p>
          <div className="mt-2">
            <a className="hover:text-primary" href="#">
              Terms of Service
            </a>
            <span className="mx-2">|</span>
            <a className="hover:text-primary" href="#">
              Privacy Policy
            </a>
            <span className="mx-2">|</span>
            <a className="hover:text-primary" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}