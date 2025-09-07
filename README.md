# 🌍 Travel Planner Web App -- JournoAI
![WhatsApp Image 2025-09-08 at 00 15 35_f1c9b89f](https://github.com/user-attachments/assets/da5c11ff-5c08-44a7-9e8d-93966781e9b8)


A modern web application to plan **personalized travel itineraries**. Users can select their **destination, travel dates, budget, travel style, and interests** to generate a tailored travel plan. Built with **React, TailwindCSS**, and **FastAPI**.

---

## 🏆 Features

- **Dynamic itinerary generation** based on user inputs.
- **Travel preferences**:
  - **Budget:** Budget / Mid-range / Luxury
  - **Travel style:** Solo / Couple / Family / Group
  - **Interests:** Sightseeing, Adventure, Cultural, Food, Shopping
- **Responsive UI** with modern effects: hover, blur, gradient backgrounds.
- **View detailed day-wise itinerary** with activities.
- **Planned integrations:** Hotels & restaurants suggestions based on destination.
- **Easy-to-use forms** with validations.

---

## 🌐 Screenshots

<img width="1848" height="960" alt="image" src="https://github.com/user-attachments/assets/4987a5c3-ef68-446e-a7b3-7e49e0f3962a" />

<img width="709" height="863" alt="image" src="https://github.com/user-attachments/assets/109a6030-8e8d-4b4a-a47e-ee1a7d91390e" />

<img width="1857" height="925" alt="image" src="https://github.com/user-attachments/assets/bf2f1c24-0955-40fa-af93-9b674ce09d34" />

<img width="1850" height="539" alt="image" src="https://github.com/user-attachments/assets/e80c3c7f-6a5e-4a1a-a229-9639c0df328f" />

<img width="1867" height="876" alt="image" src="https://github.com/user-attachments/assets/5924769f-a831-4612-bf5e-dfed9a95ed15" />

<img width="1824" height="943" alt="image" src="https://github.com/user-attachments/assets/fa7738a2-c181-494a-845d-c0248e94903d" />
---

## 🛠 Technology Stack

| Layer       | Technology                      |
|------------ |--------------------------------|
| Frontend    | React + TypeScript + TailwindCSS |
| Backend     | Python + FastAPI                 |
| API         | OpenRouter / OpenAI GPT          |
| Deployment  | Vite (frontend) + Uvicorn (backend) |
| Styling     | TailwindCSS, Gradient backgrounds |

---

## 📂 Project Structure

frontend/
└─ client/
├─ components/
│ └─ site/
│ └─ Hero.tsx # Main trip planner form
├─ services/
│ └─ api.ts # API calls
└─ App.tsx
backend/
├─ main.py # FastAPI backend entry point
├─ services.py # API helpers
└─ requirements.txt # Python dependencies

---

## ⚡ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/travel-planner.git
cd travel-planner
BACKEND SETUP
cd backend
python -m venv venv
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```
---

✈️ Travel Style Guide

Solo: Traveling alone

Couple: 2 guests

Family: 3 guests

Group: 4+ guests

💡 Usage

Fill in Destination, Check-in & Check-out, Guests, Budget, Travel Style, Interests.

Click Get Itinerary.

Your personalized itinerary will appear below the form.

🛠 Development Notes

Frontend uses React Hooks for state management.

Form data is processed using FormData API.

Travel duration is calculated automatically based on check-in & check-out dates.

API integration uses fetch and returns JSON responses.

TailwindCSS used for a modern, responsive design.

🚀 Future Enhancements

Multi-destination itineraries.

Hotel & restaurant suggestions integrated.

Export itinerary as PDF.

User authentication & saved itineraries.

Real-time recommendations based on AI models.

🤝 Contributing

Fork the repository.

Create a branch (git checkout -b feature/YourFeature).

Commit changes (git commit -m 'Add new feature').

Push to branch (git push origin feature/YourFeature).

Open a Pull Request.

📄 License

MIT License © 2025 JouroAI

📞 Contact

GitHub: cooldeba-21

Email: debashismohapatra8260@gmail.com


---

