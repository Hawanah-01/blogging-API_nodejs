const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    first_name: {
        type:String, 
        required:true
    },
    last_name: {
        type:String, 
        required:true
    },
    email: {
        type:String, 
        required:true, 
        unique:true
    },
    password: {
        type:String, 
        required:true,
        min: 8
    }
},{timestamps: true})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Compares password of a successfully signed in user with that in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema)