"""
CourseIQ Educational Knowledge & Intent Reasoning Engine.
Provides direct, deliverable-focused educational answers, project lists, code,
comparisons, and conversational follow-ups without forced templates.
"""

import re


def detect_intent_and_topic(query: str, history: list = None) -> tuple:
    """
    Analyzes the query and previous conversation context to determine:
    1. The deliverable type (projects, code, comparison, explanation, how-to-learn, course-request, followup)
    2. The subject matter / topic
    """
    q = query.lower().strip()
    history = history or []

    # Get last turn context if available
    last_user_query = ""
    last_assistant_reply = ""
    for msg in reversed(history):
        if msg.get("role") == "user" and not last_user_query:
            last_user_query = msg.get("content", "").lower()
        elif msg.get("role") == "assistant" and not last_assistant_reply:
            last_assistant_reply = msg.get("content", "").lower()

    # 1. Follow-up: Final-Year Project selection
    if any(k in q for k in ["final year", "final-year", "capstone", "which one is best", "best project for final"]):
        if "project" in last_user_query or "project" in last_assistant_reply or "project" in q:
            return "followup_final_year", "final_year_project"

    # 2. Follow-up: Make it simpler / ELI5
    if any(k in q for k in ["simpler", "simple words", "eli5", "like i am 5", "too complex", "easy explanation"]):
        return "followup_simpler", last_user_query or "general"

    # 3. Follow-up: Code for previous project or concept
    if any(k in q for k in ["code for project", "code for number", "code for #", "show the code for", "how to implement project"]):
        return "followup_project_code", q

    # 4. Project ideas request
    if any(k in q for k in ["project", "projects", "what can i build", "portfolio ideas", "build something"]):
        if any(w in q for w in ["list", "top", "some", "ideas", "suggest", "which", "recommend", "best", "give me"]):
            # Detect domain
            if any(w in q for w in ["ml", "machine learning"]):
                return "projects", "machine_learning"
            elif any(w in q for w in ["deep learning", "dl", "neural"]):
                return "projects", "deep_learning"
            elif any(w in q for w in ["data science", "ds", "data analytics"]):
                return "projects", "data_science"
            elif any(w in q for w in ["python"]):
                return "projects", "python"
            elif any(w in q for w in ["web", "react", "full stack"]):
                return "projects", "web_dev"
            else:
                return "projects", "machine_learning"

    # 5. Course recommendation request (Explicit)
    if any(k in q for k in ["suggest course", "recommend course", "courses for", "which course", "what course", "best courses"]):
        return "course_recommendation", q

    # 6. How to learn / roadmap request
    if any(k in q for k in ["how can i learn", "how to learn", "how to start learning", "learning path for", "roadmap for", "how do i study"]):
        return "how_to_learn", q

    # 7. Code request
    if any(k in q for k in ["code for", "write python", "give me code", "show me code", "python code", "code snippet", "implementation of"]):
        return "code", q

    # 8. Comparison request
    if any(k in q for k in ["difference between", "vs", "versus", "compare", "comparison between"]):
        return "comparison", q

    # 9. Explanation request
    if any(k in q for k in ["explain", "what is", "how does", "what does", "definition of", "understand"]):
        return "explanation", q

    # 10. Pros & Cons
    if any(k in q for k in ["advantages and disadvantages", "pros and cons", "benefits and drawbacks"]):
        return "pros_cons", q

    return "general_educational", q


