const router=require("express").Router()
const serviceConstructor = module.require("../Schemas/services");
const userConstructor = module.require("../Schemas/users");



router.post("/add", (req, res) => {
  // contains data of the service and user

  let data = req.body;
  // * handle if service is not added by parsing ack
  const update = { $addToSet: { wishlist: [data.sid] } };
  userConstructor
    .updateOne({ _id: data.uid }, update)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/:uid", (req, res) => {
  let uid = req.params.uid;
  // * important nested population query
  userConstructor
    .findOne({ _id: uid })
    .populate({
      path: "wishlist",
      populate: {
        path: "seller",
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.post("/delete", (req, res) => {
  // contains data of the service and user
  let data = req.body;
  const update = { $pull: { wishlist: data.sid } };
  userConstructor
    .updateOne({ _id: data.uid }, update)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports=router;