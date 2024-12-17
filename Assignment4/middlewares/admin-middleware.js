module.exports = function(req, res, next) {
    if (!req.session.user || !req.session.user.role.includes("admin")) {
      return res.redirect("/"); // if not admin
    }
    next();
  };
  