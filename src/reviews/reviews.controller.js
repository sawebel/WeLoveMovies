const service = require('./reviews.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

// Checks if Review_id exists, if not throws error
async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId)
    if (review) {
        res.locals.review = review
        return next()
    }
    next({ 
        status: 404, 
        message: 'Review cannot be found.'
    });
};

// Handles Update function for reviews
async function update(req, res) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    }
    const data = await service.update(updatedReview)
    res.json({ data })
}

// Handles Read function for reviews
async function read(req, res) {
    res.json({ data: res.locals.review })
}

// Handles Delete function for reviews
async function destroy(req, res) {
    const { review } = res.locals
    await service.delete(review.review_id)
    res.sendStatus(204)
}

module.exports = {
    read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}