const router = require('express').Router();
const User = require('../models/Users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doc = require('../models/Doc');
// const authenticateToken = require('../routes/auth')

//authenticateUser
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, userData) => {
      if (err) return res.sendStatus(403);
      req.user = userData;
      console.log(req.user)

      next();
    }
  );
}


//get all my document


router.get('/mydocs', authenticateToken, async (req, res) => {

  console.log('running')



  try {


    console.log(req.user.userId)

    const allDoc = await Doc.find({userID : req.user.userId});

    // const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(allDoc);
  } catch (err) {
    return res.status(500).json(err);
  }
});





//get a profile

// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);

//     const { password, updatedAt, ...other } = user._doc;
//     res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//update user

// router.put('/:id', authenticateToken, async (req, res) => {
//   if (req.user.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(
//           req.body.password,
//           salt
//         );
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }

//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       return res.status(200).json('Account has been updated');
//     } catch (error) {
//       return res.status(500).json(error);
//     }
//   } else {
//     return res.status(403).json('you can only updated your account');
//   }
// });
//delete user

// router.delete('/:id', authenticateToken, async (req, res) => {
//   if (req.user.userId == req.params.id || req.body.isAdmin) {
//     try {
//       await User.findByIdAndDelete(req.params.id);
//       res.status(200).json('Account has been deleted');
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json('you can only delete your account');
//   }
// });

//get a user

// router.get('/:id', async (req, res) => {
//   console.log('getting');
//   try {
//     const user = await User.findById(req.params.id);

//     const { password, updatedAt, ...other } = user._doc;
//     res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//follow a user

// router.put('/:id/follow', authenticateToken, async (req, res) => {
//   if (req.user.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);

//       const currUser = await User.findById(req.user.userId);

//       if (!user.followers.includes(req.user.userId)) {
//         await user.updateOne({
//           $push: { followers: req.user.userId },
//         });

//         await currUser.updateOne({
//           $push: { followings: user._id },
//         });
//         console.log(
//           ` ${currUser.username}  is following  ${user.username} `
//         );
//         res.status(200).json('user has been followed');
//       } else {
//         res.status(403).json('you alerady follow this user');
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json('you cant follow urself');
//   }
// });
//unfollow user

// router.put('/:id/unfollow', authenticateToken, async (req, res) => {
//   if (req.user.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currUser = await User.findById(req.user.userId);

//       if (user.followers.includes(req.user.userId)) {
//         await user.updateOne({
//           $pull: { followers: req.user.userId },
//         });
//         await currUser.updateOne({
//           $pull: { followings: user._id },
//         });

//         console.log(
//           ` ${currUser.username}  is unfollowed  ${user.username} `
//         );

//         res.status(200).json('user has been unfollowed');
//       } else {
//         res.status(403).json('you adont follow this user');
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json('you cant unfollow urself');
//   }
// });

module.exports = router, authenticateToken;
