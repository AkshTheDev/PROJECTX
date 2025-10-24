// src/components/CreateInvoiceScreen.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  LayoutDashboard,
  Receipt,
  Users,
  Package,
  BarChart,
  Settings,
  HelpCircle,
  Mail,
  PlusCircle,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker"; // Assuming you have a DatePicker component from shadcn

export function CreateInvoiceScreen() {
  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row bg-background-light dark:bg-background-dark text-[#111618] dark:text-white">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-background-dark border-r border-[#dbe2e6] dark:border-[#2a3c46]">
        <div className="flex flex-col gap-4 p-4 h-full">
          <div className="flex items-center gap-3">
            <img
              src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/invoice_creation/logo.png"
              alt="Modern Invoicer Logo"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col">
              <h1 className="text-base font-medium">Modern Invoicer</h1>
              <p className="text-[#617c89] dark:text-[#a0b8c3] text-sm">
                GST Invoicing
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg"
            >
              <LayoutDashboard className="h-5 w-5" />
              <p className="text-sm font-medium">Dashboard</p>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg bg-primary/20 dark:bg-primary/30 text-primary"
            >
              <Receipt className="h-5 w-5" />
              <p className="text-sm font-medium">Invoices</p>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg"
            >
              <Users className="h-5 w-5" />
              <p className="text-sm font-medium">Customers</p>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg"
            >
              <Package className="h-5 w-5" />
              <p className="text-sm font-medium">Products</p>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg"
            >
              <BarChart className="h-5 w-5" />
              <p className="text-sm font-medium">Reports</p>
            </Button>
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <Button className="h-10 text-sm font-bold">New Invoice</Button>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg"
              >
                <Settings className="h-5 w-5" />
                <p className="text-sm font-medium">Settings</p>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-3 py-2 rounded-lg"
              >
                <HelpCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Help</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.033em]">
              Create New Invoice
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="secondary"
                className="h-10 px-4 text-sm font-medium"
              >
                Save as Draft
              </Button>
              <Button className="h-10 px-4 text-sm font-bold">
                Generate PDF
              </Button>
              <Button className="flex items-center gap-2 h-10 px-4 text-sm font-bold bg-primary/80 hover:bg-primary">
                <Mail className="h-4 w-4" />
                <span>Send</span>
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Customer & Invoice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm space-y-4">
                <h2 className="text-xl font-bold mb-4">
                  Customer Information
                </h2>
                <div className="space-y-2">
                  <label htmlFor="customerName" className="font-medium">
                    Customer Name
                  </label>
                  <Input
                    id="customerName"
                    placeholder="Search or add new customer"
                    defaultValue="Ananya Sharma"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="font-medium">
                    Address
                  </label>
                  <Textarea
                    id="address"
                    placeholder="Enter customer's address"
                    defaultValue="123, Maple Street, Bengaluru, Karnataka, 560001"
                    className="min-h-24"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="gstin" className="font-medium">
                      GSTIN
                    </label>
                    <Input
                      id="gstin"
                      defaultValue="29ABCDE1234F1Z5"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact" className="font-medium">
                      Contact No.
                    </label>
                    <Input
                      id="contact"
                      defaultValue="+91 98765 43210"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm space-y-4">
                <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
                <div className="space-y-2">
                  <label htmlFor="invoiceNumber" className="font-medium">
                    Invoice Number
                  </label>
                  <Input
                    id="invoiceNumber"
                    defaultValue="INV-2024-00123"
                    className="h-12"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="invoiceDate" className="font-medium">
                      Invoice Date
                    </label>
                    <DatePicker /> {/* Replace with actual DatePicker */}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dueDate" className="font-medium">
                      Due Date
                    </label>
                    <DatePicker /> {/* Replace with actual DatePicker */}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white dark:bg-background-dark p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Items</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/5">Item Description</TableHead>
                      <TableHead>HSN/SAC</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>GST %</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Input
                          defaultValue="Web Design Services"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          defaultValue="998314"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue="1"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue="50000"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="18%">
                          <SelectTrigger className="border-0 bg-transparent p-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5%">5%</SelectItem>
                            <SelectItem value="12%">12%</SelectItem>
                            <SelectItem value="18%">18%</SelectItem>
                            <SelectItem value="28%">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">₹59,000.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Input
                          defaultValue="Domain & Hosting"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          defaultValue="998315"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue="1"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue="8000"
                          className="border-0 bg-transparent p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="18%">
                          <SelectTrigger className="border-0 bg-transparent p-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5%">5%</SelectItem>
                            <SelectItem value="12%">12%</SelectItem>
                            <SelectItem value="18%">18%</SelectItem>
                            <SelectItem value="28%">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">₹9,440.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <Button
                variant="link"
                className="flex items-center gap-2 mt-4 text-primary font-medium p-0"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Add Item</span>
              </Button>
            </div>

            {/* Notes & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Notes</h2>
                <Textarea
                  placeholder="Add any terms, conditions, or notes here."
                  defaultValue="Payment is due within 15 days. Thank you for your business!"
                  className="min-h-24"
                />
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[#617c89] dark:text-[#a0b8c3]">
                    <span>Subtotal</span>
                    <span>₹58,000.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[#617c89] dark:text-[#a0b8c3]">
                    <span>CGST (9%)</span>
                    <span>₹5,220.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[#617c89] dark:text-[#a0b8c3]">
                    <span>SGST (9%)</span>
                    <span>₹5,220.00</span>
                  </div>
                  <div className="border-t border-[#dbe2e6] dark:border-[#2a3c46] my-2"></div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Grand Total</span>
                    <span>₹68,440.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}