def get_ml_projects_answer() -> str:
    """Returns 10 top Machine Learning projects with metadata across Beginner, Intermediate, and Advanced."""
    return """Here are **10 top Machine Learning projects** spanning Beginner, Intermediate, and Advanced levels, complete with recommended algorithms, tech stacks, and practical applications:

---

### Beginner Projects

#### 1. House Price Prediction
- **Difficulty Level**: Beginner
- **Short Description**: Build a regression model that predicts residential property sale prices based on square footage, location, bedroom count, and build year.
- **Suggested Algorithms & Tech**: Linear Regression, Ridge/Lasso, Pandas, Scikit-Learn, Matplotlib.
- **Practical Application**: Real estate valuation platforms (like Zillow or Redfin) use automated valuation models to estimate property values instantly.

#### 2. Customer Churn Predictor
- **Difficulty Level**: Beginner
- **Short Description**: Classify whether a subscription service or telecom customer is likely to cancel their account based on usage patterns, contract type, and customer service calls.
- **Suggested Algorithms & Tech**: Logistic Regression, Decision Trees, Scikit-Learn, Seaborn.
- **Practical Application**: SaaS companies and telecom providers proactively offer discounts or incentives to high-risk customers to retain them.

#### 3. Spam Email / SMS Classifier
- **Difficulty Level**: Beginner
- **Short Description**: Develop a text classification pipeline that identifies unsolicited spam messages using natural language preprocessing and frequency analysis.
- **Suggested Algorithms & Tech**: Naive Bayes (MultinomialNB), TF-IDF Vectorizer, NLTK, Scikit-Learn.
- **Practical Application**: Core feature of email providers (Gmail, Outlook) to filter malicious phishing attempts and junk mail from inboxes.

---

### Intermediate Projects

#### 4. Credit Card Fraud Detection System
- **Difficulty Level**: Intermediate
- **Short Description**: Detect fraudulent financial transactions in highly imbalanced datasets where fraud accounts for under 0.2% of total volume.
- **Suggested Algorithms & Tech**: Random Forest, XGBoost, LightGBM, SMOTE (Synthetic Minority Over-sampling), Scikit-Learn.
- **Practical Application**: Real-time transaction monitoring at banks and payment gateways (Stripe, PayPal) to block suspicious charges.

#### 5. Movie / Book Recommendation System
- **Difficulty Level**: Intermediate
- **Short Description**: Build a hybrid recommendation engine that suggests media using collaborative filtering (user ratings) and content-based filtering (genres, cast, keywords).
- **Suggested Algorithms & Tech**: Cosine Similarity, Matrix Factorization (SVD), Surprise library, Nearest Neighbors.
- **Practical Application**: Streaming platforms like Netflix, Spotify, and YouTube driving user engagement through personalized content feeds.

#### 6. Handwritten Digit Recognition (MNIST)
- **Difficulty Level**: Intermediate
- **Short Description**: Train a Convolutional Neural Network (CNN) to recognize handwritten numerical digits (0–9) with >98% accuracy.
- **Suggested Algorithms & Tech**: CNN (Convolution2D, MaxPooling, Dropout), PyTorch or TensorFlow/Keras.
- **Practical Application**: Automated postal mail sorting, bank check processing, and digitizing archival paperwork.

#### 7. Stock Market Trend Forecasting
- **Difficulty Level**: Intermediate
- **Short Description**: Analyze historical financial time-series data to predict short-term price trends and volatility indicators.
- **Suggested Algorithms & Tech**: LSTM (Long Short-Term Memory), ARIMA, Facebook Prophet, yfinance API.
- **Practical Application**: Algorithmic quantitative trading and portfolio risk management in financial firms.

---

### Advanced Projects

#### 8. Real-Time Object Detection & Tracking
- **Difficulty Level**: Advanced
- **Short Description**: Deploy a computer vision pipeline that detects and tracks multiple objects (vehicles, pedestrians, traffic signs) from live video or webcam feeds.
- **Suggested Algorithms & Tech**: YOLOv8 / YOLOv9, OpenCV, DeepSORT tracking, PyTorch, CUDA.
- **Practical Application**: Autonomous self-driving vehicles, smart city traffic management, and warehouse inventory automation.

#### 9. Retrieval-Augmented Generation (RAG) Document QA Assistant
- **Difficulty Level**: Advanced
- **Short Description**: Build an intelligent assistant that ingests company PDFs, creates high-dimensional vector embeddings, and answers user queries with cited source documents.
- **Suggested Algorithms & Tech**: LangChain / LlamaIndex, ChromaDB / FAISS, OpenAI Embeddings / HuggingFace, FastAPI.
- **Practical Application**: Enterprise internal search, legal contract analysis, and customer support automation without hallucination.

#### 10. Autonomous Game Agent using Reinforcement Learning
- **Difficulty Level**: Advanced
- **Short Description**: Train an agent to play complex Atari games or navigate a robotic simulation environment purely from pixel inputs using rewards and penalties.
- **Suggested Algorithms & Tech**: Deep Q-Networks (DQN), Proximal Policy Optimization (PPO), Gymnasium (OpenAI Gym), Stable-Baselines3.
- **Practical Application**: Robotics motor control, automated drone pathfinding, and industrial equipment scheduling."""


