const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // console.log("Signed cookies =", req.signedCookies);
    // console.log("Unsigned cookies =", req.cookies);

    const { login_token } = req.signedCookies;
    // console.log("Token =", login_token);

    if (!login_token) {
      return res.status(404).json({ msg: 'Token not found' });
    }

    // Synchronous token verification
    const decoded = jwt.verify(login_token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log(req.userId)
   
    next();
  } catch (err) {
    return res.status(401).json({ msg: err.message });
   
  }
};

module.exports = protect;
