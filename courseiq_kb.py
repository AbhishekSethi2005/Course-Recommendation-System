"""
CourseIQ Centralized Knowledge Base & Intelligent Platform Q&A Engine.
Provides authoritative platform information (CourseIQ capabilities, discovery mechanics,
filtering, saving, and search history).
"""

COURSEIQ_KNOWLEDGE_BASE = {
    "platform_overview": {
        "name": "CourseIQ",
        "tagline": "AI-Powered Course Recommendation Platform",
        "summary": "CourseIQ is an AI-powered course discovery platform that matches learners with the most relevant online courses based on their specific learning interests, existing skills, completed courses, and preferred difficulty level.",
        "problem_solved": "Eliminates endless manual browsing through thousands of online courses by using natural-language understanding, content similarity, and skill matching to deliver transparent, ranked recommendations with rationale.",
        "key_pages": [
            {"name": "Home / Landing Page", "path": "/", "purpose": "Overview of platform capabilities, interactive floating preview, category exploration, and sample recommendations."},
            {"name": "Discover Courses", "path": "/discover", "purpose": "Primary workspace where users provide learning interests, current skills, completed courses, difficulty preference, and desired result count."},
            {"name": "Recommendation Results", "path": "/discover", "purpose": "Transparent ranked course matches with match score badges, 'Why this matches' rationale, multi-factor sidebar filters, and 1-click saving."},
            {"name": "My Library", "path": "/library", "purpose": "Personal collection of bookmarked courses and history of previous AI recommendation searches."}
        ]
    },
    "recommendation_engine": {
        "architecture": "Hybrid Content-Based Filtering & Natural Language Vectorization",
        "methods": [
            "TF-IDF (Term Frequency-Inverse Document Frequency) vectorization of course titles, descriptions, and syllabi.",
            "Cosine Similarity calculation between user input interests and course vectors.",
            "Jaccard Overlap scoring between user's current skills and required course skills.",
            "Difficulty calibration to prioritize courses matching the user's selected proficiency level.",
            "Student rating and review volume weighting to ensure high-quality recommendations."
        ],
        "match_score_explanation": "The match score (e.g. 96%) reflects the combined semantic alignment of your interests, skill coverage, difficulty fit, and course quality benchmarks."
    },
    "discover_courses_fields": {
        "interests": "Describe what you want to learn in natural language (e.g. 'I want to build full stack React apps and master backend microservices'). You can also click predefined interest tags.",
        "skills": "Add skills you already possess (e.g., Python, SQL, Git). This helps CourseIQ suggest courses with the right prerequisite coverage.",
        "completed_courses": "Optional list of courses you have already finished. CourseIQ automatically excludes these from recommendations so you never see repetitive content. If you are starting fresh, toggle 'None yet'.",
        "difficulty": "Choose between Any Level, Beginner (for newcomers), Intermediate (for those with some background), and Advanced (for deep technical depth).",
        "number_of_results": "Slider allowing you to choose between 5 and 20 recommendations (with quick presets for 5, 10, 15, and 20 courses)."
    },
    "library_and_history": {
        "saved_courses": "Courses bookmarked from the Recommendation Results view or sample cards. Saved courses persist across sessions in your library, where you can filter, sort, view details, or remove them.",
        "discovery_history": "Revisits your past recommendation searches with 1 click. You can re-examine past results or click 'Search Again' to reload preferences into the Discover workspace."
    }
}


