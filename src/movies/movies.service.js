const knex = require('../db/connection')
const mapProperties = require('../utils/map-properties')

const criticInfo =
mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
})

// Selects all Movies in DB
function list() {
    return knex('movies')
    .select('*')
}

// Selects all movies currently showing in DB
function listMoviesShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true })
    .orderBy("m.movie_id");
}

// Returns First movie that matches requested Movie_id
function read(movie_id) {
    return knex('movies')
        .where({ movie_id })
        .first()
}

// Selects all Theaters that are showing movie based on requested Movie_id
function listTheaters(movie_id) {
    return knex("movies as m")
      .join('movies_theaters as mt', 'mt.movie_id', 'm.movie_id')
      .join('theaters as t', 't.theater_id', 'mt.theater_id')
      .select('t.*')
      .where({ "m.movie_id": movie_id })
}

// Select all Reviews and Critic Information for specified movie based on requested Movie_id
function listReviews(movie_id) {
    return knex("movies as m")
      .join('reviews as r', 'r.movie_id', 'm.movie_id')
      .join('critics as c', 'c.critic_id', 'r.critic_id')
      .where({ 'm.movie_id': movie_id })
      .select('*')
      .then((reviews) => reviews.map(criticInfo));
};

module.exports = { 
    list,
    listMoviesShowing,
    read,
    listTheaters,
    listReviews
}
