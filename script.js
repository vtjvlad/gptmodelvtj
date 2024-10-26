const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    addMessageToChat('user', userMessage);
    userInput.value = '';

    const gptMessage = await getGptResponse(userMessage);
    addMessageToChat('gpt', gptMessage);
});

function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = sender === 'user' ? 'user-message' : 'gpt-message';
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

async function getGptResponse(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}` // Замените на ваш API-ключ
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: message }]
            })
        });
        const data = await response.json();
        
        if (response.ok) {
            return data.choices[0].message.content;
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        return "Error: " + error.message;
    }
}