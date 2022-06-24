const jwt = require("jsonwebtoken")
const authorModel = require("../model/authorModel.js")
const blogModel = require("../model/blogModel.js")

let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null || value.length == 0) { return false }
    return true
}

//<!-------------------Create Author API----------------------------->
const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (!keyValid(data.fName)) return res.status(400).send({ status: false, message: "Please enter first name" })
        //<!----------------First name Regex-------------------------->
        let fName = /^[a-zA-Z.]{2,15}$/.test(data.fName)
        if (!fName) {
            res.status(400).send({ msg: "Please enter alphabets only for first name and maximum legth should be 15" })
        }

        //<!-----------------Last name Regex------------------------->        
        if (!keyValid(data.lName)) return res.status(400).send({ status: false, message: "Please enter last name" })
        let lName = /^[A-Za-z]{2,20}$/.test(data.lName)
        if (!lName) {
            res.status(400).send({ msg: "Please enter alphabets only for last name and maximum length should be 20" })
        }

        //<!---------------Email Regex------------------------------>
        if (!keyValid(data.email)) return res.status(400).send({ status: false, message: "Please enter emailid" })
        let email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)

        if (!email) {
            res.status(400).send({ status: false, messege: "invalid email" })
        }

        //<!------------------Password Regex------------------------->
        if (!keyValid(data.email)) return res.status(400).send({ status: false, message: "Please enter password" })
        let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)

        if (!password)  res.status(400).send({ status: false, message: "use strong password" }) 
    

        let savedAuthor = await authorModel.create(data)
    { res.status(201).send({ status: false, message: savedAuthor }) }
}
    catch (err) {
    res.status(500).send({ msg: err.message })
}
}

//<!-----------------------------Login API----------------------------------->
let login = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        let user = await authorModel.findOne({ email: email, password: password })
        if (!user) { res.status(400).send({ msg: "user and password is incorrect" }) }

        //<!---------------------Token-------------------------------------->
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "radon",
                organisation: "FUnctionUp",
            },
            "functionup-radon"

        );
        res.setHeader("x-auth-token", token);
        res.send({ status: true, data: token });
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports.createAuthor = createAuthor
module.exports.login = login
