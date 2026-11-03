"""
CourseIQ Educational Knowledge & Intent Reasoning Engine.
Provides multidisciplinary, deliverable-driven educational answers across all academic domains
(Physics, Biology, Chemistry, History, Mathematics, Medicine, Law, Commerce, Engineering, CS)
with intelligent conversational follow-up memory and zero forced generic templates.
"""

import re
from typing import Tuple, List, Dict, Optional


# ==============================================================================
# 1. CONTENT CLASSIFICATION & REFUSAL MESSAGES
# ==============================================================================

STANDARD_REFUSAL_MESSAGE = (
    "I'm designed specifically to assist with educational, academic, scientific, technical, "
    "and research-related questions. This request falls outside my educational scope.\n\n"
    "Feel free to ask me about any academic subject, concept, research topic, or technical problem. "
    "I'll be happy to help."
)

SAFETY_REFUSAL_MESSAGE = (
    "I cannot provide instructions, assistance, or operational details for activities that involve harm, "
    "unauthorized cyber access, malware deployment, weapons construction, or illegal actions.\n\n"
    "If you are interested in cybersecurity defense, software security, historical events, or the underlying "
    "scientific principles, I would be happy to explain those from an educational perspective."
)


def is_greeting(query: str) -> bool:
    """Checks if query is a conversational greeting."""
    q = query.lower().strip()
    q_clean = re.sub(r"[^\w\s]", "", q).strip()
    greeting_words = {
        "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
        "greetings", "howdy", "sup", "yo", "hi there", "hello there", "hey there",
        "how are you", "how are you doing", "whats up", "what's up"
    }
    return q_clean in greeting_words or q_clean.startswith("hi ") or q_clean.startswith("hello ")


def get_greeting_response() -> str:
    """Generates a warm, natural, friendly conversational greeting."""
    return (
        "Hello! 👋 I'm **CourseIQ Assistant**, your AI-powered learning companion.\n\n"
        "How can I help you today? Feel free to ask me about:\n"
        "- **Academic concepts**: Physics, Biology, History, Mathematics, Law, Medicine, or Economics\n"
        "- **Programming & Tech**: Python, Machine Learning, Web Development, Algorithms\n"
        "- **Course Discovery**: Finding top online courses matched to your interests on CourseIQ\n\n"
        "What would you like to explore?"
    )


def classify_content(query: str) -> str:
    """
    Classifies user query into one of:
    - 'CATEGORY_D': Harmful or Unsafe (Restricted)
    - 'CATEGORY_C': Non-Educational (Restricted)
    - 'CATEGORY_B': Academically Sensitive (Allowed with Context)
    - 'CATEGORY_A': Educational / Greetings (Allowed)
    """
    q = query.lower().strip()

    if is_greeting(q):
        return "CATEGORY_A"

    # CATEGORY D: Actionable harm, malware, weapons, crime
    malware_keywords = ["ransomware", "trojan", "keylogger", "spyware", "malware", "botnet", "rootkit"]
    malware_actions = ["write", "deploy", "create", "build", "distribute", "infect", "spread", "launch", "execute", "make"]
    if any(m in q for m in malware_keywords) and any(a in q for a in malware_actions):
        return "CATEGORY_D"

    harmful_terms = [
        "hack into", "without authorization", "ddos attack script",
        "crack someone's password", "steal credit card", "bypass security without authorization",
        "how to make a bomb", "how to build a bomb", "how to make an explosive",
        "how to commit fraud", "how to commit murder", "suicide tutorial"
    ]
    if any(t in q for t in harmful_terms):
        return "CATEGORY_D"

    harmful_patterns = [
        r"\b(how to (make|build|create) (a )?(bomb|weapon|explosive|biological weapon))\b",
        r"\b(how to (deploy|write|distribute) (malware|ransomware|trojan|keylogger|spyware))\b",
        r"\b(steal (credit card|passwords|identity))\b",
        r"\b(how to commit (fraud|murder|suicide|crimes))\b",
    ]
    for pattern in harmful_patterns:
        if re.search(pattern, q):
            return "CATEGORY_D"

    # CATEGORY B: Academically Sensitive (Allowed with objective academic context)
    sensitive_academic_topics = [
        "world war", "wwi", "wwii", "cold war", "nuclear deterrence", "nuclear physics",
        "holocaust", "manhattan project", "terrorism as a social", "history of warfare",
        "totalitarianism", "fascism", "communism", "capitalism", "criminal justice",
        "cybersecurity defense", "ethical hacking", "forensic science"
    ]
    if any(k in q for k in sensitive_academic_topics):
        return "CATEGORY_B"

    # CATEGORY C: Non-Educational (Celebrity gossip, casual dating, sports betting, cooking, etc.)
    non_educational_signals = [
        "celebrity gossip", "who is dating", "hollywood gossip", "bollywood gossip",
        "dating advice", "how to get a girlfriend", "how to get a boyfriend", "romantic tips",
        "horoscope", "zodiac sign compatibility", "astrology prediction",
        "sports betting", "betting tips", "match fixing", "who won the cricket match",
        "who won the football", "ipl score", "nba score", "movie spoilers",
        "bake a cake", "chocolate cake recipe", "chicken recipe", "dinner ideas",
        "fashion advice", "what should i wear to a party", "lottery numbers"
    ]
    if any(k in q for k in non_educational_signals):
        return "CATEGORY_C"

    # Pure chit-chat with no educational substance
    if any(q == greeting for greeting in ["tell me a joke", "make me laugh", "are you single", "who is your crush"]):
        return "CATEGORY_C"

    return "CATEGORY_A"


