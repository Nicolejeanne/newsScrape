// Require Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytScraper";

mongoose.connect(MONGODB_URI);

// Routes
// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  axios.get("http://www.nytimes.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    let array = [];

		// With cheerio, find each h2-tag with the class "balancedHeadline" and loop through the results
		$('h2.balancedHeadline').each(function(i, element) {
			// Save the text of the h2-tag as "title"
			var title = $(element).text();

			// Find the h2 tag's parent a-tag, and save it's href value as "link"
			var link = $(element)
				.parent()
				.attr('href');
      array.push({title: title, link: link});
      // Create a new Article using the `result` object built from scraping
      
    });
    db.Article.create(array)
        .then(function(dbArticle) {
          console.log(dbArticle);
          
        })
        .catch(function(err) {
          return res.json(err);
        });
    res.send("Scrape complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Find all in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    // populate all of the associated notes
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});