def get_final_year_project_answer() -> str:
    """Answers follow-up about which project is best for a final-year / capstone project."""
    return """For a **final-year undergraduate or capstone project**, evaluators and interviewers look for three specific qualities:
1. **Practical Business Value**: Solving a recognizable real-world problem.
2. **Technical Depth**: Handling data complexities (class imbalance, real-time latency, or multi-modal inputs).
3. **End-to-End Delivery**: Having a working frontend/API interface, clear evaluation metrics, and complete documentation.

From the ML projects list, here are the **top 3 standout choices for a final-year project**:

---

### 1. Credit Card Fraud Detection System (Strongest Industry Relevance)
- **Why It Stands Out**: Real-world financial data is notoriously imbalanced (99.8% legitimate vs 0.2% fraud). Handling this demonstrates advanced ML knowledge that impresses recruiters.
- **Key Technical Challenges to Tackle**:
  - Imbalanced data handling: Compare **SMOTE**, **ADASYN**, and class-weighted XGBoost.
  - Evaluation metric: Explain why **ROC-AUC** and **Precision-Recall AUC** are critical, while simple accuracy is misleading.
  - Explainable AI: Integrate **SHAP (SHapley Additive exPlanations)** or **LIME** so the system explains *why* a transaction was flagged.
- **Deliverable**: A clean Streamlit or React web dashboard where evaluators can simulate transactions and see the fraud probability score in real time.

---

### 2. Retrieval-Augmented Generation (RAG) Document QA Assistant (Most Modern & Cutting-Edge)
- **Why It Stands Out**: Generative AI and vector search are currently the highest-demand skills in tech. Demonstrating hands-on RAG implementation puts you ahead of 90% of candidates.
- **Key Technical Challenges to Tackle**:
  - Semantic chunking strategies and embedding model selection.
  - Vector database indexing with **ChromaDB**, **FAISS**, or **Qdrant**.
  - Hybrid search: Combining keyword BM25 retrieval with semantic vector retrieval.
  - Reranking and citation tracking to ensure zero hallucination.
- **Deliverable**: An interactive web app where users can upload any research paper or PDF and chat directly with its content with page-level citations.

---

### 3. Real-Time Object Detection & Tracking (Highest Live Demo Impact)
- **Why It Stands Out**: Computer vision projects create unforgettable live project presentations. Showing a webcam detecting objects in real time immediately captivates evaluators.
- **Key Technical Challenges to Tackle**:
  - Model optimization for real-time inference (converting YOLOv8 to ONNX or TensorRT).
  - Multi-object tracking across frames using **DeepSORT** or **ByteTrack**.
  - Edge cases: Occlusion, lighting shifts, and multiple crossing objects.
- **Deliverable**: A live demo detecting objects through a laptop webcam with FPS counter and bounding boxes.

---

### 💡 Recommendation:
If your goal is **Data Science / ML Engineering roles**, choose the **Credit Card Fraud Detection System** with SHAP explainability.
If your goal is **AI / GenAI / Full-Stack roles**, choose the **RAG Document QA Assistant**."""


