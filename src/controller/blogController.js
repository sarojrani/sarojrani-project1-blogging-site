const authorModel = require("../model/authorModel")

const blogModel = require("../model/blogModel")

const createBlog = async function (req, res) {
  try {
    let data = req.body
    let id = req.authorId
    let author = await authorModel.findById(id)
    if (!author) { res.status(400).send({ status: false, msg: "author doesn't exist" }) }
    let savedData = await blogModel.create(data)
    res.status(201).send({ msg: savedData })
  }

  catch (err) { res.status(500).send({ msg: err.message }) }
}




const getBlog = async function (req, res) {
  try {
    let input = req.query.authorId
    let category = req.query.category
    let blogsData = []
    let blogs = await blogModel.find({ authorId: input, category: category })

    if (!blogs) { res.status(400).send({ status: false, msg: "no author exist with this author Id" }) }

    blogs.filter(n => {
      if (n.isDeleted == false && n.isPublished == true)
        blogsData.push(n)
    })

    return res.status(201).send({ data: blogsData })

  }
  catch (err) { res.status(500).send({ status: false, msg: err.message }) }

}





const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let title = req.body.title
    let tag = req.body.tag
    let subcategory = req.body.subcategory;
    let body = req.body.body;
    let p = req.body.publishedAt

    let blog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { title: title, tag: tag, subcategory: subcategory, body: body, publishedAt: p, isPublished: true } }, { new: true })
    if (!blog) {
      return res.status(404).send({ msg: "No such blog exists" });
    }
    res.status(200).send({ status: true, data: blog });
  }
  catch (error) {
    res.status(500).send({ msg: error.message, error: "server error" })
  }
}






const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId
    let blog = await blogModel.findById(blogId)
    if (!blog) {
      return res.status(404).send({ status: false, msg: "blog not found" })
    }
    let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
    res.status(200).send({ msg: "deleted" })
  }
  catch (err) {
    res.status(500).send({ msg: err })
  }
}






const deleteBlogDoc = async function (req, res) {

  try {
    let authorId = req.query.authorId;
    let tag = req.query.tag;
    let category = req.query.category;
    let subcategory = req.query.subcategory;
    let isPublished = req.query.isPublished;
    let arr = []
    let blog = await blogModel.find({ authorId: authorId, category: category, subcategory: subcategory, isPublished: isPublished, tag: tag })

    if (!blog) {
      return res.status(404).send({ status: false, msg: "Blog Not Found" })
    }

    blog.map(x => x.isDeleted = true)

    arr.push(blog)
    res.status(201).send({ data: arr })

  }
  catch (err) {
    res.status(500).res({ msg: err.message })
  }

}






module.exports.deleteBlogDoc = deleteBlogDoc
module.exports.deleteBlog = deleteBlog

module.exports.updateBlog = updateBlog
module.exports.getBlog = getBlog
module.exports.createBlog = createBlog







