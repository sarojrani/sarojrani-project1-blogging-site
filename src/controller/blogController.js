// const authorModel = require("../model/authorModel")

const blogModel = require("../model/blogModel")

const createBlog = async function (req,res){
    let data = req.body 
    let savedData = await blogModel.create(data)
    res.send({msg : savedData})
}

const deleteBlog = async function(req,res){
    try{
    let blogId = req.params.blogId
    let user = await blogModel.findById(blogId)
    if(!user) {
      return res.status(404).send({status: false, message: "user doesn't exists"})
    }
    let updatedBlog = await blogModel.findOneAndUpdate({_id: blogId}, {isDeleted: true}, {new: true})
    res.status(200).send({status: true, data: updatedBlog})
}
catch(err){
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


module.exports.createBlog=createBlog
module.exports.deleteBlog=deleteBlog
