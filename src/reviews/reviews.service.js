const knex = require("../db/connection");

async function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

function read(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).first();
}

async function list(movie_id) {
  return knex("reviews")
    .where({ movie_id })
    .then((reviews) => Promise.all(reviews.map(getReviewsWithCritic)));
}

async function getCritics(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function getReviewsWithCritic(review) {
  review.critic = await getCritics(review.critic_id);
  return review;
}

async function update(review) {
  return knex("reviews")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(getReviewsWithCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
