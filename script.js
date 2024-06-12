const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const challengeWordElem = document.getElementById('challengeWord');

// Variable to store the username
let username = '';

const submitUsernameButton = document.getElementById('submitUsernameButton');
submitUsernameButton.addEventListener('click', function() {
  const usernameInput = document.getElementById('usernameInput');
  username = usernameInput.value;
  // Call the challenge function after setting the username
  challenge();
});

// Get the background color picker element
const backgroundColorPicker = document.getElementById('backgroundColorPicker');

// Initial background color
let backgroundColor = backgroundColorPicker.value;

// Add an event listener to listen for changes in the background color picker
backgroundColorPicker.addEventListener('input', function() {
  backgroundColor = backgroundColorPicker.value;
  setBackground();
});

const challengeWords = [
  'Your Thread Enieme', 'Your Thread Crush', 'Ice-Cream', 'Dildo', '2pac', 'Your Pet', 'Your Fav Threader', 'Shrek', 'Spongebob', 'Silly Ghost', 'Happy Pizza Slice', 'Your Own Face', 'Silly Cat', 'Quirky Fish'
];

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let strokeColor = '#000'; // Default color
let drawingHistory = [];
let redoHistory = [];

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

colorPicker.addEventListener('input', function() {
  strokeColor = this.value; // Update strokeColor with the selected color
});

function startDrawing(e) {
  isDrawing = true;
  const { offsetX, offsetY } = getMousePosition(e);
  [lastX, lastY] = [offsetX, offsetY];
  saveDrawingState();
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault(); // Prevent scrolling when drawing on mobile devices
  const { offsetX, offsetY } = getMousePosition(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.strokeStyle = strokeColor; // Set the stroke color to the selected color
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
  [lastX, lastY] = [offsetX, offsetY];
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  saveDrawingState();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setBackground();
  drawingHistory = [];
  redoHistory = [];
}

function saveDrawingState() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  drawingHistory.push(imageData);
}

function undo() {
  if (drawingHistory.length > 1) {
    redoHistory.push(drawingHistory.pop());
    restoreCanvas();
  } else {
    clearCanvas();
  }
}

function redo() {
  if (redoHistory.length > 0) {
    drawingHistory.push(redoHistory.pop());
    restoreCanvas();
  }
}

function restoreCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setBackground();
  if (drawingHistory.length > 0) {
    ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
  }
}

function saveImage() {
  // Create a new canvas to hold the merged image
  const mergedCanvas = document.createElement('canvas');
  const mergedCtx = mergedCanvas.getContext('2d');
  mergedCanvas.width = canvas.width;
  mergedCanvas.height = canvas.height;

  // Draw the background color on the merged canvas
  mergedCtx.fillStyle = backgroundColor;
  mergedCtx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);

  // Draw the existing canvas content (drawing) on the merged canvas
  mergedCtx.drawImage(canvas, 0, 0);

  // Add the challenge text with a little white space above
  const challengeText = challengeWordElem.textContent;
  mergedCtx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Set white color with transparency
  mergedCtx.fillRect(0, 0, mergedCanvas.width, 50); // Add white space for challenge text
  mergedCtx.fillStyle = '#000'; // Set text color
  mergedCtx.font = 'bold 18px Arial'; // Set font style and size
  mergedCtx.textAlign = 'left'; // Align text to the left
  mergedCtx.fillText(challengeText, 10, 30); // Render challenge text

  // Add the username as a watermark
  mergedCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Set text color with transparency
  mergedCtx.font = 'italic 20px Arial'; // Set font style and size
  mergedCtx.textAlign = 'right'; // Align text to the right
  mergedCtx.fillText(username, mergedCanvas.width - 10, mergedCanvas.height - 10); // Render username

  // Create a temporary link element to download the image
  const link = document.createElement('a');
  link.href = mergedCanvas.toDataURL('image/png');
  link.download = 'digital_doodle.png';
  link.click();
}


function setBackground() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (drawingHistory.length > 0) {
    ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
  }
}

function getMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  return {
    offsetX: clientX - rect.left,
    offsetY: clientY - rect.top
  };
}

function resizeCanvas() {
    if (window.innerWidth <= 600) { // Mobile or small screens
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.6;
    } else { // Desktop or larger screens
        canvas.width = 600; // Set a fixed width for desktop
        canvas.height = 400; // Set a fixed height for desktop
    }
    setBackground();
    if (drawingHistory.length > 0) {
        ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

  

function challenge() {
  const randomIndex = Math.floor(Math.random() * challengeWords.length);
  const randomWord = challengeWords[randomIndex];
  challengeWordElem.textContent = `Challenge: Draw ${randomWord}`;
}

// Set the initial background color on page load
window.onload = setBackground;