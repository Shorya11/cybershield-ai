# 🛡️ CyberShield AI

> AI-Powered Fraud Detection & Mule Account Investigation Platform

CyberShield AI is an intelligent fraud detection and investigation platform developed for the **PSBs CyberShield Hackathon 2026**. The system leverages Machine Learning, Explainable AI, and Graph Analytics to detect suspicious banking transactions, assess risk, and assist investigators by generating network-based investigation reports.

---

## 🚀 Project Overview

Financial fraud has evolved beyond traditional rule-based detection systems. CyberShield AI combines machine learning with explainable risk analysis and graph-based investigation to help banks identify high-risk transactions and potential mule account networks.

The platform processes uploaded transaction datasets and automatically:

- Detects fraudulent transactions using XGBoost
- Calculates fraud probability and risk score
- Classifies transactions into multiple risk levels
- Generates investigation reports for high-risk transactions
- Provides explainable outputs for investigators
- Exposes the complete pipeline through a FastAPI backend

---

# 🏗 System Architecture

```text
                CSV Upload
                     │
                     ▼
            Data Preprocessing
                     │
                     ▼
             XGBoost ML Model
                     │
                     ▼
            Fraud Probability
                     │
                     ▼
               Risk Engine
                     │
                     ▼
      High / Critical Transactions
                     │
                     ▼
         Investigation Engine
                     │
                     ▼
          Graph-based Analytics
                     │
                     ▼
            Investigation Report
                     │
                     ▼
             FastAPI Backend
                     │
                     ▼
         React Dashboard (Upcoming)
```

---

# ✨ Features

### 🤖 Machine Learning

- XGBoost Fraud Detection Model
- SMOTE for class imbalance handling
- Hyperparameter tuning
- Model evaluation
- Probability prediction

---

### 📊 Explainability

- SHAP Explainability
- Feature Importance Analysis
- Human-readable Feature Mapping
- Business-friendly explanations

---

### ⚠️ Risk Engine

- Dynamic Risk Score
- Risk Level Classification
- Confidence Score
- Recommendation Engine
- Automated Reason Generation

---

### 🔍 Investigation Engine

- Synthetic Investigation Case Generation
- Network Graph Construction
- Mule Account Detection
- Graph Analytics
- Investigation Summary

---

### 🌐 Backend API

- FastAPI REST API
- CSV Upload Endpoint
- Batch Prediction
- Investigation Report Generation
- JSON Response

---

# 🛠 Tech Stack

## Backend

- Python
- FastAPI
- Pandas
- NumPy

## Machine Learning

- XGBoost
- Scikit-learn
- SHAP
- Joblib

## Graph Analytics

- NetworkX

## Frontend

- React (Upcoming)
- Tailwind CSS (Upcoming)

---

# 📂 Project Structure

```text
cybershield-ai/

├── api/
│   ├── routers/
│   ├── schemas/
│   └── services/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── frontend/
│
├── generated_graphs/
│
├── models/
│
├── notebooks/
│
├── reports/
│
├── src/
│   ├── feature_mapper/
│   ├── investigation/
│   ├── risk_engine/
│   └── utils/
│
├── main.py
├── requirements.txt
└── README.md
```

---

# ⚙️ Current Pipeline

```text
Upload CSV

↓

Preprocessing

↓

Fraud Prediction

↓

Risk Analysis

↓

Investigation Generation

↓

API Response
```

---

# 📡 API

## Upload Transaction Dataset

```
POST /predict/file
```

Uploads a CSV file and returns:

- Fraud Prediction
- Fraud Probability
- Risk Score
- Risk Level
- Investigation Requirement
- Investigation Report (for High/Critical cases)

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/cybershield-ai.git

cd cybershield-ai
```

---

## Create Virtual Environment

```bash
python -m venv .venv
```

---

## Activate Environment

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run FastAPI

```bash
uvicorn main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

# 📈 Current Status

| Module | Status |
|---------|--------|
| Data Pipeline | ✅ Complete |
| ML Model | ✅ Complete |
| Explainability | ✅ Complete |
| Feature Mapper | ✅ Complete |
| Risk Engine | ✅ Complete |
| Investigation Engine | ✅ Complete |
| FastAPI Backend | ✅ Complete |
| React Dashboard | 🚧 In Progress |

---

# 🎯 Future Work

- Interactive React Dashboard
- Network Visualization
- Case Management
- Fund Flow Analysis
- Authentication
- Deployment

---

# 👨‍💻 Author

**Shorya Dixit**

B.Tech Computer Science Engineering

VIT Bhopal University

---

# 📄 License

This project was developed as part of the **PSBs CyberShield Hackathon 2026**.