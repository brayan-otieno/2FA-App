const express = require('express'); // Web framework for building the server
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const mongoose = require('mongoose'); // Object-Data-Modelling (ODM) for MongoDB
const speakeasy = require('speakeasy'); // For 2FA
const qrcode = require('qrcode'); // QR code library
require('dotenv').config(); // Loads environment variables from a .env file

// Creating an Express application
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the 2FA Application! Use /register to create a user and /login to authenticate.');
});

// Creating a MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected')) // Log success message
    .catch(err => console.log('MongoDB connection error:', err)); // Log connection error message

// Defining the user schema for MongoDB
const userSchema = new mongoose.Schema({
    username: String, // Username field
    password: String, // Password field
    secret: String, // 2FA secret
});

// Creating a User Model based on the schema
const User = mongoose.model('User', userSchema);

// Creating a simple registration form
app.get('/register', (req, res) => {
    res.send(`
        <form method="POST" action="/register">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    `);
});

// Creating a user registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body; // Extract username and password

    const secret = speakeasy.generateSecret(); // Generate a 2FA secret

    // Creating a new user with username, password, and 2FA secret
    const user = new User({ username, password, secret: secret.base32 });
    await user.save(); // Save the user to the database

    // Generating a QR code URL for the 2FA secret
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Respond with an HTML page containing the QR code
    res.send(`
        <html>
            <body>
                <h1>User registered successfully!</h1>
                <p>Scan this QR code with your authenticator app:</p>
                <img src="${qrCodeUrl}" alt="QR Code" />
                <p>Username: ${username}</p>
                <p>Password: ${password}</p>
            </body>
        </html>
    `);
});

// Creating a user login route
app.post('/login', async (req, res) => {
    const { username, password, token } = req.body; // Extract credentials from request body

    const user = await User.findOne({ username }); // Find the user by username

    // Check if the user exists
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' }); // Respond with error message    
    }

    // Verifying the provided 2FA token using the user's secret
    const verified = speakeasy.totp.verify({
        secret: user.secret, // Use the stored secret
        encoding: 'base32', // Specify the encoding
        token, // The token provided by the user
    });

    // Check if the 2FA token verification failed
    if (!verified) {
        return res.status(401).json({ message: 'Invalid 2FA token' }); // Respond with an error message
    }

    // Respond with a success message if login is successful
    res.json({ message: 'Login successful' });
});

// Start the server
const PORT = process.env.PORT || 3001; // Define the port to listen on
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log message indicating that the server is running
});
