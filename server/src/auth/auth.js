const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    //   get the token from the authorization header
    const access_token = await req.headers.authorization.split(" ")[1];
    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    // pass the user down to the endpoints here
    req.userInfo = user;

    // pass down functionality to the endpoint

    next();
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({
      error: error,
    });
  }
};
