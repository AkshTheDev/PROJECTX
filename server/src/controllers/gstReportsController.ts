// server/src/controllers/gstReportsController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Invoice from '../models/Invoice';
import mongoose from 'mongoose';

// --- Get GST Summary Report ---
export const getGstSummary = async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;

    try {
        const matchStage: any = { business: new mongoose.Types.ObjectId(req.businessId) };
        
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
export const getGstRateWiseReport = async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;

    try {
        const matchStage: any = { business: new mongoose.Types.ObjectId(req.businessId) };
        
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
export const getMonthlyGstReport = async (req: AuthRequest, res: Response) => {
    const { year } = req.query;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    try {
        const monthlyReport = await Invoice.aggregate([
            {
                $match: {
                    business: new mongoose.Types.ObjectId(req.businessId),
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