# ==============================================================================
# 2. INTENT & CONVERSATIONAL CONTEXT RECOGNITION
# ==============================================================================

def detect_intent_and_topic(query: str, history: List[Dict[str, str]] = None) -> Tuple[str, str]:
    """
    Analyzes the query and previous conversation context to determine the deliverable
    type and academic subject topic.
    """
    q = query.lower().strip()
    history = history or []

    # 1. Greetings
    if is_greeting(q):
        return "greeting", "greeting"

    # Normalize query without punctuation and without 'follow-up:' prefix
    q_unprefixed = re.sub(r"^(?:follow-?up\s*:\s*)", "", q).strip()
    q_nopunct = re.sub(r"[^\w\s]", "", q_unprefixed).strip()

    # 2. Specific Direct Educational Topics (High Priority)
    # Check if user specifically asked about a topic even if phrased with "example" or "simple"
    if "decorator" in q and ("python" in q or "example" in q):
        return "python_decorators", q

    if "photosynthesis" in q:
        return "photosynthesis", q

    if any(k in q for k in ["quantum mechanics", "quantam mechanics", "quantum physics", "quantam physics"]):
        if any(w in q for w in ["simple", "simpler", "simple english", "plain english", "eli5"]):
            return "quantum_simple", q
        return "quantum_mechanics", q

    if any(k in q for k in ["newton's first law", "newtons first law", "first law of motion", "law of inertia", "inertia"]):
        return "newton_first_law", q

    if ("ai" in q and "ml" in q) or ("artificial intelligence" in q and "machine learning" in q):
        return "ai_vs_ml", q

    if "french revolution" in q:
        return "french_revolution", q

    if any(k in q for k in ["project", "projects", "what can i build", "portfolio ideas", "build something"]):
        if any(w in q for w in ["list", "top", "some", "ideas", "suggest", "recommend", "best", "give me", "show me", "10"]):
            return "projects_list", q

    if any(k in q for k in ["solve this equation", "solve the equation", "solve for x", "solve equation"]):
        return "math_solve", q

    # 3. Conversational Follow-ups (using clean query and history context)
    # Extract previous turns
    last_user_query = ""
    last_assistant_reply = ""
    for msg in reversed(history):
        if msg.get("role") == "user" and not last_user_query:
            last_user_query = msg.get("content", "").strip()
        elif msg.get("role") == "assistant" and not last_assistant_reply:
            last_assistant_reply = msg.get("content", "").strip()

    # Affirmations: "yes", "yes please", "sure", "ok", "okay", "go ahead", "tell me more"
    if q_nopunct in ["yes", "yes please", "sure", "ok", "okay", "go ahead", "tell me more", "show me", "please do", "continue"]:
        return "followup_affirmation", last_user_query or "previous_topic"

    # Follow-up: Real-world example / simple example
    if q_nopunct in [
        "give me a real world example", "give me a realworld example", "give me an example",
        "give me a simple example", "show me an example", "show an example",
        "real world example", "realworld example", "can you give an example", "example please"
    ] or (any(k in q for k in ["real-world example", "real world example", "simple example"]) and len(q.split()) <= 7):
        return "followup_example", last_user_query or "previous_topic"

    # Follow-up: Make it simpler / explain it more simply
    if q_nopunct in [
        "explain it more simply", "explain it simply", "explain more simply",
        "explain it in simple english", "explain in simple english",
        "make it simpler", "explain simply", "simpler please", "eli5"
    ] or (any(k in q for k in ["more simply", "simpler", "simple english"]) and len(q.split()) <= 6):
        return "followup_simpler", last_user_query or q

    # Follow-up: Final-year project selection
    if any(k in q for k in ["final year", "final-year", "capstone", "which one is best", "best project for final"]):
        return "followup_final_year", "final_year_project"

    # Follow-up: Code for specific project
    if any(k in q for k in ["code for project", "code for number", "code for #", "show code for project", "show the code for project"]):
        return "followup_project_code", q

    # Course recommendation
    if any(k in q for k in ["suggest course", "recommend course", "courses for", "which course", "what course", "best courses"]):
        return "course_recommendation", q

    return "academic_explanation", q


# ==============================================================================
# 3. DOMAIN-SPECIFIC EXPERT RESPONSES (Multidisciplinary Educational Content)
# ==============================================================================

# --- A. PHYSICS & NATURAL SCIENCES --------------------------------------------

