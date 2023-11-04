const preview = document.getElementById("preview");
const reviewVideo = document.getElementById("review");
const downloadBtn = document.getElementsByClassName("download")[0];
const fileInput = document.getElementById("file");
const outputFiled = document.getElementsByClassName("outputtext")[0];
const startRecording = document.getElementById("startrecording");
const fileReader = new FileReader();
const recordedChunks = [];

async function captureScreen(mediaDeviceOptions) {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia(
      mediaDeviceOptions
    );
    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, { type: recordedChunks[0].type });
      const objectURL = URL.createObjectURL(blob);
      reviewVideo.src = objectURL;
    };
    mediaRecorder.start();
    preview.srcObject = mediaStream;
  } catch (error) {
    console.log("Error", error);
  }
}

function downloadVideo(event) {
  event.preventDefault();
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "RecordedVideo.webm";
  document.body.appendChild(a);
  a.click();
}

function enableFileReading() {
  fileInput.addEventListener("change", (event) => {
    event.preventDefault();
    fileReader.onload = function () {
      outputFiled.textContent = fileReader.result;
    };
    fileReader.readAsText(event.target.files[0]);
  });
}

startRecording.addEventListener(
  "click",
  captureScreen({ video: true, audio: true })
);
downloadBtn.addEventListener("click", downloadVideo); // we should use event delegation here.
