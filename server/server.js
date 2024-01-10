const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");

console.log(process.env);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
