const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Data = require("./models/data");
const User = require("./models/user");
require("./db/mongoose");
app.use(express.json());
const userRouter = require("./routers/user");
const dataRouter = require("./routers/Data");
app.use(userRouter);
app.use(dataRouter);

app.listen(port, () => {
  console.log("Listening on port 3000");
});
