import mongoose from 'mongoose';

const notificationSchema=new Schema({
    message: {
        type: String,
        required: true
    },
    timer:{
        type: Number,
        default: 3000 // Default to 3 seconds
    },
    type:{
        type: String,
        enum: ['info', 'sale', 'warning',],
        default: 'info' // Default type
    }

})
const Notification=mongoose.model('Notification',notificationSchema);
export default Notification;