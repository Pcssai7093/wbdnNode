const mongoose = require("mongoose");
const schema = require("mongoose").Schema;
const userConstructor = module.require("../Schemas/users");

const conversationSchema=new schema(
  {
    users:{
      type:[schema.Types.ObjectId],
      ref:"users"
    },
    messages:{
      type:[schema.Types.ObjectId],
      ref:"messages"
    }
  },
  { timestamps: true });


conversationSchema.pre('save',async function(next){
  let conversationId=this._id;
          // adding conversation id's to user's data
          
          let update = { $push: { conversations: [conversationId] } };
          await userConstructor.updateOne({_id:this.users[0]},update)
            .then((result2)=>{
              // res.send(result2);
            })
            .catch((err)=>{
              console.log(err)
            })
          
         await userConstructor.update({_id:this.users[1]},update)
            .then((result2)=>{
              // res.send(result2);
            })
            .catch((err)=>{
              console.log(err)
            })
    next();
})
const conversationConstructor=mongoose.model("conversations",conversationSchema);
module.exports=conversationConstructor;