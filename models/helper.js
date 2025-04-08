
function loggedIn(req, res, next) {
    if (!req.session.userId) {
        return false;
    }
    return true;
}

module.exports = loggedIn;