document.addEventListener("DOMContentLoaded", () => {
    checkUserSession();
    displayPrivateMessages();
});

// Predefined users (hardcoded for testing)
const users = {
    "john": "password123",
    "alice": "securepass",
    "mike": "qwerty"
};

// Check if user is already logged in
function checkUserSession() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        showAppSection();
    }
}

// Login function
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    console.log(username, password)
    if (users[username] && users[username] === password) {
        localStorage.setItem("loggedInUser", username);
        alert("Login successful!");
        showAppSection();
    } else {
        alert("Invalid username or password.");
    }
}

// Show main app section & hide login
function showAppSection() {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
}

// Media upload preview
function uploadMedia() {
    const fileInput = document.getElementById("mediaUpload");
    const mediaPreview = document.getElementById("mediaPreview");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileURL = URL.createObjectURL(file);
        const mediaElement = document.createElement(file.type.startsWith("image") ? "img" : "video");

        mediaElement.src = fileURL;
        mediaElement.style.maxWidth = "100%";
        mediaElement.style.marginTop = "10px";

        if (file.type.startsWith("video")) {
            mediaElement.controls = true;
            mediaElement.style.maxHeight = "300px";
        }

        mediaPreview.innerHTML = "";
        mediaPreview.appendChild(mediaElement);
    }
}

// Messages storage (simulating database)
let messages = JSON.parse(localStorage.getItem("messages")) || {};

// Send a private message
function sendPrivateMessage() {
    const sender = localStorage.getItem("loggedInUser");
    const recipient = document.getElementById("recipientUsername").value.trim();
    const messageText = document.getElementById("privateMessage").value.trim();
    
    if (!recipient || !messageText) {
        alert("Please enter recipient's username and a message.");
        return;
    }
    
    fetch('http://localhost:5050/api/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender, recipient, messageText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Message sent!");
            displayPrivateMessages();
        } else {
            alert("Error sending message.");
        }
    })
    .catch(error => console.error('Error sending message:', error));
}

function displayPrivateMessages() {
    const currentUser = localStorage.getItem("loggedInUser");
    const privateMessagesArea = document.getElementById("privateMessagesArea");
    privateMessagesArea.innerHTML = "";
    
    fetch(`http://localhost:5050/api/messages/messages/${currentUser}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.messages.forEach(msg => {
                if (msg.sender === currentUser || msg.recipient === currentUser) {
                    const messageElement = document.createElement("div");
                    messageElement.textContent = `${msg.sender}: ${msg.messageText}`;
                    messageElement.classList.add("private-message");
                    privateMessagesArea.appendChild(messageElement);
                }
            });
        } else {
            alert("Error retrieving messages.");
        }
    })
    .catch(error => console.error('Error fetching messages:', error));
}