const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
  db.listings
    .findAll()
    .then((listings) => {
      res.render("browse/index", { listings: listings });
    })
    .catch((error) => {
      res.status(404).render("home/404");
    });
});

// router.get("/:id", (req, res) => {
//   db.listing.findOne({ id: req.params.id });

// });

module.exports = router;
