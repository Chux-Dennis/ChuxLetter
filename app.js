const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv");
const { log } = require("console");
const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", (req, res) => {
  var firstName = req.body.Fname;
  var lastName = req.body.Lname;
  var email = req.body.Email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = `https://us21.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;

  const options = {
    method: "POST",
    auth: process.env.AUTH_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      // console.log(JSON.parse(data))
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

const portNumber = process.env.PORT || 3000;

app.listen(portNumber, () => {
  console.log("Server is running at port 3000");
});
