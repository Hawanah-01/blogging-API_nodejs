const express =require('express');
const router = express.Router();
const {createBlog, publishBlog, updateBlog, deleteBlog, getSingleBlog, getPublishedBlogs} = require('../controllers/blog.controller.js');
const {authenticateUser} = require('../middleware/auth.js');

router.post('/', authenticateUser, createBlog, updateBlog);
router.patch('/:id/publish', authenticateUser, publishBlog);
router.patch('/:id', authenticateUser, updateBlog);
router.delete('/:id', authenticateUser, deleteBlog);
router.get('/:id', getSingleBlog);
router.get('/', getPublishedBlogs);

module.exports = router;