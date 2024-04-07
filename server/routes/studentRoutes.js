const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = mongoose.model("Student");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

router.post('/register', async (req, res) => {
  console.log('sent by client - ',req.body);
  const { name, department, regno, email, password, dob, address, phone, sslc, hsc, ug, pg } = req.body;
  try {
    if (!email || !password || !name || !department || !regno || !dob || !address || !phone || !sslc || !hsc || !ug || !pg) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    let user = await Student.findOne({ email: email });

    if (user) {
      return res.status(422).json({ error: "Email Already Exists" });
    }

    user = new Student({
      name,
      department,
      regno,
      email,
      password,
      dob,
      phone,
      address,
      sslc,
      hsc,
      ug,
      pg,
    });

    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/updatePassword', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    if (!email || !password || !confirmPassword) {
      return res.status(422).json({ error: "Please provide email, password, and confirmPassword" });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    let user = await Student.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = password;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post('/login', async (req, res)=>{
    // console.log('sent by client - ',req.body);
    const {email, password} = req.body;
  if(!email || !password){
    return res.status(422).json({error: "Please Add Email or Password"});
  }
  const savedUser = await Student.findOne({email:email})

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

router.get('/students', async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find({}, 'name department regno phone email dob address sslc hsc ug pg');

    res.json(students); // Send the students array as a response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/updateMarks', async (req, res) => {
  const { email, sslc, hsc, ug, pg } = req.body;
  try {
    if (!email || !sslc || !hsc || !ug || !pg) {
      return res.status(422).json({ error: "Please provide email, sslc, hsc, ug, and pg" });
    }

    let user = await Student.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.sslc = sslc;
    user.hsc = hsc;
    user.ug = ug;
    user.pg = pg;

    await user.save();

    res.json({ message: "Marks updated successfully" });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
