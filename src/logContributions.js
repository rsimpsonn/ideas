const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

logContributions = (db, payload) => {
  const value = payload.actions[0].name;
  const time = payload.actions[0].selected_options[0].value;

  const entry = db
    .collection("ideas")
    .findOne({ _id: ObjectId(payload.callback_id) })
    .then(data => {
      const index = data[value].findIndex(i => i.name === payload.user.name);
      if (index === -1) {
        db
          .collection("ideas")
          .update(
            { _id: ObjectId(payload.callback_id) },
            { $push: { [value]: { name: payload.user.name, time: time } } }
          );
      } else {
        const copy = data[value];
        copy[index] = { name: payload.user.name, time: time };
        db
          .collection("ideas")
          .update(
            { _id: ObjectId(payload.callback_id) },
            { $set: { [value]: copy } }
          );
      }
    });
};

module.exports = logContributions;
