const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const blogRoutes = require("./routes/blog.js");
const userRoutes = require("./routes/user.js");
const {authenticateUser} = require("./middleware/auth");
const http = require("http");

dotenv.config();

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb successfully connected");
    }catch (err) {
        console.error("MongoDb connection failed");
        process.exit(1);
    }
};

connectDB();

const app = express();

const PORT = 7000;

app.use(express.json());

app.use('/auth', authRoutes); // does it work?
app.use('/blogs', blogRoutes);
app.use('/users', authenticateUser, userRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, (req, res)=>{
    console.log(`Server is listening on http://localhost/${PORT}`)
});





