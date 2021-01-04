const express = require("express");

const app = express();
const fs = require("fs");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

const port = process.env.PORT || 9999;

app.get("/", (req, res) => {
  res.send("server is working");
});

app.get("/todo", (req, res) => {
  fs.readdir("todo", "utf-8", (err, files) => {
    if (err) {
      console.error("Error occured while reading folder", err);
      res.status(500).send("error in reading folder");
    } else {
      let arr = [];
      files.map((file) => {
        fs.readFile(`todo/${file}`, "utf-8", (err, data) => {
          arr.push(JSON.parse(data));

          if (files.length == arr.length) res.send(arr);
        });
      });
    }
  });
});

app.post("/todo", (req, res) => {
  const data = {
    id: new Date().getTime() + "",
    ...req.body,
  };
  fs.writeFile(`todo/${data.id}.json`, JSON.stringify(data), "utf-8", (err) => {
    if (err) {
      console.error("Error occured while writing file", err);
      res.status(500).send("error in creating file");
    } else {
      res.set({
        "Content-type": "application/json",
      });
      res.send(JSON.stringify(data));
    }
  });
});

app.put("/todo", (req, res) => {
  fs.readFile(`todo/${req.body.id}.json`, "utf-8", (err, file) => {
    if (err) {
      console.error("Error opening file", err);
      res.status(500).send("error in opening file");
    } else {
      const data = {
        ...req.body,
      };

      fs.writeFile(
        `todo/${data.id}.json`,
        JSON.stringify(data),
        "utf-8",
        (err) => {
          if (err) {
            console.error("Error occured while updating file", err);
            res.status(500).send("error in updating file");
          } else {
            res.set({
              "Content-type": "application/json",
            });
            res.send(JSON.stringify(data));
          }
        }
      );
    }
  });
});

app.delete("/todo", (req, res) => {
  fs.unlink(`todo/${req.body.id}.json`, (err) => {
    if (err) {
      console.log("error in deleting file", err);
      res.status(500).send("error in deleting file");
    } else res.send("file successfully deleted");
  });
});

app.listen(port, () => {
  console.log(`app is listening to port ${port}!`);
});
