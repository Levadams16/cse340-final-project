const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        next();
    } else {
        req.flash('error', 'You must be logged in to access this page.');
        res.redirect('/login');
    }
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }
        if (!roles.includes(req.session.user.roleName)) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }
        next();
    };
};

export { requireLogin, requireRole };