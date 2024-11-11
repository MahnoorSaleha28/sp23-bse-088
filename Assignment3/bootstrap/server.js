const express = require("express");

let server = express();

server.set("view engine", "ejs");

server.get("/", (req, res) => {
    res.render("bootstrap");
});

server.use(express.static("public"));

server.listen(5000, () => {
    console.log("Server started at localhost:5000");
});