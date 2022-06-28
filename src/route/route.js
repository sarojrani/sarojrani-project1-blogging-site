const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const mid = require("../middleware/middleware.js")

/////*******************API***************************** */
 
router.post("/author", authorController.createAuthor)

router.post("/login", authorController.login)

router.post("/blogs",mid.authenticate, blogController.createBlog)

router.get("/blogs",mid.authenticate,blogController.getBlog)

router.put("/blogs/:blogId",mid.authenticate,mid.authorisation, blogController.updateBlog)

router.delete("/blogs/:blogId", mid.authenticate,mid.authorisation, blogController.deleteBlog)

router.delete("/blogs1",mid.authenticate, blogController.deleteBlogDoc)

module.exports = router

