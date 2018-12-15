// Get all the articles as a JSON
$.getJSON("/articles", function(data) {
  // Loop through each one
  for (var i = 0; i < data.length; i++) {
    // Display the info on the page
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        "<a href='https://www.latimes.com" +
        data[i].link +
        "'>" +
        data[i].link +
        "</a></p>"
    );
  }
});

// When the user clicks on a <p> element
$(document).on("click", "p", function() {
  // clear out the notes
  $("#notes").empty();
  // Assign data-id from <p> to variable
  var thisId = $(this).attr("data-id");

  //   Make call for article that the user has clicked on
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#notes").append("<h5>" + data.title + "</h5>");
    $("#notes").append("<input id='titleinput' name='title' />");
    $("#notes").append("<textarea id='bodyinput' name='body' ></textarea>");
    $("#notes").append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );

    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});

// When the user clicks on the save note button
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