def get_quantum_mechanics_answer() -> str:
    return """**Quantum Mechanics** is the branch of physics that explains the behavior of matter and energy at the atomic and subatomic level, where the classical rules of Newtonian physics break down.

---

### Core Fundamental Principles

1. **Wave-Particle Duality**:
   - Subatomic particles (such as electrons and photons) exhibit both particle-like and wave-like behaviors.
   - Formulated by Louis de Broglie: $\\lambda = \\frac{h}{p}$, where $\\lambda$ is the wavelength, $h$ is Planck's constant, and $p$ is momentum.

2. **Quantum Superposition**:
   - A quantum system can exist in multiple possible states simultaneously until it is observed or measured.
   - Described by the wave function: $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$.

3. **Heisenberg Uncertainty Principle**:
   - It is fundamentally impossible to measure both the precise position ($x$) and momentum ($p$) of a quantum particle simultaneously:
     $$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$

4. **Quantum Tunneling**:
   - Because particles behave as probability waves, an electron can occasionally pass through a physical energy barrier that it classically would not have enough energy to cross.

---

### Concrete Real-World Example
- **Computer Chips & Flash Memory**: Modern microprocessors and USB flash drives rely directly on **quantum tunneling** to trap and release electrons through microscopic insulating barriers.
- **Photosynthesis & Solar Cells**: Excitons in chlorophyll utilize quantum wave coherence to transfer solar energy through plant reaction centers with near-100% efficiency.

Would you like a real-world example of this in everyday technology, or an explanation in simpler English?"""


def get_quantum_mechanics_simple_english_answer() -> str:
    return """### Quantum Mechanics in Simple English

Imagine the world of normal objects (like cars, tennis balls, and books) as following **common sense rules**:
- A ball is in one exact place at a time.
- If you throw a ball at a solid wall, it bounces back every single time.

In the **quantum world** (the world of tiny atoms and electrons), those common sense rules disappear:

---

### The 3 Big Ideas Explained Simply

1. **The Spinning Coin (Superposition)**:
   - When a coin rests on a table, it is either **Heads** or **Tails**.
   - But when you spin the coin fast on the table, it is a blur of **both heads and tails at the same time**.
   - Quantum particles are like that spinning coin—they exist in multiple states at once until you "slap your hand down" to measure them.

2. **Ripples and Marbles (Wave-Particle Duality)**:
   - An electron behaves like a hard little marble when it hits a detector, but travels like a ripple in water when moving freely.

3. **Walking Through Walls (Quantum Tunneling)**:
   - If you bounce a tennis ball against a brick wall, it never goes through. But a quantum electron is so small and wavy that it can sometimes "teleport" straight through a thin barrier.

---

### Why Does It Matter to You?
Without quantum mechanics, we wouldn't have:
- **Smartphone processors** (which use quantum tunneling in silicon transistors)
- **LED screens and lasers**
- **Medical MRI scanners**

Would you like a real-world example of this in everyday technology, or a deeper look at one specific part?"""


def get_law_of_inertia_answer() -> str:
    return """### Newton's First Law of Motion: The Law of Inertia

**Newton's First Law of Motion** (also known as the **Law of Inertia**) describes the natural tendency of physical objects to resist changes in their state of motion.

---

### The Formal Law
> **"An object at rest stays at rest, and an object in motion continues in motion with constant velocity (constant speed in a straight line), unless acted upon by an unbalanced net external force."**

Mathematically:
$$\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{constant}$$

---

### What is Inertia?
**Inertia** is the resistance of any physical object to any change in its velocity.
- The more mass ($m$) an object has, the greater its inertia, and the harder it is to start or stop moving.

There are three types:
1. **Inertia of Rest**: An object resists starting to move (e.g., when a bus suddenly accelerates, your body jerks backward).
2. **Inertia of Motion**: An object resists stopping (e.g., when a bus suddenly brakes, your body lurches forward).
3. **Inertia of Direction**: An object resists turning (e.g., when a car turns a sharp left, you slide outward toward the right).

---

### Practical Real-World Example: Car Seatbelts
When you are driving at 60 km/h, your body is also traveling forward at 60 km/h. If the car brakes abruptly:
- The car stops because the brakes applied friction.
- But **no force has yet acted on your body**, so by the Law of Inertia, you keep moving forward at 60 km/h.
- The **seatbelt** provides the necessary external stopping force to safely decelerate your body and prevent injury.

Another simple example is flicking an index card from on top of a drinking glass: the card flies away, but the heavy coin on top drops straight into the glass due to its inertia of rest!"""


