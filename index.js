import express from "express";
import bodyParser from "body-parser";
import router from "./src/router.js";

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
