var jwt = require("jsonwebtoken");
const JWT_SECRET = "Ahmadisgoodb$oy";

//jab ham ya kr rahyn ho gy tab header k ander ya ("auth-token") ay ga or value k ander wo token("sdfsdfhdjkbgdfjk......") ay ga jo hamy milta h .Actual ma ham us token ko user ki id ma transfer kr rahy h
const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  const token = req.header("auth-token"); //is ma token ma apny header se ly kr aun ga.or jab apni reqst ko bhyjun ga to is header ('auth-token) ky name se bhyjun ga
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  } else {
    try {
      const data = jwt.verify(token, JWT_SECRET); //ham is JWT_SECRET hash k sath verify kr ky dekhy gy ky kiya ya match ho rha h ya ni
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }
  }
};

module.exports = fetchuser;
