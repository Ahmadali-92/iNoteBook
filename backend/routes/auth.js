const express = require("express");
const User = require("../models/User"); //User.js ko import kr rhy hn
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //password protect k liya
const jwt = require("jsonwebtoken"); //user ko jo aik token dy gy us ky darmiyan layer k liya or protection k liya jwt
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Ahmadisgoodb$oy";

//(Route 1):(1st endpoint)create a user Using :POST "/api/auth/createuser". No login require
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter atleast 5 charactors").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors,return Bad reqest and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      //Cheack weather the user with same email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exist",
        });
      }
      
      //password protected with the use of salt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      //create jwt protection (jo token dy ga)
      const data = {
        user: {
          id: user.id,
        },
      };

      let authtoken = jwt.sign(data, JWT_SECRET); //data,secret number h jo ap na secret rakha h
      // res.json(user )
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      //Some error found then show this error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//(Route 2):(2nd endpoint)Authenticate a user Using :POST "/api/auth/login". No login require
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors,return Bad reqest and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body; //req.body se email or password nikala h bhr
    try {
      let user = await User.findOne({ email }); //email or password dono dekhy ga k corrct hy ya ni h
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login correct email creditionals",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password); //dala hoa password,or jo phly se h password dono ko match kary ga
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login correct password creditionals",
        });
      }
      //create jwt protection (jo token dy ga)
      const data = {
        user: {
          id: user.id,
        },
      };
      let authtoken = jwt.sign(data, JWT_SECRET); //data,secret number h jo ap na secret rakha h
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      //Some error found then show this error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//(Route 3):(3rd point) Get loggedin user Deails Using :POST "/api/auth/getuser".login required
//idher hamy wo token bhyjna pary ga
//yaha pr ham ny aik middleware ka folder bnaiya h (us ma fetchuser.js) js ma ham aik middle ware function lihy ga jo ham tab use kr sakty h jab hamy achahiya ho likn ham agr async k ander likh dy gy to hamy baki sab ma bhi lijhna pary ga. Or jaha jaha pr login ki zarorat ho gi waha pr middle ware function ka use kary gy
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //except password agr ya ni likhy gy to password bhi show ho ga;
    res.send(user);
  } catch (error) {
    //Some error found then show this error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
