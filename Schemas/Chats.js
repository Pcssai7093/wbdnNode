const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const chatSchema=new schema(
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

const chatConstructor=mongoose.model("chats",chatSchema);
module.exports=chatConstructor;