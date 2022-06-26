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
let blogId = req.params.blogId
        
        let Blog = await blogModel.findById(blogId)
        let author = Blog.authorId
        

        if (userLogedIn != author) { res.status(403).send({ status: false, msg: "Sorry, you are not authorised to do it" }) }

        next()
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}



module.exports.authenticate = authenticate
module.exports.authorisation = authorisation
