// server/src/controllers/invoiceController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Invoice from '../models/Invoice';
import Client from '../models/Client'; // Needed if creating clients on the fly
import mongoose from 'mongoose';
// --- Create New Invoice ---
export const createInvoice = async (req: AuthRequest, res: Response) => {
    const {
        // Extract all fields from request body, matching the IInvoice interface
        invoiceNumber, invoiceDate, dueDate, status, notes,
        subtotal, cgstAmount, sgstAmount, igstAmount, total,
        clientId, // ID of an existing client
        // clientName, clientAddress, clientGstin, clientContact, // OR details to create a new client
        items
    } = req.body;

    // Basic Validation (add more as needed)
    if (!invoiceNumber || !invoiceDate || !dueDate || !clientId || !items || items.length === 0 || total === undefined || subtotal === undefined) {
        return res.status(400).json({ message: 'Missing required invoice fields' });
    }

    try {
        // Verify client exists for this business
        const clientExists = await Client.findOne({ _id: clientId, business: req.businessId });
        if (!clientExists) {
             return res.status(404).json({ message: 'Client not found for this business' });
        }

        // TODO: Add logic to check if invoiceNumber is unique for this business
        // You might need a helper function or pre-save hook in the model

        const newInvoice = new Invoice({
            invoiceNumber, invoiceDate, dueDate, status, notes,
            subtotal, cgstAmount, sgstAmount, igstAmount, total,
            client: clientId,
            items,
            business: req.businessId, // Link to the business from middleware
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);

    } catch (error: any) {
        console.error("Create Invoice Error:", error);
         // Handle potential duplicate key error for invoiceNumber
        if (error.code === 11000 && error.keyPattern?.invoiceNumber) {
            return res.status(400).json({ message: `Invoice number ${invoiceNumber} already exists for this business.` });
        }
        res.status(500).json({ message: 'Server error creating invoice' });
    }
};

// --- Get Invoices (History) ---
export const getInvoices = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // Items per page
    const status = req.query.status as string;
    const searchQuery = req.query.search as string;
    // TODO: Add date range filters

    const query: any = { business: req.businessId };

    if (status && status !== 'all') {
        query.status = status.toUpperCase(); // Match enum values
    }

    // Basic search (adjust as needed for better search across fields)
    if (searchQuery) {
        query.$or = [
            { invoiceNumber: { $regex: searchQuery, $options: 'i' } },
            // Add search by client name (requires populating client)
            // { 'client.name': { $regex: searchQuery, $options: 'i' } } // Need to adjust query if populating
        ];
         // Note: Searching populated fields directly in the main query is complex.
         // Often better to search client first, get IDs, then query invoices.
         // Or denormalize client name onto invoice (simpler but redundant).
    }

    try {
        const totalCount = await Invoice.countDocuments(query);
        const invoices = await Invoice.find(query)
            .populate('client', 'name') // Fetch client name along with invoice
            .sort({ invoiceDate: -1 }) // Sort by newest first
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            invoices,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        });

    } catch (error) {
        console.error("Get Invoices Error:", error);
        res.status(500).json({ message: 'Server error fetching invoices' });
    }
};

// --- Get Invoice Summary Stats --- (For Invoice History Page)
export const getInvoiceSummary = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await Invoice.aggregate([
            { $match: { business: new mongoose.Types.ObjectId(req.businessId) } }, // Match business
            {
                $group: {
                    _id: null, // Group all documents together
                    totalInvoiced: { $sum: '$total' },
                    totalPaid: {
                        $sum: { $cond: [{ $eq: ['$status', 'PAID'] }, '$total', 0] } // Sum only if status is PAID
                    }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id
                    totalInvoiced: 1,
                    totalPaid: 1,
                    totalOutstanding: { $subtract: ['$totalInvoiced', '$totalPaid'] } // Calculate outstanding
                }
            }
        ]);

        // If no invoices, aggregate returns empty array
        const summary = stats[0] || { totalInvoiced: 0, totalPaid: 0, totalOutstanding: 0 };

        res.json(summary);

    } catch (error) {
         console.error("Get Invoice Summary Error:", error);
        res.status(500).json({ message: 'Server error fetching invoice summary' });
    }
};

// --- Get Single Invoice ---
export const getInvoice = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    try {
        const invoice = await Invoice.findOne({ 
            _id: id, 
            business: req.businessId 
        }).populate('client', 'name address gstin contact');
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        
        res.json(invoice);
    } catch (error) {
        console.error("Get Invoice Error:", error);
        res.status(500).json({ message: 'Server error fetching invoice' });
    }
};

// --- Update Invoice ---
export const updateInvoice = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        // Remove fields that shouldn't be updated directly
        delete updateData.business;
        delete updateData._id;
        
        const invoice = await Invoice.findOneAndUpdate(
            { _id: id, business: req.businessId },
            updateData,
            { new: true, runValidators: true }
        ).populate('client', 'name address gstin contact');
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        
        res.json(invoice);
    } catch (error: any) {
        console.error("Update Invoice Error:", error);
        if (error.code === 11000 && error.keyPattern?.invoiceNumber) {
            return res.status(400).json({ message: `Invoice number ${updateData.invoiceNumber} already exists for this business.` });
        }
        res.status(500).json({ message: 'Server error updating invoice' });
    }
};

// --- Delete Invoice ---
export const deleteInvoice = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    try {
        const invoice = await Invoice.findOneAndDelete({ 
            _id: id, 
            business: req.businessId 
        });
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error("Delete Invoice Error:", error);
        res.status(500).json({ message: 'Server error deleting invoice' });
    }
};

// --- Get Dashboard Stats ---
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // Get overall stats
        const stats = await Invoice.aggregate([
            { $match: { business: new mongoose.Types.ObjectId(req.businessId) } },
            {
                $group: {
                    _id: null,
                    invoiceCount: { $sum: 1 },
                    totalInvoiced: { $sum: '$total' },
                    totalPaid: {
                        $sum: { $cond: [{ $eq: ['$status', 'PAID'] }, '$total', 0] }
                    },
                    totalCGST: { $sum: '$cgstAmount' },
                    totalSGST: { $sum: '$sgstAmount' },
                    totalIGST: { $sum: '$igstAmount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    invoiceCount: 1,
                    totalInvoiced: 1,
                    totalPaid: 1,
                    totalOutstanding: { $subtract: ['$totalInvoiced', '$totalPaid'] },
                    totalCGST: 1,
                    totalSGST: 1,
                    totalIGST: 1
                }
            }
        ]);

        // Get monthly data for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await Invoice.aggregate([
            {
                $match: {
                    business: new mongoose.Types.ObjectId(req.businessId),
                    invoiceDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$invoiceDate' },
                        month: { $month: '$invoiceDate' }
                    },
                    revenue: { $sum: '$total' },
                    invoiceCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            {
                                $cond: [
                                    { $lt: ['$_id.month', 10] },
                                    { $concat: ['0', { $toString: '$_id.month' }] },
                                    { $toString: '$_id.month' }
                                ]
                            }
                        ]
                    },
                    revenue: 1,
                    invoiceCount: 1
                }
            }
        ]);

        const summary = stats[0] || {
            invoiceCount: 0,
            totalInvoiced: 0,
            totalPaid: 0,
            totalOutstanding: 0,
            totalCGST: 0,
            totalSGST: 0,
            totalIGST: 0
        };

        res.json({
            ...summary,
            monthlyData
        });

    } catch (error) {
        console.error("Get Dashboard Stats Error:", error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};