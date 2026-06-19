const addLocalVariables = (req, res, next) => {
    res.locals.styles = [];

    res.addStyle = (style) => {
        res.locals.styles.push(style);
    };

    res.locals.isLoggedIn = false;
    res.locals.user = null;

    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.userRole = req.session.user.roleName;
        res.locals.user = req.session.user;
    }

    next();
};

export { addLocalVariables };