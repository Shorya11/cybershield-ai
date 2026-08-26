ARGUS

AI-Powered Financial Threat Detection, Risk Intelligence & Investigation Platform

PSBs CyberShield Hackathon Series 2026 — Problem Statement 2: Suspicious Transaction & Mule Account Detection

<p align="center">
  <strong>Detect → Assess → Explain → Investigate → Act</strong>
</p>

<p align="center">
  ARGUS transforms suspicious transaction predictions into prioritized, explainable, and actionable investigation intelligence.
</p>

1. Overview

ARGUS is an AI-powered financial threat detection and investigation platform built for suspicious transaction and mule account detection.

The core idea is that detection is only the beginning of an investigation.

A conventional model may produce a suspicious probability, but an investigator still needs to understand:

Why was this transaction flagged?

How risky is the case?

Which cases should be investigated first?

What evidence supports the alert?

What should happen next?

ARGUS addresses this investigation gap by combining:

XGBoost-based machine learning

Leakage-aware preprocessing

Class-imbalance handling

Out-of-fold validation

Threshold optimization

Risk scoring and prioritization

SHAP-based explainability

Behavioral intelligence

Feature-level evidence

Investigation workflow

Prototype network investigation context

React-based investigation UI

FastAPI backend

ARGUS workflow

                    BANKING DATA
                         │
                         ▼
               LEAKAGE-AWARE PREPROCESSING
                         │
                         ▼
                   XGBOOST MODEL
                         │
                         ▼
                SUSPICIOUS PROBABILITY
                         │
                         ▼
                   RISK ENGINE
                         │
          ┌──────────────┼───────────────┐
          ▼              ▼               ▼
     RISK SCORE        SHAP        BEHAVIORAL
     + PRIORITY     EXPLANATION    INTELLIGENCE
          │              │               │
          └──────────────┼───────────────┘
                         ▼
                INVESTIGATION CASE
                         │
                         ▼
                 RECOMMENDED ACTION

2. What Makes ARGUS Different?

ARGUS is designed around one principle:

A suspicious alert should become an investigation case, not just a model score.

Detection

Identifies suspicious transactions and potential mule activity.

Assessment

Converts model probability into risk score, risk level, and investigation priority.

Explainability

Shows the feature contributions behind an individual prediction using SHAP.

Behavioral Intelligence

Adds context around unusual activity patterns and behavioral deviations.

Investigation

Brings together risk, explanation, behavioral context, feature evidence, and investigator-facing decision support.

Action

Surfaces a recommended next action from the risk engine.

3. Product Screenshots

Recommended image directory: docs/images/

Add the following screenshots to the repository using the filenames below.

Dashboard

The Dashboard provides an overview of uploaded transactions, suspicious detections, risk concentration, and investigation workload.



Suggested screenshot: the main ARGUS Dashboard showing the dataset summary and risk KPIs.

Transactions

The Transactions view provides a prioritized case list with prediction, probability, risk score, risk level, and recommended action.



Suggested screenshot: the ARGUS transaction table with high-risk cases visible.

Investigation Center

The Investigation Center brings together risk information, SHAP explanations, behavioral intelligence, feature evidence, and recommended action for a selected transaction.



Suggested screenshot: the Investigation view for a high-risk transaction such as TXN_09062.

Network Investigation Prototype

ARGUS also includes a prototype network investigation view that demonstrates how network context can be integrated into an investigation workflow.



Important: The current network view is a synthetic / illustrative prototype. The supplied dataset does not contain sufficient persistent account, device, or IP relationships for reliable real-world graph reconstruction.

4. Dataset

The development dataset used for ARGUS contains a highly imbalanced and high-dimensional classification problem.

Property

Value

Total records

9,082

Normal records

9,001

Mule-positive cases

81

Positive rate

0.89%

Original input features

3,923

Why the imbalance matters

Only 0.89% of the records are mule-positive.

