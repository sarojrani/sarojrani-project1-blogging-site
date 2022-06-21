// const authorModel = require("../model/authorModel")

const blogModel = require("../model/blogModel")

const createBlog = async function (req,res){
  try{  let data = req.body 
    let id = req.authorId
 let author = await authorModel.findById(id)
 if(!author){res.status(400).send({status:false,msg:"author doesn't exist"})}
    let savedData = await blogModel.create(data)
    res.status(201).send({msg : savedData})}
  
  catch(err){res.status(500).send({msg:err.message})}}
module.exports.createBlog = createBlog
 
const getBlog = async function(req,res){
try{
    let Id = req.params.authorId
    let data = await blogModel.find({authorId:`$`, isDeleted:false,isPublished:true})

/////changes

//fghj
//wert
//dfgh


}
catch(err){
    console.log(err)
    res.send({msg:err})
}


}





