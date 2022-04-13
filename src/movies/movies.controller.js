const service = require('./movies.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

// Depending on request; Returns list of all movies or all movies currently showing
async function list(req, res) {
    let data
    const { is_showing } = req.query
    if (is_showing === "true") {
      data = await service.listMoviesShowing()
    } else {
      data = await service.list()
    } res.json({ data });
};

// Returns information regarding movie based on Movie_id, if unable throws 404 status
async function movieExists(req, res, next) {
    const { movieId } = req.params
    const data = await service.read(movieId)
    if (data) {
        res.locals.movie = data
        return next()
    } next({
        status: 404,
        message: "Movie cannot be found."
    });
};

// Returns information on requested movie
async function read(req, res) {
    res.json({ data: res.locals.movie })
};

// Returns all theaters showing requested movie_id
async function listTheaters(req, res) {
    const { movie } = res.locals;
    const data = await service.listTheaters(movie.movie_id);
    res.json({ data });
};

// Returns all reviews for requested movie_id
async function listReviews(req, res) {
    const { movie } = res.locals
    const data = await service.listReviews(movie.movie_id);
    res.json({ data });
};

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)]
}