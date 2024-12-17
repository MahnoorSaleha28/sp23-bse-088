let User = require("../models/user.model");
// module.exports = async function (req, res, next) {
//   let defaultUser = await User.findOne({ email: "usman.akram@gmail.com" });
//   req.session.user = defaultUser;

//   res.locals.user = req.session.user;

//   req.user = req.session.user;
//   next();
// };
module.exports = function(req, res, next) {
    res.locals.user = req.session.user || null; // Make user data available in views
    next();
  };
  