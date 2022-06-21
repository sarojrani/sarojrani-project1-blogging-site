const authorModel = require("../model/authorModel.js")

const blogModel = require("../model/blogModel.js")

const createAuthor = async function (req,res){
let data = req.body 
let savedData = await authorModel.create(data)
res.send({msg : savedData})


}
module.exports.createAuthor = createAuthor
