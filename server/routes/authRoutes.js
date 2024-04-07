const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

router.post('/signup', async (req, res) => {
    console.log('sent by client - ',req.body);
  const { name, email, password, department, designation, phone } = req.body;

  try {
    if (!email || !password || !name || !department || !designation || !phone) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({ error: "Email Already Exists" });
    }

    const user = new User({
      name,
      email,
      password,
      department,
      phone,
      designation,
    });

    await user.save();
    // res.json({ message: "User saved successfully" });
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    res.send({token});
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/signin', async (req, res)=>{
    // console.log('sent by client - ',req.body);
    const {email, password} = req.body;
  if(!email || !password){
    return res.status(422).json({error: "Please Add Email or Password"});
  }
  const savedUser = await User.findOne({email:email})

  if(!savedUser){
    return res.status(422).json({error: "Invalid Credentials"});
  }
  try{
    bcrypt.compare(password, savedUser.password, (err, result)=>{
      if(result){
        console.log("Password Matched");
        const token = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET);
        console.log(token)
        res.send({token});
      }
      else{
        console.log("Password Does Not Match");
        return res.status(422).json({error: "Invalid Credentials"});
      }
    })
  }
  catch(err){
    console.log(err);
  }
})


router.get('/faculties', async (req, res) => {
  try {
    const faculty = await User.find({}, { password: 0 }); // Exclude password field from the response
    res.status(200).json(faculty);
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/faculties/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFaculty = await User.findByIdAndDelete(id);
    if (!deletedFaculty) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (err) {
    console.error('Error deleting faculty:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
