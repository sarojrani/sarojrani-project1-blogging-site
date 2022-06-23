////// require of package..///////



const express = require('express');
const router = express.Router();

/////// imports of files ////////


const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const mid = require("../middleware/middleware.js")


////////router without authentication and authorisation ......./////


router.post("/author",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)

router.put("/blogs/:blogId/",blogController.updateBlog)
router.delete("/blogs/:blogId",blogController.deleteBlog)
router.delete("/blogs1",blogController.deleteBlogDoc)


/////// login ....////////

router.post("/login",authorController.login)


////////router after adding  authentication and authorisation ......./

router.post("/blogs/:authorId",mid.authenticate,mid.authorisation,blogController.createBlog)
router.put("/blogs/:blogId/:authorId",mid.authenticate,mid.authorisation,mid.delMid,blogController.updateBlog)
router.delete("/blogs/:blogId/:authorId",mid.authenticate,mid.authorisation,mid.delMid,blogController.deleteBlog)
router.delete("/blogs1/:authorId",mid.authenticate,mid.authorisation,blogController.deleteBlogDoc)


module.exports = router

