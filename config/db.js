const mongoose = require('mongoose');

const connectToDatabase = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://masomoplusadmin:Gudfather24571659@masomoplus1.is2q0.mongodb.net/?retryWrites=true&w=majority';

    if (!MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in the environment variables.');
        process.exit(1); // Exit process if MONGO_URI is not defined
    }

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: true, // Enable TLS/SSL connection
            tlsInsecure: true // Temporarily allow insecure certificates (only for testing purposes)
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process if unable to connect
    }
};

module.exports = connectToDatabase;
