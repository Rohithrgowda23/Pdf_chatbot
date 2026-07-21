
# 📄 AI PDF Chatbot (RAG)

An AI-powered document question-answering platform built with **Spring Boot**, **Spring AI**, **OpenAI**, and **Qdrant**. Users can upload PDF documents and ask questions in natural language to receive context-aware answers using **Retrieval-Augmented Generation (RAG)**.

---

## 🚀 Features

- 🔐 JWT Authentication
- 📄 Upload and manage PDF documents
- ✂️ Automatic PDF text extraction and chunking
- 🧠 OpenAI Embeddings
- 📚 Semantic Search using Qdrant
- 🤖 AI-powered Question Answering (RAG)
- 💬 Conversation History
- ⚡ RESTful APIs
- 🐳 Docker Support
- 🎨 Modern React Frontend

---

## 🛠 Tech Stack

### Backend
- Java 21
- Spring Boot 3
- Spring AI
- Spring Security
- JWT Authentication
- MySQL
- Maven

### AI
- OpenAI API
- Embeddings
- Retrieval-Augmented Generation (RAG)
- Prompt Engineering

### Vector Database
- Qdrant

### Frontend
- React
- TypeScript
- Tailwind CSS

### DevOps
- Docker
- Git
- GitHub

---

## 🏗 Architecture

```
                +----------------------+
                |     React Client     |
                +----------+-----------+
                           |
                      REST APIs
                           |
                +----------v-----------+
                | Spring Boot Backend  |
                +----------+-----------+
                           |
          +----------------+----------------+
          |                                 |
          |                                 |
  OpenAI Embeddings                  MySQL Database
          |                                 |
          +------------+--------------------+
                       |
                  Qdrant Vector DB
                       |
                 Semantic Search
                       |
                  OpenAI GPT Model
                       |
                 AI Generated Answer
```

---

## 📂 Project Structure

```
pdf-chatbot
│
├── frontend
│
├── pdf-chatbot-backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── config
│   ├── security
│   └── exception
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Rohithrgowda23/Pdf_chatbot.git

cd Pdf_chatbot
```

### Backend

```bash
cd pdf-chatbot-backend

mvn clean install

mvn spring-boot:run
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

```
OPENAI_API_KEY=your_openai_key

DB_URL=jdbc:mysql://localhost:3306/pdf_chatbot

DB_USERNAME=root

DB_PASSWORD=password

JWT_SECRET=your_secret_key

QDRANT_HOST=localhost

QDRANT_PORT=6334
```

---

## 🐳 Docker

```bash
docker compose up --build
```

---

## 📸 Screenshots

### Login
<img width="1919" height="1017" alt="Screenshot 2026-07-13 100331" src="https://github.com/user-attachments/assets/962c6b29-6ee7-42e0-89fc-73dc12881126" />



## 📈 Workflow

1. User logs in.
2. Uploads a PDF.
3. PDF text is extracted.
4. Text is split into chunks.
5. Embeddings are generated using OpenAI.
6. Embeddings are stored in Qdrant.
7. User asks a question.
8. Similar chunks are retrieved.
9. OpenAI generates an answer using retrieved context.
10. Response is shown in the chat interface.

---

## 🎯 Future Improvements

- Multiple document chat
- Streaming AI responses
- PDF citations
- OCR support
- Admin Dashboard
- Cloud Deployment (AWS)

---

## 👨‍💻 Author

**Rohith R Gowda**

GitHub:
https://github.com/Rohithrgowda23



---

## ⭐ If you found this project useful

Give it a ⭐ on GitHub!
