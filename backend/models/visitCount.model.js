import mongoose from 'mongoose'

const visitCounterSchema = new mongoose.Schema({
    globalVisitCount: {
        type: Number,
    },
})

const visitCounter = mongoose.model("VisitCounter", visitCounterSchema)

export default visitCounter;