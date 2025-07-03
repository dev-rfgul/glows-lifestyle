import express from 'express';
import Notification from "../models/notification.model";


const router = express.Router();

router.get('/getNotification', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/addNotification', async (req, res) => {
    const { message, timer, type } = req.body;

    if (!message || !timer || !type) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newNotification = new Notification({
            message,
            timer,
            type
        });

        await newNotification.save();
        res.status(201).json({ message: 'Notification added successfully' });
    } catch (error) {
        console.error('Error adding notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
