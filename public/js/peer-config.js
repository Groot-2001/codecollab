let localStream;
let existingCall;
// PeerJS object
var peer = new Peer();

peer.on("open", function () {
  $("#my-id").text(peer.id);
});

// Click handlers setup
$(function () {
  $("#make-call").click(function () {
    // Initiate a call!
    var call = peer.call($("#callToId").val(), localStream);

    step3(call);
  });

  $("#end-call").click(function () {
    existingCall.close();
    step2();
  });

  // Get things started
  step1();
});

// Receiving a call
peer.on("call", function (call) {
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(localStream);
  step3(call);
});

peer.on("error", function (err) {
  alert(err.message);
  // Return to step 2 if error occurs
  step2();
});

async function step1() {
  // Get audio/video stream
  try {
    //Media capture devices includes video cameras and microphones
    const constraints = { video: true, audio: true };
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoElement = document.getElementById("my-video");
    //Once a media device has been opened and we have a MediaStream available,
    //we can assign it to a video or audio element to play the stream locally.
    videoElement.srcObject = localStream;

    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };

    step2();
  } catch (error) {
    $("#step1-error").show();
    //Error opening video camera.
    console.error("Error opening video camera.", error);
  }
}

function step2() {
  $("#step1, #step3").hide();
  $("#step2").show();
}

function step3(call) {
  // Hang up on an existing call if present
  if (existingCall) {
    existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on("stream", async (stream) => {
    // Get audio/video stream
    try {
      //Media capture devices includes video cameras and microphones
      const videoElement = document.getElementById("second-video");
      //Once a media device has been opened and we have a MediaStream available,
      //we can assign it to a video or audio element to play the stream locally.
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        videoElement.play();
      };
    } catch (error) {
      //Error opening video camera.
      console.error("Error opening answer video camera.", error);
    }
  });

  // UI stuff
  existingCall = call;
  $("#second-id").text(call.peer);
  call.on("close", step2);
  $("#step1, #step2").hide();
  $("#step3").show();
}
