const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/Users')

const nodemailer = require('nodemailer');

 


router.use(cors());

//signup
router.post('/signup', async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
 console.log(req.body.password)
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      userType: req.body.userType,
    });

    const user = await newUser.save();
    const email =  req.body.email;
    const password = req.body.password;

    console.log(password)


   

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chandigarh.ca.1233@gmail.com',
        pass: 'hjimftiojvskkjdr'
      }
    });
    
    const mailOptions = {
      from: 'chandigarh.ca.1233@gmail.com',
      to: `${email}`,
      subject: 'CA - Credentials ',
      text: `Your Credentials are here Email:- ${email} Password:- ${password} `,
      html : `<div>
        <h1>Your Credentials are given below</h1>
      <p>Email :- ${email}</p> 
      <p>Password :- ${password}</p>
      <h5 style={{color  : 'red'}}>Note - dnt share your credentials with anyone</h5>
      </div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error.response);
    } else {
    console.log('Email sent: ' + info.response);
    res.status(200).json('Successfully created a User');
   }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)

    // !user && res.status(404).json('User not found');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //!validPassword && res.status(400).json('Password is invalid'); 

    const userData = {
      userId: user._id,
      email: user.email,
      userType: user.userType,
           
    };

    
    const accessToken = jwt.sign(
      userData,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '10000000000000000000',
      }
    );

    const uData = {
      userId: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      token:accessToken
    };


    res.status(200).json(uData);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
