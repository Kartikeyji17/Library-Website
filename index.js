alert("Welcome to the library");

const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Check if dark mode was previously enabled
if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️ Light Mode";
}

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("dark-mode", "disabled");
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});

const quotes = [
  "\"A reader lives a thousand lives before he dies.\" – George R.R. Martin",
  "\"The only thing that you absolutely have to know, is the location of the library.\" – Albert Einstein",
  "\"A room without books is like a body without a soul.\" – Marcus Tullius Cicero",
  "\"So many books, so little time.\" – Frank Zappa"
];

let quoteIndex = 0;
const quoteText = document.getElementById("quoteText");

function changeQuote() {
  quoteText.style.opacity = 0; // Fade out
  setTimeout(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteText.textContent = quotes[quoteIndex];
    quoteText.style.opacity = 1; // Fade in
  }, 1000); // Wait for fade-out before changing text
}

setInterval(changeQuote, 5000);

document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('time');
  const startButton = document.getElementById('start');
  const resetButton = document.getElementById('reset');
  const minutesInput = document.getElementById('minutes');
  const progressBar = document.getElementById('progress-bar');
  const alarmSound = document.getElementById('alarm-sound');
  const fileInput = document.getElementById('file-input');
  const fileContent = document.getElementById('file-content');
  let timer;
  let timeLeft = 0; // Start with 0 seconds
  let totalTime = 1500; // Default total time (25 minutes)

  // Update Timer Display and Progress Bar
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Start Pomodoro Timer
  function startTimer() {
    if (timer) {
      clearInterval(timer);
    }
    timeLeft = parseInt(minutesInput.value) * 60 || totalTime; // Use input value or default
    totalTime = timeLeft; // Set total time to the input value
    updateDisplay(); // Update display immediately
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        playAlarm();
      }
    }, 1000);
  }

  // Play Alarm Sound
  function playAlarm() {
    const audio = document.getElementById("alarm-sound");

    audio.play().catch(error => {
        console.log("Audio blocked, waiting for user interaction.");
        document.body.addEventListener("click", () => {
            audio.play();
        }, { once: true });
    });

    // If audio fails completely, use a backup beep
    setTimeout(() => {
        if (audio.paused) {
            playBeep();
        }
    }, 1000);
  }

  // Reset Timer
  function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 0; // Reset to 0 seconds
    totalTime = 1500; // Reset total time to default
    updateDisplay();
  }

  // Read Uploaded File (Text, PDF, and Image Support)
  function readFile(event) {
    const file = event.target.files[0];

    if (!file) {
      fileContent.textContent = "No file selected.";
      return;
    }

    // Check the uploaded file type
    const validTypes = ["text/plain", "application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      fileContent.textContent = "Unsupported file type. Please upload a text, PDF, JPG, or PNG file.";
      return;
    }

    if (file.type === "text/plain") {
      // Handle plain text files
      const reader = new FileReader();
      reader.onload = function (e) {
        fileContent.textContent = e.target.result;
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      // Handle PDF files
      const reader = new FileReader();
      reader.onload = function (e) {
        const pdfViewer = document.createElement("iframe");
        pdfViewer.src = e.target.result;
        pdfViewer.width = "100%";
        pdfViewer.height = "100%";
        pdfViewer.style.border = "none";

        // Clear previous content and display the PDF
        fileContent.innerHTML = "";
        fileContent.appendChild(pdfViewer);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "image/jpeg" || file.type === "image/png") {
      // Handle image files (JPG, PNG)
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.alt = "Uploaded Image";

      // Clear previous content and display the image
      fileContent.innerHTML = "";
      fileContent.appendChild(img);
    }
  }

  // Attach Event Listeners
  startButton.addEventListener('click', startTimer);
  resetButton.addEventListener('click', resetTimer);
  fileInput.addEventListener('change', readFile);

  // Initialize Timer Display
  updateDisplay();
});
