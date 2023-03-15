const router=require("express").Router()
const serviceConstructor = module.require("../Schemas/services");

router.get("/", (req, res) => {
  
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


router.post("/add", (req, res) => {
  let data = req.body;
  let sellerId = req.body.seller;
  console.log(sellerId);
  serviceConstructor(data)
    .save()
    .then((result) => {
      // * syntax to update
      const update = { $push: { services: [result._id] } };
      userConstructor
        .update({ _id: sellerId }, update)
        .then((result2) => {
          res.send(result._id);
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/:sid", (req, res) => {
  let serviceId = req.params.sid;
  serviceConstructor
    .findOne({ _id: serviceId })
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get(
  "/:search/:sortCategory/:category/:price/:limit/:skip",
  (req, res) => {
    let searchString = req.params.search;
    let sortCategory = req.params.sortCategory;
    let category = req.params.category;
    let price = req.params.price;
    let limit = req.params.limit;
    let skip = req.params.skip;
    function sortComparater(sortCat) {
      if (sortCat == "priceLTH") return { price: 1 };
      else if ((sortCat = "priceHTL")) return { price: -1 };
      else return {};
    }

    serviceConstructor
      .find({
        title: {
          $regex: searchString == 0 ? /[a-zA-z]*/ : searchString,
          $options: "i",
        },
        category: {
          $regex: category == 0 ? /[a-zA-z]*/ : category,
          $options: "i",
        },
        price: { $lte: price },
      })
      .populate("seller")
      .sort(sortComparater(sortCategory))
      .limit(limit)
      .skip(skip)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

//* route for find total services for a filter
// * returns in the form {count:_COUNT_}
router.get(
  "/count/:search/:sortCategory/:category/:price",
  (req, res) => {
    let searchString = req.params.search;
    let sortCategory = req.params.sortCategory;
    let category = req.params.category;
    let price = req.params.price;
    // * regex can be used like this
    function sortComparater(sortCat) {
      if (sortCat == "priceLTH") return { price: 1 };
      else if ((sortCat = "priceHTL")) return { price: -1 };
      else return {};
    }

    serviceConstructor
      .find({
        title: {
          $regex: searchString == 0 ? /[a-zA-z]*/ : searchString,
          $options: "i",
        },
        category: {
          $regex: category == 0 ? /[a-zA-z]*/ : category,
          $options: "i",
        },
        price: { $lte: price },
      })
      .sort(sortComparater(sortCategory))
      .then((result) => {
        res.send({ count: result.length });
      })
      .catch((err) => {
        res.send(err);
      });
  }
);



module.exports=router;