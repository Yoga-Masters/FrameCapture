var imageCapture;
var latestImg;
var latestBase64;
var isRecording = false;

function startStop() {
    if (!isRecording) {
        document.getElementById("StartStop").textContent = "Stop";
        onGetUserMediaButtonClick();
    } else {
        document.getElementById("StartStop").textContent = "Start";
        console.log(latestBase64);
    }
    isRecording = !isRecording;
}

function onGetUserMediaButtonClick() {
    navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then(mediaStream => {
            document.querySelector('video').srcObject = mediaStream;
            const track = mediaStream.getVideoTracks()[0];
            imageCapture = new ImageCapture(track);
            onGrabFrameButtonClick();
        })
        .catch(error => ChromeSamples.log(error));
}

function onGrabFrameButtonClick() {
    imageCapture.grabFrame()
        .then(imageBitmap => {
            const canvas = document.querySelector('#grabFrameCanvas');
            latestImg = imageBitmap;
            drawCanvas(canvas, imageBitmap);
        })
        .catch(error => ChromeSamples.log(error));
}

function onTakePhotoButtonClick() {
    imageCapture.takePhoto()
        .then(blob => createImageBitmap(blob))
        .then(imageBitmap => {
            const canvas = document.querySelector('#takePhotoCanvas');
            drawCanvas(canvas, imageBitmap);
        })
        .catch(error => ChromeSamples.log(error));
}

/* Utils */

function drawCanvas(canvas, img) {
    canvas.width = getComputedStyle(canvas).width.split('px')[0];
    canvas.height = getComputedStyle(canvas).height.split('px')[0];
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
        x, y, img.width * ratio, img.height * ratio);
    document.getElementById("counter").textContent = parseInt(document.getElementById("counter").textContent) + 1;
    latestBase64 = canvas.toDataURL();
    if (isRecording) onGrabFrameButtonClick();
}

document.querySelector('video').addEventListener('play', function () {
    document.querySelector('#grabFrameButton').disabled = false;
    document.querySelector('#takePhotoButton').disabled = false;
});