A classifier that predicts almost everything as normal could therefore achieve deceptively high accuracy while missing the cases that matter most.

For this reason, ARGUS focuses on precision, recall, F1, AUPRC, AUROC, out-of-fold validation, and threshold selection instead of treating accuracy as the primary metric.

5. Data Leakage Controls

Leakage prevention was a major part of the ARGUS training methodology.

F3912 — Target Leakage

F3912 was identified as an extremely strong target-correlated feature and was treated as answer-key-like / target-leakage information.

It was removed before model training so that the classifier would learn meaningful transaction and behavioral patterns instead of directly relying on a feature that effectively reveals the target.

F2230 — Sampling / Month Artifact

F2230 was associated with the sampling month and could separate classes because of how the dataset was constructed rather than because of genuine mule behavior.

It was removed as a dataset-construction artifact.

Result

ARGUS uses a leakage-aware feature set designed to reduce the chance that obvious dataset artifacts drive model predictions.

6. Machine Learning Methodology

Final classifier

ARGUS uses XGBoost for suspicious-transaction classification.

The model operates on the structured financial and behavioral feature space after preprocessing and leakage controls.

End-to-end ML pipeline

Raw Development Dataset
          │
          ▼
Leakage Review / Removal
          │
          ▼
Fold-Safe Preprocessing
          │
          ▼
5-Fold Out-of-Fold Validation
          │
          ▼
SMOTE on Training Fold Only
          │
          ▼
XGBoost Training
          │
          ▼
Out-of-Fold Predictions
          │
          ▼
Threshold Optimization
          │
          ▼
Final Risk / Investigation Decision

7. Fold-Safe Preprocessing

Preprocessing is fitted inside the training portion of each fold.

For one validation iteration:

Training folds
     │
     ▼
Fit preprocessing rules
     │
     ▼
Transform training data
     │
     ▼
Apply SMOTE to training data
     │
     ▼
Train XGBoost
     │
     ▼
Unseen validation fold

The validation fold is transformed using rules learned only from its corresponding training data.

This prevents validation observations from indirectly influencing imputation, transformation, or other preprocessing decisions.

8. Class Imbalance and SMOTE

The dataset contains:

Normal:         9,001
Mule-positive:     81

Because the positive class is rare, ARGUS uses SMOTE (Synthetic Minority Over-sampling Technique) to help the model learn the minority class.

The important constraint is:

SMOTE is applied only to the training portion of each fold.

Validation records are never used to generate synthetic training samples.

Training Fold
      │
      ▼
    SMOTE
      │
      ▼
Balanced Training Data
      │
      ▼
   XGBoost

This keeps validation data isolated from synthetic sampling.

9. Model Evaluation Strategy

ARGUS uses 5-fold out-of-fold (OOF) validation.

Each record receives an out-of-fold prediction from a model that was trained without using that record's validation fold.

This provides a development-stage estimate of how the model behaves on unseen validation data.

The final candidate is also evaluated on a separate development holdout.

The organizer validation dataset remains unseen.

10. Threshold Optimization

A default probability threshold of 0.50 is not automatically optimal for an investigation-prioritization system.

ARGUS therefore selects an operating threshold from out-of-fold predictions using a precision constraint while optimizing recall.

Final operating threshold

0.39

Conceptual flow:

XGBoost Probability
        │
        ▼
Operating Threshold = 0.39
        │
        ▼
Prediction
        │
        ▼
Risk Score
        │
        ▼
Risk Level
        │
        ▼
Investigation Priority
        │
        ▼
Recommended Action

The objective is to maintain high precision while still capturing a useful proportion of relevant cases.

11. Risk Engine

The ARGUS Risk Engine connects the ML output to an operational investigation decision.

It produces:

Risk score

Risk level

Investigation priority

Recommended action

Automated reasons / supporting signals

Decision flow

Suspicious Probability
        ↓
Decision Threshold
        ↓
Suspicious / Legitimate
        ↓
