const authenticateToken = require("./users");
const User = require("../models/Users");
const Doc = require("../models/Doc");
const router = require("express").Router();
const fs = require("fs");

//update user

router.put("/updateUser/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
    });

    res.status(200).json("user updated");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get the list of users expect admin

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ userType: "2" });
    console.log(users.length);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete user if u are admin
router.delete("/user/:id", async (req, res) => {
  try {
    //delete the file from localstore fist
    const deleteFromLocal = await Doc.find({ userID: req.params.id });

    console.log(deleteFromLocal.length);

    for (i = 0; i < deleteFromLocal.length; i++) {
      fs.unlinkSync(__dirname + "/uploaded_Docs/" + deleteFromLocal[i].docUrl);
    }

    //find the docs which contain userid in DB

    const response = await User.findOneAndDelete({
      _id: req.params.id,
    });

    //delete all the document which belongs to particular user

    const deleteDoc = await Doc.deleteMany({ userID: req.params.id });

    console.log(deleteFromLocal);

    res.status(200).json('Successfully deleted a User');
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//upload document files

router.post("/doc", async (req, res) => {


  try{
    const fileName = Date.now() + "" + req.files.uploadFile.name;
  const file = req.files.uploadFile;
  let uploadPath = __dirname + "/uploaded_Docs/" + fileName;

  let uploadpath2send = fileName;

  console.log(uploadPath);

  file.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
    }
  });

  const newDoc = new Doc({
    userID: req.body.userID,
    documentType: req.body.documentType,
    documentDesc: req.body.documentDesc,
    docUrl: uploadpath2send,
  });

  const listDoc = await Doc.find({ userID: req.body.userID });

  const newDocNo = listDoc.length + 1;

  const updateDocNo = await User.findByIdAndUpdate(req.body.userID, {
    documentNo: newDocNo,
  });

  const document = await newDoc.save();
  res.status(200).json(`Document is successfully uploaded`);

  }catch(err) {

    res.status(500).json(err)



  }

  

  
});

//delete document

router.delete("/delete_doc/:id", async (req, res) => {
  try {
    const delete_doc = await Doc.findByIdAndDelete(req.params.id);

    console.log("----deleted_doc" + delete_doc);

    const user_whose_doc_is_deleted = await User.findById(delete_doc.userID);

    console.log("----user_whose_doc_is_deleted" + user_whose_doc_is_deleted);

    const prev_doc_Count = user_whose_doc_is_deleted.documentNo;

    console.log("----previous_Count" + prev_doc_Count);

    const decrement_count = await User.findByIdAndUpdate(delete_doc.userID, {
      documentNo: prev_doc_Count - 1,
    });

    res.status(200).json(delete_doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all the document of a user

router.get("/list-docs/:id", async (req, res) => {
  try {
    const listDoc = await Doc.find({ userID: req.params.id });
    res.status(200).json(listDoc);

    // const DocumentNo = await User.findById(req.body.userID, {documentNo : listDoc.length})

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/totaldoc", async (req, res) => {
  try {
    const total_doc = await Doc.find();
    res.status(200).json(total_doc.length);



    console.log(total_doc)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
