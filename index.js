import fetch from "node-fetch";
import mongoose from "mongoose";
import express from "express";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const app = express();

app.set("view engine", "ejs");

const DATABASE_URL =
  "mongodb+srv://prakharbhatnagar03:admin@cluster0.ibrneg0.mongodb.net";

mongoose.set("strictQuery", true);
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cryptoSchema = new mongoose.Schema({
  base_unit: {
    type: String,
  },
  quote_unit: {
    type: String,
  },
  low: {
    type: Number,
  },
  high: {
    type: Number,
  },
  last: {
    type: Number,
    // required: true,
  },
  type: {
    type: String,
  },
  open: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  sell: {
    type: Number,
  },
  buy: {
    type: Number,
  },
  at: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
});
const Crypto = mongoose.model("Crypto", cryptoSchema);

async function getPosts() {
  const myPosts = await fetch("https://api.wazirx.com/api/v2/tickers");
  const response = await myPosts.json();
  for (const key in response) {
    const crypto = new Crypto({
      name: response[key]["name"],
      base_unit: response[key]["base_unit"],
      quote_unit: response[key]["quote_unit"],
      buy: response[key]["buy"],
      sell: response[key]["sell"],
      volume: response[key]["volume"],
    });
    await crypto.save();
  }
}
getPosts();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.get("/", (req, res) => {
  Crypto.find({}, function (err, crypto) {
    res.render("index", {
      cryptoList: crypto,
    });
  }).limit(10);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
