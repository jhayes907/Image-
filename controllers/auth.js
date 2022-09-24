const express = require("express");
const router = express.Router();
const passport = require("../config/ppConfig");
const db = require("../models");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/logout", (req, res) => {
  req.logOut(() => {
    console.log("I am logged out");
  }); // logs the userss out of the session
  req.flash("success", "Logging out... See you next time!");
  res.redirect("/");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    successFlash: "Welcome back ...",
    failureFlash: "Either email or password is incorrect",
  })
);

//  /auth/signup routes
router.post("/signup", async (req, res) => {
  // we now have access to the userss info (req.body);
  const { email, name, password } = req.body; // goes and us access to whatever key/value inside of the object
  try {
    const [users, created] = await db.users.findOrCreate({
      where: { email },
      defaults: { name, password },
    });

    if (created) {
      // if created, success and we will redirect back to / page
      console.log(`----- ${users.name} was created -----`);
      const successObject = {
        successRedirect: "/profile",
        successFlash: `Welcome ${users.name}. Account was created and logging in...`,
      };
      //
      passport.authenticate("local", successObject)(req, res);
    } else {
      // Send back email already exists
      req.flash("error", "Email already exists");
      res.redirect("/auth/signup"); // redirect the users back to sign up page to try again
    }
  } catch (error) {
    // There was an error that came back; therefore, we just have the users try again
    console.log("**************Error");
    console.log(error);
    req.flash(
      "error",
      "Either email or password is incorrect. Please try again."
    );
    res.redirect("/auth/signup");
  }
});

module.exports = router;
