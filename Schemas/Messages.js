const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const messageSchema=new schema(
{
   message:{
     type:String,
     required:true,
   },
  from:{
    type:schema.Types.ObjectId,
    required:true
  },
  to:{
    type:schema.Types.ObjectId,
    required:true
  }
},
{ timestamps: true });

const messageConstructor=mongoose.model("messages",messageSchema)
module.exports = messageConstructor;