Risk Score
        ↓
Risk Level
        ↓
Investigation Priority
        ↓
Recommended Action

This layer converts a machine-learning probability into an investigator-facing decision signal.

12. Explainable AI with SHAP

ARGUS uses SHAP (SHapley Additive exPlanations) for transaction-level model explanation.

For an individual transaction, the system identifies features that contribute to the model's prediction.

The investigation interface can surface:

Top contributing features

Feature contribution evidence

Human-readable metadata

Supporting indicators

Explanation workflow

Individual Transaction
        ↓
XGBoost Prediction
        ↓
SHAP Explanation
        ↓
Top Feature Contributors
        ↓
Human-Readable Evidence

The goal is to answer:

Why did the model consider this transaction suspicious?

13. Behavioral Intelligence

ARGUS adds behavioral context on top of the model prediction.

The behavioral intelligence layer examines multiple dimensions, including:

Transaction velocity

Fund flow

Activity shifts

Behavioral deviations

Alert correlation

Counterparty-related signals

These signals are combined into behavioral assessments that help highlight unusual or elevated activity patterns.

This provides context beyond the raw model probability.

14. Feature-Level Evidence

ARGUS includes a feature-mapping layer that connects feature identifiers to available human-readable metadata.

For selected features, the system can expose:

Feature identifier

Variable name

Description

Observed value

This helps translate model inputs into investigator-facing evidence.

15. Investigation Workflow

The current application follows:

CSV Upload
    │
    ▼
Data Preparation
    │
    ▼
XGBoost Detection
    │
    ▼
Risk Scoring
    │
    ▼
Transaction Prioritization
    │
    ▼
SHAP + Behavioral Intelligence
    │
    ▼
Investigation Case
    │
    ▼
Recommended Action

An individual investigation can contain:

Prediction

Suspicious / mule-risk probability

Risk score

Risk level

Investigation priority

SHAP explanation

Behavioral assessment

Feature-level evidence

Recommended action

Prototype network context

16. Example Investigation Case

Transaction

TXN_09062

Model output

99.95% Mule-Risk Probability

Risk

Critical

Investigation context

The investigation view can combine:

SHAP feature contributions

Behavioral signals

Historical deviations

Feature-level evidence

Investigation priority

Recommended action

Prototype network context

The purpose is to turn a high-risk model output into an investigation-ready case.

17. Network Investigation

ARGUS includes a network investigation component to demonstrate how network context can fit into a financial investigation workflow.

Current implementation

The network layer is currently a prototype simulation.

The supplied dataset does not provide enough persistent entity identifiers for reliable reconstruction of real account/device/IP relationships.

Therefore, the current network visualization is explicitly illustrative.

Production direction

A future production graph could connect persistent entities such as:

             ACCOUNT
             /  |              /   |          DEVICE  IP  COUNTERPARTY
             \  |  /
              TRANSACTION

This could support:

Relationship traversal

Connected components

Suspicious entity ranking

Shared devices

Shared IPs

Network-level investigation

Mule-network discovery

18. Model Results

5-Fold OOF Evaluation

Metric

Result

AUPRC

0.8969

AUROC

0.9837

Precision

98.18%

Recall

83.08%

F1

0.9000

Development Holdout

Metric

Result

AUPRC

0.9931

AUROC

0.9999

Precision

100%

Recall

93.75%

F1

0.9677

Operating threshold

0.39

Evaluation scope

These are development-stage results. The organizers' hidden validation dataset has not been evaluated.

19. Precision–Recall Curve

Place the generated PR curve at:

docs/images/argus-pr-curve.png

Then display it here:



Precision–recall performance of the final ARGUS V2 candidate on development evaluation data.

Because the positive class represents only 0.89% of the dataset, precision-recall analysis is particularly useful for evaluating the model's ability to identify rare positive cases.

