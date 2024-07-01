const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const LoginRoute = require("./routes/LoginRoute");
const port = process.env.PORT


dbConnect();

app.use(cors());
app.use(express.json());


app.use("/api/user", UserRouter);
app.use("/api/user", PhotoRouter);
app.use("/api/user", LoginRoute);



app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});



app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

