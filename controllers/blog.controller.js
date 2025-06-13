const Blog = require('../models/Blog');
const calculatedReadingTime = require('../utils/readingTime.js');

exports.createBlog = async(req, res, next) => {
    try {
       const {title, description, tags, body} = req.body;
       //Validating required fields
       if(!title || !description || !body) {
            return res.status(400).json({message: "Title, description and body are required"});
       }

       const userId = req.user._id;


       const reading_time = calculatedReadingTime(body);

       const newBlog = new Blog({
            title,
            description,
            tags,
            body,
            author: userId,
            reading_time
       });

       //Automatically defaulting state to draft
       const savedBlog = await newBlog.save();
       res.status(201).json({message: "Blog saved as draft"})
    } catch (err) {
        next(err);
    }
};

exports.publishBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) return res.status(403).json({ message: 'Not authorized or blog not found' });

    if (blog.state === 'published') {
      return res.status(400).json({ message: 'Blog is already published' });
    }

    blog.state = 'published';
    await blog.save();

    const { _id, title, description, state, author } = blog;
    res.json({ message: 'Blog published successfully', blog: { _id, title, description, state, author } });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) {
      return res.status(403).json({ message: 'You are not allowed to edit this blog' });
    }

    Object.assign(blog, req.body);

    // If the body/content was updated, recalculate the reading time
    if (req.body.body) {
      blog.reading_time = calculateReadingTime(req.body.body);
    }
    await blog.save();
    res.json(blog);

  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!blog) return res.status(403).json({ message: 'You are not allowed to delete this blog' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getSingleBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, state: 'published' },
      { $inc: { read_count: 1 } },
      { new: true }
    ).populate('author', 'first_name last_name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or not published' });
    }

    res.json(blog);
  } catch (err) {
    next(err);
  }
};

exports.getPublishedBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, author, title, tags, order_by = '-createdAt' } = req.query;

    const query = { state: 'published' };
    if (author) query.author = author;
    if (title) query.title = new RegExp(title, 'i');
    if (tags) query.tags = { $in: tags.split(',') };

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(order_by)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(blogs);
  } catch (err) {
    next(err);
  }
};


