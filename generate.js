function MakeAllergy() {  
  var possibles = new Array("pollen","insuline","anti_inflammatoire","Voltaren","iode");
  var text = new Array();
  
    for (var i = 0; i < Math.round(Math.random() *4)  ; i++)
      text.push(possibles[Math.floor(Math.random() * possibles.length)]) ;
    return text;
      
   
  };
    
    

  function makeCardio() {
    var cardio;
    cardio =Math.round((Math.random() *200)+ 40 );

  return cardio;
}

  function makeAddress() {
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

  function makeDisease() {  
    var possible = new Array("Epileptic","Depression","Asthme","Cancer");
    var text = "";
    
      for (var i = 0; i < 1  ; i++)
        text += possible[Math.floor(Math.random() * possible.length)] ;
      return text;
        
     
    };
  
    function makeLocalisationArray() {  
      return Array.apply(null, Array(10)).map(function() {
        return [Math.round((Math.random()*360 - 180) * 1000)/1000, Math.round((Math.random()*360 - 180) * 1000)/1000];
      });
    }

    function isTransmissible() {  
      var random_boolean = Math.random() >= 0.5;
        return random_boolean;
          
       
      };

  //Finds the cars that the last localisation is in a given geographical area
const findLocalisation = function(db, callback,latitudeMin,latitudeMax){
  
  var dbo = db.db("medicalDB");
  const collection = dbo.collection('patients');
  collection.find({GpsCoord : {$gt:latitudeMin, $lt:latitudeMax}}).toArray(function(err, docs) { 
    assert.equal(err, null);
    console.log("Found the following records");

    for (var i = docs.length - 1; i >= 0; i--) {
    	console.log(docs[i])
    }

    callback(docs);
  });
}
  
  

 