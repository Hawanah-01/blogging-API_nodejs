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

const PORT = process.env.PORT || 7000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Huuuurrrraaaayyyyy!!!! Welcome to Hawa's Blogging API");
});


app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/users', authenticateUser, userRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});





