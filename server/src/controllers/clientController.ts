// server/src/controllers/clientController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Client from '../models/Client';

// --- Create New Client ---
export const createClient = async (req: AuthRequest, res: Response) => {
    const { name, address, gstin, contact } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Client name is required' });
    }

    try {
        const newClient = new Client({
            name,
            address,
            gstin,
            contact,
            business: req.businessId,
        });

        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        console.error("Create Client Error:", error);
        res.status(500).json({ message: 'Server error creating client' });
    }
};

// --- Get All Clients ---
export const getClients = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const searchQuery = req.query.search as string;

    const query: any = { business: req.businessId };

    if (searchQuery) {
        query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { gstin: { $regex: searchQuery, $options: 'i' } },
            { contact: { $regex: searchQuery, $options: 'i' } },
        ];
    }

    try {
        const totalCount = await Client.countDocuments(query);
        const clients = await Client.find(query)
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            clients,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        });
    } catch (error) {
        console.error("Get Clients Error:", error);
        res.status(500).json({ message: 'Server error fetching clients' });
    }
};

// --- Get Single Client ---
export const getClient = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const client = await Client.findOne({ 
            _id: id, 
            business: req.businessId 
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error("Get Client Error:", error);
        res.status(500).json({ message: 'Server error fetching client' });
    }
};

// --- Update Client ---
export const updateClient = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Remove fields that shouldn't be updated directly
        delete updateData.business;
        delete updateData._id;

        const client = await Client.findOneAndUpdate(
            { _id: id, business: req.businessId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error("Update Client Error:", error);
        res.status(500).json({ message: 'Server error updating client' });
    }
};

// --- Delete Client ---
export const deleteClient = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const client = await Client.findOneAndDelete({ 
            _id: id, 
            business: req.businessId 
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error("Delete Client Error:", error);
        res.status(500).json({ message: 'Server error deleting client' });
    }
};
