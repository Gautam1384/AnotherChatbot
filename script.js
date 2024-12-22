let btn = document.querySelector(".microphone-button");
let recognition; // Declare globally for start/stop control
let isMicrophoneOn = false; // Track microphone state

// Initialize Speech Recognition
const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log("Speech recognition started...");
        };

        recognition.onresult = (e) => {
            if (e.results.length > 0) {
                const result = e.results[0][0];
                const spokenText = result.transcript.toLowerCase().trim();
                const confidence = result.confidence;

                console.log(`Recognized Text: "${spokenText}" (Confidence: ${confidence})`);

                if (confidence > 0.75) { // Process only confident results
                    handleCommands(spokenText);
                } else {
                    console.warn("Low confidence result ignored.");
                }
            }
        };

        recognition.onerror = (err) => {
            console.error("Speech Recognition Error:", err.error);
            if (err.error === "no-speech") {
                speakFunc("I couldn't hear anything. Please try again.");
            }
        };

        recognition.onend = () => {
            if (isMicrophoneOn) {
                // Restart recognition if the microphone is still on
                recognition.start();
            } else {
                console.log("Speech recognition stopped.");
            }
        };
    } else {
        alert("Your browser does not support voice input!");
    }
};

// Speak Function
const speakFunc = (input) => {
    let speakInput = new SpeechSynthesisUtterance(input);
    speakInput.rate = 1.2;
    speakInput.lang = 'en-HI';
    speakInput.volume = 1;
    window.speechSynthesis.speak(speakInput);
    console.log("Bot Response:", input);
};

// Greeting Function
const greetingFunc = () => {
    let date = new Date();
    let hour = date.getHours();
    if (hour >= 0 && hour < 12) {
        return "Good Morning Sir!";
    } else if (hour >= 12 && hour < 16) {
        return "Good Afternoon Sir!";
    } else {
        return "Good Evening Sir!";
    }
};

// Handle User Commands
const handleCommands = (command) => {
    console.log("Processing Command:", command);

    const greetings = ["hi", "hello", "hey"];
    if (greetings.includes(command)) {
        let greeting = greetingFunc();
        speakFunc(`Hello! ${greeting} How can I help you?`);
    } else {
        speakFunc("I'm sorry, I didn't understand that. Can you please repeat?");
    }
};

// Start Voice Input
const startVoiceInput = () => {
    if (recognition) {
        recognition.start();
    } else {
        console.error("Speech Recognition not initialized.");
    }
};

// Stop Voice Input
const stopVoiceInput = () => {
    if (recognition) {
        recognition.stop();
        console.log("Speech recognition stopped.");
    }
};

// Button Event Listeners
btn.onmousedown = () => {
    if (!isMicrophoneOn) {
        isMicrophoneOn = true;
        btn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
        speakFunc("Microphone is now on. You can speak.");
        startVoiceInput();
    }
};

btn.onmouseup = () => {
    if (isMicrophoneOn) {
        isMicrophoneOn = false;
        btn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
        speakFunc("Microphone is now off.");
        stopVoiceInput();
    }
};

// Initialize Speech Recognition on Page Load
window.onload = () => {
    initializeRecognition();
};