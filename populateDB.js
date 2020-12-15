var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27078/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  populateDB(db);
}); 


// fill the empty database with random values
function populateDB(db){
  var iteration;
  var dbo = db.db("medicalDB");

  //cardiac patient
  for (iteration = 0; iteration <= 10; iteration++) {
    var myobj = { 

      name: makecharact(), 
      address: makeaddress() ,
      Age : Math.round(Math.random()*100) ,
      drugAllergy : makeAllergy(), 
      bloodGroup : makeBlood() , 
      cardio : makeCardio() ,
      pressure : makePressure(),
      bodyTemp : makeTemperature()
    
    };
    dbo.collection("patients").insertOne(myobj, function(err, res) {
      if (err) throw err;
            
    });
    console.log(iteration);
  }

  //sportsmen
  for (iteration = 11; iteration <= 20; iteration++) {
    var myobj = { 

      name: makecharact(), 
      address: makeaddress() ,
      GpsCoord : makeLocalisationArray(),
      Age : Math.round(Math.random()*100) ,
      bloodGroup : makeBlood() , 
      cardio : makeCardio() ,
      pressure : makePressure(),
      bodyTemp : makeTemperature(),
      transmissibleDisease : isTransmissible()
    
    };
    dbo.collection("patients").insertOne(myobj, function(err, res) {
      if (err) throw err;   
    });
    console.log(iteration);
  }

 // patient with specific disease
  for (iteration = 21; iteration <= 30; iteration++) {
    var myobj = { 

      name: makecharact(), 
      address: makeaddress() ,
      bloodGroup : makeBlood() , 
      Age : Math.round(Math.random()*100) ,
      drugAllergy : makeAllergy(), 
      specificDisease : makeDisease(),
      transmissibleDisease : isTransmissible()
    
    };
    dbo.collection("patients").insertOne(myobj, function(err, res) {
     if (err) throw err;
      
      
    });
    console.log(iteration); 
  }
  // patient with specific disease
  for (iteration = 31; iteration <= 40; iteration++) {
    var myobj = { 

      name: makecharact(), 
      address: makeaddress() ,
      Age : Math.round(Math.random()*100) ,
      bloodGroup : makeBlood() , 
      drugAllergy : makeAllergy(), 
      transmissibleDisease : isTransmissible()
    
    };
    dbo.collection("patients").insertOne(myobj, function(err, res) {
     if (err) throw err;
      
      
    });
    console.log(iteration);
  }
  
  db.close();

}


// random values to generate the random database

function makecharact() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }


  function makeCardio() {
    return Array.apply(null, Array(10)).map(function() {
      return Math.round((Math.random() *200)+ 40 );
    });
  
}

  function makeaddress() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var number ="0123456789"
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      text += " ";
      text += number.charAt(Math.floor(Math.random() * number.length));
      text += number.charAt(Math.floor(Math.random() * number.length));
  
    return text;
  }

  function makeBlood() {  
    var text = "";
    var possibles = new Array("A","AB","O","B");
    var rhesus =new Array("+" , "-");
   
  
    for (var i = 0; i < 1; i++)
      text += possibles[Math.floor(Math.random() * possibles.length)];
      text += " ";
      text += rhesus[Math.floor(Math.random() * rhesus.length)];
    return text;
      
      
    }
    
    function makePressure() {  
      return Array.apply(null, Array(10)).map(function() {
        return [Math.round((Math.random()*200)+80) , Math.round((Math.random()*120) + 40 )];
      });
    }

    function makeTemperature() {  
      return Array.apply(null, Array(10)).map(function() {
        return Math.round((Math.random()*20)+20);
      });
    }

  function makeLocalisationArray() {  
    return Array.apply(null, Array(1)).map(function() {
      return [Math.round((Math.random()*200)+80) , Math.round((Math.random()*120) + 40 )];
      //return [Math.round((Math.random()*360 - 180) * 1000)/1000, Math.round((Math.random()*360 - 180) * 1000)/1000];
    });
   
  }

  function makeAllergy() {  
    var possibles = new Array("pollen","insuline","anti_inflammatoire","Voltaren","iode");
    var text = new Array();
    
      for (var i = 0; i < Math.round(Math.random() *4)  ; i++)
        text.push(possibles[Math.floor(Math.random() * possibles.length)]) ;
      return text;
        
     
    };

    function makeDisease() {  
      var possible = new Array("Epileptic","Depression","Asthme","Cancer");
      var text = "";
      
        for (var i = 0; i < 1  ; i++)
          text += possible[Math.floor(Math.random() * possible.length)] ;
        return text;
          
       
      };

      function isTransmissible() {  
        var random_boolean = Math.random() >= 0.5;
          return random_boolean;
            
         
        };