20. System Architecture

                         USER
                          │
                          ▼
                    React / Vite
                     ARGUS UI
                          │
                          ▼
                    FastAPI API
                          │
                          ▼
            Banking Transaction & Behavioral Data
                          │
                          ▼
               Leakage-Aware Preprocessing
                          │
                          ▼
                    XGBoost Classifier
                          │
                          ▼
                 Suspicious Probability
                          │
                          ▼
                    ARGUS Risk Engine
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
         Risk Score      SHAP      Behavioral
         & Priority   Explanation  Intelligence
             │            │            │
             └────────────┼────────────┘
                          ▼
                  Investigation Center
                          │
                          ▼
                   Recommended Action

21. Production Scalability Path

The current prototype is batch-oriented.

A planned production path is:

                CURRENT
                  │
                  ▼
                 BATCH
                  │
                  ▼
             STREAMING
                  │
                  ▼
          ASYNCHRONOUS INFERENCE
                  │
                  ▼
       PERSISTENT INVESTIGATION STORE

Why this architecture?

Separating ingestion, model inference, and investigation state allows these components to scale independently as transaction volume grows.

Important distinction

Batch CSV ingestion is part of the current prototype.

Streaming ingestion, asynchronous inference, and persistent investigation state are the planned production scaling path.

22. Frontend

The frontend is built with React + Vite.

Main views

Dashboard

Transactions

Investigation

Analytics

About

Frontend responsibilities

CSV upload

Detection summary

Transaction prioritization

Risk visualization

Investigation navigation

SHAP explanation display

Behavioral intelligence display

Network prototype display

Recommended action

23. Backend

The backend is built with FastAPI.

Responsibilities

CSV ingestion

Model inference

Risk scoring

Behavioral analysis

Investigation generation

SHAP explainability

Feature-level evidence

Network simulation

Analytics

Dataset storage for on-demand investigation

24. API Endpoints

Health Check

GET /

Example:

{
  "status": "running"
}

CSV Prediction

POST /predict/file

Accepts a CSV file and returns:

Dataset summary

Transaction-level predictions

Suspicious probabilities

Risk scores

Risk levels

Investigation requirements

Behavioral intelligence

Investigation-related outputs

Investigation

GET /investigation/{transaction_id}

Returns investigation intelligence for a transaction currently present in the uploaded dataset.

Interactive API Documentation

When running locally:

http://127.0.0.1:8000/docs

25. Tech Stack

Machine Learning

Python

XGBoost

scikit-learn

imbalanced-learn

joblib

pandas

NumPy

SciPy

Explainability

SHAP

Backend

FastAPI

Uvicorn

python-multipart

Investigation / Graph

NetworkX

PyVis

Frontend

React

Vite

Axios

Deployment

Vercel — Frontend

Render — Backend

26. Project Structure

cybershield-ai/
│
├── api/
│   ├── routers/
│   │   ├── analytics.py
│   │   ├── investigation.py
│   │   ├── prediction.py
│   │   └── upload.py
│   │
│   └── services/
│       ├── analytics_service.py
│       ├── argus_features.py
│       ├── behavioral_intelligence.py
│       ├── dataset_store.py
│       ├── investigation_service.py
│       └── prediction_service.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── models/
│   ├── feature_metadata.pkl
│   ├── feature_names.pkl
│   ├── preprocessor.pkl
│   └── xgboost_tuned.pkl
│
├── src/
│   ├── feature_mapper/
│   ├── investigation/
│   ├── ml/
│   ├── risk_engine/
│   └── xai/
│
├── docs/
│   └── images/
│       ├── argus-dashboard.png
│       ├── argus-transactions.png
│       ├── argus-investigation.png
│       ├── argus-network.png
│       └── argus-pr-curve.png
│
├── main.py
├── requirements.txt
└── README.md

27. Running Locally

Prerequisites

Python 3.11

Node.js / npm

Clone the repository

git clone https://github.com/Shorya11/cybershield-ai.git
cd cybershield-ai

Create a Python environment

python -m venv .venv

Windows

