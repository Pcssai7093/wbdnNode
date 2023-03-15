const router=require("express").Router()
const bcrypt = require("bcrypt");
const userConstructor = module.require("../Schemas/users");
const jwt=require("jsonwebtoken")


function createToken(id){
  let payload={
    id:id,
    age:1 * 24 * 60 * 60*2000
  }
  return jwt.sign(payload,process.env.secretKey);
}

router.post("/signin", (req, res) => {
  let data = req.body;
  let signin = false;
  // console.log(data);
  userConstructor
    .find({ email: data.email })
    .then((result) => {
     
      if (bcrypt.compareSync(data.password, result[0].password)) {
        
        let jwtToken=createToken(result[0]._id);
        res.send(jwtToken);
        // * use token to protect routes in the frontend
      } else {
        res.send("err");
      }
    })
    .catch((err) => {
      res.send(false);
    });

});

router.post("/signup", (req, res) => {
  let data = req.body;
  userConstructor(data)
    .save()
    .then((response) => {
      res.send(true);
//     * redirect to login page
    })
    .catch((err) => {
      res.send(false);
    });
});

router.get("/", (req, res) => {
  userConstructor
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/:uid", (req, res) => {
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


router.get("/temp",(req,res)=>{
  res.send("test")
})

module.exports=router;