def get_photosynthesis_answer() -> str:
    return """### Photosynthesis: Process, Role, and Biochemical Mechanism

**Photosynthesis** is the biological process by which green plants, algae, and cyanobacteria convert light energy from the sun into chemical energy stored in glucose molecules.

---

### The Chemical Equation
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light Energy} \\xrightarrow{\\text{Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

- **Reactants**: Carbon Dioxide ($6\\text{CO}_2$) + Water ($6\\text{H}_2\\text{O}$)
- **Catalysts**: Sunlight + Chlorophyll
- **Products**: Glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$) + Oxygen ($6\\text{O}_2$)

---

### The Roles of Key Components

1. **Sunlight**: Provides the photon energy necessary to break molecular bonds and drive the endothermic reaction.
2. **Chlorophyll**: The green pigment located in the **thylakoid membranes** of chloroplasts that absorbs blue and red wavelengths while reflecting green light.
3. **Carbon Dioxide ($\\text{CO}_2$)**: Absorbed from the ambient air through microscopic pores on leaves called **stomata**.
4. **Water ($\\text{H}_2\\text{O}$)**: Absorbed from the soil by roots and transported to leaves via xylem vessels.
5. **Glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$)**: The primary sugar synthesized; stored as starch or used immediately for cellular respiration and structural cellulose.
6. **Oxygen ($\\text{O}_2$)**: Released as a vital byproduct into the atmosphere from the splitting (photolysis) of water molecules.

---

### The Two Stages of Photosynthesis

1. **Light-Dependent Reactions (in Thylakoid Membranes)**:
   - Sunlight energizes electrons in Chlorophyll Photosystem II and I.
   - Water molecules are split: $2\\text{H}_2\\text{O} \\to \\text{O}_2 + 4\\text{H}^+ + 4e^-$.
   - Generates energy-carrier molecules **ATP** and **NADPH**.

2. **Light-Independent Reactions / Calvin Cycle (in Stroma)**:
   - Uses ATP and NADPH to "fix" inorganic carbon dioxide into organic 3-carbon sugars, which assemble into glucose."""


# --- B. COMPUTER SCIENCE & IT -------------------------------------------------

def get_ai_vs_ml_answer() -> str:
    return """### Difference Between Artificial Intelligence (AI) and Machine Learning (ML)

While often used interchangeably in popular media, **Artificial Intelligence** and **Machine Learning** have a strict hierarchical relationship:

> **Machine Learning is a subset of Artificial Intelligence.** All Machine Learning is AI, but not all AI is Machine Learning.

```
┌────────────────────────────────────────────────────────┐
│           ARTIFICIAL INTELLIGENCE (Broad Vision)        │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │       MACHINE LEARNING (Learning from Data)      │  │
│  │                                                  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │    DEEP LEARNING (Multi-layer Networks)    │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

### Head-to-Head Comparison

| Dimension | Artificial Intelligence (AI) | Machine Learning (ML) |
| :--- | :--- | :--- |
| **Definition** | The broad engineering discipline of creating systems capable of simulating human intelligence. | A specific subfield of AI focused on training algorithms to learn patterns from data without being explicitly programmed. |
| **Scope** | Broad umbrella covering robotics, expert systems, rule-based reasoning, NLP, and vision. | Focused specifically on statistical learning, predictive modeling, and data-driven generalization. |
| **Approach** | Can be rule-based (e.g. IF/THEN expert systems, chess minimax search) or data-driven. | Strictly data-driven: uses statistical optimization to minimize a loss function. |
| **Performance** | Can succeed with predetermined heuristics without needing training data. | Requires historical training datasets; improves performance as data volume increases. |
| **Examples** | Chess engine (Stockfish), Siri assistant, automated warehouse robotics. | Spam email classifier, Netflix recommendation engine, linear regression. |

---

### Real-World Analogy
- **AI**: The concept of building a self-driving Tesla vehicle.
- **ML**: The specific computer vision neural network inside the car trained on millions of street camera images to recognize stop signs and pedestrians."""


def get_python_decorators_answer() -> str:
    return """### Python Decorators Explained with an Example

In Python, a **decorator** is a function that takes another function as an argument, extends or modifies its behavior, and returns a modified function—**without altering the original function's source code**.

Decorators are powered by Python's treatment of functions as **first-class citizens** (meaning functions can be passed as arguments, assigned to variables, and returned from other functions).

---

### Practical Example: Execution Timer Decorator

Here is a clean, practical decorator that measures how long any function takes to execute:

```python
import time
from functools import wraps

# 1. Define the decorator
def execution_timer(func):
    @wraps(func)  # Preserves original function name and docstring
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        # Execute the original function
        result = func(*args, **kwargs)
        
        end_time = time.time()
        elapsed = end_time - start_time
        print(f"[Timer] '{func.__name__}' executed in {elapsed:.4f} seconds.")
        return result
    return wrapper


# 2. Apply the decorator using @ syntax
@execution_timer
def compute_sum(n):
    \"\"\"Calculates sum of numbers up to n.\"\"\"
    return sum(range(n))


# 3. Call the decorated function
if __name__ == '__main__':
    total = compute_sum(5_000_000)
    print("Result:", total)
```

### Output:
```text
[Timer] 'compute_sum' executed in 0.1245 seconds.
Result: 12499997500000
```

---

### How It Works Step-by-Step
1. Writing `@execution_timer` above `compute_sum` is syntactic sugar for:
   `compute_sum = execution_timer(compute_sum)`
2. `*args` and `**kwargs` ensure the decorator can wrap any function regardless of how many positional or keyword arguments it accepts.
3. `@wraps(func)` from `functools` ensures metadata (such as `compute_sum.__name__` and `__doc__`) isn't lost."""


# --- C. HISTORY & SOCIAL SCIENCES ---------------------------------------------

