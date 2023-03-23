const router=require("express").Router()
const bcrypt = require("bcrypt");
const userConstructor = module.require("../Schemas/users");
const jwt=require("jsonwebtoken")
const auth=require("../Middlewares/authorization")



router.get("/",(req, res) => {
  userConstructor
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/:uid",auth, (req, res) => {
  
  userConstructor
    .findOne({ _id: req.params.uid })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/profile/:uid", (req, res) => {
  userConstructor
    .findOne({ _id: req.params.uid })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/profile/update/:uid", (req, res) => {
  const data=req.body;
  userConstructor
    .updateOne({ _id: req.params.uid },data)
    .then((result) => {
      res.send(true);
    })
    .catch((err) => {
      res.send(false);
    });
});

router.post("/update", (req, res) => {
  // * user data update
  const data = req.body;
  const uid = data.uid;

  delete data.uid;

  userConstructor
    .updateOne({ _id: uid }, data)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/temp",auth,(req,res)=>{
  res.send(req)
})


router.post("/forgot", (req,res) => {
  const email = req.body.email;
  userConstructor
    .find({email: email})
    .then((result) => {
      res.send(result);
  })
    .catch((err) => {
      res.send(err);
  })
})


// ------------------------------------------------------
//  chandra's code

router.post("/chandra/signup", (req, res) => {
//   let data = req.body;
//   userConstructor(data)
//     .save()
//     .then((response) => {
//       res.send(true);
// //     * redirect to login page
//     })
//     .catch((err) => {
//       res.send(false);
//     });
  
  console.log("hello")
  const username = req.body.username;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const obj = {
    fullname : fullname,
    username : username,
    email : email,
    password : password
  }
  userConstructor(obj)
    .save()
    .then((response) => {
      res.send(response);
//     * redirect to login page
    })
    .catch((err) => {
      console.log("puk")
      res.send(err);
    });
  
  
});


function createToken(id){
  let payload={
    id:id,
    age:1 * 24 * 60 * 60*2000
  }
  return jwt.sign(payload,process.env.secretKey);
}




router.post("/chandra/signin", (req, res) => {
//   let data = req.body;
//   let signin = false;
//   // console.log(data);
//   userConstructor
//     .find({ email: data.email })
//     .then((result) => {
     
//       if (bcrypt.compareSync(data.password, result[0].password)) {
        
//         let jwtToken=createToken(result[0]._id);
//         res.send(jwtToken);
//         // * user need to set this jwttoken in a cookie in format
//           // {
//           //   jwt:jwt_Token_Val
//           // }
//       } else {
//         res.send("password not matched");
//       }
//     })
//     .catch((err) => {
//       res.send(err);
//     });
  
  // response object form
  // {
  //   errors:[],
  //   result:
  //   token:
  // }
  
  let data = req.body;
  let signin = false;
  let responseObject={
    errors:[]
  }
  userConstructor
    .find({ email: data.userEmail })
    .then((result) => {
     
      if (bcrypt.compareSync(data.userPassword, result[0].password)) {
        
        let jwtToken=createToken(result[0]._id);
        
        res.send({errors:[],result,jwtToken});
        // * user need to set this jwttoken in a cookie in format
          // {
          //   jwt:jwt_Token_Val
          // }
      } else {
        responseObject.errors.push("Password is incorrect");
        res.send(responseObject)
        // return res;
      }
    })
    .catch((err) => {
      responseObject.errors.push("Email is not found");
      res.send(responseObject)
        // return res;
    });

});


router.post("/blockHandle",(req,res)=>{
  // const sid=req.params.sid;
  let data=req.body;
  const sid=data.sid;
  const blockVal=data.isBlock;
  userConstructor.updateOne({_id:sid},{isBlock:blockVal})
  .then((result)=>{
    res.send(true);
    
  })
  .catch((err)=>{
    res.send(err);
  })
})


module.exports=router;

