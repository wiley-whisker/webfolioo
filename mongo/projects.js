const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://stormadmin:123@cluster0-f3yzi.mongodb.net/storm?retryWrites=true&w=majority";
const mongo = require("mongodb"); // install mongo
const ObjectId = mongo.ObjectID;

const findprojects = async _id => {
  let idstr = _id.toString();

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = client.db("storm");
  const arr = await db
    .collection("projects")
    .find({ "owner.id": idstr })
    .toArray();
  return arr;
};

const insertproject = async jsonobject => {
  const id = ObjectId();
  jsonobject["_id"] = id;

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = client.db("storm");

  db.collection("projects").insertOne(jsonobject);
  return jsonobject;
};

const findbyId = async id => {
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("storm");
  const [arr] = await db
    .collection("projects")
    .find({ _id: ObjectId(id) })
    .toArray();
  return arr;
};

const deletebyid = async id => {
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("storm");
  db.collection("projects").deleteOne({ _id: ObjectId(id) });
};

const insert_picture_into_project = async (email, projectname, link) => {
  //https://www.deadcoderising.com/2017-03-28-es6-destructuring-an-elegant-way-of-extracting-data-from-arrays-and-objects-in-javascript/
  // https://stackoverflow.com/questions/17039018/how-to-use-a-variable-as-a-field-name-in-mongodb-native-findone
  // Simply enclosing [query] in brackets tells mongodb that it's not literal, but rather a path.

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("storm");
  const value = await db
    .collection("projects")
    .find({
      $and: [{ email: email }, { projectname: projectname }]
    })
    .toArray();

  if (!value.length) {
    return 0;
  } else {
    // if it exist then update it
    db.collection("projects").updateOne(
      { $and: [{ email: email }, { projectname: projectname }] },
      { $push: { link: link } }
    );
    return 1;
  }
};

module.exports = {
  findprojects,
  insertproject,
  insert_picture_into_project,
  findbyId,
  deletebyid
};
