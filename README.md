# 🧠 LLM Wars – Multiplayer AI Guessing Game

**LLM Wars** is a real-time multiplayer web game where players give text clues to help an AI guess a hidden company based on its logo. All players in a room are shown the same logo. They take turns entering creative clues, and the selected AI model (OpenAI, Groq, or Gemini) tries to guess the company name.

The first player whose clue leads to a correct guess ends the game for **everyone in the room**, declaring them the winner!

---

## 🚀 Features

- 🔗 **Room-based multiplayer gameplay** using Socket.IO  
- 🧠 **LLM-powered guessing** (supports OpenAI, Groq, and Gemini)  
- 🎯 **Same company logo for all room members**  
- 🏆 **Game ends instantly when a correct guess is made**  
- 🔄 **Real-time chat-style interaction with the AI**  
- ⚡ **No login or signup required** – just enter your name and join/create a room  
- 👤 **Single-player mode available** – play solo without rooms or sockets  
- 📱 **Responsive UI** – mobile-friendly and optimized for all screen sizes  
- 🚫 **Fairness logic** – clues are checked for unfair hints before sending to the LLM  
- ⏱️ **Post-win delay popup** – winner popup appears after a short suspense delay  
- 🔁 **Play again & Home options** after game ends for seamless restarts  

---

## 📦 Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Socket.IO Client  
- **Backend**: Flask (Python), Flask-SocketIO  
- **AI Models**: OpenAI GPT, Groq (Mixtral), Gemini  
- **Deployment**: Vercel (frontend), Render/Fly.io/Other (backend)


---

## 🧑‍💻 Getting Started

### Prerequisites

- Python 3.10+
- Node.js and npm (for frontend)
- OpenAI/Groq/Gemini API keys

### Clone the Repository

```bash
git clone https://github.com/your-username/llm-wars.git
cd llm-wars


cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Create a .env file with your API keys and config
flask run


cd frontend
npm install
npm run dev



---

Let me know if you want me to regenerate the full `README.md` with this correction applied throughout.

