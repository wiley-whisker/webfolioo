const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://stormadmin:123@cluster0-f3yzi.mongodb.net/storm?retryWrites=true&w=majority";
const mongo = require("mongodb"); // install mongo
const ObjectId = mongo.ObjectID;

const findbyId = async id => {
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("storm");
  const [arr] = await db
    .collection("users")
    .find({ _id: ObjectId(id) })
    .toArray();
  return arr;
};
const findOne = async json => {
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("storm");
  const [arr] = await db
    .collection("users")
    .find(json)
    .toArray();
  return arr;
};

const insertuser = async userdocument => {
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("storm");

  db.collection("users").insertOne(userdocument, (err, data) => {
    console.log("inserted ", userdocument);
  });
};
module.exports = { findbyId, findOne, insertuser };
