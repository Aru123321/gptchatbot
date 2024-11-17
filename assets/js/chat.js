var checkout = {};

$(document).ready(function () {
  var $messages = $(".messages-content"),
    d,
    h,
    m,
    i = 0;

  $(window).load(function () {
    $messages.mCustomScrollbar();
    insertResponseMessage(
      "Hi there, I'm your personal Concierge. How can I help?"
    );
  });

  function updateScrollbar() {
    $messages
      .mCustomScrollbar("update")
      .mCustomScrollbar("scrollTo", "bottom", {
        scrollInertia: 10,
        timeout: 0,
      });
  }

  function setDate() {
    d = new Date();
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ":" + m + "</div>").appendTo(
        $(".message:last")
      );
    }
  }

  function callChatbotApi(message) {
    // params, body, additionalParams
    return sdk.chatbotPost(
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "rMN5xYslhF1bt2oOwd0fQ2dSIsp6xhVf3jr8A56Y",
        "Access-Control-Allow-Origin": "*",
      },
      {
        message: message,
      },
      {}
    );
  }

  function insertMessage() {
    msg = $(".message-input").val();
    if ($.trim(msg) == "") {
      return false;
    }
    $('<div class="message message-personal">' + msg + "</div>")
      .appendTo($(".mCSB_container"))
      .addClass("new");
    setDate();
    $(".message-input").val(null);
    updateScrollbar();

    callChatbotApi(msg)
      .then((response) => {
        console.log(response);
        insertResponseMessage(response.data);
      })
      .catch((error) => {
        console.log("an error occurred", error);
        insertResponseMessage("Oops, something went wrong. Please try again.");
      });
  }

  $(".message-submit").click(function () {
    insertMessage();
  });

  $(window).on("keydown", function (e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  });

  function insertResponseMessage(content) {
    // Convert Markdown-style bold (**) to HTML <strong> tags
    const formattedContent = content.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Append the loading animation
    $(
      '<div class="message loading new"><figure class="avatar"><img src="https://media.tenor.com/images/4c347ea7198af12fd0a66790515f958f/tenor.gif" /></figure><span></span></div>'
    ).appendTo($(".mCSB_container"));
    updateScrollbar();

    // Simulate a delay for the loading animation, then replace it with the response
    setTimeout(function () {
      $(".message.loading").remove(); // Remove the loading animation
      $(
        '<div class="message new"><figure class="avatar"><img src="https://media.tenor.com/images/4c347ea7198af12fd0a66790515f958f/tenor.gif" /></figure>' +
          formattedContent + // Use the formatted content for bold text
          "</div>"
      )
        .appendTo($(".mCSB_container"))
        .addClass("new");
      setDate();
      updateScrollbar();
    }, 500); // Adjust the delay time as needed
  }
});
