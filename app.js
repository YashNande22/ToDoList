const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin1:test123@cluster0.uifv8bm.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemsSchema = new mongoose.Schema({
  name : String 
})

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item ({
  name : "Welcome todolist"
})

const item2 = new Item ({
  name : "You can Add items with + Button"
})

const item3 = new Item ({
  name : "You can delete Items with checkbox"
})
const defaultItems = [item1,item2,item3];

const listSchema = new mongoose.Schema({
  name : String,
  items : [itemsSchema]
})

const List = mongoose.model("List",listSchema);



app.get("/", function(req, res) {
  Item.find({})
    .then(function(foundItems) {
      if (foundItems.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItems;
      }
    })
    .then(function(items) {
      res.render("list", {listTitle: "Today", newListItems: items});
    })
    .catch(function(err) {
      console.log(err);
    });
});




 app.post("/",function (req,res) {
  
 const itemName = req.body.newItem;
 const listName = req.body.list;


 const item = new Item({
  name : itemName
 })

 if (listName === "Today") {
 item.save();
 res.redirect("/");
 }else{
  List.findOne({ name: listName })
  .then(foundList => {
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  })
  .catch(err => console.error(err));

 }
 
 })

 app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName  = req.body.listName;


  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      console.log("successfully deleted item");
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting item");
    });
  }else{
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
  .then(foundList => {
    res.redirect("/" + listName);
  })
  .catch(err => console.error(err));

  }
  
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  // Check if the user is redirected to an existing list
  List.findOne({ name: customListName })
    .then(foundList => {
      if (!foundList) {
        // Create a new list if it does not exist
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // Render the existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    })
    .catch(err => console.log(err));
});



app.post("/work",function (req,res) {
  
  let item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
})
  
app.get("/about",function (req,res) {
  res.render("about");
})
  app.listen(3000,function () {
    console.log("server runing on 3000");
  })