const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
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
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// MySQL connection setup
const pool = mysql.createPool({
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8728307',
    password: 'y6RcfWXvnf',
    database: 'sql8728307',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
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

    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = { id: user.id, username: user.username };
                console.log('User logged in:', req.session.user);
                return res.redirect('/dashboard.html');
            }
        }
        res.send('Invalid credentials');
    });
});

// Protecting routes and fetching user-specific data
app.get('/dashboard.html', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }

    const userId = req.session.user.id;

    pool.query('SELECT * FROM expenses WHERE user_id = ?', [userId], (err, results) => {
        if (err) throw err;

        console.log('Fetching dashboard data for user:', req.session.user);
        res.render('dashboard', { expenses: results, user: req.session.user });
    });
});

// User Logout
app.get('/logout', (req, res) => {
    console.log('Logging out user:', req.session.user);
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.send('Logout failed');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/index.html');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