.venv\Scriptsctivate

Linux / macOS

source .venv/bin/activate

Install backend dependencies

pip install -r requirements.txt

Start FastAPI

uvicorn main:app --reload --port 8000

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

The frontend normally runs at:

http://127.0.0.1:5173

28. Deployment

ARGUS uses a separate frontend/backend deployment architecture.

                    Internet
                       │
                       ▼
                Vercel / React
                  ARGUS UI
                       │
                       ▼
             Render / FastAPI
                  ARGUS API
                       │
               ┌───────┴───────┐
               ▼               ▼
           ML Pipeline    Intelligence
                          / Investigation

Hosted prototype

Frontend:

https://argus-ai-eight.vercel.app

Backend:

https://argus-backend-p57p.onrender.com

Hosting note

The hosted environment may be resource-constrained for very large benchmark batches on a low-resource instance.

The complete 9,082-record benchmark workflow has been validated locally, including the optimized chunked batch-inference path.

29. Validation of the Optimized Batch Inference

The production-oriented batch implementation was optimized to reduce peak memory use during inference.

Instead of transforming the complete dataset in one large operation, the inference path processes smaller chunks:

9,082 rows
     │
     ├── Chunk 1
     ├── Chunk 2
     ├── Chunk 3
     ├── ...
     └── Chunk N

This optimization was validated against the previous full-dataset output.

Verified development behavior

Total transactions:          9,082
Fraud predictions:              80
High/Critical cases:             77
Fraud classification set:   unchanged

The same individual 80 positive transaction IDs were retained after optimization.

30. Current Limitations

Network reconstruction

The supplied dataset does not contain sufficient persistent account/device/IP relationships for reliable real-world network reconstruction.

The current network view is therefore a prototype simulation.

Validation scope

Current model metrics are development-stage OOF and holdout results.

The organizers' hidden validation dataset remains unseen.

Input schema

The trained model and preprocessing pipeline expect the trained feature schema.

Batch-oriented ingestion

The current prototype processes uploaded CSV files.

Real-time streaming and asynchronous inference are part of the production scalability roadmap.

31. Future Work

Real-time transaction monitoring

Move from batch CSV processing toward continuous transaction streams.

Streaming and asynchronous inference

Introduce queue-based processing so ingestion and model inference can scale independently.

Persistent investigation store

Maintain durable case and investigation state instead of relying only on request/runtime state.

Real entity graph

Integrate persistent account, device, IP, counterparty, and transaction relationships for real network investigations.

Continuous risk profiles

Maintain evolving behavioral profiles for entities over time.

Human-in-the-loop feedback

Use investigator decisions and outcomes to improve prioritization and governance.

Production AML integration

Connect ARGUS with existing monitoring, alert, case-management, and compliance workflows.

32. Hackathon Context

ARGUS was developed for:

PSBs CyberShield Hackathon Series 2026

Problem Statement 2

Suspicious Transaction & Mule Account Detection

The project focuses on detecting suspicious activity and transforming model predictions into explainable, prioritized, and actionable investigation intelligence.

33. Key Design Principles

Detection is only the beginning

A suspicious prediction should lead to investigation context.

Explainability matters

Investigators should understand the key factors behind an individual prediction.

Precision matters

With only 0.89% positive cases, unnecessary alerts can quickly increase investigation workload.

Validation must be trustworthy

Leakage-aware preprocessing and fold-safe SMOTE help maintain validation integrity.

Current and future capabilities are clearly separated

Batch CSV analysis is the current prototype.

Streaming, asynchronous inference, persistent investigation state, and real entity graphs are the production roadmap.

34. Project Philosophy

DETECT
   ↓
ASSESS
   ↓
EXPLAIN
   ↓
INVESTIGATE
   ↓
ACT

ARGUS — From Suspicious Alerts to Actionable Investigation Intelligence.

License

This project was developed as part of the PSBs CyberShield Hackathon Series 2026.
