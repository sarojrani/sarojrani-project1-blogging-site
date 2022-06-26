const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require('moment');
let keyValid = function (value) {
  if (typeof (value) == "undefined" || typeof (value) == null || value.length == 0) { return false }
  return true
}


//<!--------------Create API------------------------------------>   
const createBlog = async function (req, res) {
  try {
    let data = req.body
    //<!---------------------title validation------------------------->
    if (!keyValid(data.title)) return res.status(400).send({ status: false, message: " Please mention title" })

    let title = /^[A-Za-z_ ]+$/.test(data.title)
    if (!title) return res.status(400).send({ status: false, message: " use alphabets only to define title" });

    //<!---------------------Body Validation-------------------------->
    if (!keyValid(data.body)) return res.status(400).send({ status: false, message: "Body is required" })
    let body = /^[A-Za-z]+$/.test(data.body)
    let id = req.body.authorId
    let author = await authorModel.findById(id)
    if (!author) { res.status(400).send({ status: false, msg: "author doesn't exist" }) }

    //<!-----------------Category validation--------------------------------->
    if (!keyValid(data.category)) return res.status(400).send({ status: false, message: "Please  mention category" })
    let category = /^[A-Za-z_ ]+$/.test(data.category)
    if (!category) { res.status(400).send({ status: false, message: "use alphabets only for category" }) }
    let savedData = await blogModel.create(data)
    res.status(201).send({ msg: savedData })
  }
  catch (err) { res.status(500).send({ msg: err.message }) }
}

//<!--------------------------Get Blog API--------------------------->
const getBlog = async function (req, res) {
  try {
    let doc = req.query
    if(!doc.authorId){return res.status(400).send({status:false,msg:"No author Id"})}
    if(doc.authorId.length==0){return res.status(400).send({status:false,msg:"Cannot place empty"})}
    let blogs = await blogModel.find(doc)
    if (!blogs || blogs.length == 0) { res.status(400).send({ status: false, msg: "No such blog exist" }) }
    // if(doc.tag){
      // let new = await blogModel.find(tag)
      
    // }
    return res.status(200).send({ data: blogs })
  }
  catch (err) { res.status(500).send({ status: false, msg: err.message }) }

}

//<!----------------------Update Blog API---------------------------->
const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let doc = req.body
    var currentDate = moment().toString();
    console.log(currentDate)
    let blog = await blogModel.findOneAndUpdate({ _id: blogId },{ $set:{doc,publishedAt: currentDate}}, { new: true });
    if (!blog || blog.length == 0) {
      return res.status(404).send({ msg: "No such blog exists" });
    }
    // let update = await blogModel.findByIdAndUpdate(blogId, { $push: { tags: doc.tags, subCategory: doc.subCategory }, publishedAt: Date.now() }, { new: true });
    res.status(200).send({ status: true, data: blog });
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
    console.log(error)
  }
}

//<!----------------------Delete Blog API-------------------------->
const deleteBlog = async function (req, res) {
  try {
    var currentDate = moment().toString();
    let blogId = req.params.blogId
    let blog = await blogModel.findById(blogId)
    if (!blog) {
      return res.status(404).send({ status: false, msg: "Blog not found" })
    }
    let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {$set:{ isDeleted: true, deletedAt:currentDate}}, { new: true })
    if(deletedBlog){
      deletedBlog.deletedAt=currentDate
    }
    res.status(200).send({ msg: "Deleted" })
  }
  catch (err) {
    res.status(500).send({ msg: err.message })
  }
}

//<!----------------------Delete Blog By Document----------------->
const deleteBlogDoc = async function (req, res) {
  try {
    var currentDate = moment().toString();
    let authorId = req.params.authorId;
    let doc = req.query
    let blog = await blogModel.findOneAndUpdate({ authorId: authorId, doc },{ $set: { isDeleted: true,deletedAt:currentDate } })

    if (!blog || blog.length == 0) {
      return res.status(404).send({ status: false, msg: " Blog not exists" })
    }
    res.status(201).send({ status: true, data: blog })

  }
  catch (err) {
    res.status(500).send({ msg: err.message })
  }

}

module.exports.deleteBlogDoc = deleteBlogDoc
module.exports.deleteBlog = deleteBlog
module.exports.updateBlog = updateBlog
module.exports.getBlog = getBlog
module.exports.createBlog = createBlog







