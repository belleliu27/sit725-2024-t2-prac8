$(document).ready(function () {
  $(".modal").modal();
  $(".scrollspy").scrollSpy();

  // Fetch projects from the server
  $.ajax({
    type: "GET",
    url: "/api/projects",
    success: function (projects) {
      let projectCards = "";
      projects.forEach((project) => {
        projectCards += `
          <div class="col s12 m6">
            <div class="card">
              <div class="card-image">
                <img src="${project.image}">
                <span class="card-title">${project.title}</span>
              </div>
              <div class="card-content">
                <p>${project.description}</p>
              </div>
              <div class="card-action">
                <a href="${project.link}">View Project</a>
              </div>
            </div>
          </div>`;
      });
      $("#projects .row").html(projectCards);
    },
    error: function (error) {
      console.error("Error fetching projects:", error);
    },
  });

  // Set up Socket.io client
  let socket = io();

  // Listen for 'number' event from the server
  socket.on("number", (msg) => {
    console.log("Random number: " + msg);
    M.toast({ html: "Random number: " + msg }); // Displaying the message using a Materialize toast
  });

  // Handle contact form submission
  $("#contact-form").on("submit", function (event) {
    event.preventDefault();
    const formData = {
      name: $("#name").val(),
      email: $("#email").val(),
      message: $("#message").val(),
    };
    $.ajax({
      type: "POST",
      url: "/api/contact",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        M.toast({ html: "Message sent!" });
        $("#contact-form")[0].reset();
        var instance = M.Modal.getInstance($("#contact-modal"));
        instance.close();
      },
      error: function (error) {
        M.toast({ html: "Error sending message." });
      },
    });
  });
});
