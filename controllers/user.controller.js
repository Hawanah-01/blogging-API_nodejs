const Blog = require ("../models/Blog");

exports.getUserBlogs = async(req, res, next) => {
    try{
        const {state, page = 1, limit = 20} = req.query; //extracts the state from the URL query; draft or published and sets page limit to 20
        const filter = {author: req.user._id}; //queries only returned blog by the logged in user
        if (state) filter.state = state; //state query is added to the filter and makes it more specific

        const skip =(parseInt(page) -1) * parseInt(limit);

        const blogs = await Blog.find(filter) //fetches the blog using MongoDb query
        .sort({createdAt: -1}) //newest blogs first
        .skip(skip) //skips n documents for pagination
        .limit(parseInt(limit)); //limits result per page

        const total = await Blog.countDocuments(filter); //counts all blogs

        res.status(200).json({
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit), blogs
        }); //returns list of blogs as a JSON response
    }catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user without the password
    const { _id, first_name, last_name, email, createdAt } = user;
    res.status(200).json({ id: _id, first_name, last_name, email, createdAt });
  } catch (error) {
    next(error);
  }
};
