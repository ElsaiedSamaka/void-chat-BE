// Load environment variables from .env file
require("dotenv").config();

// Import necessary libraries
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const socketio = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const session = require("express-session");
// Import routes and database models
const authRouter = require( "./app/routes/auth.routes" );
const usersRouter = require("./app/routes/users.routes")
const db = require("./app/models");
const setupSocket = require("./app/socketio/socket.io");
// Create a new Express app instance
const app = express();

// Set up rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  headers: true, // Return rate limit info in the headers
});

// Apply rate limiting middleware to all requests
app.use(limiter);
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
// Set up Passport.js middleware for authentication
require("./app/utils/passport");
app.use(passport.initialize());
app.use( passport.session() );

// Set up Swagger documentation
const swaggerDocument = require("./app/helper/swaggerDocument");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable cross-origin requests
app.use( cors(
  {origin:"http://localhost:4200",credentials:true}
));

// Set up error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// Set headers to allow certain HTTP methods and credentials
app.use( ( req, res, next ) => {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header( "Access-Control-Allow-Credentials", true );
  next();
});

// Synchronize database models with database schema
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error(err);
  });

// Define a simple route for testing purposes
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the server");
});

// Set up routes for handling authentication
app.use( "/api/auth", authRouter );
app.use("/api/users",usersRouter)

// Define the port to listen on
const PORT = process.env.NODE_APP_PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up a Socket.IO server for real-time communication
setupSocket(server)