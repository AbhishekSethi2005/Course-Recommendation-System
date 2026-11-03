import os
import json
from flask import Flask, render_template, request, jsonify, session, send_from_directory
from model import load_model, build_tfidf_model, compute_similarity_matrix, save_model, evaluate_model
from recommender import CourseRecommender, _parse_user_input
from preprocessing import load_and_preprocess

frontend_dist = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')
app = Flask(__name__, static_folder=None)
app.secret_key = 'course_recommender_secret_2024'

# ── CORS Middleware ────────────────────────────────────────────────────────────
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

# ── Global model objects (loaded once at startup) ──────────────────────────────
recommender = None


def initialize_model():
    """Load or build the recommendation model."""
    global recommender
    model_dir = 'model/'

    if os.path.exists(os.path.join(model_dir, 'vectorizer.pkl')):
        print("[CourseIQ] Loading existing model from disk...")
        vectorizer, tfidf_matrix, similarity_matrix, df = load_model(model_dir)
    else:
        print("[CourseIQ] Building model from scratch...")
        df = load_and_preprocess('data/coursera_courses.csv')
        vectorizer, tfidf_matrix = build_tfidf_model(df)
        similarity_matrix = compute_similarity_matrix(tfidf_matrix)
        save_model(vectorizer, tfidf_matrix, similarity_matrix, df, model_dir)

    recommender = CourseRecommender(vectorizer, tfidf_matrix, similarity_matrix, df)
    print(f"[CourseIQ] Recommender ready with {len(df)} courses.")


@app.before_request
def ensure_model_initialized():
    global recommender
    if recommender is None:
        initialize_model()


# ── Static Assets Route for React Frontend ─────────────────────────────────────
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    assets_dir = os.path.join(frontend_dist, 'assets')
    if os.path.exists(os.path.join(assets_dir, filename)):
        return send_from_directory(assets_dir, filename)
    return ('Asset not found', 404)


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    """Landing Page (serves premium React landing page when built, with fallback to template)."""
    index_html = os.path.join(frontend_dist, 'index.html')
    if os.path.exists(index_html):
        return send_from_directory(frontend_dist, 'index.html')
    
    all_skills       = recommender.get_all_skills()[:100]   # top 100 for autocomplete
    all_difficulties = recommender.get_all_difficulties()
    return render_template('index.html',
                           all_skills=all_skills,
                           all_difficulties=all_difficulties,
                           total_courses=len(recommender.df))


@app.route('/discover')
def discover_page():
    """Discover Courses route."""
    index_html = os.path.join(frontend_dist, 'index.html')
    if os.path.exists(index_html):
        return send_from_directory(frontend_dist, 'index.html')
    return classic_form()


@app.route('/categories')
def categories_page():
    """Categories route."""
    index_html = os.path.join(frontend_dist, 'index.html')
    if os.path.exists(index_html):
        return send_from_directory(frontend_dist, 'index.html')
    return classic_form()


@app.route('/library')
def library_page():
    """My Library route."""
    index_html = os.path.join(frontend_dist, 'index.html')
    if os.path.exists(index_html):
        return send_from_directory(frontend_dist, 'index.html')
    return classic_form()


# ── Library & Search History Endpoints ─────────────────────────────────────────
import threading
import tempfile

DATA_DIR = os.getenv('DATA_DIR', os.path.join(os.path.dirname(__file__), 'data'))
os.makedirs(DATA_DIR, exist_ok=True)

LIBRARY_FILE = os.path.join(DATA_DIR, 'user_library.json')
HISTORY_FILE = os.path.join(DATA_DIR, 'search_history.json')
_json_lock = threading.Lock()


def _read_json(filepath, default_val):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[CourseIQ Storage] Warning reading {filepath}: {e}")
            return default_val
    return default_val


def _write_json(filepath, data):
    with _json_lock:
        try:
            parent_dir = os.path.dirname(filepath)
            os.makedirs(parent_dir, exist_ok=True)
            # Atomic write to temporary file then replace to avoid partial/corrupted writes
            with tempfile.NamedTemporaryFile('w', dir=parent_dir, delete=False, encoding='utf-8') as tf:
                json.dump(data, tf, indent=2)
                temp_name = tf.name
            os.replace(temp_name, filepath)
        except Exception as e:
            print(f"[CourseIQ Storage] Error writing to {filepath}: {e}")


@app.route('/api/library', methods=['GET', 'POST'])
def api_library():
    if request.method == 'GET':
        library = _read_json(LIBRARY_FILE, [])
        return jsonify({'saved_courses': library, 'count': len(library)})

    course_data = request.get_json()
    if not course_data:
        return jsonify({'error': 'No course data'}), 400

    library = _read_json(LIBRARY_FILE, [])
    name = course_data.get('course_name', '').strip()
    if not any(c.get('course_name', '').lower() == name.lower() for c in library):
        library.insert(0, course_data)
        _write_json(LIBRARY_FILE, library)

    return jsonify({'status': 'success', 'saved_courses': library, 'count': len(library)})


@app.route('/api/library/<path:course_name>', methods=['DELETE'])
def api_remove_library(course_name):
    library = _read_json(LIBRARY_FILE, [])
    target_name = course_name.strip().lower()
    filtered = [
        c for c in library 
        if c.get('course_name', '').strip().lower() != target_name and str(c.get('id', '')) != target_name
    ]
    _write_json(LIBRARY_FILE, filtered)
    return jsonify({'status': 'success', 'saved_courses': filtered, 'count': len(filtered)})


