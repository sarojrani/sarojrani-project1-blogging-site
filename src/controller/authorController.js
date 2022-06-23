
///              REQUIRING JSON WEB TOKEN      ////

const jwt=require("jsonwebtoken")



const authorModel = require("../model/authorModel.js")

const blogModel = require("../model/blogModel.js")


//////     **** we are using keyValid function to check if the value is empty  ******    ////

let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null|| value.length == 0) { return false }
    
    return true
}
    


///////     ****  creating author *****   ///////


/////   we have used keyvalid function and regex to check  the proper format of the field that user will mention in the body   //////



const createAuthor = async function (req,res){
    try{
let data = req.body 



//--------------firstname validation------------//



if (!keyValid(data.fName)) return res.status(400).send({ status: false, message: "Please enter first name" })

//    *** following regex will allow user to use small and capital alphabets only in first name   ****   ////

let fName=/^[A-Za-z]+$/.test(data.fName)

if (!fName){res.status(400).send({msg:"Please enter alphabets only  for first name"})
}



//----------------last name validation--------------//


//    *** following regex will allow user to use small and capital alphabets only in last name   ****   ////


if (!keyValid(data.lName)) return res.status(400).send({ status: false, message: "Please enter last name" })
let lName = /^[A-Za-z]+$/.test(data.lName)
if (!lName){res.status(400).send({msg:"Please enter alphabets only for last name"})}



/////------------------emailid validation-----------//


//    *** following regex will allow user to write a proper format of email id  ****   ////


if (!keyValid(data.email)) return res.status(400).send({ status: false, message: "Please enter emailid" })
let email=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)

if (!email){res.status(400).send({status:false, messege:"invalid email" })}

//////////---------password validation------------/////


//////    ****  following regex will allow you only  to  use strong password   ***   //////

if (!keyValid(data.email)) return res.status(400).send({ status: false, message: "Please enter password" })
// let password=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(data.password)

// if (!password){res.status(400).send({status:false,message:"use strong password"})}
// }


///////    ******  &&&&&   @@@     if all the validations are passed, user is allowed to sign up    ******    $$$$   ////

let savedAuthor = await authorModel.create(data)
if (password){res.status(201).send({status:false,message:savedAuthor})}

    }




catch(err){
    res.status(500).send({msg:err.message})
}}


  
/////    *******   this api is for login of user , after succesfull login , it will generate a jwt token and send it to user in response ****////    



let login=async function(req,res){
    try{
        let email=req.body.email;
        let password= req.body.password;

//////   ****   we are checking if the email id and password send by user match any author in our database    ***    ////


        let user=await authorModel.findOne({email:email,password:password})

        /////    ***   we are sending error  if there is no user    ****    ////
        if (!user) {res.status(400).send({msg:"user and password is incorrect"})}


//////    *****   generating token    *****    /////

        let token = jwt.sign(
            {
              userId: user._id.toString(),
              batch: "radon",
              organisation: "FUnctionUp",
            },
           "functionup-radon"
           
          );

//////    ***    sending  token in  response   header    ****   ////

          res.setHeader("x-auth-token", token);
          res.send({ status: true, data: token });
        }
    catch(err){
        res.status(500).send({msg:err.message})
    }
}



/////    ***   exporting  functions , making these global function   **   ///


module.exports.createAuthor = createAuthor
module.exports.login = login
