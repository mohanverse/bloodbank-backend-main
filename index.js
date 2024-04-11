const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User.js");
const DonationfromModel = require('./models/DonationfromModel');
const BloodRequestModel = require('./models/BloodRequestModel');


const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const jwtSecret = '7584u8tu3oiut';

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/test", async (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ userDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err,token)=>{
            if(err) throw err;
            res.cookie('token', token).json('pass ok');
        });
    }else{
        res.status(422).json('pass not ok')
    }
  } else {
    res.json("not found");
  }
});


// Donation

// Get all donations
app.get('/donation', async (req, res) => {
  try {
    const donations = await DonationfromModel.find();
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new donation
app.post('/donation', async (req, res) => {
  try {
    const donation = await DonationfromModel.create(req.body);
    res.status(201).json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update donation status
app.patch('/donation/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const donation = await DonationfromModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blood Request

// Get all blood requests
app.get('/bloodrequest', async (req, res) => {
  try {
    const bloodrequests = await BloodRequestModel.find();
    res.json(bloodrequests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new blood request
app.post('/bloodrequests', async (req, res) => {
  try {
    const bloodrequest = await BloodRequestModel.create(req.body);
    res.status(201).json(bloodrequest);
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blood request status
app.patch('/bloodrequest/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const bloodrequest = await BloodRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!bloodrequest) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    res.json(bloodrequest);
  } catch (error) {
    console.error('Error updating blood request status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
