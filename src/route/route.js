
const express = require('express');
const router = express.Router();


const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")


router.post("/author",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)

router.put("/blogs/:blogId",blogController.updateBlog)
router.delete("/blogs/:blogId",blogController.deleteBlog)
router.delete("/blogs1",blogController.deleteBlogDoc)



router.get("/blogs",blogController.getBlog)
module.exports = router

