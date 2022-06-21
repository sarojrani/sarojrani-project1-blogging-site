const mongoose = require("mongoose") 
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({

   title :{ type : String,
required : true} ,

body : { type : String,
required : true },

authorId : {  type : ObjectId,
    ref : 'ProjectAuthor'
},
tag : [],

category : { type : String , 
 required : true },

 subcategory : String,
 isDeleted :{type: boolean ,
    default : false
},
 isPublished : {type: boolean ,
    default : false
}
}
,{timestamps : true}


)

module.exports = mongoose.model('Blog',blogSchema)
