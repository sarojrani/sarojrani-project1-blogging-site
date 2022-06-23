/////// require jwt token ..//////


const jwt = require("jsonwebtoken")

const blogModel = require("../model/blogModel.js")

////......       AUTHENTICATION    ............///////////


const authenticate = async function (req, res, next) {

    /////// .... check the presence of token in header .....//////

    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-Api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        console.log(token);


        //////....   decoding token for verification   ...//////

        let decodedToken = jwt.verify(token, "functionup-radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "you are not logged in , first try to login" });
        next()
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}


////  *********   @@    checking if the author is authorised   @@   ******    /////


const authorisation = async function (req, res, next) {


    //   ???    checking presence  of token in header    ????   ///

    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-Api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        console.log(token);

        ///   ******  $$$$   ****   verifying token using secret key     *****  $$$$$ *****////

        let decodedToken = jwt.verify(token, "functionup-radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token invalid" })

        let userLogedIn = decodedToken.userId
        let userToBeModified = req.params.authorId

        if (userLogedIn != userToBeModified) { res.status(403).send({ status: false, msg: "sorry, you are not authorised to do it" }) }

        next()
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}

////  ***   middleware to authorise the creater of the blog only to delete and update it  **  ///

const delMid = async function (req, res, next) {
    try {
        let blogId = req.params.blogId      //// ** blog id ///

        let userId = req.params.authorId   ///** author id of the user who is trying to delete blog */

        let blog = await blogModel.findById(blogId)   //// we are checking if there is any blog with this id 

        if (!blog) {
            return res.status(404).send({ status: false, msg: "blog not found" })
        }

        let authorofBlog = blog.authorId   ////    id of the author  of the blog 

        if (authorofBlog != userId) { res.status(403).send({ status: false, msg: "you are not the author of this blog " }) }
        next()        /////  comparing both the id  ///


    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }


}

module.exports.authenticate = authenticate
module.exports.authorisation = authorisation
module.exports.delMid = delMid