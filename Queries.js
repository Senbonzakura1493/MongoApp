var menu = require('node-menu');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27078/";



MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  //ImportantInfosPatient(db,'zpaAMyZybA');
  
  //findGiverNearestGriversInArea(db,'B +',-180,180,-180,180);

  menu.addDelimiter('-', 40, 'Patients database')
  .addItem(
    'Créer et peupler la base de données',
    function(){
      populateDB(db, function(){});
    }
    )
    .addItem(
      'Requête simple : Vérifier la/les allergies médicamenteuses ou maladie specifique du patient .',
      function(patientName){
        ImportantInfosPatient(db,patientName, function(){});
        
      },
      null,
	        [{'name': 'patientName', 'type':'string'}])
      
    
    .addItem(
      'Requête moyenne : Renvoie les patients ayant des soucis cardiaques avec pour chacun, la liste des fréquences anormales apparues et leur tension associée.',
      function(){
        findCardiacPatients(db, function(){});
      }
    )

    .addItem(
      'Requête complexe: Renvoyer les patients pouvant être donneur (18<age<60 , groupeSanguin compatible, sans maladie transmissible) qui sont dans un périmètre donné',
      function(bloodGroup,latMin, latMax, longMin, longMax){
        findGiverNearestGriversInArea(db,bloodGroup,latMin, latMax, longMin, longMax, function(){});
        
      },
      null,
      [{'name': 'bloodGroup <space> rhesus', 'type': 'string'},{'name': 'latMin', 'type': 'numeric'}, {'name': 'latMax', 'type': 'numeric'}, {'name': 'longMin', 'type': 'numeric'}, {'name': 'longMax', 'type': 'numeric'}])
        
	    .addDelimiter('*', 40)
	    .start();
  

});

function test(db){

 var dbo = db.db("medicalDB");
  
  dbo.collection("patients").findOne({GpsCoord:{$exists:true}} , function(err, result) {
  if (err) throw err;
  console.log(result.GpsCoord);
  db.close();
});
}

//Requête simple : Vérifier la/les allergies médicamenteuses ou maladie specifique du patient .
function ImportantInfosPatient(db,name){

  var dbo = db.db("medicalDB");
  
  dbo.collection("patients").findOne({name :name,drugAllergy:{$exists:true}} || {specificDisease:{$exists:true}} , function(err, result) {
  if (err) throw err;
  if (result.drugAllergy){
    console.log("Allergie(s) médicamenteuse(s):")
    console.log(result.drugAllergy)
  }
  if (result.specificDisease){
    console.log("Maladie spécifique présente :")
    console.log(result.specificDisease)
  }
  
});
}

//Requête moyenne : Renvoie les patients ayant des soucis cardiaques avec pour chacun d'eux la liste des fréquences anormales apparues et leur tension associée.
function findCardiacPatients(db){

  var dbo = db.db("medicalDB");
  var query = {cardio : {$exists :true}, pressure: {$exists :true}}
  
  dbo.collection("patients").find(query).toArray(function(err, result) {
    if (err) throw err;
    for (var i = result.length - 1; i >= 0; i--) { 
      var liste = new Array(); 
      var listeAss = new Array();
      var liste2 = new Array();
      var listeAss2 = new Array(); 
      for(var j = result[i].cardio.length -1 ; j>=0 ; j--){ 
        if(result[i].cardio[j]>120){
          
          liste.push(result[i].cardio[j]) 
          listeAss.push(result[i].pressure[j])
        }
        if(result[i].cardio[j]<50){
          
          liste2.push(result[i].cardio[j])
          listeAss2.push(result[i].pressure[j]) 
          
        }
      }
      console.log("nom :" + result[i].name);
      if (liste.length > 0 ){
        
        console.log('Fréquences trop élevées');
        console.log(liste);
        console.log('Tensions Associées');
        console.log(listeAss);
      }
      
      if (liste2.length > 0 ){
        console.log('Fréquences trop faibles');
        console.log(liste2);
        console.log('Tensions Associées');
        console.log(listeAss2);
      }
        
       
    }
    

  });
  
  
}

