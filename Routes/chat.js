const router=require("express").Router()
const messageConstructor = module.require("../Schemas/message");
const conversationConstructor = module.require("../Schemas/conversation");
const userConstructor = module.require("../Schemas/users");

router.get("/temp",(req,res)=>{
  res.send("chat temp");
});

router.get("/coversation/:uid",(req,res)=>{
  let uid=req.params.uid
  conversationConstructor.find({$or:[{user1:uid},{user2:uid}]})
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
});

router.get("/message/:conversationId",(req,res)=>{
  let cid=req.params.conversationId
  conversationConstructor.find({_id:cid})
  .populate("messages")
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
});

router.post("/message/add/:cid",(req,res)=>{
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
    let msgId=result[0]._id;
    let uid1=data.from
    let uid2=data.to;
    
    let update = { $push: { messages: [msgId] } };
    conversationConstructor.update({_id:cid},update)
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send("error")
    })
  })
  .catch((err)=>{
    res.send("error")
  })
  
});

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
  conversationConstructor.find({$or:
                                [
                                  {user1:uid1,user2:uid2},
                                  {user1:uid2,user2:uid1}
                                ]
                               })
    .then((result)=>{
      
    if(result.length==0){
        conversationConstructor(data)
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
});

module.exports=router;