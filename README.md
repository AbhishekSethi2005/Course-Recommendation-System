# CourseIQ - AI-Powered Course Recommendation Platform

### Built with React + Vite | Tailwind CSS | Framer Motion | Flask Backend | Coursera Dataset 2021

> **CourseIQ**  
> A premium AI-powered course discovery and recommendation engine that suggests online courses based on a student's interests, existing skills, completed courses, and preferred difficulty level.

---

## Project Structure

```text
Course Recommendation System - SLA 032/
|-- frontend/                  # React + Vite Production SaaS Frontend
|   |-- src/
|   |   |-- components/
|   |   |   |-- Navbar.jsx              # Sticky Navigation with CourseIQ wordmark & drawer
|   |   |   |-- Hero.jsx                # Split Hero with Interactive Product Window & Float Cards
|   |   |   |-- AIDiscoveryPreview.jsx  # Interactive Preview & AI Node Visualization
|   |   |   |-- HowItWorks.jsx          # 4-Step Horizontal Process with Connections
|   |   |   |-- AICapabilities.jsx      # Core AI Feature Cards
|   |   |   |-- ExploreCategories.jsx   # 8 Domain Category Cards with Prefilled Search
|   |   |   |-- SampleRecommendations.jsx # Premium Sample Course Cards with Score Bars
|   |   |   |-- FinalCTA.jsx            # Full-Width Glow CTA Banner
|   |   |   |-- Footer.jsx              # Multi-Column Modern Footer
|   |   |   |-- DiscoverPage.jsx        # Full Course Discovery & Recommendation Engine
|   |   |   |-- CategoriesPage.jsx      # Category Directory & Domain Filter
|   |   |   `-- AuthModal.jsx           # Modern Dark Auth Modal (Login / Sign Up)
|   |   |-- data/
|   |   |   `-- sampleCourses.js        # Dataset Mappings & Category Metadata
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- index.css
|   |-- dist/                  # Built Production Assets (served directly by Flask)
|   |-- package.json
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- app.py                     # Flask API & Application Server
|-- recommender.py             # CourseRecommender with TF-IDF & Jaccard Matching
|-- model.py                   # Model Loading & Vectorizer Management
|-- preprocessing.py           # Text Lemmatization & Feature Preprocessing
|-- requirements.txt
|-- README.md
|-- data/
|   |-- coursera_courses.csv
|   `-- coursera_courses.zip
|-- model/
|   |-- courses_df.pkl
|   |-- similarity_matrix.pkl
|   |-- tfidf_matrix.pkl
|   `-- vectorizer.pkl
`-- templates/
    |-- index.html             # Classic Template Form (preserved)
    `-- results.html           # Classic Template Results (preserved)
```

---

## Running the Application

### Option 1: Run with Flask (Serves both the React Frontend & Backend API)
```bash
python app.py
```
Open your browser at `http://localhost:5000/`.

### Option 2: Run Frontend Development Server (with Hot Reloading)
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173/`. Requests to `/api/recommend` are automatically proxied to Flask.

---

## Dataset

**Dataset used:** [Coursera Courses Dataset 2021](https://www.kaggle.com/datasets/khusheekapoor/coursera-courses-dataset-2021)

| Property | Detail |
|---|---|
| Source | Kaggle |
| Total usable courses | 3,416 |
| Core fields | Course Name, Description, Skills, Difficulty, Rating, Certificate Type |
| Why selected | Supports both content-based matching and skills-based ranking |

Place the dataset CSV inside `data/coursera_courses.csv` before building the model from scratch.

---

## Preprocessing And Features

All preprocessing logic is implemented in `preprocessing.py`.

Main steps:

- Normalize column names
- Handle missing values
- Remove duplicates
- Clean and lemmatize text
- Parse skills into structured lists
- Build a weighted `combined_features` field

```text
combined_features = course_name x 2
                  + course_description
                  + skills x 2
```

This weighting helps the model emphasize course titles and skill tags more than generic description text.

---

## Model Design

The recommender combines content similarity and skill overlap:

```text
User Input
   |
   v