//Requête complexe: Renvoyer les patients pouvant être donneur (18<age<60 , groupeSanguin compatible, sans maladie transmissible) qui sont dans un périmètre donné 
function findGiverNearestGriversInArea(db,bloodGroup,latMin,latMax,longMin,longMax){
    var dbo = db.db("medicalDB");
    
    if (bloodGroup =='AB +'){
      var query = {Age : {$gt : 18,$lt : 60},bloodGroup: {$exists:true} , transmissibleDisease : false ,"GpsCoord.9.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.9.1" : {$gte:longMin, $lte:longMax}};
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
        
      }
      
    });
  }
    if (bloodGroup =='AB -'){
      var query = {Age : {"$gt" : 18},bloodGroup: {"$nin" : ['B +', 'A +', 'AB +'] } , transmissibleDisease : false ,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      
    });
  }
    if (bloodGroup =='A +'){
      var query = {Age : {"$gt" : 18},bloodGroup: {"$in" : ['O +', 'A +', 'A -','O -'] } , transmissibleDisease : false,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      
    });
    }
    if (bloodGroup =='A -'){
      var query = {Age : {"$gt" : 18},bloodGroup: {"$in" : ['O -','A -'] } , transmissibleDisease : false,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      
    });
    }
    if (bloodGroup =='B +'){
      var query = {Age : {"$gt" : 18},bloodGroup: {"$in" : ['O -','O +','B +','B -'] } , transmissibleDisease : false,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      
    });
    }
    if (bloodGroup =='B -'){
      var query = {Age : {"$gt" : 18},bloodGroup: {"$in" : ['O -','B -'] } , transmissibleDisease : false,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      
    });
    }
    if (bloodGroup =='O +'){
      var query = {Age : {"$gt" : 18},bloodGroup: {"$in" : ['O -','O +'] } , transmissibleDisease : false,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      
    });
    }
    if (bloodGroup =='O -'){
      var query = {Age : {$gt : 18,$lt : 60},bloodGroup: 'O -', transmissibleDisease : false,"GpsCoord.0.0" : {$gt:latMin, $lt:latMax}, "GpsCoord.0.1" : {$gte:longMin, $lte:longMax} };
      dbo.collection("patients").find(query).toArray(function(err, result) {
      if (err) throw err;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log("nom : " + result[i].name)
        console.log("groupe sanguin :" + result[i].bloodGroup)
        console.log("Coordonnées GPS :" +result[i].GpsCoord.pop())
      }
      //console.log(result);
      
    });
    }
    

}

// Créer et remplis la base de donnée de valeurs aléatoires
function populateDB(db){
  var iteration;
  var dbo = db.db("medicalDB");
  
  console.log("Loading values in the database");
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
    
  }
  console.log('cardiac patients created');
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
    
  }
  console.log('sportsmen created !');
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
    
  }
  console.log('Patient with specific disease created'); 
  // patient with drugAllergy
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
  
  }
  console.log('Patients with no specific disease but drugAllergy created')
  
  
  
}


//Fonctions générant les valeurs aléatoires.

function makecharact() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }


  function makeCardio() {
    return Array.apply(null, Array(10)).map(function() {
      return Math.round((Math.random() *100)+ 40 );
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
        return [Math.round((Math.random()*100)+40) , Math.round((Math.random()*10) + 1 )];
      });
    }

    function makeTemperature() {  
      return Array.apply(null, Array(10)).map(function() {
        return Math.round((Math.random()*20)+20);
      });
    }

  function makeLocalisationArray() {  
    return Array.apply(null, Array(10)).map(function() {
      //return [Math.round((Math.random()*200)+80) , Math.round((Math.random()*120) + 40 )];
      return [Math.round((Math.random()*360 - 180) * 1000)/1000, Math.round((Math.random()*360 - 180) * 1000)/1000];
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








      