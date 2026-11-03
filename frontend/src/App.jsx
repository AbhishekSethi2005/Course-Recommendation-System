import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AIDiscoveryPreview from './components/AIDiscoveryPreview';
import HowItWorks from './components/HowItWorks';
import AICapabilities from './components/AICapabilities';
import ExploreCategories from './components/ExploreCategories';
import SampleRecommendations from './components/SampleRecommendations';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import DiscoverPage from './components/DiscoverPage';
import CategoriesPage from './components/CategoriesPage';
import MyLibraryPage from './components/MyLibraryPage';
import AuthModal from './components/AuthModal';
import { ChatbotProvider } from './context/ChatbotContext';
import ChatbotLauncher from './components/chatbot/ChatbotLauncher';
import ChatWindow from './components/chatbot/ChatWindow';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [prefillData, setPrefillData] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleNavigateDiscover = (customPrefill = null) => {
    if (customPrefill) {
      setPrefillData(customPrefill);
    }
    setActivePage('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReopenPreviousSearch = (searchEntry) => {
    setPrefillData({
      interests: searchEntry.interests || searchEntry.title,
      skills: searchEntry.skills || [],
      completed_courses: searchEntry.completed_courses || [],
      difficulty: searchEntry.difficulty || 'any',
      top_n: searchEntry.top_n || searchEntry.recommendationsCount || 10
    });
    setActivePage('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category) => {
    setPrefillData({
      interests: category.query,
      skills: category.skills,
      difficulty: 'any',
      top_n: 10
    });
    setActivePage('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const scrollToHowItWorks = () => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('how-it-works-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pageContextMap = {
    home: 'home',
    discover: 'discover-courses',
    categories: 'categories',
    library: 'my-library'
  };
  const currentPageContext = pageContextMap[activePage] || activePage;

  return (
    <ChatbotProvider currentPage={currentPageContext}>
      <div className="min-h-screen bg-[#09090F] text-[#F5F3FF] flex flex-col selection:bg-[#8055FF]/30 selection:text-white relative">
        {/* Sticky Navigation Bar */}
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenAuth={handleOpenAuth} 
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {activePage === 'home' && (
            <>
              {/* 1. Hero Section (Split Screen with Floating Product Preview) */}
              <Hero 
                onNavigateDiscover={handleNavigateDiscover} 
                onScrollHowItWorks={scrollToHowItWorks} 
              />

              {/* 2. AI Discovery Preview Section */}
              <AIDiscoveryPreview 
                onNavigateDiscover={handleNavigateDiscover} 
              />

              {/* 3. How It Works Section */}
              <HowItWorks />

              {/* 4. AI Capabilities Section */}
              <AICapabilities />

              {/* 5. Explore Categories Section */}
              <ExploreCategories 
                onSelectCategory={handleSelectCategory}
                onNavigateAllCategories={() => {
                  setActivePage('categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* 6. Sample Recommendations Section */}
              <SampleRecommendations 
                onNavigateDiscover={handleNavigateDiscover} 
              />

              {/* 7. Final Call-To-Action Section */}
              <FinalCTA 
                onNavigateDiscover={handleNavigateDiscover} 
              />
            </>
          )}

          {activePage === 'discover' && (
            <DiscoverPage 
              prefillData={prefillData} 
              onClearPrefill={() => setPrefillData(null)} 
            />
          )}

          {activePage === 'categories' && (
            <CategoriesPage 
              onSelectCategory={handleSelectCategory} 
            />
          )}

          {activePage === 'library' && (
            <MyLibraryPage 
              onNavigateDiscover={handleNavigateDiscover}
              onReopenPreviousSearch={handleReopenPreviousSearch}
              onPrefillSearchAgain={handleReopenPreviousSearch}
            />
          )}
        </main>

        {/* Footer */}
        <Footer setActivePage={setActivePage} />

        {/* Authentication Modal */}
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialMode={authMode} 
        />

        {/* Floating AI Learning Assistant Chatbot */}
        <ChatbotLauncher />
        <ChatWindow />
      </div>
    </ChatbotProvider>
  );
}

