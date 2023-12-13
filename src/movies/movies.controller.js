const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { is_showing } = req.query;

  if (is_showing) {
    res.status(200).json({ data: await moviesService.listIsShowing() });
  } else {
    res.status(200).json({ data: await moviesService.list() });
  }
}

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await moviesService.read(movieId);

  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({
    status: 404,
    message: `Movie cannot be found.`,
  });
}

async function read(req, res, next) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function getTheaters(req, res) {
  const { movieId } = req.params;

  const result = await moviesService.getTheaters(movieId);
  res.json({ data: result });
}

async function getReviews(req, res) {
  const { movieId } = req.params;
  const reviews = await moviesService.getMovieReviews(movieId);
  const allReviews = [];
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const critic = await moviesService.getMovieCritics(review.critic_id);
    review.critic = critic[0];
    allReviews.push(review);
  }
  res.status(200).json({ data: allReviews})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  getTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(getTheaters),
  ],
  getReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getReviews)]
};
