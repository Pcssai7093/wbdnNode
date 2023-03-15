const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const conversationSchema=new schema(
  {
    user1:{
      type:schema.Types.ObjectId,
      ref:"users",
      required:true
    },
    user2:{
      type:schema.Types.ObjectId,
      ref:"users",
      required:true
    },
    messages:{
      type:[schema.Types.ObjectId],
      ref:"messages"
    }
  },
  { timestamps: true });

const conversationConstructor=mongoose.model("conversations",conversationSchema);
module.exports=conversationConstructor;