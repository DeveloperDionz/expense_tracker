# Expense Tracker Web App

## Project Description

The Expense Tracker Web App is a Node.js-based application designed to help users manage their expenses and track their budgets effectively. Initially intended to use MySQL, this project was adapted to use PostgreSQL to leverage serverless database hosting. The application allows users to register, log in, and manage their budget and expenses through an intuitive web interface.

## Features

- User registration and login
- Expense tracking
- Budget management
- Automatic calculation of remaining budget
- User-specific dashboards

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for Node.js
- **PostgreSQL**: Database for storing user and expense data
- **Sequelize**: ORM for managing PostgreSQL interactions

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure the database:
   - Create a `.env` file in the root directory with the following content:
     ```
     DB_HOST=your_postgresql_host
     DB_USER=your_postgresql_user
     DB_PASS=your_postgresql_password
     DB_NAME=your_postgresql_database
     ```

4. Run database migrations (if applicable):
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start the application:
   ```bash
   npm start
   ```

## Usage

- Navigate to `http://localhost:3000` in your web browser to access the application.
- Register a new account or log in with existing credentials.
- Manage your budget and track expenses through the provided interface.

## Deployed App

You can access the live version of the Expense Tracker Web App here https://expense-tracker-7w9h.onrender.com .

## Contributing

Feel free to open issues or submit pull requests to contribute to the project.

## Acknowledgements

- Node.js and Express.js for the server-side framework
- PostgreSQL and Sequelize for database management
