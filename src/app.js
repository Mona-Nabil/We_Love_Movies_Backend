if (process.env.USER) require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router")
// const notFound = require("./errors/notFoundHandler");
// const errorHandler = require("./errors/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

// app.use("/", router);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter)


// app.use(notFound);
// app.use(errorHandler);
// Not-found handler
app.use((request, _response, next) => {
  next({ status: 404, message: `Not found: ${request.originalUrl}` });
});

// Error handler
app.use((error, _request, response, _next) => {
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;
