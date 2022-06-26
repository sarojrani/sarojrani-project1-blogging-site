const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    authorId: {
        type: ObjectId,
        ref: 'ProjectAuthor'
    },
    tag: [String],

    category: {
        type: String,
        required: true
    },

    subcategory: [],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt:{type:String,
        default:null},
    isPublished: {
        type: Boolean,
        default: false
    }
    ,
    publishedAt: Date
}
    , { timestamps: true }


)

module.exports = mongoose.model('Blog', blogSchema)