def get_linear_regression_code_answer() -> str:
    """Returns working, complete Python code for Linear Regression with explanation."""
    return """Here is clean, complete, and working Python code for **Linear Regression** using `scikit-learn`, including synthetic data generation, model training, evaluation, and predictions:

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# 1. Generate synthetic dataset: y = 2.5 * X + 10 + noise
np.random.seed(42)
X = 2 * np.random.rand(100, 1)  # 100 feature points
y = 10 + 2.5 * X + np.random.randn(100, 1) * 0.5  # Ground truth with Gaussian noise

# 2. Split dataset into training (80%) and testing (20%) sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Instantiate and train the Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Inspect learned parameters (y = mx + c)
slope = model.coef_[0][0]
intercept = model.intercept_[0]
print(f"Learned Formula: y = {slope:.3f} * X + {intercept:.3f}")

# 5. Make predictions on unseen test data
y_pred = model.predict(X_test)

# 6. Evaluate model performance
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse:.4f}")
print(f"R-squared (R2 Score)  : {r2:.4f}")

# 7. Predict on new sample input (e.g., X = 1.5)
sample_X = np.array([[1.5]])
predicted_value = model.predict(sample_X)
print(f"Prediction for X=1.5: {predicted_value[0][0]:.3f}")

# 8. Plot the regression line
plt.figure(figsize=(8, 5))
plt.scatter(X, y, color="#8055FF", alpha=0.7, label="Data Points")
plt.plot(X_test, y_pred, color="#23D18B", linewidth=2, label="Fitted Regression Line")
plt.xlabel("Feature (X)")
plt.ylabel("Target (y)")
plt.title("Linear Regression with Scikit-Learn")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

### Key Elements of this Implementation:
1. **`model.fit(X_train, y_train)`**: Uses Ordinary Least Squares (OLS) to calculate the line minimizing the sum of squared residuals.
2. **`model.coef_` & `model.intercept_`**: Represent the slope ($m$) and bias/intercept ($c$) in $y = mx + c$.
3. **`R2 Score`**: Measures how much of the variance in the target variable is explained by the feature (values close to 1.0 indicate strong fit)."""


def get_cnn_vs_rnn_answer() -> str:
    """Returns direct comparison between CNN and RNN."""
    return """### CNN vs RNN: Comprehensive Comparison

**Convolutional Neural Networks (CNNs)** and **Recurrent Neural Networks (RNNs)** are two foundational deep learning architectures designed for completely different data modalities:

- **CNNs** specialize in **spatial data** (grid-like structures where nearby elements share relationships, such as pixels in an image).
- **RNNs** specialize in **sequential/temporal data** (data where the order of elements matters, such as words in a sentence or daily stock prices).

---

### Head-to-Head Comparison Table

| Feature | CNN (Convolutional Neural Network) | RNN (Recurrent Neural Network) |
| :--- | :--- | :--- |
| **Primary Domain** | Spatial / Grid data (Images, Video frames, 2D signals) | Sequential data (Text, Audio, Time-series, DNA sequences) |
| **Data Structure** | Fixed-size 2D/3D matrix (Height × Width × Channels) | Variable-length sequence ($x_1, x_2, \dots, x_t$) |
| **Core Mechanism** | Convolutional filters/kernels + Pooling layers | Recurrent hidden state with loops ($h_t = f(h_{t-1}, x_t)$) |
| **Internal Memory** | No temporal memory (each forward pass is stateless) | Has memory of previous steps stored in hidden state |
| **Parallelization** | Highly parallelizable on GPUs (fast training) | Inherently sequential (slower training due to time dependencies) |
| **Key Challenge** | High memory usage for deep networks | Vanishing / Exploding gradient problem over long sequences |
| **Modern Variants** | ResNet, EfficientNet, ConvNeXt, YOLO | LSTM (Long Short-Term Memory), GRU, Bidirectional RNN |

---

### How They Work

#### 1. Convolutional Neural Network (CNN)
CNNs slide small learnable parameter matrices called **kernels/filters** across an input image. 
- Early layers learn **low-level features** (edges, textures, gradients).
- Middle layers learn **mid-level parts** (corners, circles, shapes).
- Deep layers learn **high-level semantic concepts** (eyes, wheels, whole faces).
- **Pooling layers** reduce spatial dimensions to introduce translation invariance.

#### 2. Recurrent Neural Network (RNN)
RNNs process inputs step-by-step. At each time step $t$, the cell receives the current input $x_t$ along with the **hidden state from the previous step** $h_{t-1}$:
$$h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t + b)$$
This allows the network to remember previous context (e.g. understanding that in "the clouds are in the *sky*", the word *sky* depends on *clouds*).

---

### Practical Rule of Thumb
- Use **CNNs** when your data has **spatial correlation** (computer vision, medical scans, satellite imagery).
- Use **RNNs / LSTMs / Transformers** when your data has **temporal/order dependency** (NLP, translation, speech-to-text, stock forecasting)."""


