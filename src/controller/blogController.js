const authorModel = require("../model/authorModel")

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
 let input = req.query.authorId
 let category = req.query.category
 let blogsData = []
 let blogs = await blogModel.find({authorId:input, category : category})

 if(!blogs){res.status(400).send({status:false,msg : "no author exist with this author Id"})}

 blogs.filter(n => {if(n.isDeleted == false && n.isPublished == true )
                        blogsData.push(n)})
                         
return res.status(201).send({data:blogsData})

}
catch(err){res.status(500).send({status:false,msg:err.message})}

}
module.exports.getBlog = getBlog