TF-IDF vectorization on combined_features
   |
   v
Cosine similarity -> Content score (0.6)
   |
   v
Jaccard overlap -> Skills score (0.4)
   |
   v
Final score + small rating bonus
   |
   v
Top-N ranked recommendations
```

### TF-IDF settings

| Parameter | Value |
|---|---|
| Max Features | 5000 |
| N-gram Range | (1, 2) |
| Min DF | 1 |
| Max DF | 0.95 |
| TF Scaling | Sublinear |

### Evaluation metrics used

- Catalogue size
- Coverage@10
- Average intra-list diversity

---

## Project Working

### 1. Landing page

![CourseIQ landing page](./image1.png)

### 2. Recommendation form

![CourseIQ recommendation form](./image2.png)

### 3. Filled user input example

![CourseIQ sample input](./image3.png)

### 4. Recommendation results

![CourseIQ results page](./image4.png)

### 5. Model build and evaluation output

![CourseIQ terminal output](./image5.png)

---

## Sample Input

| Input Field | Example Value |
|---|---|
| Interests | I want to learn machine learning and AI to build intelligent models |
| Skills | Python, Statistics |
| Completed Courses | Machine Learning by Andrew Ng |
| Difficulty | Any Level |
| Results | 10 |

---

## Setup And Run

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Build the model

```bash
python model.py
```

### 3. Start the Flask app

```bash
python app.py
```

### 4. Open in browser

```text
http://127.0.0.1:5000
```

---

## Available Routes

| Route | Method | Description |
|---|---|---|
| `/` | GET | Home page |
| `/recommend` | POST | Returns ranked recommendations |
| `/similar` | GET | Finds similar courses |
| `/api/recommend` | POST | JSON recommendation API |
| `/evaluate` | GET | Evaluation metrics page |
| `/about` | GET | About page |

---

## Example API Request

```json
{
  "interests": "machine learning and deep learning",
  "skills": ["python", "statistics"],
  "completed_courses": ["Machine Learning by Andrew Ng"],
  "difficulty": "intermediate",
  "top_n": 5
}
```

---

## Dependencies

```txt
flask
pandas
numpy
scikit-learn
nltk
gunicorn
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| ML / NLP | scikit-learn, NLTK |
| Data | pandas, numpy |
| Frontend | HTML, CSS, JavaScript |
| Dataset | Coursera Courses Dataset 2021 |
| Model storage | Pickle files |

---

## Report

Project report: [Course Recommendation System Report.docx](./Course%20Recommendation%20System%20Report.docx)




Step 1 – Rebuild and update Docker
Since you've modified chatbot prompts and backend Python files, run:
docker compose up -d --build backend


This rebuilds the backend image and recreates the backend container while keeping your existing frontend and Nginx containers running.
Step 2 – If you also modified frontend code
Run this instead to update the complete application:
docker compose up -d --build --force-recreate


This rebuilds and recreates all three services.
Step 3 – Check container status
docker compose ps


Expected:
Container	Status
courseiq-frontend	Healthy
courseiq-backend	Healthy
courseiq-nginx	Running

Step 4 – Check backend logs
docker compose logs -f backend


Check for Python errors, OpenAI API errors or chatbot initialization issues.

Press Ctrl + C to exit the logs. Containers will continue running.
Step 5 – Test CourseIQ
Open:
**http://localhost**

Open
Test these chatbot questions:
1. What is quantum mechanics?
2. Explain the law of inertia.
3. Give me 10 machine learning project ideas.
4. Explain the Indian Constitution.
5. What is CourseIQ?
6. Explain Python decorators.
7. Ask a follow-up question using "Yes".


Since your existing Docker project uses the old Compose project identity, keep using:
docker compose -p project11-courserecommendationsystem-sla032 up -d


When you change backend code:
docker compose -p project11-courserecommendationsystem-sla032 up -d --build backend


When you change frontend code:
docker compose -p project11-courserecommendationsystem-sla032 up -d --build frontend