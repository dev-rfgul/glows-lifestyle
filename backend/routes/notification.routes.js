import express from 'express';
import Notification from '../models/notification.model.js'; // Adjust the path as needed

const router = express.Router();

// ✅ Create or Update Notification (Upsert)
router.post('/notification', async (req, res) => {
    try {
        const { message, type, timer } = req.body;
        const notification = await Notification.findByIdAndUpdate(
            'singleton',
            { message, type, timer },
            { upsert: true, new: true }
        );
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create or update notification' });
    }
});

// ✅ Get the current notification
router.get('/notification', async (req, res) => {
    try {
        const notification = await Notification.findById('singleton');
        if (!notification) return res.status(404).json({ message: 'No notification set' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get notification' });
    }
});

// ✅ Delete the current notification
router.delete('/notification', async (req, res) => {
    try {
        const deleted = await Notification.findByIdAndDelete('singleton');
        if (!deleted) return res.status(404).json({ message: 'No notification to delete' });
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

export default router;
