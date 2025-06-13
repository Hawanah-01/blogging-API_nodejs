const jwt = require("jsonwebtoken");
const User = require("../models/User")

exports.signup = async (req, res, next) => {
    try {
        const {first_name, last_name, email, password} = req.body;

    //Checking if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(409).json({message: "Email exists already!"});
    }

    const user = new User ({first_name, last_name, email, password});
    await user.save();

    res.status(201).json({message: "User successfully registered!"});
    }catch(err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try{
        const {email, password} =req.body;

        //Validating user input
        if(!email || !password) {
            return res.status(400).json({message: "Email and password are required!"});
        }

        //Finding user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "Invalid email or password!"})
        }
        //console.log("User:", user); 

        
        //Comparing password with hashed password
        const matchedPassword = await user.comparePassword(password);
        if (!matchedPassword) {
            return res.status(401).json({message: "Invalid email or password"})
        }
        //console.log("Password match:", matchedPassword);

        //Generating jsonwebtoken
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        //Returning user info without password and token
        const {first_name, last_name} = user;
        res.status(200).json({message: "Login successful!", user: { id: user._id, first_name, last_name, email },
        token});

    } catch(err) {
        next(err);
    }
};
