/* 
Request not found: returns 404 status update
*/
function notFound(req, res, next){
    next({
        status: 404,
        message: `${req.originalUrl} not found!`
    });
}

module.exports = notFound;