const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const mid = require("../middleware/middleware.js")

//<!------------------API without Middleware-------------------------->
router.post("/author",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)
router.get("/blogs",blogController.getBlog)
router.put("/blogs/:blogId/",blogController.updateBlog)
router.delete("/blogs/:blogId",blogController.deleteBlog)
router.delete("/blogs1",blogController.deleteBlogDoc)

//<!----------------------Login API------------------------------------->
router.post("/login",authorController.login)

//<!----------------------APIs with Middleware-----------------------------------> 
router.post("/blogs/:authorId",mid.authenticate,blogController.createBlog)
router.put("/blogs/:blogId/:authorId",mid.authenticate,mid.authorisation,mid.delMid,blogController.updateBlog)
router.delete("/blogs/:blogId/:authorId",mid.authenticate,mid.authorisation,mid.delMid,blogController.deleteBlog)
router.delete("/blogs1/:authorId",mid.authenticate,mid.authorisation,blogController.deleteBlogDoc)

module.exports = router

