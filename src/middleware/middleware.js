const jwt = require("jsonwebtoken")
const blogModel = require("../model/blogModel.js")

//<!-----------------------Authentication------------------------------->
const authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-Api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "Token must be present" });
        console.log(token);

        let decodedToken = jwt.verify(token, "functionup-radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "You are not logged in , first try to login" });
        next()
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}

//<!--------------------Authorisation------------------------------------>
const authorisation = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-Api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "Token must be present" });
        console.log(token);

        let decodedToken = jwt.verify(token, "functionup-radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token invalid" })

        let userLogedIn = decodedToken.userId
        let userToBeModified = req.params.authorId

        if (userLogedIn != userToBeModified) { res.status(403).send({ status: false, msg: "Sorry, you are not authorised to do it" }) }

        next()
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}

//<!----------Middleware on creater of the blog to delete and update it---------------------------->

const delMid = async function (req, res, next) {
    try {
        let blogId = req.params.blogId
        let userId = req.params.authorId
        let blog = await blogModel.findById(blogId)

        if (!blog) {
            return res.status(404).send({ status: false, msg: "Blog not found" })
        }

        let authorofBlog = blog.authorId

        if (authorofBlog != userId) { res.status(403).send({ status: false, msg: "You are not the author of this blog " }) }
        next()
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}

module.exports.authenticate = authenticate
module.exports.authorisation = authorisation
module.exports.delMid = delMid