@app.route('/api/history', methods=['GET', 'POST'])
def api_history():
    if request.method == 'GET':
        history = _read_json(HISTORY_FILE, [])
        return jsonify({'history': history, 'count': len(history)})

    search_entry = request.get_json()
    if not search_entry:
        return jsonify({'error': 'No search entry'}), 400

    history = _read_json(HISTORY_FILE, [])
    history.insert(0, search_entry)
    _write_json(HISTORY_FILE, history[:20])
    return jsonify({'status': 'success', 'history': history, 'count': len(history)})


@app.route('/api/history/<search_id>', methods=['DELETE'])
def api_delete_history(search_id):
    history = _read_json(HISTORY_FILE, [])
    filtered = [h for h in history if str(h.get('id', '')) != str(search_id)]
    _write_json(HISTORY_FILE, filtered)
    return jsonify({'status': 'success', 'history': filtered, 'count': len(filtered)})


@app.route('/classic')
def classic_form():
    """Classic Jinja discovery form."""
    all_skills       = recommender.get_all_skills()[:100]
    all_difficulties = recommender.get_all_difficulties()
    return render_template('index.html',
                           all_skills=all_skills,
                           all_difficulties=all_difficulties,
                           total_courses=len(recommender.df))


@app.route('/recommend', methods=['POST'])
def recommend():
    """Handle form submission and return recommendations."""
    interests         = request.form.get('interests', '').strip()
    skills_input      = request.form.get('skills', '').strip()
    completed_input   = request.form.get('completed_courses', '').strip()
    difficulty        = request.form.get('difficulty', 'any')
    top_n             = int(request.form.get('top_n', 10))

    # Parse comma-separated inputs
    user_skills       = _parse_user_input(skills_input)
    completed_courses = _parse_user_input(completed_input)

    if not interests and not user_skills:
        return render_template('index.html',
                               error="Please enter at least your interests or skills.",
                               all_skills=recommender.get_all_skills()[:100],
                               all_difficulties=recommender.get_all_difficulties(),
                               total_courses=len(recommender.df))

    results = recommender.recommend(
        interests=interests,
        user_skills=user_skills,
        completed_courses=completed_courses,
        difficulty=difficulty,
        top_n=top_n
    )

    return render_template('results.html',
                           results=results,
                           interests=interests,
                           user_skills=user_skills,
                           difficulty=difficulty,
                           total_found=len(results))


@app.route('/similar', methods=['GET'])
def similar():
    """Find courses similar to a given course."""
    course_name = request.args.get('course', '').strip()
    if not course_name:
        return jsonify({'error': 'No course name provided'}), 400

    similar_courses = recommender.similar_to_course(course_name, top_n=6)
    return jsonify({'similar_courses': similar_courses})


@app.route('/api/recommend', methods=['POST'])
def api_recommend():
    """JSON API endpoint for recommendations."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON body'}), 400

    results = recommender.recommend(
        interests=data.get('interests', ''),
        user_skills=data.get('skills', []),
        completed_courses=data.get('completed_courses', []),
        difficulty=data.get('difficulty', 'any'),
        top_n=data.get('top_n', 10)
    )
    return jsonify({'recommendations': results, 'count': len(results)})


# ── CourseIQ Assistant Chatbot Endpoints ──────────────────────────────────────
from openai_service import openai_service

@app.route('/api/chatbot/chat', methods=['POST'])
def api_chatbot_chat():
    """Main communication endpoint for CourseIQ Assistant."""
    try:
        data = request.get_json() or {}
        message = data.get('message', '').strip()
        conversation_id = data.get('conversationId')
        current_page = data.get('currentPage', 'home')

        if not message:
            return jsonify({'success': False, 'error': 'Message cannot be empty.'}), 400

        res = openai_service.chat(
            message=message,
            conversation_id=conversation_id,
            current_page=current_page
        )
        return jsonify(res)
    except Exception as e:
        print(f"[CourseIQ Assistant API Error] {e}")
        return jsonify({
            'success': False,
            'error': 'CourseIQ Assistant encountered a temporary processing issue. Please try asking again.'
        }), 500


@app.route('/api/chatbot/clear', methods=['POST'])
def api_chatbot_clear():
    """Clear conversation history for a given conversation ID."""
    try:
        data = request.get_json() or {}
        conversation_id = data.get('conversationId')
        if conversation_id:
            openai_service.clear_conversation(conversation_id)
        return jsonify({'success': True, 'status': 'cleared'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/chatbot/history/<conversation_id>', methods=['GET'])
def api_chatbot_history(conversation_id):
    """Retrieve message history for a conversation."""
    try:
        history = openai_service.get_history(conversation_id)
        return jsonify({'success': True, 'history': history})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/evaluate')
def evaluate():
    """Show evaluation metrics."""
    from model import evaluate_model
    metrics = evaluate_model(recommender.df, recommender.similarity_matrix, sample_size=50)
    return render_template('evaluate.html', metrics=metrics)


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/health')
def health_check():
    """Service health check endpoint for Docker and monitoring."""
    courses_count = len(recommender.df) if recommender and hasattr(recommender, 'df') else 0
    return jsonify({
        'status': 'healthy',
        'service': 'courseiq-backend',
        'courses_loaded': courses_count
    }), 200


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    initialize_model()
    app.run(debug=True, host='0.0.0.0', port=5000)
