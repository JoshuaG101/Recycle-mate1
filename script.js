const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let cameraActive = false;




// Initialize QuaggaJS
function initQuagga() {
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#interactive'),
        constraints: {
            facingMode: "environment" // Use the back camera
        }
    },
    decoder: {
        readers: ["ean_reader"] // Specify the type of barcode to scan
    }
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("QuaggaJS initialized.");
    Quagga.start();
    cameraActive = true;
});
}




function stopQuagga() {
Quagga.stop();
cameraActive = false;
}




// Start the camera when "Scan your Item" button is clicked
document.getElementById('scanButton').addEventListener('click', function() {
if (!cameraActive) {
    initQuagga();
} else {
    stopQuagga();
}
});




// Process the result when a barcode is detected
Quagga.onDetected(function(result) {
const code = result.codeResult.code;
console.log("Detected barcode:", code);




// Show the detected barcode
const resultElement = document.createElement('div');
resultElement.id = 'result';
resultElement.innerText = `Barcode detected: ${code}`;
document.body.appendChild(resultElement);




// Stop QuaggaJS scanning
Quagga.stop();
 // Capture the current frame (screen grab)
screenGrab();
});


function hideInitialElements() {
   document.querySelector('h1').style.display = 'none';
   document.querySelector('p').style.display = 'none';
   document.querySelector('.learn-more-button').style.display = 'none';
   document.getElementById('moreContent').style.display = 'none';
}


function showInitialElements() {
   document.querySelector('h1').style.display = 'block';
   document.querySelector('p').style.display = 'block';
   document.querySelector('.learn-more-button').style.display = 'block';
   // Keep 'moreContent' hidden as it should only show when "Learn More" is clicked
   document.getElementById('moreContent').style.display = 'none';
}


// Function to take a screenshot from the video feed
function screenGrab() {
   const videoElement = document.querySelector('#interactive video');
   const interactiveDiv = document.getElementById('interactive');




// Set canvas size to match the video size
canvas.width = videoElement.videoWidth;
canvas.height = videoElement.videoHeight;


context.clearRect(0, 0, canvas.width, canvas.height);


// Draw the current frame from the video onto the canvas
context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);




// Get the image data URL from the canvas
const imageDataURL = canvas.toDataURL('image/png');


const stream = videoElement.srcObject;
const tracks = stream.getTracks();
tracks.forEach(track=> track.stop());


videoElement.remove();
interactiveDiv.style.display = 'none';


const resultContainer = document.createElement('div');
resultContainer.id = 'resultContainer';
resultContainer.style.textAlign = 'center';
document.body.appendChild(resultContainer);


// Display the captured image
const img = new Image();
img.src = imageDataURL;
img.style.maxWidth = '100%';
img.style.height = 'auto';
img.style.marginBottom = '20px';
resultContainer.appendChild(img);




// Create and append a div with the recycling instructions
const instructions = document.createElement('div');
instructions.classList.add('instructions');
instructions.innerHTML = `
  <h2>Recycling Instructions</h2>
  <p1><strong>1. Separate Materials</strong></p>
  <p1>Remove Metal Spiral Binding: If your notebook has a metal spiral, carefully remove it. Metal can typically be recycled separately.</p1>
  <p1>Remove Plastic Covers: If the notebook has plastic covers, these should be removed and disposed of separately as they may not be recyclable in standard paper streams.</p1>
  <p1><strong>2. Paper Recycling</strong></p1>
  <p1>Recycle Paper Pages: Most notebook pages, especially if they are uncoated or lightly printed, can go into your regular paper recycling. Check for any coated or laminated pages, which might need special handling.</p1>
  <p1><strong>3. Repurpose Unused Pages</strong></p1>
  <p1>Reuse Pages: If the notebook has unused pages, consider tearing them out and using them for scratch paper, note-taking, or shopping lists before recycling the rest.</p1>
`;
resultContainer.appendChild(instructions);


const scanAgainButton = document.createElement('button');
   scanAgainButton.textContent = 'Scan Again';
   scanAgainButton.classList.add('scan-button');
   scanAgainButton.addEventListener('click', function() {
       resetScanner();
       showInitialElements();
   });
   resultContainer.appendChild(scanAgainButton);


}


function resetScanner() {
   // Remove the result container
   const resultContainer = document.getElementById('resultContainer');
   if (resultContainer) {
       resultContainer.remove();
   }


   // Show the interactive div and reset its content
   const interactiveDiv = document.getElementById('interactive');
   interactiveDiv.style.display = 'flex';
   interactiveDiv.innerHTML = '<img id="cameraPlaceholder" src="https://www.svgrepo.com/show/116752/film-camera.svg" alt="Camera Placeholder" style="display: block; max-width: 30%; border-radius:20px"/>';


   // Reset the scan button
   const scanButton = document.getElementById('scanButton');
   scanButton.textContent = 'Scan your Item';
   cameraActive = false;


   // Show initial elements
   showInitialElements();
}




document.getElementById('scanButton').addEventListener('click', function() {
   if (!cameraActive) {
       initQuagga();
       this.textContent = 'Cancel Scan';
       hideInitialElements();
   } else {
       stopQuagga();
       resetScanner();
   }
});


// Modify the Quagga.onDetected function
Quagga.onDetected(function(result) {
   const code = result.codeResult.code;
   console.log("Detected barcode:", code);


   // Stop QuaggaJS scanning
   Quagga.stop();
  
   // Hide initial elements
   hideInitialElements();
  
   // Capture the current frame (screen grab)
   screenGrab();
});



