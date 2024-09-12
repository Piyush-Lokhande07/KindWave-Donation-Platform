const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

dotenv.config();
const port = 3000;
const app = express();

// Initialize session middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: {
        secure: false, // In production, set to true if using HTTPS
        httpOnly: true, // Helps with security by not exposing cookies to the browser
        maxAge: 24 * 60 * 60 * 1000, // 24 hours session expiration
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Save the user profile (or a specific part of it)
    return done(null, profile);
}));

// Serialize and deserialize user to maintain authentication state
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3001', // Your frontend URL
    methods: ['GET', 'POST'],
    credentials: true // Allow cookies to be sent
}));

app.use(express.json());

// Set up your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

// Connect to PostgreSQL
const client = new Client({
    connectionString: process.env.DB_URL,
});

client.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
    })
    .catch(err => console.error('Connection error', err.stack));

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password, emailId } = req.body;

    if (!username || !password || !emailId) {
        return res.status(400).send('Username, password, and email are required');
    }

    try {
        const result = await client.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );

        // Send a confirmation email
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: emailId,
            subject: 'Registration Successful',
            text: 'Thank you for registering with us!'
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);

        if (err.code === '23505') {
            return res.status(400).send('Username already exists');
        }
        res.status(500).send('Server error');
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            res.status(200).json({
                message: 'Login successful',
                user: result.rows[0],
            });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    req.session.isAuthenticated = true; // Set session flag
    console.log("Session isAuthenticated callback:", req.session.isAuthenticated);
    res.redirect('http://localhost:3001'); // Redirect to frontend
});

// Check if user is authenticated
app.get('/auth/check', (req, res) => {
    console.log("Session isAuthenticated:", req.session.isAuthenticated);
    res.json({ isAuthenticated: req.session.isAuthenticated || false });
});

app.listen(port, () => {
    console.log(`The server is listening on port: ${port}`);
});
