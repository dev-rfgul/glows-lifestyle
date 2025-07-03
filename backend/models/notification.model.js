import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    _id: {
        type: String,
        default: 'singleton'
    },
    message: {
        type: String,
        required: true
    },
    timer: {
        type: Number,
        default: 3000
    },
    type: {
        type: String,
        enum: ['info', 'sale', 'warning'],
        default: 'info'
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
