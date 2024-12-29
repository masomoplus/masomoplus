const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentMethod: {
        type: String,
        default: 'M-Pesa',
        enum: ['M-Pesa', 'Other']
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Completed', 'Failed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
