const sql = require('mssql');

const config = {
  server: "JI_Yoga1\\SQLEXPRESS",
  database: "locaLdb",
  options: {
    trustedConnection: true, // Set to true if using Windows Authentication
    trustServerCertificate: true, // Set to true if using self-signed certificates
  },
  driver: "ODBC Driver 17 for SQL Server", // Required if using Windows Authentication
};

(async () => {
  try {
    await sql.connect(config);
    const result = await sql.query`select TOP 10 * from INFORMATION_SCHEMA.tables`;
    console.dir(result);
  } catch (err) {
    console.error(err);
  }
})();