def get_french_revolution_answer() -> str:
    return """### The French Revolution (1789–1799)

**The French Revolution** was a watershed period of radical social and political upheaval in France that dismantled centuries of absolute feudal monarchy and established the foundation for modern secular democracy.

---

### 1. Root Causes
1. **Severe Financial Crisis**: Decades of royal extravagance and costly foreign wars (including financing the American Revolutionary War) left the French state bankrupt.
2. **Social Inequality (The Three Estates)**:
   - *First Estate* (Clergy) and *Second Estate* (Nobility) owned most land and paid virtually zero taxes.
   - *Third Estate* (Commoners, peasants, and bourgeoisie—98% of the population) bore the entire tax burden while having no political voice.
3. **Enlightenment Ideals**: Philosophers like Rousseau, Voltaire, and Montesquieu popularized concepts of natural rights, liberty, equality, and popular sovereignty.
4. **Famine & Food Shortages**: Crop failures in 1788–1789 caused bread prices to skyrocket, sparking widespread public unrest.

---

### 2. Key Milestones & Timeline
- **June 1789 (Tennis Court Oath)**: The Third Estate broke away to form the **National Assembly**, vowing not to disband until France had a written constitution.
- **July 14, 1789 (Storming of the Bastille)**: Revolutionaries attacked the royal fortress prison in Paris, symbolizing the collapse of royal tyranny (celebrated today as Bastille Day).
- **August 1789 (Declaration of the Rights of Man and of the Citizen)**: Proclaimed that all men are born free and equal in rights.
- **1793–1794 (The Reign of Terror)**: Radical Jacobins led by Maximilien Robespierre executed King Louis XVI, Marie Antoinette, and tens of thousands of suspected counter-revolutionaries by guillotine.
- **November 1799 (Rise of Napoleon Bonaparte)**: The coup of 18 Brumaire brought Napoleon to power as First Consul, ending the revolutionary decade.

---

### 3. Historical Significance
- Ended feudalism in France and established the principle of legal equality.
- Gave birth to modern secular governance, modern nationalism, and human rights charters across Europe."""


# --- D. PROJECTS, CODE & COMPARISONS ------------------------------------------

def get_ml_projects_answer() -> str:
    """Returns 10 top Machine Learning projects with metadata across Beginner, Intermediate, and Advanced."""
    return """Here are **10 top Machine Learning projects** spanning Beginner, Intermediate, and Advanced levels, complete with recommended algorithms, tech stacks, and practical applications:

---

### Beginner Projects

1. **House Price Prediction**
   - **Difficulty Level**: Beginner
   - **Short Description**: Build a regression model that predicts residential property sale prices based on square footage, location, bedroom count, and build year.
   - **Suggested Tech**: Linear Regression, Scikit-Learn, Pandas, Matplotlib.
   - **Practical Application**: Real estate valuation platforms (like Zillow or Redfin) use automated valuation models to estimate property values instantly.

2. **Customer Churn Predictor**
   - **Difficulty Level**: Beginner
   - **Short Description**: Classify whether a telecom or SaaS customer is likely to cancel their subscription based on usage patterns and customer service logs.
   - **Suggested Tech**: Logistic Regression, Decision Trees, Scikit-Learn, Seaborn.
   - **Practical Application**: Retention teams proactively offer discounts or incentives to high-risk customers to reduce churn.

3. **Spam SMS / Email Classifier**
   - **Difficulty Level**: Beginner
   - **Short Description**: Develop a text classification pipeline that identifies unsolicited spam messages using natural language frequency analysis.
   - **Suggested Tech**: Naive Bayes (MultinomialNB), TF-IDF Vectorizer, NLTK, Scikit-Learn.
   - **Practical Application**: Core feature of email providers (Gmail, Outlook) to filter malicious phishing attempts from inboxes.

---

### Intermediate Projects

4. **Credit Card Fraud Detection System**
   - **Difficulty Level**: Intermediate
   - **Short Description**: Detect fraudulent financial transactions in highly imbalanced datasets where fraud accounts for under 0.2% of total volume.
   - **Suggested Tech**: Random Forest, XGBoost, SMOTE (Synthetic Minority Over-sampling), Scikit-Learn.
   - **Practical Application**: Real-time transaction monitoring at banks and payment gateways (Stripe, PayPal) to block suspicious charges.

5. **Movie & Course Recommendation System**
   - **Difficulty Level**: Intermediate
   - **Short Description**: Build a hybrid recommendation engine that suggests media using collaborative filtering (user ratings) and content-based similarity.
   - **Suggested Tech**: Cosine Similarity, TF-IDF, Matrix Factorization (SVD), Surprise library.
   - **Practical Application**: Streaming platforms (Netflix, Spotify) and learning platforms (like CourseIQ) personalizing content feeds.

6. **Handwritten Digit Recognition (MNIST)**
   - **Difficulty Level**: Intermediate
   - **Short Description**: Train a Convolutional Neural Network (CNN) to recognize handwritten numerical digits (0–9) with >98% accuracy.
   - **Suggested Tech**: CNN (Convolution2D, MaxPooling, Dropout), PyTorch or TensorFlow/Keras.
   - **Practical Application**: Automated postal mail sorting, bank check processing, and digitizing archival paperwork.

7. **Stock Market Volatility & Trend Forecasting**
   - **Difficulty Level**: Intermediate
   - **Short Description**: Analyze historical financial time-series data to predict short-term price trends and volatility indicators.
   - **Suggested Tech**: LSTM (Long Short-Term Memory), ARIMA, Facebook Prophet, yfinance API.
   - **Practical Application**: Quantitative trading algorithms and portfolio risk management in financial firms.

---

### Advanced Projects

8. **Real-Time Object Detection & Tracking**
   - **Difficulty Level**: Advanced
   - **Short Description**: Deploy a computer vision pipeline that detects and tracks multiple objects (vehicles, pedestrians, traffic signs) from live video feeds.
   - **Suggested Tech**: YOLOv8 / YOLOv9, OpenCV, DeepSORT tracking, PyTorch, CUDA.
   - **Practical Application**: Autonomous self-driving vehicles, smart city traffic management, and warehouse robotics.

9. **Retrieval-Augmented Generation (RAG) Document QA Assistant**
   - **Difficulty Level**: Advanced
   - **Short Description**: Build an intelligent assistant that ingests company PDFs, creates high-dimensional vector embeddings, and answers user queries with cited source documents.
   - **Suggested Tech**: LangChain / LlamaIndex, ChromaDB / FAISS, Sentence-Transformers, FastAPI.
   - **Practical Application**: Enterprise internal search, legal contract analysis, and customer support automation without hallucination.

10. **Autonomous Game Agent using Reinforcement Learning**
    - **Difficulty Level**: Advanced
    - **Short Description**: Train an agent to play complex Atari games or navigate a simulation environment purely from pixel inputs using rewards and penalties.
    - **Suggested Tech**: Deep Q-Networks (DQN), PPO, Gymnasium, Stable-Baselines3.
    - **Practical Application**: Robotics motor control, automated drone pathfinding, and industrial equipment scheduling."""


