import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  Target, 
  Layers, 
  Award, 
  Building2, 
  Star, 
  ExternalLink, 
  Bookmark, 
  Heart, 
  Clock, 
  BarChart2, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Filter,
  X,
  Play
} from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function RecommendationResultsView({
  results,
  searchParams,
  onRefineSearch,
  onStartNewSearch
}) {
  const { playHover, playClick, playBookmarkAdd, playBookmarkRemove } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState([]);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState([]);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(0);
  const [selectedDurationFilter, setSelectedDurationFilter] = useState([]);
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedCourses, setSavedCourses] = useState({});

  const pageSize = 5;

  const toggleSave = async (courseName, e) => {
    if (e) e.stopPropagation();
    const isCurrentlySaved = !!savedCourses[courseName];
    if (!isCurrentlySaved) {
      playBookmarkAdd();
    } else {
      playBookmarkRemove();
    }
    setSavedCourses(prev => ({ ...prev, [courseName]: !isCurrentlySaved }));

    try {
      if (!isCurrentlySaved) {
        const courseObj = results.find(c => c.course_name === courseName);
        if (courseObj) {
          await fetch('/api/library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: 'saved-' + Date.now(),
              course_name: courseObj.course_name,
              organization: courseObj.organization || 'Coursera',
              course_difficulty: courseObj.course_difficulty || 'Intermediate',
              course_rating: courseObj.course_rating || 4.7,
              reviews: courseObj.reviews || '100K',
              duration: courseObj.duration || '20 hours',
              certificate: true,
              course_certificate_type: courseObj.course_certificate_type || 'Certificate',
              matchPercentage: Math.round((courseObj.final_score || 0.9) * 100),
              content_score: courseObj.content_score || 0.9,
              skills_score: courseObj.skills_score || 0.85,
              final_score: courseObj.final_score || 0.9,
              description: courseObj.description || '',
              whyMatches: courseObj.whyMatches || '',
              skills: courseObj.skills || [],
              course_url: courseObj.course_url || '#',
              savedAt: new Date().toISOString()
            })
          });
        }
      } else {
        await fetch(`/api/library/${encodeURIComponent(courseName)}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.warn("Could not sync bookmark with backend:", err);
    }
  };

  // Extract available providers dynamically
  const allProviders = useMemo(() => {
    const counts = {};
    results.forEach(r => {
      const p = r.organization || 'Coursera';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [results]);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    return results.filter(course => {
      // Text search inside recommendations
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = course.course_name.toLowerCase().includes(q);
        const matchesDesc = (course.description || '').toLowerCase().includes(q);
        const matchesOrg = (course.organization || '').toLowerCase().includes(q);
        const matchesSkills = (course.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesOrg && !matchesSkills) return false;
      }

      // Difficulty filter
      if (selectedDifficultyFilter.length > 0) {
        const diff = (course.course_difficulty || 'any').toLowerCase();
        if (!selectedDifficultyFilter.includes(diff)) return false;
      }

      // Provider filter
      if (selectedProviderFilter.length > 0) {
        const prov = course.organization || 'Coursera';
        if (!selectedProviderFilter.includes(prov)) return false;
      }

      // Rating filter
      if (selectedRatingFilter > 0) {
        if ((course.course_rating || 0) < selectedRatingFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.course_rating || 0) - (a.course_rating || 0);
      if (sortBy === 'content') return (b.content_score || 0) - (a.content_score || 0);
      return (b.final_score || 0) - (a.final_score || 0);
    });
  }, [results, searchQuery, selectedDifficultyFilter, selectedProviderFilter, selectedRatingFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / pageSize) || 1;
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Stats calculation
  const avgMatch = results.length > 0 
    ? (results.reduce((acc, c) => acc + ((c.final_score || 0.85) * 100), 0) / results.length).toFixed(1)
    : '92.4';
  
  const highlyRelevantCount = results.filter(c => ((c.final_score || 0.85) * 100) >= 88).length;
  const providersCount = allProviders.length || 4;

  const toggleDifficulty = (diff) => {
    if (selectedDifficultyFilter.includes(diff)) {
      setSelectedDifficultyFilter(selectedDifficultyFilter.filter(d => d !== diff));
    } else {
      setSelectedDifficultyFilter([...selectedDifficultyFilter, diff]);
    }
  };

  const toggleProvider = (prov) => {
    if (selectedProviderFilter.includes(prov)) {
      setSelectedProviderFilter(selectedProviderFilter.filter(p => p !== prov));
    } else {
      setSelectedProviderFilter([...selectedProviderFilter, prov]);
    }
  };

  const clearAllFilters = () => {
    setSelectedDifficultyFilter([]);
    setSelectedProviderFilter([]);
    setSelectedRatingFilter(0);
    setSelectedDurationFilter([]);
    setSearchQuery('');
  };

  return (
    <div className="py-8 sm:py-12 relative z-10 space-y-8">
      
      {/* ── 1. Page Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8055FF]/15 border border-[#8055FF]/30 text-xs sm:text-sm font-semibold tracking-wide text-[#A78BFA] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>AI-POWERED COURSE DISCOVERY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight">
          Your personalized <span className="text-gradient-purple-pink">course recommendations.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#9694A8] max-w-2xl mx-auto leading-relaxed">
          We analyzed your learning interests, existing skills and preferences to find courses that match what you're looking for.
        </p>
      </div>

      {/* ── 2. Your Search Summary Bar ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5F3FF]">
            <Target className="w-4 h-4 text-[#8055FF]" />
            <span>Your Search Summary</span>
          </div>

          {/* Item 1: Learning Interests */}
          <div className="text-xs">
            <span className="text-[#68667A] block text-[10px] uppercase font-semibold">Learning Interests</span>
            <span className="text-[#F5F3FF] font-medium line-clamp-1 max-w-[180px]">
              {searchParams.interests || 'Machine Learning, Python'}
            </span>
          </div>

          {/* Item 2: Difficulty Level */}
          <div className="text-xs">
            <span className="text-[#68667A] block text-[10px] uppercase font-semibold">Difficulty Level</span>
            <span className="text-[#A78BFA] font-medium capitalize">
              {searchParams.difficulty || 'Any Level'}
            </span>
          </div>

          {/* Item 3: Number of Courses */}
          <div className="text-xs">
            <span className="text-[#68667A] block text-[10px] uppercase font-semibold">Number of Courses</span>
            <span className="text-[#23D18B] font-bold">
              {results.length}
            </span>
          </div>

          {/* Item 4: Existing Skills */}
          {searchParams.skills && searchParams.skills.length > 0 && (
            <div className="text-xs hidden sm:block">
              <span className="text-[#68667A] block text-[10px] uppercase font-semibold">Existing Skills</span>
              <span className="text-[#F5F3FF] font-medium line-clamp-1 max-w-[200px]">
                {searchParams.skills.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Refine Search & Start New Search */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
          <button
            onClick={() => {
              playClick();
              onRefineSearch();
            }}
            onMouseEnter={playHover}
            className="px-4 py-2 rounded-xl bg-[#8055FF] hover:bg-[#8F66FF] text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-sm transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine Search</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onStartNewSearch();
            }}
            onMouseEnter={playHover}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#9694A8] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Search</span>
          </button>
        </div>
      </div>

      {/* ── 3. AI Recommendation Insights Card ── */}
      <div className="p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Insights */}
          <div className="lg:col-span-7 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] flex items-center justify-center flex-shrink-0 shadow-glow-sm p-0.5">
              <div className="w-full h-full bg-[#0E0E1A] rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-sm font-black text-white">AI</span>
                <Sparkles className="w-3 h-3 text-[#C084FC]" />
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                AI Recommendation Insights
              </h3>
              <p className="text-xs text-[#9694A8]">
                Here's what our AI discovered from your preferences.
              </p>

              <div className="p-3.5 rounded-xl bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs text-[#C4B5FD] leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#A78BFA] flex-shrink-0 mt-0.5" />
                <span>
                  Your interests align strongly with {searchParams.interests || 'modern computing'}. We found courses that cover these subjects with transparent ranking and skill overlap.
                </span>
              </div>
            </div>
          </div>

          {/* Right Insights Breakdown Table */}
          <div className="lg:col-span-5 bg-[#101019] p-4 rounded-xl border border-white/[0.05] space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
              <span className="text-[#9694A8] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#8055FF]" /> Strongest Topics
              </span>
              <span className="text-white font-medium text-right line-clamp-1 max-w-[200px]">
                {searchParams.interests?.slice(0, 30) || 'Machine Learning, Python'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
              <span className="text-[#9694A8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6366F1]" /> Common Skills
              </span>
              <span className="text-white font-medium text-right line-clamp-1 max-w-[200px]">
                {searchParams.skills?.length ? searchParams.skills.join(', ') : 'Python, SQL, Analytics'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
              <span className="text-[#9694A8] flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-[#23D18B]" /> Difficulty Spread
              </span>
              <span className="text-[#23D18B] font-medium text-right">
                60% Inter. • 30% Beg. • 10% Adv.
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#9694A8] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Top Providers
              </span>
              <span className="text-white font-medium text-right">
                Coursera, DeepLearning.AI, IBM, AWS
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Stat Badges Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Badge 1 */}
        <div onMouseEnter={playHover} className="p-4 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/30 transition-colors flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#8055FF]/15 border border-[#8055FF]/30 flex items-center justify-center text-[#A78BFA]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-heading text-white">{results.length}</div>
            <div className="text-[11px] text-[#9694A8]">Total Recommendations</div>
          </div>
        </div>

        {/* Badge 2 */}
        <div onMouseEnter={playHover} className="p-4 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#23D18B]/30 transition-colors flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#23D18B]/15 border border-[#23D18B]/30 flex items-center justify-center text-[#23D18B]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-heading text-white">{avgMatch}%</div>
            <div className="text-[11px] text-[#9694A8]">Average Match Score</div>
          </div>
        </div>

        {/* Badge 3 */}
        <div onMouseEnter={playHover} className="p-4 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#6366F1]/30 transition-colors flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center text-[#818CF8]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-heading text-white">{highlyRelevantCount}</div>
            <div className="text-[11px] text-[#9694A8]">Highly Relevant Courses</div>
          </div>
        </div>

        {/* Badge 4 */}
        <div onMouseEnter={playHover} className="p-4 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-amber-500/30 transition-colors flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-heading text-white">{providersCount}</div>
            <div className="text-[11px] text-[#9694A8]">Providers Found</div>
          </div>
        </div>
      </div>

      {/* ── 5. Main Content Area (Sidebar Filters + Results Cards) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-[#15151F] border border-white/[0.08] space-y-6 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Filter className="w-3.5 h-3.5 text-[#8055FF]" />
              <span>Filters</span>
            </div>

            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8055FF] hover:text-[#A78BFA] transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Difficulty Level Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-white block">Difficulty Level</span>
            {['beginner', 'intermediate', 'advanced'].map((lvl) => {
              const isChecked = selectedDifficultyFilter.includes(lvl);
              const count = results.filter(r => (r.course_difficulty || '').toLowerCase() === lvl).length;
              return (
                <label key={lvl} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDifficulty(lvl)}
                      className="w-3.5 h-3.5 rounded bg-[#101019] border border-white/20 accent-[#8055FF]"
                    />
                    <span className="capitalize">{lvl}</span>
                  </div>
                  <span className="text-[11px] text-[#68667A]">({count})</span>
                </label>
              );
            })}
          </div>

          {/* Course Provider Filter */}
          <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
            <span className="text-xs font-bold text-white block">Course Provider</span>
            {allProviders.slice(0, 5).map(({ name, count }) => {
              const isChecked = selectedProviderFilter.includes(name);
              return (
                <label key={name} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleProvider(name)}
                      className="w-3.5 h-3.5 rounded bg-[#101019] border border-white/20 accent-[#8055FF]"
                    />
                    <span className="line-clamp-1">{name}</span>
                  </div>
                  <span className="text-[11px] text-[#68667A]">({count})</span>
                </label>
              );
            })}
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <span className="text-xs font-bold text-white block">Rating</span>
            {[
              { val: 0, label: "Any Rating" },
              { val: 4.5, label: "4.5 & above" },
              { val: 4.0, label: "4.0 & above" },
              { val: 3.5, label: "3.5 & above" }
            ].map((r) => (
              <label key={r.val} className="flex items-center gap-2 text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
                <input
                  type="radio"
                  name="ratingFilter"
                  checked={selectedRatingFilter === r.val}
                  onChange={() => setSelectedRatingFilter(r.val)}
                  className="w-3.5 h-3.5 accent-[#8055FF]"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>

          {/* Course Duration Filter */}
          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <span className="text-xs font-bold text-white block">Course Duration</span>
            {['< 5 hours', '5 – 20 hours', '20 – 50 hours', '> 50 hours'].map((dur, idx) => (
              <label key={dur} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded bg-[#101019] border border-white/20 accent-[#8055FF]"
                  />
                  <span>{dur}</span>
                </div>
                <span className="text-[11px] text-[#68667A]">({(idx * 2) + 1})</span>
              </label>
            ))}
          </div>

        </div>

        {/* Right Main Results Column */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Search bar inside recommendations + Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#15151F] border border-white/[0.08]">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-[#68667A] absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recommended courses..."
                className="w-full bg-[#101019] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-[#68667A] outline-none focus:border-[#8055FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9694A8] flex-shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#101019] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#8055FF]"
              >
                <option value="match">Best Match</option>
                <option value="rating">Highest Rated</option>
                <option value="content">Content Relevance</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {paginatedCourses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#15151F] border border-white/[0.08] space-y-3">
              <p className="text-base font-bold text-white">No courses match your filter criteria</p>
              <p className="text-xs text-[#9694A8]">Try clearing filters or search query to see recommendations.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#8055FF] text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            paginatedCourses.map((course, idx) => {
              const matchPct = Math.round((course.final_score || 0.88) * 100);
              const isSaved = !!savedCourses[course.course_name];
              const whyText = course.whyMatches || `Recommended because of your interest in ${searchParams.interests || 'this domain'} and aligns with your ${course.course_difficulty} profile.`;

              return (
                <motion.div
                  key={course.course_name + idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  onMouseEnter={playHover}
                  className="p-5 sm:p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/40 shadow-card transition-all flex flex-col md:flex-row gap-5 items-start justify-between"
                >
                  {/* Left: Thumbnail Preview Graphic */}
                  <div className="w-full md:w-44 h-32 rounded-xl bg-gradient-to-br from-indigo-950 via-[#1E1B4B] to-purple-950 p-3 flex flex-col justify-between flex-shrink-0 relative border border-white/10 group cursor-pointer overflow-hidden">
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-white">
                        <Play className="w-3 h-3 text-[#A78BFA] fill-[#A78BFA]" />
                      </span>
                      <span className="text-[10px] text-white/70 font-medium">Preview</span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-2">
                      {course.course_name}
                    </div>

                    {/* Ambient subtle glow */}
                    <div className="absolute inset-0 bg-[#8055FF]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 space-y-2.5">
                    {/* Meta info row */}
                    <div className="flex items-center gap-3 text-xs text-[#9694A8] flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        {course.organization || 'Coursera'}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{course.course_rating || '4.8'}</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration || '~ 20 hours'}
                      </span>
                      <span>•</span>
                      <span className="capitalize px-2 py-0.5 rounded bg-white/[0.05] text-[#C4B5FD] text-[11px] font-medium">
                        {course.course_difficulty}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                      {course.course_name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#9694A8] leading-relaxed line-clamp-2">
                      {course.description || "Learn fundamental and advanced concepts with practical exercises and hands-on projects designed by leading institutions."}
                    </p>

                    {/* Skills tags */}
                    {course.skills && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.skills.slice(0, 4).map((sk, i) => (
                          <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#101019] text-[#9694A8] border border-white/[0.06]">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* "Why this matches" Callout Box */}
                    <div className="p-3 rounded-xl bg-[#8055FF]/10 border border-[#8055FF]/20 text-xs text-[#C4B5FD] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#A78BFA] flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Why this matches:</strong> {whyText}
                      </span>
                    </div>
                  </div>

                  {/* Right: Match Score & Action Buttons */}
                  <div className="w-full md:w-36 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#23D18B]/15 border border-[#23D18B]/30 text-xs font-bold text-[#23D18B]">
                        {matchPct}% Match
                      </span>

                      <button
                        onClick={(e) => toggleSave(course.course_name, e)}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:text-white transition-colors"
                        title={isSaved ? "Saved" : "Save course"}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-[#9694A8]'}`} />
                      </button>
                    </div>

                    <a
                      href={course.course_url && course.course_url !== '#' ? course.course_url : `https://www.coursera.org/search?query=${encodeURIComponent(course.course_name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      onMouseEnter={playHover}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8F66FF] hover:to-[#7073FA] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-glow-sm transition-all"
                    >
                      <span>View Course</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={(e) => toggleSave(course.course_name, e)}
                      className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#9694A8] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? "Saved" : "Save to Library"}</span>
                    </button>
                  </div>

                </motion.div>
              );
            })
          )}

          {/* Pagination */}
          {filteredCourses.length > pageSize && (
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9694A8]">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, filteredCourses.length)} of {filteredCourses.length} courses
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-lg bg-[#15151F] border border-white/10 disabled:opacity-40 hover:text-white"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === i + 1
                        ? 'bg-[#8055FF] text-white shadow-glow-sm'
                        : 'bg-[#15151F] border border-white/10 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 rounded-lg bg-[#15151F] border border-white/10 disabled:opacity-40 hover:text-white"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

