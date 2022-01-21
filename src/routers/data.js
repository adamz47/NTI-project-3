const express = require("express");
const routers = express.Router();
const Data = require("../models/data");
const auth = require("../middelware/auth");

// Routes
//post *token is required to post a data *
routers.post("/data", auth, async (req, res) => {
  try {
    const data = await new Data({ ...req.body, reporter: req.user._id });
    data.save();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET Route " get all data for the user * token is required * "
routers.get("/data", auth, async (req, res) => {
  try {
    const data = await Data.find({ reporter: req.user._id });
    if (!data) {
      return res.status(404).send("No task");
    }
    res.send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// PATCH Route "update data *each user can update his data only token is required*"
routers.patch("/data/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Data.findOneAndUpdate(
      { _id, reporter: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!data) {
      return res.status(404).send("Unable to find the data");
    }
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete Route "delete data each user can delete his data only token required "
routers.delete("/data/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Data.findOneAndDelete({
      _id,
      reporter: req.user._id,
    });
    if (!data) {
      return res.status(404).send("You dont have any data to be deleted");
    }
    res.send("data has been Deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = routers;
