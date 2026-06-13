const addLocalVariables = (req, res, next) => {
    res.locals.styles = [];

    res.addStyle = (style) => {
        res.locals.styles.push(style);
    };

    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.userRole = req.session.user.roleName;
    }

    next();
};

export { addLocalVariables };