const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require('moment');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let keyValid = function (value) {
  if (typeof (value) == "undefined" || typeof (value) == null || value.length == 0) { return false }
  return true
}


//<!--------------Create API------------------------------------>   

const createBlog = async function (req, res) {
  try {
    const data = req.body
    if (data.isPublished) data.publishedAt = Date.now();
    if (data.isDeleted) data.deletedAt = Date.now();
    //<!---------------------title validation------------------------->
    if (!data.title) { return res.status(400).send({ status: false, message: " Title is a mandatory field" }) }
    if (!keyValid(data.title)) return res.status(400).send({ status: false, message: " Please mention title" })
    let title = /^[A-Za-z_ ]+$/.test(data.title)
    if (!title) return res.status(400).send({ status: false, message: " use alphabets only to define title" });

    //<!---------------------Body Validation-------------------------->
    if (!data.body) { return res.status(400).send({ status: false, message: " body is a mandatory field" }) }
    if (!keyValid(data.body)) return res.status(400).send({ status: false, message: "Body is required" })

    //<!---------------------author Id validation -------------------->
    if (!data.authorId) { return res.status(400).send({ status: false, message: " AuthorId is a mandatory field" }) }
    let id = data.authorId 
    let author = await authorModel.findById(id)
    if (!author) { res.status(400).send({ status: false, msg: "author doesn't exist" }) }

    //<!-----------------Category validation--------------------------------->

    if (!data.category) { return res.status(400).send({ status: false, message: " Category is a mandatory field" }) }
    if (!keyValid(data.category)) return res.status(400).send({ status: false, message: "Please  mention category" })

    const savedData = await blogModel.create(data)
    res.status(201).send({ msg: savedData })
  }
  catch (err) { res.status(500).send({ msg: err.message }) }
}

//<!--------------------------Get Blog API--------------------------->

const getBlog = async function (req, res) {
  try {
    let doc = req.query
    if (doc.authorId) {
      let id = doc.authorId
      let author = await authorModel.findById(id)
      if (!author) { return res.status(400).send({ status: false, msg: "No such Author" }) }
    }
    if (doc.tag) {
      const tag = doc.tag
      const blog = await blogModel.find({ tag: tag })
      if (!blog) { return res.status(400).send({ status: false, msg: "No blog related to this tag" }) }
    }
    if (doc.category) {
      const category = doc.category
      const blog = await blogModel.find({ category: category })
      if (!blog) { return res.status(400).send({ status: false, msg: "No blog related to this category" }) }
    }
    if (doc.subCategory) {
      const subcategory = doc.subCategory
      const blog = await blogModel.find({ subcategory: subcategory })
      if (!blog) { return res.status(400).send({ status: false, msg: "No blog related to this sub-category" }) }
    }

    // let blogs = await blogModel.find({isDeleted:false,isPublished:true})
     let Blog =  await blogModel.find(doc)
      Blog.filter(x=>x.isDeleted===false && x.isPublished===true)
    if (!Blog || Blog.length == 0) { res.status(400).send({ status: false, msg: "No such blog exist" }) }

    return res.status(200).send({ data: Blog })
  }
  catch (err) { res.status(500).send({ status: false, msg: err.message }) }

}

//<!----------------------Update Blog API---------------------------->

const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;

    const { title, body, tag, subcategory } = req.body;
    const blog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      {
        $push: { tag: tag, subcategory: subcategory },
        $set: {
          title,
          body,
          isPublished: true,
          publishedAt: Date.now(),
        },
      },
      { new: true }
    );
    return res.status(200).send({ status: true, data: blog });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//<!----------------------Delete Blog API-------------------------->
const deleteBlog = async function (req, res) {
  try {
    var currentDate = moment().toString();
    let blogId = req.params.blogId
    let blog = await blogModel.findById(blogId)
    console .log(blog._id.toString())
    if (!blog) {
      return res.status(404).send({ status: false, msg: "There is no such blog" })
    }
    let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: currentDate } }, { new: true })
    if (!deletedBlog) { return res.status(404).send({ msg: "Already deleted" }) }
    res.status(200).send({ msg: "Deleted" })
  }
  catch (err) {
    res.status(500).send({ msg: err.message })
  }
}

//<!----------------------Delete Blog using filters----------------->
const deleteBlogDoc = async function (req, res) {
  try {
 
    var currentDate = moment().toString();
    let doc = req.query

    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-Api-key"];

    if (!token) return res.status(401).send({ status: false, msg: "Token must be present" });
    console.log(token);

    let decodedToken = jwt.verify(token, "functionup-radon");

    if (!decodedToken)
        return res.status(401).send({ status: false, msg: "Token invalid" })
    let authorId = req.query.authorId
 let userId = decodedToken.userId
    if (authorId != userId) { res.status(403).send({ status: false, msg: "Sorry, you are not authorised to do it" }) }

    if(doc.authorId){
      let id = doc.authorId
      let author = await authorModel.findById(id) 
    if(!author){return res.status(400).send({status:false,msg:"No such Author"})}
    }
    if(doc.tag){
      const tag = doc.tag
      const blog = await blogModel.find({tag:tag}) 
    if(!blog){return res.status(400).send({status:false,msg:"No blog related to this tag"})}
    }
    if(doc.category){
      const category = doc.category
      const blog = await blogModel.find({category:category}) 
    if(!blog){return res.status(400).send({status:false,msg:"No blog related to this category"})}
    }
    if(doc.subCategory){
      const subcategory = doc.subCategory
      const blog = await blogModel.find({subcategory:subcategory}) 
    if(!blog){return res.status(400).send({status:false,msg:"No blog related to this sub-category"})}
    }
    
    let blog = await blogModel.findOneAndUpdate( {doc,isPublished:false},{ $set: { isDeleted: true,deletedAt:currentDate } })

    if (!blog || blog.length == 0) {
      return res.status(404).send({ status: false, msg: "No such blog" })
    }
    res.status(200).send({ status: true, data: blog })

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







