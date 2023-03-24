// an user id
// 63c16c3ad393089e5d87fea4

const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminConstructor = module.require("./Schemas/admins");
const userConstructor = module.require("./Schemas/users");
const serviceConstructor = module.require("./Schemas/services");
const messageConstructor=module.require("./Schemas/message");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const fs = require("fs");
const path = require("path");
const { bufferParser, cloudinary,multerUploads } = require("./cloudinary");

const userRoutes = require("./Routes/user");
const serviceRoutes = require("./Routes/service");
const wishlistRoutes = require("./Routes/wishlist");
const chatRoutes = require("./Routes/chat");

let logStream = fs.createWriteStream("./Files/Logs.log", {
  flags: "a",
});

app.use(morgan("tiny",{
  stream: logStream,
}));

app.use(cookieParser());
app.use(cors({ origin: true }));

app.use(express.json());
app.use("/user", userRoutes);
app.use("/service", serviceRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/chat", chatRoutes);
// app.use("/user/:uid",csrfProtection)

dotenv.config("./.env");
mongoose.set("strictQuery", false);
let port = process.env.port || 5000;

const server = app.listen(port, () => {
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

//  socket.io code

// * users variable maintains all the active socket connections with key userId
let users = {};

function addUser(socketId, userId) {
  users[userId] = socketId;
}

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});
io.on("connection", (clientSocket) => {
  // io.to(clientSocket).emit("welcome","Server: :) hello u r connected");

  clientSocket.on("addUser", (userId) => {
    addUser(clientSocket.id, userId);
  });

  clientSocket.on("sendMessage", (fromUserId, toUserId, Message) => {
    let toSocketId = users[toUserId];
    // console.log("send Message request to "+toSocketId);
    if (toSocketId) {
      clientSocket
        .to(toSocketId)
        .emit("receiveMessage", fromUserId, toUserId, Message);
        
      const messageId=Message._id;
      messageConstructor.updateOne({_id:messageId},{seen:true})
      .then((result)=>{
        
      })
      .catch((err)=>{
        console.log("err");
      })
      
    }
  });
});

app.get("/", (req, res) => {
  res.send(`server running at port ${port}`);
});

app.post("/forgotpass", (req,res) => {
  
  userConstructor
  .find({email: req.body.email})
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    res.send(err);
  }) 
  
})

app.get("/profilee/:pid", (req,res) => {
  const id = req.params.pid;
  serviceConstructor
  .find({_id:id})
  .populate("seller")
  .then((result) => {
      res.send(result);
  })
  .catch((err) => {
      res.send(err);
  })
})

app.get("/profile/:uid", (req, res) => {
  const id = req.params.uid;
  userConstructor
    .find({ _id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/profile/:uid", (req, res) => {
  const id = req.params.uid;

  userConstructor
    .findByIdAndUpdate(id, {
      fullname: req.body.fullname,
      $push: { skills: req.body.skills },
      about: req.body.about,
      password: req.body.password,
    })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/admin/users", (req, res) => {
  userConstructor
    .find()
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/admin/services", (req, res) => {
  serviceConstructor
    .find()
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/admin/signin", (req, res) => {
  //   let data = req.body;
  //   let signin = false;

  //   adminConstructor
  //     .find({ email: data.email })
  //     .then((result) => {

  //       let hashnew = bcrypt.hashSync(data.password, 2);

  //       if (bcrypt.compareSync(data.password, result[0].password)) {
  //         res.send(result[0].fullname);
  //       } else {
  //         res.send("err");
  //       }
  //     })
  //     .catch((err) => {
  //       res.send(err);
  //     });

  let data = req.body;
  let signin = false;
  // console.log(data);
  adminConstructor
    .find({ email: data.usnam })
    .then((result) => {
      if (result[0].password === data.eml) {
        res.send(result[0]);
      } else {
        res.send("hello");
      }
    })
    .catch((err) => {
      res.send("hell");
    });
});

function userSortComparator(sort, order) {
  if (sort === "username" && order === "asc") {
    return { username: 1 };
  } else if (sort === "username" && order === "dsc") {
    return { username: -1 };
  } else if (sort === "datejoined" && order === "asc") {
    return { createdAt: 1 };
  } else if (sort === "datejoined" && order === "dsc") {
    return { createdAt: -1 };
  } else {
    return {};
  }
}

app.post("/admin/user/filter", (req, res) => {
  let data = req.body;
  userConstructor
    .find({
      username: {
        $regex: data.search.length == 0 ? /[a-zA-z]*/ : data.search,
        $options: "i",
      },
    })
    .sort(userSortComparator(data.sort, data.order))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

function serviceSortComparator(sort, order) {
  if (sort === "title" && order === "asc") {
    return { title: 1 };
  } else if (sort === "title" && order === "asc") {
    return { title: -1 };
  } else if (sort === "dateposted" && order === "asc") {
    return { createdAt: 1 };
  } else if (sort === "dateposted" && order === "dsc") {
    return { createdAt: -1 };
  } else if (sort === "price" && order === "asc") {
    return { price: 1 };
  } else if (sort === "price" && order === "dsc") {
    return { price: -1 };
  } else {
    return {};
  }
}

app.post("/admin/service/filter", (req, res) => {
  let data = req.body;
  // console.log(data)
  serviceConstructor
    .find({
      title: {
        $regex: data.search.length == 0 ? /[a-zA-z]*/ : data.search,
        $options: "i",
      },
    })
    .populate("seller")
    .sort(serviceSortComparator(data.sort, data.order))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/test", async (req, res) => {
  let data = await serviceConstructor.find().populate("seller");
  res.send(data);
});

// const storage = multer.memoryStorage();
// const multerUploads = multer({ storage }).array("images",2);

app.post("/upload", multerUploads, (req, res) => {
  console.log(req.body,req.files);
  res.send("hello");
  
  // let imgData = bufferParser(req);
  // cloudinary.uploader
  //   .upload(imgData)
  //   .then((response) => {
  //     res.send(response.secure_url);

      //      response format
      // {
      //   asset_id: "2e45aa037c9ce65872e76fe8d639e348",
      //   public_id: "k5yrek6dnpseh9gipp36",
      //   version: 1679467430,
      //   version_id: "2408706cb5c03f021fb1604422666add",
      //   signature: "1303cadb874cc7a8c4de8f8cab89e9d6bdb3978d",
      //   width: 1517,
      //   height: 488,
      //   format: "png",
      //   resource_type: "image",
      //   created_at: "2023-03-22T06:43:50Z",
      //   tags: [],
      //   bytes: 75498,
      //   type: "upload",
      //   etag: "82bda0614e2643a6c9045019cb3455dd",
      //   placeholder: false,
      //   url: "http://res.cloudinary.com/dgeg6il49/image/upload/v1679467430/k5yrek6dnpseh9gipp36.png",
      //   secure_url:
      //     "https://res.cloudinary.com/dgeg6il49/image/upload/v1679467430/k5yrek6dnpseh9gipp36.png",
      //   folder: "",
      //   api_key: "812339449319741",
      // }
    // })
    // .catch((err) => {
    //   res.send(err);
    // });
  // res.send("image uploaded");
});
//* route for filter and pagination
