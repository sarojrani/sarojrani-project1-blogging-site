const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require('moment');
const jwt = require("jsonwebtoken");
const { set } = require("mongoose");
let keyValid = function (value) {
  if (typeof (value) == "undefined" || typeof (value) == null || value.length == 0) { return false }
  return true
}


//<!--------------Create API------------------------------------>   

const createBlog = async function (req, res) {
  try {
    let data = req.body
    //<!---------------------title validation------------------------->

    if(!data.title){ return res.status(400).send({ status: false, message: " Title is a mandatory field" })}
    if (!keyValid(data.title)) return res.status(400).send({ status: false, message: " Please mention title" })
    let title = /^[A-Za-z_ ]+$/.test(data.title)
    if (!title) return res.status(400).send({ status: false, message: " use alphabets only to define title" });

    //<!---------------------Body Validation-------------------------->
    if(!data.body){ return res.status(400).send({ status: false, message: " body is a mandatory field" })}
    if (!keyValid(data.body)) return res.status(400).send({ status: false, message: "Body is required" })

    //<!---------------------author Id validation -------------------->
    if(!data.authorId){ return res.status(400).send({ status: false, message: " AuthorId is a mandatory field" })}
    let id = req.body.authorId
    let author = await authorModel.findById(id)
    if (!author) { res.status(400).send({ status: false, msg: "author doesn't exist" }) }

    //<!-----------------Category validation--------------------------------->
    
    if(!data.category){ return res.status(400).send({ status: false, message: " Category is a mandatory field" })}
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

    let blogs = await blogModel.find(doc)
    if (!blogs || blogs.length == 0) { res.status(400).send({ status: false, msg: "No such blog exist" }) }
   
    return res.status(200).send({ data: blogs })
  }
  catch (err) { res.status(500).send({ status: false, msg: err.message }) }

}

//<!----------------------Update Blog API---------------------------->

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let eblog = await blogModel.findById(blogId)
    if(!eblog){return res.status(404).send({ msg: "No such blog exists" })}

  let title = req.body.title
  let body = req.body.body
  let newTag = req.body.tag
  let sub = req.body.subcategory

    var currentDate = moment().toString();
    let blogg = await blogModel.findById( blogId )
    tag = blogg.tag;
    subcategory=blogg.subcategory
   
  


   
    let blog = await blogModel.findOneAndUpdate({ _id: blogId },{ $set:{title:title,body:body,$addToSet :{tag:newTag,subcategory:sub},publishedAt: currentDate,isPublished:true}}, { new: true });
    if (!blog || blog.length == 0) {
      return res.status(404).send({ msg: "No such blog exists" });
    }
   
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
      return res.status(404).send({ status: false, msg: "There is no such" })
    }
    let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId,isDeleted:false }, {$set:{ isDeleted: true, deletedAt:currentDate}}, { new: true })
    if(!deleteBlog){ return res.status(404).send({ msg: "Already deleted" })}
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