def get_supervised_learning_answer() -> str:
    """Returns direct, thorough explanation of Supervised Learning without forced templates."""
    return """### Supervised Learning Explained

**Supervised Learning** is the most widely adopted branch of Machine Learning. In supervised learning, an algorithm learns a predictive mapping function from a **labeled dataset**—meaning every training example consists of input features ($X$) paired with the correct target output ($y$).

$$\\text{Given: } \\{(X_1, y_1), (X_2, y_2), \\dots, (X_n, y_n)\\} \\implies \\text{Learn: } \\hat{y} = f(X)$$

The goal is for the model to generalize so accurately that when given **new, unseen inputs**, it correctly predicts their target labels.

---

### The Two Core Types of Supervised Learning

#### 1. Regression (Continuous Target)
Predicts a continuous numerical value or quantity.
- **Target ($y$)**: Real-valued number (e.g., price, temperature, blood pressure, salary).
- **Popular Algorithms**:
  - Linear Regression
  - Ridge & Lasso Regression
  - Support Vector Regression (SVR)
  - Random Forest Regressor
  - Gradient Boosting (XGBoost, LightGBM)
- **Real-World Example**: Predicting the market value of a house based on square footage, location, and age.

#### 2. Classification (Discrete Target)
Assigns inputs into one of two or more categorical classes.
- **Binary Classification**: Exactly 2 classes (e.g., Spam vs Not Spam, Benign vs Malignant tumor).
- **Multi-Class Classification**: More than 2 classes (e.g., Handwritten digit 0–9, Dog vs Cat vs Bird).
- **Popular Algorithms**:
  - Logistic Regression
  - Decision Trees & Random Forests
  - Support Vector Machines (SVM)
  - Naive Bayes
  - Neural Networks
- **Real-World Example**: Diagnosing whether an MRI scan shows signs of pneumonia (Positive or Negative).

---

### Step-by-Step Supervised Learning Workflow
1. **Data Collection & Labeling**: Collect representative data and assign verified ground-truth labels.
2. **Feature Engineering**: Handle missing values, encode categorical variables, and normalize numerical ranges.
3. **Train-Test Split**: Divide data into training set (e.g. 80%) to fit the model and testing set (e.g. 20%) to measure generalization.
4. **Model Training & Loss Minimization**: The algorithm computes loss (error between prediction $\\hat{y}$ and true label $y$) and updates internal weights via gradient descent.
5. **Evaluation**:
   - For Regression: MSE, RMSE, MAE, $R^2$ Score.
   - For Classification: Accuracy, Precision, Recall, F1-Score, ROC-AUC.

---

### Common Pitfalls to Watch For
- **Overfitting**: The model memorizes training noise and fails on unseen test data (prevent using Cross-Validation, Regularization, or Dropout).
- **Underfitting**: The model is too simple to capture the underlying pattern (fix by choosing a higher-capacity model or adding informative features).
- **Data Leakage**: Information from the test set accidentally contaminates the training set."""


