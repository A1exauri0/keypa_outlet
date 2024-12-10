// middleware/isAuthenticated.js

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        // Si hay datos en la sesión (usuario autenticado), continuamos con la solicitud
        return next();
    }
    // Si no hay usuario autenticado, redirige al login
    res.redirect('/login');
}

module.exports = isAuthenticated;
