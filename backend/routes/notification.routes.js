import express from 'express';
import Notification from '../models/notification.model.js'; // Adjust the path as needed

const router = express.Router();

// ✅ Create or Update Notification (Upsert)
router.post('/add-notification', async (req, res) => {
    const { message, timer, type } = req.body;

    try {
        const updated = await Notification.findByIdAndUpdate(
            'singleton',
            { message, timer, type },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Update failed' });
    }
});

// ✅ Get the current notification
router.get('/notification', async (req, res) => {
    try {
        const notification = await Notification.findById('singleton');
        if (!notification) {
            return res.status(200).json(null); // or return a default structure if needed
        }
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Delete the current notification
router.delete('/delete-notification', async (req, res) => {
    try {
        await Notification.findByIdAndDelete('singleton');
        res.status(204).send(); // No Content
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

export default router;
