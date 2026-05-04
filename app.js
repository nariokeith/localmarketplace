const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3001')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// 1) GLOBAL SECURITY MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting (Limits requests from same IP)
const limiter = rateLimit({
  max: 100, // Allow 100 requests per hour
  windowMs: 60 * 60 * 1000, 
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body. Also cookie parser.
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'price', 'priceDiscount', 'category', 'seller', 'name', 'postedDate'
  ]
}));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Local Marketplace API is running",
    frontend: process.env.FRONTEND_URL || "http://localhost:3001",
    documentation: "/api/v1/products"
  });
});

// 2) ROUTES
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

// Add 404 Not Found Errors Handler for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
