const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

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

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '3641Dionz.', // replace with your MySQL password
    database: 'budget_tracker'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
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

    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
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
        res.redirect('/login.html');
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
