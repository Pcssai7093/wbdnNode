const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminConstructor = module.require("./Schemas/admins");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const socket=require("socket.io")

const userRoutes=require("./Routes/user")
const serviceRoutes=require("./Routes/service")
const wishlistRoutes=require("./Routes/wishlist")
const chatRoutes=require("./Routes/chat")

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/user",userRoutes)
app.use("/service",serviceRoutes)
app.use("/wishlist",wishlistRoutes)
app.use("/chat",chatRoutes)


dotenv.config("./.env");
mongoose.set("strictQuery", false);
let port=process.env.port || 5000


const server=app.listen(port, () => {
  console.log(`mongoose server running at port ${port}`);
  mongoose
    .connect(process.env.dbid)
    .then(() => {
      console.log("mongodb connection successful");
     
    })
    .catch((err) => {
      console.log(err);
      console.log("mongodb connection error");
    });
});


// const io=socket(server)
// * socket connection
// io.on("connection",(clientSocket)=>{
//   console.log(`new socket connection is established with socket ${clientSocket}`)
// });



app.get("/", (req, res) => {
  res.send(`server running at port ${port}`);
});


app.post("/admin/signin", (req, res) => {
  let data = req.body;
  let signin = false;
  // console.log(data);
  adminConstructor
    .find({ email: data.email })
    .then((result) => {
      console.log(data.password);
      console.log(result[0].password);
      let hashnew = bcrypt.hashSync(data.password, 2);
      console.log(bcrypt.compareSync(data.password, hashnew));
      if (bcrypt.compareSync(data.password, result[0].password)) {
        res.send(result[0].fullname);
      } else {
        res.send("err");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});


//* route for filter and pagination