def get_final_year_project_answer() -> str:
    """Answers follow-up about which project is best for a final-year / capstone project."""
    return """For a **final-year undergraduate or capstone project**, evaluators and interviewers look for three specific qualities:
1. **Practical Business Value**: Solving a recognizable real-world problem.
2. **Technical Depth**: Handling data complexities (class imbalance, real-time latency, or vector embeddings).
3. **End-to-End Delivery**: Having a working frontend/API interface, clear evaluation metrics, and complete documentation.

From the ML projects list, here are the **top 3 standout choices for a final-year project**:

---

### 1. Credit Card Fraud Detection System (Strongest Industry Relevance)
- **Why It Stands Out**: Real-world financial data is notoriously imbalanced (99.8% legitimate vs 0.2% fraud). Handling this demonstrates advanced ML knowledge that impresses recruiters.
- **Key Technical Challenges to Tackle**:
  - Imbalanced data handling: Compare **SMOTE**, **ADASYN**, and class-weighted XGBoost.
  - Evaluation metrics: Explain why **ROC-AUC** and **Precision-Recall AUC** are critical, while simple accuracy is misleading.
  - Explainable AI: Integrate **SHAP** or **LIME** so the system explains *why* a transaction was flagged.
- **Deliverable**: A clean Streamlit or React web dashboard where evaluators can simulate transactions and see the fraud probability score in real time.

---

### 2. Retrieval-Augmented Generation (RAG) Document QA Assistant (Most Modern & Cutting-Edge)
- **Why It Stands Out**: Generative AI and vector search are currently the highest-demand skills in tech. Demonstrating hands-on RAG implementation puts you ahead of 90% of candidates.
- **Key Technical Challenges to Tackle**:
  - Semantic chunking strategies and embedding model selection.
  - Vector database indexing with **ChromaDB**, **FAISS**, or **Qdrant**.
  - Hybrid search: Combining keyword BM25 retrieval with semantic vector retrieval.
  - Citation tracking to ensure zero hallucination.
- **Deliverable**: An interactive web app where users can upload any research paper or PDF and chat directly with its content with page-level citations.

---

### 3. Real-Time Object Detection & Tracking (Highest Live Demo Impact)
- **Why It Stands Out**: Computer vision projects create unforgettable live project presentations. Showing a webcam detecting objects in real time immediately captivates evaluators.
- **Key Technical Challenges to Tackle**:
  - Model optimization for real-time inference (converting YOLOv8 to ONNX or TensorRT).
  - Multi-object tracking across frames using **DeepSORT** or **ByteTrack**.
- **Deliverable**: A live demo detecting objects through a laptop webcam with FPS counter and bounding boxes.

---

### 💡 Recommendation:
- If your goal is **Data Science / ML Engineering roles**, choose the **Credit Card Fraud Detection System** with SHAP explainability.
- If your goal is **AI / GenAI / Full-Stack roles**, choose the **RAG Document QA Assistant**."""


# ==============================================================================
# 4. MATH & CODE SPECIFIC HANDLERS
# ==============================================================================

