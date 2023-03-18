const router=require("express").Router()
const messageConstructor = module.require("../Schemas/message");
const conversationConstructor = module.require("../Schemas/conversation");
const userConstructor = module.require("../Schemas/users");

router.get("/temp",(req,res)=>{
  res.send("chat temp");
});

// retrieving conversations for a user
  router.get("/conversation/:uid",(req,res)=>{
  let uid=req.params.uid
  
  conversationConstructor.find({users:uid})
  .populate("users","fullname")
  .sort({createdAt:-1})
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
  
});


// retrieving messages for a conversation
router.get("/message/:conversationId",(req,res)=>{
  let cid=req.params.conversationId
  conversationConstructor.find({_id:cid})
  .populate("messages",["message","from","createdAt"])
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
});


// adding messages in a conversation
router.post("/message/add",(req,res)=>{
  // no conversation id is needed
//   body contains two user id's and messages
//   conversationId
  const cid=req.params.cid
  const data=req.body;
//   data obj format
  // {
  //   from:uid1
  //   to:uid2
  //   message:"msg"
  // }
  messageConstructor(data)
    .save()
    .then((result)=>{

    res.send(result)
  })
    .catch((err)=>{
    res.send(err)
  })
  
});


// adding adding conversation for users

router.post("/conversation/add",(req,res)=>{
  // res.send("hello");
  const data=req.body;
  //   data obj format
  // {
  //   user1:uid1
  //   user2:uid2
  // }
  const uid1=data.user1;
  const uid2=data.user2;
  if(uid1!==uid2){
    conversationConstructor.find({$and:
                                [
                                  {users:uid1},
                                  {users:uid2}
                                ]
                               })
    .then((result)=>{
      
    if(result.length==0){
        conversationConstructor({users:[uid1,uid2]})
        .save()
        .then((result)=>{
          res.send(result);  
          
        })
        .catch((err)=>{
          res.send("error")
        })
    }
    else{
      res.send("conversation already exists")
    }
    
  })
  .catch((err)=>{
    res.send("err2")
  })
  } 
  else{
    res.send("same user");
  }
    
});

module.exports=router;