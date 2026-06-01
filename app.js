const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const path = require("path");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3001')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);


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

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, 
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({
  whitelist: [
    'price', 'priceDiscount', 'category', 'seller', 'name', 'postedDate'
  ]
}));

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

app.use(express.static(path.join(__dirname, 'client/out')));

app.all('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  } else {
    res.sendFile(path.join(__dirname, 'client/out/index.html'));
  }
});

app.use(globalErrorHandler);

module.exports = app;
