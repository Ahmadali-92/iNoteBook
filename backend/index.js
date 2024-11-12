const connectToMongo = require("./db");
const express = require("express");
//cors installl
connectToMongo();
var cors = require("cors");


const app = express();
const port = 5000; //becuse 3000 pr react app chaly gi

//ya midpoint h jo json ma convert kary ga or ya lgana lazmi h
app.use(cors());
app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  // http://localhost:5000/  (ya local host h means k url)
  console.log(`The port listening on  ${port}`);
});