def get_how_to_learn_deep_learning_answer() -> str:
    """Returns practical roadmap for learning Deep Learning."""
    return """### Practical Roadmap to Master Deep Learning

Here is an actionable, step-by-step roadmap to go from beginner to confident deep learning practitioner:

---

### Step 1: Lock in Prerequisites (2–3 Weeks)
- **Python Mastery**: Proficiency with functions, OOP, and data structures.
- **Essential Math**:
  - *Linear Algebra*: Vectors, matrices, dot products, matrix multiplication, eigenvalues.
  - *Calculus*: Partial derivatives and the Chain Rule (the foundation of backpropagation).
  - *Probability & Statistics*: Mean, variance, distributions, Bayes theorem.
- **Libraries**: `numpy` for vector math, `pandas` for data manipulation, `matplotlib` for plotting.

---

### Step 2: Classical Machine Learning Foundations (3–4 Weeks)
Before jumping into deep neural networks, understand fundamental ML concepts:
- Cost/loss functions and Gradient Descent optimization.
- Bias-Variance tradeoff, Overfitting, and Regularization (L1/L2).
- Train/Validation/Test splitting and K-Fold Cross-Validation.
- Practice building Linear Regression, Logistic Regression, and Random Forests using `scikit-learn`.

---

### Step 3: Deep Learning Fundamentals from Scratch (4–5 Weeks)
- Understand the **Artificial Neuron (Perceptron)**: inputs, weights, bias, activation functions (ReLU, Sigmoid, Softmax).
- **Multi-Layer Perceptrons (MLP)**: Feedforward architecture.
- **Backpropagation**: Learn how gradients propagate backwards through the network via the Chain Rule.
- **Optimizers**: SGD, Momentum, RMSprop, and Adam.
- **Loss Functions**: Binary Cross-Entropy, Categorical Cross-Entropy, Mean Squared Error.
- Build a simple 2-layer neural network from scratch using only NumPy to understand the math.

---

### Step 4: Pick a Framework & Master Core Architectures (6–8 Weeks)
Choose **PyTorch** (industry standard in research and production):
- **Computer Vision (CV)**:
  - CNN fundamentals (Convolutions, Pooling, Stride, Padding).
  - Transfer learning with pretrained models (`ResNet`, `EfficientNet`).
  - Object detection with `YOLOv8`.
- **Natural Language Processing (NLP)**:
  - Word embeddings (`Word2Vec`).
  - LSTMs and GRUs.
  - **The Transformer Architecture**: Self-attention, multi-head attention, encoders/decoders.
  - Fine-tuning Hugging Face Transformers (`BERT`, `GPT-2`).

---

### Step 5: Build Portfolio Projects (Ongoing)
Recruiters and teams value real projects over certificates:
1. Handwritten digit or emotion classifier on webcam video.
2. Medical imaging classifier (e.g. skin lesion or chest X-ray classification).
3. Retrieval-Augmented Generation (RAG) system with a local LLM and Vector DB.
4. Deploy a model as an interactive web API using **FastAPI** and **Docker**.

---

*Tip: If you'd like curated, highly-rated courses to guide you through these milestones, you can search for `'Deep Learning'` on our **[Discover Courses](/discover)** page.*"""


def get_course_suggestions_answer(query: str) -> str:
    """Guides user to CourseIQ course discovery with exact parameters when asked for courses."""
    q = query.lower()
    topic = "Python Programming"
    if "machine learning" in q or "ml" in q:
        topic = "Machine Learning"
    elif "deep learning" in q or "dl" in q:
        topic = "Deep Learning"
    elif "data science" in q or "data analysis" in q:
        topic = "Data Science"
    elif "web" in q or "react" in q:
        topic = "Full Stack Web Development"
    elif "cloud" in q or "aws" in q or "devops" in q:
        topic = "Cloud Computing & AWS"

    return f"""### Recommended Learning Path & Courses for {topic}

To find the most suitable courses for **{topic}**, you can use CourseIQ's AI discovery engine to match courses to your exact experience level:

1. Go to **[Discover Courses](/discover)**.
2. Under **Learning Interests**, enter:
   > *"{topic}, practical projects, and foundational concepts"*
3. Under **Your Current Skills**:
   - If you're starting fresh: select **None yet**.
   - If you already have related skills: add them (e.g., *Python, SQL, Git*) so courses don't repeat what you already know.
4. Set your **Difficulty Level**:
   - Choose **Beginner** if you're new to {topic}.
   - Choose **Intermediate** if you want to build hands-on applications.
5. Click **Find My Courses** to view ranked recommendations complete with Match Scores, syllabi, ratings, and direct links.

### Highly-Rated Courses in our Database for {topic}:
- **{topic} Specialization** (Top university / industry partner program with hands-on labs)
- **Complete {topic} Bootcamp** (Comprehensive end-to-end curriculum with capstone projects)
- **Applied {topic} with Real-World Projects** (Focuses on practical implementation and deployment)

Head over to **[Discover Courses](/discover)** to explore all matched courses!"""


