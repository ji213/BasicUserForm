// This script uses the 'mssql' package to connect to a SQL Server database.
// To run this, you'll need to have Node.js and npm installed.
// First, initialize a new project and install the 'mssql' package:
// npm init -y
// npm install mssql

const sql = require('mssql');

// Replace these values with your actual connection parameters from the .env file.
// The example below is structured to work with a local SQL Express instance using Windows Authentication.
const config = {
    user: 'your_user_name', // e.g., 'SSMS_User'
    password: 'your_password', // e.g., 'YourPassword123'
    server: 'your_server_name\\SQLEXPRESS', // e.g., 'LOCALHOST\\SQLEXPRESS'
    database: 'your_database_name', // e.g., 'TestDB'
    port: 1433, // Default port for SQL Server
    options: {
        trustedConnection: true, // Use this for Windows Authentication
        trustServerCertificate: true, // Required for self-signed certificates, such as those used by default with SSMS
        encrypt: false // Set to true if you are connecting to a server with encryption enabled
    }
};

async function testConnectionAndQuery() {
    let pool;
    try {
        // Attempt to connect to the database
        pool = await sql.connect(config);
        console.log('✅ Successfully connected to the SQL Server database!');

        // Create a new request and execute the query
        const result = await pool.request()
            .query('SELECT * FROM information_schema.tables');

        console.log('\nQuery executed successfully! Here are the results:');
        console.table(result.recordset);

    } catch (err) {
        // Log any errors that occur during the process
        console.error('❌ An error occurred:', err);
    } finally {
        // Ensure the connection pool is closed, even if an error occurred
        if (pool) {
            await pool.close();
            console.log('\nConnection to the database has been closed.');
        }
    }
}

// Call the main function to start the process
testConnectionAndQuery();