// test.js
// Test js script to build API from ground up


// lets test just the db connectivity



const sql = require('mssql');

// load connection variables from .env file
require('dotenv').config();

// init dbconfig

const dbconfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    driver: process.env.DB_DRIVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433, //DEFAULTS to port 1433 if not specified
    options: {
        trustedConnection: process.env.TRUSTED_CONNECTION === 'true',
        trustedServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === 'true',
        encrypt: process.env.ENCRYPT === 'true'
    }
}

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustedConnection: process.env.TRUSTED_CONNECTION === 'true', // Set to true if using Windows Authentication
    trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === 'true', // Set to true if using self-signed certificates
  },
  driver: process.env.DB_DRIVER, // Required if using Windows Authentication
};

async function testConnectionAndQuery(){
    let pool;
    try{
        //Attempt to connect to the db
        console.log('Connecting to db... please wait...')
        pool = await sql.connect(dbconfig);
        console.log('✅ Successfully connected to the SQL Server database!')

        // once connection is acheived we can add a query block here
    } catch (err) {
        // Log error information
        console.error('AN ERROR OCCURRED in Connectivity Test... ', err);
    } finally {
        // Ensure the connection pool is closed, regardless of error
        if (pool){
            await pool.close();
            console.log('\n DB Connection Closed');
        }
    }
}

testConnectionAndQuery();