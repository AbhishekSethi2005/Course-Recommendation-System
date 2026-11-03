import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, History, X, Check, ArrowRight, SlidersHorizontal } from 'lucide-react';
import LibraryHeader from './library/LibraryHeader';
import LibraryStats from './library/LibraryStats';
import LibraryFilters from './library/LibraryFilters';
import SavedCourseCard from './library/SavedCourseCard';
import DiscoveryHistorySection from './library/DiscoveryHistorySection';
import CourseDetailsModal from './library/CourseDetailsModal';
import DeleteConfirmationModal from './library/DeleteConfirmationModal';
import LibraryEmptyState from './library/LibraryEmptyState';
import { useAudio } from '../audio/AudioContext';

export default function MyLibraryPage({ 
  onNavigateDiscover,
  onReopenPreviousSearch,
  onPrefillSearchAgain
}) {
  const { playHover, playClick, playBookmarkRemove } = useAudio();
  const [savedCourses, setSavedCourses] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State for Saved Courses
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'match', 'rating', 'name'

  // Modals & Confirmation State
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'course' or 'history'
    item: null,
    title: '',
    message: ''
  });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch initial saved courses & search history from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [libRes, histRes] = await Promise.all([
          fetch('/api/library'),
          fetch('/api/history')
        ]);

        if (libRes.ok) {
          const libData = await libRes.json();
          if (libData.saved_courses) {
            setSavedCourses(libData.saved_courses);
          }
        }

        if (histRes.ok) {
          const histData = await histRes.json();
          if (histData.history) {
            setSearchHistory(histData.history);
          }
        }
      } catch (err) {
        console.warn("Could not reach backend library endpoint, falling back to local storage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Unique Providers Count
  const uniqueProvidersCount = useMemo(() => {
    const s = new Set();
    savedCourses.forEach(c => {
      if (c.organization) s.add(c.organization);
    });
    return s.size;
  }, [savedCourses]);

  // Remove Course Action
  const handleConfirmRemoveCourse = async () => {
    const course = confirmModal.item;
    if (!course) return;

    playBookmarkRemove();
    // Optimistically update state
    const nextSaved = savedCourses.filter(c => c.course_name !== course.course_name && c.id !== course.id);
    setSavedCourses(nextSaved);
    setConfirmModal({ isOpen: false, type: null, item: null, title: '', message: '' });
    showToast(`Removed "${course.course_name}" from your saved collection.`);

    try {
      await fetch(`/api/library/${encodeURIComponent(course.course_name)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Could not sync deletion with backend:", err);
    }
  };

  // Delete History Action
  const handleConfirmDeleteHistory = async () => {
    const entry = confirmModal.item;
    if (!entry) return;

    const nextHistory = searchHistory.filter(h => h.id !== entry.id);
    setSearchHistory(nextHistory);
    setConfirmModal({ isOpen: false, type: null, item: null, title: '', message: '' });
    showToast(`Deleted "${entry.title}" from search history.`);

    try {
      await fetch(`/api/history/${entry.id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Could not sync history deletion with backend:", err);
    }
  };

  // Filtered & Sorted Saved Courses
  const filteredSavedCourses = useMemo(() => {
    return savedCourses.filter(course => {
      // 1. Text Search
      if (courseSearchQuery.trim()) {
        const q = courseSearchQuery.toLowerCase();
        const matchesName = course.course_name.toLowerCase().includes(q);
        const matchesOrg = (course.organization || '').toLowerCase().includes(q);
        const matchesDesc = (course.description || '').toLowerCase().includes(q);
        const matchesSkills = (course.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesOrg && !matchesDesc && !matchesSkills) return false;
      }

      // 2. Difficulty
      if (selectedDifficulty.length > 0) {
        const diff = (course.course_difficulty || '').toLowerCase();
        if (!selectedDifficulty.includes(diff)) return false;
      }

      // 3. Providers
      if (selectedProviders.length > 0) {
        const prov = course.organization || '';
        if (!selectedProviders.includes(prov)) return false;
      }

      // 4. Rating
      if (selectedRating > 0) {
        if ((course.course_rating || 0) < selectedRating) return false;
      }

      // 5. Certificate
      if (selectedCertificate.length > 0) {
        if (selectedCertificate.includes('available') && course.certificate === false) return false;
        if (selectedCertificate.includes('none') && course.certificate !== false) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') return (b.matchPercentage || 90) - (a.matchPercentage || 90);
      if (sortBy === 'rating') return (b.course_rating || 0) - (a.course_rating || 0);
      if (sortBy === 'name') return a.course_name.localeCompare(b.course_name);
      // default: recently saved
      return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
    });
  }, [savedCourses, courseSearchQuery, selectedDifficulty, selectedProviders, selectedRating, selectedCertificate, sortBy]);

  // Active filters list for chips bar
  const hasActiveFilters = selectedDifficulty.length > 0 || selectedProviders.length > 0 || selectedRating > 0 || selectedCertificate.length > 0;

  const clearAllFilters = () => {
    setSelectedDifficulty([]);
    setSelectedProviders([]);
    setSelectedRating(0);
    setSelectedCertificate([]);
    setCourseSearchQuery('');
  };

  return (
    <div className="py-8 sm:py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Page Header ── */}
        <LibraryHeader onNavigateDiscover={onNavigateDiscover} />

        {/* ── 2. Overview Statistics (3 Compact Cards) ── */}
        <LibraryStats
          savedCount={savedCourses.length}
          searchHistoryCount={searchHistory.length}
          providersCount={uniqueProvidersCount}
        />

        {/* ── 3. Three-Column Workspace Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column (3 cols): Filter Sidebar */}
          <div className="lg:col-span-3">
            <LibraryFilters
              savedCourses={savedCourses}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedCertificate={selectedCertificate}
              setSelectedCertificate={setSelectedCertificate}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* Center Column (6 cols): Your Saved Courses */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Saved Courses Header Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#8055FF] fill-[#8055FF]" />
                  <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                    Your Saved Courses
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-xs font-bold text-[#A78BFA]">
                    {savedCourses.length} Courses
                  </span>
                </div>
                <p className="text-xs text-[#9694A8] mt-0.5">
                  All the courses you've bookmarked, ready to explore again.
                </p>
              </div>
            </div>

            {/* Search Bar & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-[#68667A] absolute left-3" />
                <input
                  type="text"
                  value={courseSearchQuery}
                  onChange={(e) => setCourseSearchQuery(e.target.value)}
                  placeholder="Search your saved courses..."
                  className="w-full bg-[#101019] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-[#68667A] outline-none focus:border-[#8055FF]"
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[#9694A8]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#101019] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#8055FF]"
                >
                  <option value="recent">Recently Saved</option>
                  <option value="match">Best Match</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Course Name (A–Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Bar */}
            {hasActiveFilters && (
              <div className="p-3 rounded-xl bg-[#101019] border border-white/[0.06] flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[#68667A] font-medium">Active Filters:</span>

                {selectedDifficulty.map(d => (
                  <span key={d} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#C4B5FD] capitalize">
                    {d}
                    <button onClick={() => setSelectedDifficulty(selectedDifficulty.filter(item => item !== d))}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                ))}

                {selectedProviders.map(p => (
                  <span key={p} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#C4B5FD]">
                    {p}
                    <button onClick={() => setSelectedProviders(selectedProviders.filter(item => item !== p))}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                ))}

                {selectedRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#C4B5FD]">
                    {selectedRating}+ Stars
                    <button onClick={() => setSelectedRating(0)}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                )}

                {selectedCertificate.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#C4B5FD]">
                    {c === 'available' ? 'Certificate Available' : 'No Certificate'}
                    <button onClick={() => setSelectedCertificate(selectedCertificate.filter(item => item !== c))}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8055FF] hover:text-[#A78BFA] ml-auto font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Saved Course Cards Grid (2 columns) */}
            {savedCourses.length === 0 ? (
              <LibraryEmptyState 
                type="courses" 
                onNavigateDiscover={onNavigateDiscover} 
              />
            ) : filteredSavedCourses.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-[#15151F] border border-white/[0.08] space-y-3">
                <p className="text-sm font-bold text-white">No saved courses match your filter criteria</p>
                <p className="text-xs text-[#9694A8]">Try clearing search or filters to see all bookmarked courses.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#8055FF] text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSavedCourses.map((course) => (
                  <SavedCourseCard
                    key={course.course_name}
                    course={course}
                    onOpenDetails={(c) => setActiveCourseModal(c)}
                    onPromptRemove={(c) => setConfirmModal({
                      isOpen: true,
                      type: 'course',
                      item: c,
                      title: 'Remove from Library',
                      message: `Are you sure you want to remove "${c.course_name}" from your saved courses?`
                    })}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Right Column (3 cols): Previous Searches */}
          <div className="lg:col-span-3">
            {searchHistory.length === 0 ? (
              <LibraryEmptyState 
                type="history" 
                onNavigateDiscover={onNavigateDiscover} 
              />
            ) : (
              <DiscoveryHistorySection
                history={searchHistory}
                onReopenResults={(entry) => {
                  if (onReopenPreviousSearch) onReopenPreviousSearch(entry);
                }}
                onSearchAgain={(entry) => {
                  if (onPrefillSearchAgain) onPrefillSearchAgain(entry);
                }}
                onPromptDeleteHistory={(entry) => setConfirmModal({
                  isOpen: true,
                  type: 'history',
                  item: entry,
                  title: 'Delete Search Entry',
                  message: `Are you sure you want to remove the search "${entry.title}" from your discovery history?`
                })}
              />
            )}
          </div>

        </div>

      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={activeCourseModal}
        isOpen={!!activeCourseModal}
        onClose={() => setActiveCourseModal(null)}
        onPromptRemove={(c) => {
          setActiveCourseModal(null);
          setConfirmModal({
            isOpen: true,
            type: 'course',
            item: c,
            title: 'Remove from Library',
            message: `Are you sure you want to remove "${c.course_name}" from your saved courses?`
          });
        }}
      />

      {/* Delete / Remove Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.type === 'course' ? handleConfirmRemoveCourse : handleConfirmDeleteHistory}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, item: null, title: '', message: '' })}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#1B1B28] border border-[#8055FF]/40 shadow-2xl text-xs sm:text-sm font-medium text-white flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4 text-[#A78BFA] fill-[#A78BFA]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