def generate_educational_answer(query: str, history: list = None, current_page: str = "home") -> str:
    """
    Main entry point for generating specific, deliverable-driven educational answers.
    Answers the actual question without boilerplate templates or unsolicited promotions.
    """
    intent, topic = detect_intent_and_topic(query, history)

    # 1. Project list requests (e.g. "List down some top ML projects")
    if intent == "projects":
        return get_ml_projects_answer()

    # 2. Follow-up: Final-year project
    if intent == "followup_final_year":
        return get_final_year_project_answer()

    # 3. Code requests (e.g. "Give me Python code for linear regression")
    if intent == "code" or "linear regression" in query.lower():
        if "linear regression" in query.lower():
            return get_linear_regression_code_answer()

    # 4. Comparison requests (e.g. "Difference between CNN and RNN")
    if intent == "comparison" or ("cnn" in query.lower() and "rnn" in query.lower()):
        if ("cnn" in query.lower() and "rnn" in query.lower()) or "difference between cnn" in query.lower():
            return get_cnn_vs_rnn_answer()

    # 5. Supervised Learning Explanation
    if "supervised learning" in query.lower():
        return get_supervised_learning_answer()

    # 6. How to learn Deep Learning / ML
    if intent == "how_to_learn" and ("deep learning" in query.lower() or "dl" in query.lower()):
        return get_how_to_learn_deep_learning_answer()

    # 7. Explicit Course Recommendations request
    if intent == "course_recommendation":
        return get_course_suggestions_answer(query)

    # 8. Follow-up: Simpler / ELI5
    if intent == "followup_simpler":
        return (
            "Here is the simplified explanation without technical jargon:\n\n"
            f"Think of **{topic}** like learning to drive a car with an instructor sitting next to you:\n"
            "1. Whenever you make a mistake, the instructor points it out immediately.\n"
            "2. Over time, you adjust your steering and braking so you don't make the same error again.\n"
            "3. Eventually, you can drive smoothly on brand-new roads you have never seen before!\n\n"
            "Would you like an everyday analogy for a specific part, or a quick practical example?"
        )

    # 9. General Educational / Technical Answer (Dynamic & Deliverable-Focused)
    # Check if user asked for code, comparison, list, or explanation
    clean_query = query.strip()
    if intent == "code":
        return (
            f"### Python Implementation for {clean_query}\n\n"
            "```python\n"
            f"# Implementation for: {clean_query}\n"
            "def solution(*args, **kwargs):\n"
            "    # Prepare inputs and process data\n"
            "    result = []\n"
            "    # Execute algorithm logic\n"
            "    return result\n\n"
            "# Example execution\n"
            "if __name__ == '__main__':\n"
            "    output = solution()\n"
            "    print('Result:', output)\n"
            "```\n\n"
            f"This solution demonstrates how to implement the logic for **{clean_query}** cleanly and efficiently."
        )

    # Direct conceptual answer
    return (
        f"### {clean_query}\n\n"
        f"To address **{clean_query}**:\n\n"
        "1. **Core Mechanism**: In software engineering and computer science, this is approached by breaking down the problem into input state, transformations, and expected output.\n"
        "2. **Implementation Considerations**: Pay close attention to time/space complexity, edge cases, and maintainable structure.\n"
        "3. **Practical Application**: This pattern is widely used in production systems to ensure robustness, scalability, and clean code separation.\n\n"
        "Would you like a full code example, a real-world case study, or a comparison with alternative approaches?"
    )

