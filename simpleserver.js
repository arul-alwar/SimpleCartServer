var express = require('express');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

var fs = require('fs');
var filePath = './cart.json';

function loadFile(filePath) {
  var fileContent = fs.readFileSync(filePath);
  var parseJson = [];
  parseJson = JSON.parse(fileContent);
  return parseJson;
}

function saveFile(filePath, jsonObjArray) {
  var fileContent = JSON.stringify(jsonObjArray);
  fs.writeFileSync(filePath, fileContent);
}
//Handles GET method on localhost:3000/
app.get('/', function (req, res) {
  res.send('Welcome to shopping cart application');
});

//Handles GET method on localhost:3000/
app.get('/about', function (req, res) {
  res.send('Welcome to shopping cart application.<br>This application is developed by Arul Murugan Alwar');
});

app.route('/cart')
  .get(function (req, res) {
    var objArray = loadFile(filePath);
    res.json(objArray);
  })

  .post(function (req, res) {
    var objArray = loadFile(filePath);
    var recentItem = null;
    for (var i = 0; i < objArray.length; i++) {
      if (recentItem==null || parseInt(objArray[i].id) > parseInt(recentItem.id))
        recentItem = objArray[i];
    }
    var newItemId = parseInt(recentItem.id)+1;
    objArray.push({ id: newItemId, name: req.body.name, quantity: req.body.quantity });
    saveFile(filePath, objArray);
    res.status(201).json(objArray);
  })


app.route('/cart/:id')
  .get(function (req, res) {
    var objArray = loadFile(filePath);
    var matchFound = false;
    matchFound = objArray.some(function (arrayItem, _index, _arr) {
      if (arrayItem.id == req.params.id) {
        res.json(arrayItem);
        return true;
      }
    });
    if(!matchFound) {
      res.status(404).send("No item found with Id:"+req.params.id);
    }
  })

  .put(function (req, res) {
    var objArray = loadFile(filePath);
    let itemId = parseInt(req.params.id);
    if (itemId != NaN) {
      var matchFound = false;
      matchFound = objArray.some(function (arrayItem, _index, arr) {
        if (arrayItem.id == req.params.id) {
          arrayItem.name = req.body.name;
          arrayItem.quantity = req.body.quantity;
          return true;
        }
      });
      if (!matchFound) objArray.push({ id: req.params.id, name: req.body.name, quantity: req.body.quantity });
      saveFile(filePath, objArray);
      if(matchFound) res.json(objArray);
      else res.status(201).json(objArray);
    }
  })

  .patch(function (req, res) {
    var objArray = loadFile(filePath);
    let itemId = parseInt(req.params.id);
    if (itemId != NaN) {
      var matchFound = false;
      matchFound = objArray.some(function (arrayItem, _index, arr) {
        if (arrayItem.id == req.params.id) {
          arrayItem.name = req.body.name;
          arrayItem.quantity = req.body.quantity;
          saveFile(filePath, arr);
          res.json(arr);
          return true;
        }
      });
      if (!matchFound) res.status(404).send("No item found with Id:" + req.params.id);
    }
  })

  .delete(function (req, res) {
    var objArray = loadFile(filePath);
    var itemFound = false;
    itemFound = objArray.some(function (arrayItem, index, _arr) {
      if (arrayItem.id == req.params.id) {
        objArray.splice(index, 1);
        saveFile(filePath, objArray);
        res.json(objArray);
        return true;
      }
    });
    if(!itemFound) res.status(404).send("No item found with Id:"+req.params.id);
  })
  

// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Hmm... Did Alexa ask you to visit this URL? Don't listen to her");
});

app.listen(3200, function () {
  console.log('Shopping cart server listening on port 3200!');
});