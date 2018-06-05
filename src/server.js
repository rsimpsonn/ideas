const Express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ideaFactory = require("./ideaFactory");
const toDocument = require("./toDocument");
const toAttachments = require("./toAttachments");
const logContributions = require("./logContributions");
const toContributions = require("./toContributions");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const app = new Express();
app.use(bodyParser.urlencoded({ extended: true }));

setInterval(function() {
  request.get("https://springideas.herokuapp.com/");
}, 300000);

const {
  PORT,
  SLACK_TOKEN: slackToken,
  MONGO_USERNAME: mongous,
  MONGO_PASSWORD: mongopw
} = process.env;

const port = PORT || 80;

var db;

app.get("/", (req, res) => {
  return;
});

app.post("/makeidea", (req, res) => {
  db.collection("ideas").save(toDocument(req.body), (err, result) => {
    if (err) return console.log(err);
  });
  ideaFactory(slackToken, req.body)
    .then(text => {
      res.json(text);
      return res.redirect("/");
    })
    .catch(console.error);
});

app.post("/listideas", (req, res) => {
  res.sendStatus(200);
  db.collection("ideas").find().toArray().then(data => {
    request.post(
      req.body.response_url,
      {
        json: true,
        body: toAttachments(data, req.body.user_name),
        headers: {
          "content-type": "application/json"
        }
      },
      function(error, response, body) {
        return;
      }
    );
  });
});

app.post("/action", (req, res) => {
  res.json();
  const output = JSON.parse(req.body.payload);
  console.log(output.callback_id);
  if (output.actions[0].name === "remove") {
    db.collection("ideas").deleteOne({ _id: ObjectId(output.callback_id) });
    request.post(output.response_url, {
      json: true,
      body: { text: "Your idea has been removed from the list!" },
      headers: {
        "content-type": "application/json"
      }
    });
  } else {
    logContributions(db, output);
  }
  return res.redirect("/");
});

app.post("/myideas", (req, res) => {
  res.sendStatus(200);
  db
    .collection("ideas")
    .find({ name: req.body.user_name })
    .toArray()
    .then(data => {
      if (data.length === 0) {
        request.post(req.body.response_url, {
          json: true,
          body: { text: "You don't have any ideas on the list!" },
          headers: {
            "content-type": "application/json"
          }
        });
      } else {
        request.post(
          req.body.response_url,
          {
            json: true,
            body: toContributions(data),
            headers: {
              "content-type": "application/json"
            }
          },
          function(error, response, body) {
            console.log(response);
          }
        );
      }
    });
});

MongoClient.connect(
  `mongodb://${mongous}:${mongopw}@ds133360.mlab.com:33360/springideas`,
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("springideas");

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server started at localhost:${port}`);
    });
  }
);