def get_platform_answer(query: str, current_page: str = None) -> str:
    """Answers CourseIQ platform questions with accurate facts."""
    q = query.lower().strip()

    # Combined: What is CourseIQ and how does it recommend courses?
    if ("what is courseiq" in q or "tell me about courseiq" in q) and ("how" in q and ("recommend" in q or "work" in q)):
        return (
            "### CourseIQ Overview & Recommendation Methodology\n\n"
            "**CourseIQ** is an AI-powered course discovery platform designed to eliminate endless catalog browsing and match learners with courses that precisely fit their goals and skill levels.\n\n"
            "#### How CourseIQ Recommends Courses:\n"
            "1. **Natural Language Semantic Matching**: Uses **TF-IDF vectorization** and **Cosine Similarity** to compare your natural-language goals against full course descriptions and syllabi.\n"
            "2. **Skill Prerequisite Overlap**: Evaluates the skills you already possess against course requirements so you don't repeat familiar basics.\n"
            "3. **Exclusion of Completed Courses**: Automatically filters out courses you have already completed.\n"
            "4. **Difficulty Calibration**: Prioritizes courses that match your desired proficiency level (Beginner, Intermediate, or Advanced).\n"
            "5. **Transparent Match Score**: Generates a percentage score (e.g., 95% Match) and a concise *'Why this matches'* rationale for each recommendation.\n\n"
            "You can test it out on the **[Discover Courses](/discover)** page!"
        )

    # General CourseIQ overview
    if any(k in q for k in ["what is courseiq", "about courseiq", "what does courseiq do", "tell me about courseiq"]):
        return (
            "### What is CourseIQ?\n\n"
            "**CourseIQ** is an AI-powered course recommendation platform designed to help learners find online courses that genuinely match their goals.\n\n"
            "Instead of endlessly scrolling through catalog pages, CourseIQ analyzes:\n"
            "- **Your Learning Interests**: What you want to learn in natural language.\n"
            "- **Your Current Skills**: What you already know, ensuring suitable prerequisites.\n"
            "- **Completed Courses**: Excluded automatically so you only see fresh material.\n"
            "- **Difficulty Level**: Calibrated for Beginner, Intermediate, or Advanced.\n\n"
            "You can head over to **[Discover Courses](/discover)** to try it out!"
        )

    # Recommendation algorithm details
    if any(k in q for k in ["how does it recommend", "how does ai recommend", "recommendation work", "recommendation algorithm", "match score"]):
        return (
            "### How CourseIQ Recommends Courses\n\n"
            "CourseIQ uses a multi-factor recommendation pipeline:\n\n"
            "1. **Semantic Content Matching**: Uses **TF-IDF vectorization** and **Cosine Similarity** to compare your goals with course syllabi, titles, and descriptions.\n"
            "2. **Skill Overlap Analysis**: Measures the overlap between your current skills and target course curriculum.\n"
            "3. **Difficulty Calibration**: Filters and boosts courses matching your desired proficiency level.\n"
            "4. **Course Quality Weighting**: Factors in student ratings (e.g., 4.7★) and review volume.\n\n"
            "The resulting **Match Score** (e.g. 94% Match) reflects how closely a course aligns with your profile."
        )

    # Discovery workspace instructions
    if any(k in q for k in ["how to discover", "how do i discover", "find courses", "start search", "search courses"]):
        return (
            "### Discovering Courses on CourseIQ\n\n"
            "To get personalized course recommendations:\n\n"
            "1. Navigate to **[Discover Courses](/discover)**.\n"
            "2. **Learning Interests**: Type what you want to learn or click suggestion chips (e.g. *Machine Learning*, *Web Development*).\n"
            "3. **Current Skills**: Add skills you already have (e.g. *Python*, *SQL*) so courses aren't too basic.\n"
            "4. **Completed Courses (Optional)**: Add courses you've finished to exclude them, or check **'None yet'**.\n"
            "5. **Difficulty Level**: Choose *Any Level*, *Beginner*, *Intermediate*, or *Advanced*.\n"
            "6. **Number of Results**: Pick between 5 and 20 courses.\n"
            "7. Click **Find My Courses** to let the AI generate your ranked matches!"
        )

    # Sidebar Filters
    if any(k in q for k in ["filter", "filters", "how do filters work", "filtering"]):
        return (
            "### How Course Filters Work in CourseIQ\n\n"
            "Once recommendations are generated on the **Results** page, you can refine your matched courses using multi-factor sidebar filters:\n\n"
            "- **Difficulty Filter**: View courses by Beginner, Intermediate, Advanced, or Mixed levels.\n"
            "- **Provider / University Filter**: Filter courses by educational platform or offering university.\n"
            "- **Minimum Rating**: Set threshold ratings (e.g., 4.5★ and above).\n"
            "- **Duration / Pace**: Narrow down by estimated hours or study intensity.\n\n"
            "Filters update your recommendation results in real time without having to re-run your search."
        )

    # Saved courses and library
    if any(k in q for k in ["save course", "library", "bookmark", "saved courses", "my library"]):
        return (
            "### Managing Saved Courses & My Library\n\n"
            "- **Saving a Course**: On any recommendation card or sample card, click the **Bookmark** or **'Save to Library'** button.\n"
            "- **Viewing Saved Courses**: Click **[My Library](/library)** in the navigation bar to see all your saved courses.\n"
            "- **Managing**: Inside My Library, you can filter by difficulty, rating, or provider, inspect course details, and remove bookmarked courses with 1 click."
        )

    # Search history
    if any(k in q for k in ["history", "previous searches", "past search", "search history"]):
        return (
            "### Discovery Search History\n\n"
            "CourseIQ automatically logs your recommendation searches so you can revisit them anytime.\n\n"
            "- Go to **[My Library](/library)** and look at the **Previous Searches** panel on the right.\n"
            "- Click **View Results** (arrow icon) to inspect the previously generated recommendations.\n"
            "- You can also clear specific searches or delete past search entries whenever you want."
        )

    # Troubleshooting
    if any(k in q for k in ["troubleshoot", "not loading", "error", "no courses"]):
        return (
            "### Troubleshooting Recommendations\n\n"
            "If recommendations aren't appearing or seem limited:\n\n"
            "- **Verify Inputs**: Ensure you entered at least one learning interest or selected a topic chip in the Discover form.\n"
            "- **Broaden Filters**: If you are on the Results page, check if strict provider or rating filters are active.\n"
            "- **Completed Courses**: Make sure your completed courses list doesn't exclude all relevant courses in that topic.\n"
            "- **Reset & Retry**: Click **Clear All** on the Discover page to start with a clean slate."
        )

    # Platform boundaries (LMS / Certificates)
    if any(k in q for k in ["certificate", "lms", "learning roadmap", "accreditation", "degree"]):
        return (
            "### CourseIQ Scope & Platform Capabilities\n\n"
            "- **What CourseIQ Is**: An intelligent AI-driven discovery and recommendation platform that matches you to external accredited courses from top universities and platforms.\n"
            "- **What CourseIQ Is Not**: CourseIQ does not host its own LMS videos, grade assignments, or directly issue degree certificates. When you click a recommended course, you are directed to the host platform (such as Coursera) to enroll."
        )

    return None
