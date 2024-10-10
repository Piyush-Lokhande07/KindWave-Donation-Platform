const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');


dotenv.config();
const port = 3000;
const app = express();
const crypto = require('crypto');


app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, 
    }
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true 
}));

app.use(express.json());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

const client = new Client({
    connectionString: process.env.DB_URL,
});

client.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
    })
    .catch(err => console.error('Connection error', err.stack));

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

app.post('/api/campaigns', async (req, res) => {
    const { title, description, accountNumber, donationAmount } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO donation_campaigns (title, description, account_number, donation_amount) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, accountNumber, donationAmount]
        );
        const campaignId = result.rows[0].id; 
        res.status(201).json({ campaignId }); 
    } catch (error) {
        console.error('Error inserting campaign:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/campaigns/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query(
            'SELECT * FROM donation_campaigns WHERE id = $1',
            [id]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]); 
        } else {
            res.status(404).json({ error: 'Campaign ID does not exist.' }); 
        }
    } catch (error) {
        console.error('Error retrieving campaign:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/order",async(req,res)=>{
    try{
        const razorpay = new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET,
        })
    
        const options  =req.body;
        const order =await razorpay.orders.create(options);
    
        if(!order){
            return res.status(500).send("Error");
        }
        res.json(order);

    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }
})

app.post('/order/validate',async(req,res)=>{
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;

    const sha =crypto.createHmac("sha256",process.env.KEY_SECRET);

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if(digest!==razorpay_signature){
        return res.status(400).json({msg:"Transaction is not legit!"})
    }

    res.json({
        msg:"Success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
})




app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    req.session.isAuthenticated = true; 
    console.log("Session isAuthenticated callback:", req.session.isAuthenticated);
    res.redirect('http://localhost:3001');
});


app.get('/auth/check', (req, res) => {
    console.log("Session isAuthenticated:", req.session.isAuthenticated);
    res.json({ isAuthenticated: req.session.isAuthenticated || false });
});

app.listen(port, () => {
    console.log(`The server is listening on port: ${port}`);
});
