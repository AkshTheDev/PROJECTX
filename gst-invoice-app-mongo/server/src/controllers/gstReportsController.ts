// server/src/controllers/gstReportsController.ts
import { Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Invoice from '../models/Invoice';
import mongoose from 'mongoose';

// --- Get GST Summary Report ---
export const getGstSummary: RequestHandler = async (req, res) => {
    const { businessId } = (req as AuthRequest);
    const { startDate, endDate } = req.query;

    try {
    const matchStage: any = { business: new mongoose.Types.ObjectId(businessId) };
        
        // Add date filter if provided
        if (startDate || endDate) {
            matchStage.invoiceDate = {};
            if (startDate) matchStage.invoiceDate.$gte = new Date(startDate as string);
            if (endDate) matchStage.invoiceDate.$lte = new Date(endDate as string);
        }

        const gstSummary = await Invoice.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$subtotal' },
                    totalCGST: { $sum: '$cgstAmount' },
                    totalSGST: { $sum: '$sgstAmount' },
                    totalIGST: { $sum: '$igstAmount' },
                    totalGST: { $sum: { $add: ['$cgstAmount', '$sgstAmount', '$igstAmount'] } },
                    totalAmount: { $sum: '$total' },
                    invoiceCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSales: 1,
                    totalCGST: 1,
                    totalSGST: 1,
                    totalIGST: 1,
                    totalGST: 1,
                    totalAmount: 1,
                    invoiceCount: 1
                }
            }
        ]);

        const summary = gstSummary[0] || {
            totalSales: 0,
            totalCGST: 0,
            totalSGST: 0,
            totalIGST: 0,
            totalGST: 0,
            totalAmount: 0,
            invoiceCount: 0
        };

        res.json(summary);
    } catch (error) {
        console.error("Get GST Summary Error:", error);
        res.status(500).json({ message: 'Server error fetching GST summary' });
    }
};

// --- Get GST Rate-wise Report ---
export const getGstRateWiseReport: RequestHandler = async (req, res) => {
    const { businessId } = (req as AuthRequest);
    const { startDate, endDate } = req.query;

    try {
    const matchStage: any = { business: new mongoose.Types.ObjectId(businessId) };
        
        // Add date filter if provided
        if (startDate || endDate) {
            matchStage.invoiceDate = {};
            if (startDate) matchStage.invoiceDate.$gte = new Date(startDate as string);
            if (endDate) matchStage.invoiceDate.$lte = new Date(endDate as string);
        }

        const gstRateReport = await Invoice.aggregate([
            { $match: matchStage },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.gstRate',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalAmount: { $sum: '$items.amount' },
                    itemCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    gstRate: '$_id',
                    totalQuantity: 1,
                    totalAmount: 1,
                    itemCount: 1
                }
            },
            { $sort: { gstRate: 1 } }
        ]);

        res.json(gstRateReport);
    } catch (error) {
        console.error("Get GST Rate-wise Report Error:", error);
        res.status(500).json({ message: 'Server error fetching GST rate-wise report' });
    }
};

// --- Get Monthly GST Report ---
export const getMonthlyGstReport: RequestHandler = async (req, res) => {
    const { businessId } = (req as AuthRequest);
    const { year } = req.query;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    try {
        const monthlyReport = await Invoice.aggregate([
            {
                $match: {
                    business: new mongoose.Types.ObjectId(businessId),
                    invoiceDate: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$invoiceDate' },
                    totalSales: { $sum: '$subtotal' },
                    totalCGST: { $sum: '$cgstAmount' },
                    totalSGST: { $sum: '$sgstAmount' },
                    totalIGST: { $sum: '$igstAmount' },
                    totalAmount: { $sum: '$total' },
                    invoiceCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    totalSales: 1,
                    totalCGST: 1,
                    totalSGST: 1,
                    totalIGST: 1,
                    totalAmount: 1,
                    invoiceCount: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        // Fill in missing months with zero values
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const completeReport = monthNames.map((monthName, index) => {
            const monthData = monthlyReport.find(item => item.month === index + 1);
            return {
                month: index + 1,
                monthName,
                totalSales: monthData?.totalSales || 0,
                totalCGST: monthData?.totalCGST || 0,
                totalSGST: monthData?.totalSGST || 0,
                totalIGST: monthData?.totalIGST || 0,
                totalAmount: monthData?.totalAmount || 0,
                invoiceCount: monthData?.invoiceCount || 0
            };
        });

        res.json(completeReport);
    } catch (error) {
        console.error("Get Monthly GST Report Error:", error);
        res.status(500).json({ message: 'Server error fetching monthly GST report' });
    }
};

// --- Get GST Detailed Invoices (for report table) ---
export const getGstDetails: RequestHandler = async (req, res) => {
    const { businessId } = (req as AuthRequest);
    const { startDate, endDate, search } = req.query;

    try {
    const matchStage: any = { business: new mongoose.Types.ObjectId(businessId) };

        if (startDate || endDate) {
            matchStage.invoiceDate = {};
            if (startDate) matchStage.invoiceDate.$gte = new Date(startDate as string);
            if (endDate) matchStage.invoiceDate.$lte = new Date(endDate as string);
        }

        // Basic search on invoiceNumber; could be extended to client name via lookup or populate + filter
        if (search && typeof search === 'string' && search.trim().length > 0) {
            matchStage.invoiceNumber = { $regex: search.trim(), $options: 'i' };
        }

        const invoices = await Invoice.find(matchStage)
            .populate('client', 'name')
            .sort({ invoiceDate: -1 })
            .select('invoiceNumber invoiceDate subtotal cgstAmount sgstAmount igstAmount total client');

        const rows = invoices.map((inv) => ({
            id: (inv as any)._id.toString(),
            invoiceNumber: (inv as any).invoiceNumber,
            date: (inv as any).invoiceDate,
            customer: ((inv as any).client?.name) || 'Unknown',
            taxableAmount: (inv as any).subtotal || 0,
            cgst: (inv as any).cgstAmount || 0,
            sgst: (inv as any).sgstAmount || 0,
            igst: (inv as any).igstAmount || 0,
            total: (inv as any).total || 0,
        }));

        res.json(rows);
    } catch (error) {
        console.error('Get GST Details Error:', error);
        res.status(500).json({ message: 'Server error fetching GST details' });
    }
};
