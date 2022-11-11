const router = require('express').Router();
// const Post = require('../models/Posts');
// const User = require('../models/Users');
const AdminUser = require('../models/adminUser')
const cloudinary = require('cloudinary');

const authenticateToken = require('../routes/users');

//configuration
cloudinary.config({
  cloud_name: 'dzejdfmma',
  api_key: '933815445382538',
  api_secret: 'UlZ5dAY_geVzPfEp8BVGitcEp_o',
});

//create a post

router.post('/', authenticateToken, async (req, res) => {
  try {
    await cloudinary.v2.uploader.upload(
      `${req.body.img}`,
      { upload_preset: 'ml_default' },
      (error, result) => {
        console.log(result.url, error);
        global.url = result.url;
      }
    );
    const newPost = new Post({
      userId: req.user.userId,
      desc: req.body.desc,
      img: global.url,
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put('/update', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.userId);
    const post = await Post.findOne({ userId: req.user.userId });
    console.log(post);

    await post.updateOne({ $set: req.body });
    res.status(200).json('the post has been udpated');
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post

router.delete('/', authenticateToken, async (req, res) => {
  try {
    await Post.findOneAndDelete({ userId: req.user.userId });
    res.status(200).json('Post has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a post

router.put('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.userId)) {
      await post.updateOne({
        $push: { likes: req.user.userId },
      });
      res.status(200).json('liked');
    } else {
      res.status(403).json('you alerady liked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//unlike a post

router.put('/:id/unlike', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.user.userId)) {
      await post.updateOne({
        $pull: { likes: req.user.userId },
      });
      res.status(200).json('unliked');
    } else {
      res.status(403).json('you never liked this post ');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline

router.get('/timeline', authenticateToken, async (req, res) => {
  try {
    const currUser = await User.findById(req.user.userId);
    const userPost = await Post.find({ userId: currUser._id });
    const friendPost = await Promise.all(
      currUser.followings.map((friendId) => {
        Post.find({ userId: friendId });
      })
    );

    res.json(userPost.concat(...friendPost));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//postPic upload

router.post('/upload', authenticateToken, async (req, res) => {
  try {
  } catch (err) {}
});

//profilePic upload

//coverPic upload

module.exports = router;
