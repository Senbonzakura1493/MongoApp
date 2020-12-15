var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27078/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("medicalDB");
  dbo.collection("patients").drop(function(err, delOK) {
   if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });
}); 