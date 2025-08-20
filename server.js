// server.js
// This script creates a simple web server using Node.js's built-in http module.
// It serves an HTML form and handles a POST request to insert data into
// a Microsoft SQL Server database.

// First, you need to install the required packages:
// npm init -y
// npm install mssql dotenv


const http = require('http');
const url = require('url');
const mssql = require('mssql/msnodesqlv8')
require('dotenv').config();  // Load .env variables

// Define the SQL Server connection configuration using environment variables.
// putting DB_SERVER config in connection string directly from the .env file causes an issue if it has '\\'
const dbserver = process.env.DB_SERVER.replace(/\\\\/g, '\\');


const connectionString = `Driver={${process.env.DB_DRIVER}};Server=${dbserver};Database=${process.env.DB_DATABASE};Trusted_Connection=${process.env.TRUSTED_CONNECTION};`;

const dbConfig = {
  connectionString: connectionString,
  driver: 'msnodesqlv8'
};

const port = process.env.SERVER_PORT;

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);

  // --- Handle GET requests to serve the HTML form ---
  // Builds out HTML logic for the form request
  if (req.method === 'GET' && reqUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Registration</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f0f2f5; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
          h1 { text-align: center; color: #333; margin-bottom: 1.5rem; }
          form div { margin-bottom: 1rem; }
          label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
          input, select { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
          input:focus, select:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.25); }
          button { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; background-color: #007bff; color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
          button:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Register New User</h1>
          <form action="/submit" method="POST">
            <div>
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" required>
            </div>
            <div>
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" required>
            </div>
            <div>
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" required>
            </div>
              <label for="birthdate">Birthdate</label>
              <input type="date" id="birthdate" name="birthdate" required>
            <div>
            </div>
            <div>
              <label for="gender">Gender</label>
              <select id="gender" name="gender" required>
                <option value="">--Select Gender--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // --- Handle POST requests from the form submission ---
  if (req.method === 'POST' && reqUrl.pathname === '/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Collect the data chunks
    });

    req.on('end', async () => {
      // Parse the URL-encoded form data
      const params = new URLSearchParams(body);
      const firstName = params.get('firstName');
      const lastName = params.get('lastName');
      const email = params.get('email');
      const gender = params.get('gender');
      const birthdate = params.get('birthdate');

      try {
        // Connect to the SQL Server
        const pool = await mssql.connect(dbConfig);
        const request = pool.request();

        // Use a parameterized query to prevent SQL injection attacks.
        request.input('firstName', mssql.NVarChar, firstName);
        request.input('lastName', mssql.NVarChar, lastName);
        request.input('email', mssql.NVarChar, email);
        request.input('gender', mssql.NVarChar, gender);
        request.input('birthdate', mssql.NVarChar, birthdate);

        // Define the SQL INSERT statement. Make sure the table `dbo.tbl_User_Form`
        // and its columns exist in your database.
        const insertQuery = `
          INSERT INTO dbo.tbl_User_Form (FirstName, LastName, Email, Gender, Birthdate)
          VALUES (@firstName, @lastName, @email, @gender, CAST(@birthdate AS DATE))
        `;

        // Execute the query
        await request.query(insertQuery);
        console.log('Data successfully inserted into the database.');

        // Close the connection
        pool.close();

        // Send a success response back to the user
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Submission Successful!</h1><p>Thank you for registering.</p><a href="/">Go back</a>');

      } catch (err) {
        // Handle any errors during the database connection or query
        console.error('Database operation failed:', err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>An error occurred.</h1><p>Please try again later.</p>');
      }
    });
    return;
  }

  // --- Handle 404 Not Found for all other requests ---
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1>');
});

// Start the server and listen for incoming requests
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});