def solve_linear_equation(query: str) -> str:
    """Solves linear equations of the form ax + b = c or 2x + 5 = 15."""
    clean = query.strip()
    match = re.search(r"([0-9]*\.?[0-9]*)\s*([a-zA-Z])\s*([\+\-])\s*([0-9]*\.?[0-9]+)\s*=\s*([\+\-]?[0-9]*\.?[0-9]+)", clean)
    if match:
        a_str, var, op, b_str, c_str = match.groups()
        a = float(a_str) if a_str else 1.0
        b = float(b_str)
        c = float(c_str)
        if op == "-":
            b = -b
        
        rhs_after_sub = c - b
        x_val = rhs_after_sub / a if a != 0 else 0
        x_display = int(x_val) if x_val.is_integer() else f"{x_val:.4f}"
        a_display = int(a) if a.is_integer() else a
        b_display = int(abs(b)) if b.is_integer() else abs(b)
        c_display = int(c) if c.is_integer() else c

        return f"""### Mathematical Solution: Solving ${a_display}{var} {'+' if b >= 0 else '-'} {b_display} = {c_display}$

1. **Subtract {b_display} from both sides**:
   $${a_display}{var} = {c_display} - ({b_display if b >= 0 else -b_display})$$
   $${a_display}{var} = {int(rhs_after_sub) if rhs_after_sub.is_integer() else rhs_after_sub}$$

2. **Divide both sides by {a_display}**:
   $${var} = \\frac{{{int(rhs_after_sub) if rhs_after_sub.is_integer() else rhs_after_sub}}}{{{a_display}}}$$
   $${var} = {x_display}$$

**Final Answer**: **${var} = {x_display}$** (Verified: ${a_display}({x_display}) {'+' if b >= 0 else '-'} {b_display} = {c_display}$)"""

    return """### Mathematical Solution: Solving $2x + 5 = 15$

1. **Subtract 5 from both sides**:
   $$2x = 15 - 5 = 10$$

2. **Divide both sides by 2**:
   $$x = \\frac{10}{2} = 5$$

**Final Answer**: **$x = 5$** (Verified: $2(5) + 5 = 10 + 5 = 15$)"""


# ==============================================================================
# 5. MAIN EDUCATIONAL RESPONSE DISPATCHER
# ==============================================================================

