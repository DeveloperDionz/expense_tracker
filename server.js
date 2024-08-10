const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// PostgreSql connection setup
const pool = new Pool({
    connectionString: 'postgresql://root:zMxf74EyitnXV0jD563ogDl4Q1BroWBC@dpg-cqrpb7lumphs73colb60-a.singapore-postgres.render.com/budget_tracker_m462',
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to PostgreSQL');
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword], (err) => {
        if (err) {
            console.error(err);
            return res.send('User registration failed');
        }
        res.redirect('/login.html');
    });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = $1', [username], async (err, results) => {
        if (err) throw err;

        if (results.rows.length > 0) {
            const user = results.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = user;
                return res.redirect('/dashboard.html');
            }
        }
        res.send('Invalid credentials');
    });
});

// User Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/index.html');
    });
});

// Protecting routes
app.get('/dashboard.html', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
