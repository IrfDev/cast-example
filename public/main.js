const _buttons = {};
const _presentation = {
  request: window.PresentationRequest
    ? new PresentationRequest("./build/index.html")
    : null,
  connection: null,
};

const checkAvailability = (evt) => {
  _buttons.connect.disabled = !evt.target.value;
};

const connectDisplay = async () => {
  try {
    _buttons.connect.disabled = true;
    _presentation.connection = await _presentation.request.start();
    _presentation.connection.addEventListener("connect", displayConnected);
    _presentation.connection.addEventListener("terminate", displayTerminated);
  } catch (e) {
    // do nothing when no presentation display is connected
    _buttons.connect.disabled = false;
  }
};

const changeImage = () => {
  _buttons.change.disabled = true;
  _presentation.connection.send("change");
};

const disconnectDisplay = async () => {
  if (_presentation.connection.state !== "closed") {
    _presentation.connection.terminate();
  } else {
    _presentation.connection.addEventListener("connect", () => {
      _presentation.connection.terminate();
    });
    _presentation.connection.reconnect(_presentation.connection.id);
  }
};

const displayConnected = () => {
  _buttons.connect.removeEventListener("click", connectDisplay);
  _buttons.connect.addEventListener("click", disconnectDisplay);
  _buttons.connect.classList.add("connected");
  _buttons.connect.disabled = false;
  _presentation.connection.addEventListener("message", imageLoaded);
};

const displayTerminated = () => {
  _buttons.connect.addEventListener("click", connectDisplay);
  _buttons.connect.classList.remove("connected");
  _buttons.connect.disabled = false;
  _buttons.change.disabled = true;
};

const imageLoaded = (evt) => {
  if (evt.data === "loaded") _buttons.change.disabled = false;
};

document.addEventListener("DOMContentLoaded", async () => {
  _buttons.connect = document.getElementById("connect");
  _buttons.change = document.getElementById("change");
  if (!_presentation.request) {
    alert("This browser does not support Presentation API.");
    return;
  }
  _buttons.connect.addEventListener("click", connectDisplay);
  _buttons.change.addEventListener("click", changeImage);
  const availability = await _presentation.request.getAvailability();
  _buttons.connect.disabled = !availability.value;
  availability.addEventListener("change", checkAvailability);

  document.querySelector("#start").addEventListener("click", startHandler);
  document.querySelector("#close").addEventListener("click", closeHandler);
  document
    .querySelector("#terminate")
    .addEventListener("click", terminateHandler);
});

window.addEventListener("unload", () => {
  if (_presentation.connection) disconnectDisplay();
});

// App ID EF1A139F is registered in the Google Cast SDK Developer
// Console and points to the following custom receiver:
// https://googlechrome.github.io/samples/presentation-api/receiver/index.html
const presentationRequest = new PresentationRequest("cast:EF1A139F");

// Make this presentation the default one when using the "Cast" browser menu.
navigator.presentation.defaultRequest = presentationRequest;

let presentationConnection;

function startHandler() {
  console.log("Starting presentation request...");
  presentationRequest
    .start()
    .then((connection) => {
      console.log(
        "> Connected to " + connection.url + ", id: " + connection.id
      );
    })
    .catch((error) => {
      // A timeout error is expected because the presentation is not connected.
    });
}

presentationRequest.addEventListener("connectionavailable", function (event) {
  presentationConnection = event.connection;
  presentationConnection.addEventListener("close", function () {
    console.log("> Connection closed.");
  });
  presentationConnection.addEventListener("terminate", function () {
    console.log("> Connection terminated.");
  });
});

function closeHandler() {
  console.log("Closing connection...");
  presentationConnection.close();
}

function terminateHandler() {
  console.log("Terminating connection...");
  presentationConnection.terminate();
}

/* Availability monitoring */

presentationRequest
  .getAvailability()
  .then((availability) => {
    console.log("Available presentation displays: " + availability.value);
    availability.addEventListener("change", function () {
      console.log("> Available presentation displays: " + availability.value);
    });
  })
  .catch((error) => {
    log(
      "Presentation availability not supported, " +
        error.name +
        ": " +
        error.message
    );
  });
