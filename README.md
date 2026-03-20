# Waste Classification Project Setup Guide

This guide will help you set up and run the Waste Classification project on a new laptop.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **Python 3.9+**: [Download Python](https://www.python.org/downloads/)
2.  **Node.js & npm**: [Download Node.js](https://nodejs.org/)
3.  **MongoDB Community Server**: [Download MongoDB](https://www.mongodb.com/try/download/community)

---

## Step 1: Backend Setup

1.  Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - **Windows**: `venv\Scripts\activate`
    - **Mac/Linux**: `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Seed the database (make sure MongoDB is running):
    ```bash
    python seed_rewards.py
    ```
6.  Start the backend server:
    ```bash
    python app.py
    ```

---

## Step 2: Chatbot Setup

1.  Open a new terminal and navigate to the `chatbot` directory:
    ```bash
    cd chatbot
    ```
2.  Install dependencies (you can use the same virtual environment or create a new one):
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the chatbot API:
    ```bash
    python chatbot_api.py
    ```

---

## Step 3: Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## Summary of Ports
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Chatbot**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017

Make sure all three services (Backend, Chatbot, Frontend) are running simultaneously for the full experience.