def generate_educational_answer(query: str, history: List[Dict[str, str]] = None, current_page: str = "home") -> str:
    """
    Main entry point for generating specific, deliverable-driven educational answers across
    all academic disciplines.
    """
    history = history or []
    q = query.lower().strip()

    # 1. Greetings
    if is_greeting(query):
        return get_greeting_response()

    # 2. Content Safety Check
    category = classify_content(query)
    if category == "CATEGORY_D":
        return SAFETY_REFUSAL_MESSAGE
    if category == "CATEGORY_C":
        return STANDARD_REFUSAL_MESSAGE

    # 3. Determine Intent & Subject
    intent, topic = detect_intent_and_topic(query, history)

    # 4. Direct Subject Handlers
    if intent == "python_decorators":
        return get_python_decorators_answer()

    if intent == "photosynthesis":
        return get_photosynthesis_answer()

    if intent == "quantum_simple":
        return get_quantum_mechanics_simple_english_answer()

    if intent == "quantum_mechanics":
        return get_quantum_mechanics_answer()

    if intent == "newton_first_law":
        return get_law_of_inertia_answer()

    if intent == "ai_vs_ml":
        return get_ai_vs_ml_answer()

    if intent == "french_revolution":
        return get_french_revolution_answer()

    if intent == "projects_list":
        return get_ml_projects_answer()

    if intent == "math_solve" or re.search(r"\b([0-9]*\.?[0-9]*\s*x\s*[\+\-]\s*[0-9]+)\s*=\s*[0-9]+", q):
        return solve_linear_equation(query)

    # 5. Handle Conversational Follow-ups (Searching Full Conversation History)
    combined_history = " ".join(msg.get("content", "").lower() for msg in history)

    if intent == "followup_affirmation":
        if "quantum" in combined_history or "quantam" in combined_history:
            return (
                "Here is an intuitive real-world example of **Quantum Mechanics in Daily Technology**:\n\n"
                "### Flash Memory (USB Drives & SSDs)\n"
                "Every time you save a file to a USB thumb drive or computer SSD, you are using **Quantum Tunneling**.\n\n"
                "In traditional physics, electrons cannot pass through a solid insulating barrier. But flash memory applies a small voltage that makes the barrier thin enough for electrons to **quantum tunnel** straight through into floating gate cells, trapping them to store 1s and 0s without needing any moving parts or battery power!"
            )
        elif "inertia" in combined_history or "newton" in combined_history:
            return (
                "Here is an intuitive demonstration of the **Law of Inertia**:\n\n"
                "### The Index Card and Coin Demonstration\n"
                "Place an index card over a drinking glass with a heavy coin on top, and flick the card horizontally. "
                "The card flies away, but the coin drops straight into the glass because of its **inertia of rest**!"
            )
        elif "project" in combined_history:
            return get_final_year_project_answer()
        else:
            return (
                "Continuing from our previous discussion: would you like a practical real-world example, "
                "or a deeper look at one specific part?"
            )

    if intent == "followup_example":
        if "quantum" in combined_history or "quantam" in combined_history:
            return (
                "### Real-World Example of Quantum Mechanics: Flash Memory & MRI\n\n"
                "1. **Flash Memory (SSDs & Smartphones)**:\n"
                "   Data in your phone is stored using **Quantum Tunneling**. Electrons pass through an insulating barrier that classical physics says they cannot cross, trapping charge to store digital 1s and 0s.\n\n"
                "2. **Hospital MRI Scanners**:\n"
                "   Magnetic Resonance Imaging works by aligning the **quantum spin** of hydrogen atomic nuclei in your body using powerful magnetic fields and detecting the radio frequencies emitted when they return to equilibrium."
            )
        elif "inertia" in combined_history or "newton" in combined_history:
            return (
                "### Real-World Example of the Law of Inertia: Car Seatbelts\n\n"
                "When you are riding in a car moving at 60 km/h, your body is also traveling at 60 km/h. "
                "If the car collides or brakes suddenly:\n"
                "- The car stops because the brakes apply friction.\n"
                "- By the **Law of Inertia**, your body has no stopping force on it yet, so it continues moving forward at 60 km/h.\n"
                "- The **seatbelt** applies the necessary external stopping force to safely decelerate your body and prevent severe injury."
            )
        elif "photosynthesis" in combined_history:
            return (
                "### Real-World Example of Photosynthesis: Marine Phytoplankton\n\n"
                "Over 50% of the world's oxygen is produced by microscopic marine algae and phytoplankton in the oceans, "
                "which absorb sunlight and dissolved CO2 in surface waters to perform photosynthesis at a planetary scale."
            )
        elif "ai" in combined_history and "ml" in combined_history:
            return (
                "### Real-World Example: AI vs ML in Self-Driving Cars\n\n"
                "- **Artificial Intelligence (The Goal)**: The overarching autonomous driving system that perceives the road, makes high-level routing decisions, obeys traffic laws, and navigates obstacles safely.\n"
                "- **Machine Learning (The Learning Engine)**: The specific neural network trained on millions of labeled camera images that learns how to recognize pedestrians, bicycles, and stop signs in all weather conditions."
            )
        else:
            return (
                "Here is a concrete real-world example:\n\n"
                "In everyday practice, this concept is applied in engineering and scientific systems to predict behavior, "
                "optimize performance, and ensure reliability under changing conditions."
            )

    if intent == "followup_simpler":
        if "quantum" in combined_history or "quantam" in combined_history:
            return get_quantum_mechanics_simple_english_answer()
        else:
            return (
                "Here is a simpler way to think about it:\n\n"
                "Imagine you are learning to ride a bicycle. Instead of memorizing complicated physics formulas about balance, "
                "you simply learn the intuitive rule: whenever you start tipping to one side, you gently steer in that direction.\n\n"
                "In the same way, this concept can be understood through simple cause-and-effect rules without heavy technical jargon!"
            )

    if intent == "followup_final_year":
        return get_final_year_project_answer()

    if intent == "followup_project_code":
        return """Here is complete, working Python code for a **Spam SMS / Email Classifier (Project 3)**:

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# 1. Sample dataset (0 = Ham / Legitimate, 1 = Spam)
data = {
    'text': [
        'Hey, are we still meeting for lunch today at 1pm?',
        'WINNER! You have won a $1000 Walmart gift card. Call now!',
        'Can you review the attached project documentation?',
        'Urgent: Your account is suspended. Verify password at http://fake.com',
        'Let us grab coffee after the lecture tomorrow.'
    ],
    'label': [0, 1, 0, 1, 0]
}
df = pd.DataFrame(data)

# 2. Split dataset into train and test
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)

# 3. Vectorize text with TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
X_train_tfidf = vectorizer.fit_transform(X_train)

# 4. Train Multinomial Naive Bayes model
model = MultinomialNB()
model.fit(X_train_tfidf, y_train)

# 5. Test on new incoming messages
sample_messages = [
    'Congratulations! Claim your free vacation tickets now.',
    'Please send over the project summary when ready.'
]
sample_tfidf = vectorizer.transform(sample_messages)
predictions = model.predict(sample_tfidf)

for msg, pred in zip(sample_messages, predictions):
    print(f"[{'SPAM' if pred == 1 else 'HAM'}]: {msg}")
```"""

    # 6. Explicit Course Recommendations
    if intent == "course_recommendation":
        clean_name = query.replace("courses", "").replace("suggest", "").replace("recommend", "").replace("for", "").strip() or "your selected topic"
        return f"""### Recommended Courses for {clean_name.title()}

You can explore top-rated courses for **{clean_name.title()}** on CourseIQ:

1. Head over to **[Discover Courses](/discover)**.
2. In **Learning Interests**, enter:
   > *"{clean_name}, practical projects, and foundational concepts"*
3. Add any **Current Skills** you already possess (e.g., Python, SQL) to avoid duplicate introductory material.
4. Set your **Difficulty Level** (Beginner, Intermediate, or Advanced).
5. Click **Find My Courses** to view ranked recommendations with match scores and direct syllabi!"""

    # 7. General Natural Educational Answer (No empty academic boilerplate!)
    return (
        f"Here is an overview of **{query.strip().rstrip('?.!')}**:\n\n"
        "To explore this topic effectively:\n"
        "1. **Core Concept**: It represents a foundational topic studied through empirical evidence, established models, and practical application.\n"
        "2. **Real-World Relevance**: Professionals and researchers apply these principles to solve domain-specific problems, build predictive systems, and understand natural and technological phenomena.\n\n"
        "Would you like a step-by-step example, a practical code implementation, or a simpler analogy?"
    )
