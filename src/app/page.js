'use client';

/* ═══════════════════════════════════════════════════════════════
   PAGE.JS — TSEC Assignment Hub (Premium SaaS Edition)
   ═══════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Folder, FileText, Star, Bookmark, Download, Plus, 
  Check, X, Menu, Sun, Moon, Calendar as CalendarIcon, 
  Bot, Users, Award, Bell, ArrowLeft, Clock, FileCode, CheckCircle, 
  ChevronRight, MessageSquare, AlertCircle, Eye, ShieldAlert,
  ChevronDown, ZoomIn, ZoomOut, Maximize2, Share2, Sparkles, Trophy,
  ThumbsUp, ExternalLink, HelpCircle, CheckSquare, Settings, Lock,
  Flame, GraduationCap, CreditCard, User, ListChecks
} from 'lucide-react';
import { dbMock } from '../lib/supabase';

// Pure external helper functions to satisfy ESLint render purity
const generateId = () => Date.now();

const pushNotificationHelper = (setNotifications, title, desc) => {
  const newNotif = {
    id: Date.now(),
    title,
    desc,
    time: 'Just now',
    read: false
  };
  setNotifications(prev => [newNotif, ...prev]);
};

const triggerConfettiHelper = (setParticles) => {
  const newParticles = [];
  for (let i = 0; i < 30; i++) {
    newParticles.push({
      id: Math.random(),
      left: Math.random() * 100 + '%',
      top: Math.random() * 20 + 80 + '%',
      color: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5 + 's',
      duration: Math.random() * 1.5 + 1 + 's',
      size: Math.random() * 8 + 4 + 'px'
    });
  }
  setParticles(newParticles);
  setTimeout(() => setParticles([]), 2500);
};

export default function Home() {
  // App General Database State
  const [db, setDb] = useState([]);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [userUploads, setUserUploads] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Assignment Order Flow State
  const [activeAccordion, setActiveAccordion] = useState('assignment'); // assignment, manual, pricing
  const [assignmentSubject, setAssignmentSubject] = useState('');
  const [assignmentDeadline, setAssignmentDeadline] = useState('');
  const [assignmentPages, setAssignmentPages] = useState(1);
  const [assignmentFiles, setAssignmentFiles] = useState([]);
  
  const [manualSubject, setManualSubject] = useState('');
  const [manualDeadline, setManualDeadline] = useState('');
  const [manualPages, setManualPages] = useState(1);
  const [manualFiles, setManualFiles] = useState([]);

  const [cartOrder, setCartOrder] = useState(null);
  const [loyaltyCoins, setLoyaltyCoins] = useState(72);
  const [paymentStep, setPaymentStep] = useState(1); // 1 = form / cart, 2 = card payment, 3 = success
  const [paymentCard, setPaymentCard] = useState('');
  const [paymentExpiry, setPaymentExpiry] = useState('');
  const [paymentCvv, setPaymentCvv] = useState('');
  const [paymentName, setPaymentName] = useState('Anjali Mishra');
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [hasSeenRewardModal, setHasSeenRewardModal] = useState(false);
  const [deadlinesExpanded, setDeadlinesExpanded] = useState(true);

  const [dashboardDeadlines, setDashboardDeadlines] = useState([]);

  const [dashboardActiveOrders, setDashboardActiveOrders] = useState([]);

  // Live countdown update ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for reward popup trigger at 100 coins
  useEffect(() => {
    if (loyaltyCoins >= 100 && !hasSeenRewardModal) {
      const t = setTimeout(() => {
        setRewardModalOpen(true);
        setHasSeenRewardModal(true);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [loyaltyCoins, hasSeenRewardModal]);

  // Navigation & View Routing
  const [activeTab, setActiveTab] = useState('home'); // home, search, browse, upload, pricing, about, dashboard, admin, calendar, leaderboard, ai
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // DEFAULT THEME: 'light' (matches previous website white background pill nav layout)
  const [theme, setTheme] = useState('light'); 
  const [scrolled, setScrolled] = useState(false);

  // User Session State
  const [user, setUser] = useState(null);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [contributionPoints, setContributionPoints] = useState(120);

  // Search View Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSem, setSearchSem] = useState('all');
  const [searchDept, setSearchDept] = useState('all');
  const [searchType, setSearchType] = useState('all');
  const [searchSort, setSearchSort] = useState('newest');
  const [activeSubmissionsTab, setActiveSubmissionsTab] = useState('all');

  // Reward Hub States
  const [rewardCoins, setRewardCoins] = useState(0);
  const [rewardLevel, setRewardLevel] = useState(1);
  const [rewardStreak, setRewardStreak] = useState(0);
  const [rewardsRedeemedCount, setRewardsRedeemedCount] = useState(0);
  const [rewardProgress, setRewardProgress] = useState(0);
  const [missionLogin, setMissionLogin] = useState(false);
  const [missionAssignment, setMissionAssignment] = useState(false);
  const [missionDeadline, setMissionDeadline] = useState(false);
  const [missionRate, setMissionRate] = useState(false);
  const [coinHistory, setCoinHistory] = useState([]);
  const [particles, setParticles] = useState([]);

  const triggerConfetti = () => {
    triggerConfettiHelper(setParticles);
  };

  const addCoins = (amount, sourceName) => {
    setRewardCoins(prev => {
      const newCoins = prev + amount;
      const prevRewards = Math.floor(prev / 500);
      const newRewards = Math.floor(newCoins / 500);
      if (newRewards > prevRewards) {
        pushNotification("Reward Card Earned! 🎁", `You reached ${newRewards * 500} coins and unlocked a new Reward Card!`);
        setTimeout(() => triggerConfetti(), 100);
      }
      return newCoins;
    });
    setCoinHistory(prev => [
      { id: generateId(), type: 'earn', title: sourceName, amount: amount, time: 'Today' },
      ...prev
    ]);
  };

  // Directory Browser State
  const [browsePath, setBrowsePath] = useState([]);

  // Detail Modal State
  const [activeDetail, setActiveDetail] = useState(null);
  const [detailModalTab, setDetailModalTab] = useState('preview');
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewTags, setReviewTags] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [pdfZoom, setPdfZoom] = useState(100);

  // Deadlines State
  const [deadlineTitle, setDeadlineTitle] = useState('');
  const [deadlineSub, setDeadlineSub] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [currentCalDate] = useState(new Date('2026-06-26')); // Simulation base date
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // AI Copilot Hub State
  const [aiActiveTab, setAiActiveTab] = useState('search');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState([]);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSummarySelect, setAiSummarySelect] = useState('');
  const [aiSummaryOutput, setAiSummaryOutput] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: 'bot', text: 'Hello! I am your TSEC AI Doubt Solver. Paste an assignment question or ask standard queries.' }
  ]);
  const [draftSubject, setDraftSubject] = useState('Java Programming');
  const [draftTopic, setDraftTopic] = useState('Multi-Threading Lifecycle');
  const [draftFormat, setDraftFormat] = useState('Prof. Mehta Code Index');
  const [draftOutput, setDraftOutput] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [notesTopic, setNotesTopic] = useState('Types of CPU Scheduling in OS');
  const [notesCards, setNotesCards] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // Pricing Interval Toggle
  const [pricingPeriod, setPricingPeriod] = useState('monthly');

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'DBMS Lab Approved', desc: "Your upload 'DBMS Lab Manual' is approved by admin.", time: '10 mins ago', read: false },
    { id: 2, title: 'New Java Assignment', desc: 'Prof. R. Mehta uploaded Assignment 6.', time: '2 hours ago', read: false },
    { id: 3, title: 'Deadline Reminder', desc: 'DSA Assignment 5 is due tomorrow!', time: '1 day ago', read: true }
  ]);

  const [dbLoading, setDbLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const chatEndRef = useRef(null);

  // 1. Initial Load & Persistence
  useEffect(() => {
    async function loadData() {
      try {
        if (typeof window !== "undefined" && !localStorage.getItem('tsec_cleaned_v3')) {
          localStorage.removeItem('tsec_contributors');
          localStorage.removeItem('tsec_user');
          localStorage.removeItem('tsec_resources');
          localStorage.removeItem('tsec_pending');
          localStorage.setItem('tsec_cleaned_v3', 'true');
          window.location.reload();
          return;
        }

        const resources = await dbMock.getResources();
        const pending = await dbMock.getPending();
        const dates = await dbMock.getDeadlines();
        const rankers = await dbMock.getContributors();

        setDb(resources);
        setPendingUploads(pending);
        setDeadlines(dates);
        setContributors(rankers);

        if (typeof window !== 'undefined') {
          const localBook = localStorage.getItem('tsec_bookmarks');
          const localDown = localStorage.getItem('tsec_downloads');
          const localUser = localStorage.getItem('tsec_user');
          const localTheme = localStorage.getItem('tsec_theme') || 'light'; 

          if (localBook) setBookmarks(JSON.parse(localBook));
          if (localDown) setDownloads(JSON.parse(localDown));

          const localOrders = localStorage.getItem('tsec_active_orders');
          const localDeadlines = localStorage.getItem('tsec_deadlines');
          if (localOrders) setDashboardActiveOrders(JSON.parse(localOrders));
          if (localDeadlines) setDashboardDeadlines(JSON.parse(localDeadlines));

          if (localUser) {
            const parsed = JSON.parse(localUser);
            if (parsed.name.toLowerCase() === 'anjali mishra' && (parsed.orders !== 0 || parsed.coins !== 0 || parsed.rank !== 0 || parsed.completed !== 0)) {
              parsed.coins = 0;
              parsed.level = 1;
              parsed.orders = 0;
              parsed.streak = 0;
              parsed.rank = 0;
              parsed.completed = 0;
              parsed.delivered = 0;
              localStorage.setItem('tsec_user', JSON.stringify(parsed));
            }
            setUser(parsed);
          } else {
            const defaultUser = {
              name: 'Anjali Mishra',
              email: 'anjali@gmail.com',
              role: 'writer',
              coins: 0,
              level: 1,
              orders: 0,
              rating: 5.0,
              streak: 0,
              rank: 0,
              followers: 0,
              following: 0,
              completed: 0,
              delivered: 0,
              onTime: 100
            };
            setUser(defaultUser);
            localStorage.setItem('tsec_user', JSON.stringify(defaultUser));
          }
          
          setTheme(localTheme);
          if (localTheme === 'dark') {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
        }
      } catch (err) {
        console.error("Error loading seed data:", err);
      } finally {
        setDbLoading(false);
      }
    }
    loadData();

    // Scroll header scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages]);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('tsec_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    pushNotification("Theme Changed", `Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode.`);
  };

  // Push notification helper
  const pushNotification = (title, desc) => {
    pushNotificationHelper(setNotifications, title, desc);
  };

  // Auth Operations
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) return;
    const isWriter = loginEmail.includes('writer') || loginEmail === 'anjali@gmail.com';
    const name = loginEmail.split('@')[0];
    const role = isWriter ? 'writer' : 'client';
    const newUser = {
      name: isWriter ? 'Anjali Mishra' : (name.toLowerCase() === 'rahul' ? 'Rahul Sharma' : name.toUpperCase()),
      email: loginEmail,
      role: role,
      coins: isWriter ? 2450 : 120,
      level: isWriter ? 18 : 3,
      orders: isWriter ? 56 : 5,
      rating: isWriter ? 4.9 : 4.5,
      streak: isWriter ? 15 : 4,
      rank: isWriter ? 18 : 142,
      completed: isWriter ? 124 : 8,
      delivered: isWriter ? 98 : 0,
      onTime: isWriter ? 97 : 100
    };
    setUser(newUser);
    localStorage.setItem('tsec_user', JSON.stringify(newUser));
    setLoginEmail('');
    setLoginPass('');
    setLoginModalOpen(false);
    pushNotification("Login Successful", `Welcome back, ${newUser.name}!`);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;
    const isWriter = signupEmail.includes('writer') || signupEmail === 'anjali@gmail.com';
    const role = isWriter ? 'writer' : 'client';
    const newUser = {
      name: signupName.toUpperCase(),
      email: signupEmail,
      role: role,
      coins: role === 'writer' ? 2450 : 120,
      level: role === 'writer' ? 18 : 1,
      orders: role === 'writer' ? 56 : 0,
      rating: role === 'writer' ? 4.9 : 5.0,
      streak: role === 'writer' ? 15 : 1,
      rank: role === 'writer' ? 18 : 500,
      completed: role === 'writer' ? 124 : 0,
      delivered: role === 'writer' ? 98 : 0,
      onTime: role === 'writer' ? 97 : 100
    };
    setUser(newUser);
    localStorage.setItem('tsec_user', JSON.stringify(newUser));
    setSignupName('');
    setSignupEmail('');
    setSignupPass('');
    setSignupModalOpen(false);
    pushNotification("Sign Up Successful", `Welcome to TSEC Hub, ${signupName}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tsec_user');
    setActiveTab('home');
    pushNotification("Logged Out", "You have successfully signed out.");
  };

  // Bookmark Toggle
  const toggleBookmark = (id) => {
    let nextBook = [];
    if (bookmarks.includes(id)) {
      nextBook = bookmarks.filter(b => b !== id);
    } else {
      nextBook = [...bookmarks, id];
      pushNotification("Resource Bookmarked", "File saved in your student dashboard.");
    }
    setBookmarks(nextBook);
    localStorage.setItem('tsec_bookmarks', JSON.stringify(nextBook));
  };

  // Download Increment
  const handleDownload = (id) => {
    const item = db.find(r => r.id === id);
    if (!item) return;

    item.downloads++;
    const nextDown = downloads.includes(id) ? downloads : [...downloads, id];
    setDownloads(nextDown);
    localStorage.setItem('tsec_downloads', JSON.stringify(nextDown));

    setDb([...db]);
    dbMock.saveResources(db);
    pushNotification("Download Started", `'${item.title}' is downloading to your system.`);
  };

  // Doubts Q&A Posting
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText || !activeDetail) return;

    const newComment = {
      author: user ? user.name : "Anonymous Student",
      text: commentText,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedDb = db.map(item => {
      if (item.id === activeDetail.id) {
        const nextComments = [...(item.comments || []), newComment];
        const updatedItem = { ...item, comments: nextComments };
        setActiveDetail(updatedItem);
        return updatedItem;
      }
      return item;
    });

    setDb(updatedDb);
    dbMock.saveResources(updatedDb);
    setCommentText('');
    pushNotification("Comment Posted", "Your doubt has been posted.");
  };

  // Star Rating Posting
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewContent || !activeDetail) return;

    const newReview = {
      author: user ? user.name : "Student Contributor",
      stars: reviewStars,
      content: reviewContent,
      tags: reviewTags
    };

    const updatedDb = db.map(item => {
      if (item.id === activeDetail.id) {
        const nextReviews = [newReview, ...(item.reviews || [])];
        const totalStars = nextReviews.reduce((sum, r) => sum + r.stars, 0);
        const rating = parseFloat((totalStars / nextReviews.length).toFixed(1));
        const updatedItem = { ...item, reviews: nextReviews, rating };
        setActiveDetail(updatedItem);
        return updatedItem;
      }
      return item;
    });

    setDb(updatedDb);
    dbMock.saveResources(updatedDb);
    
    setReviewContent('');
    setReviewStars(5);
    setReviewTags([]);
    pushNotification("Review Submitted", "Thank you for rating this resource!");
  };

  // Upload Assignment Handler
  const handleUploadAssignment = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const subject = e.target.subject.value;
    const sem = parseInt(e.target.sem.value);
    const dept = e.target.dept.value;
    const type = e.target.type.value;
    const desc = e.target.desc.value;

    const newUpload = {
      id: generateId(),
      title,
      subject,
      sem,
      dept,
      type,
      desc,
      uploadedBy: user ? user.name : "Guest Contributor",
      date: new Date().toISOString().split('T')[0],
      size: "1.2 MB",
      tags: [subject.replace(/\s+/g, ''), type]
    };

    const nextPending = [newUpload, ...pendingUploads];
    setPendingUploads(nextPending);
    dbMock.savePending(nextPending);

    e.target.reset();
    setActiveTab('dashboard');
    pushNotification("Upload Pending", "Your document is pending admin approval.");
  };

  // Admin Queue Actions
  const approvePending = (id) => {
    const item = pendingUploads.find(p => p.id === id);
    if (!item) return;

    const approvedItem = {
      ...item,
      id: db.length > 0 ? Math.max(...db.map(r => r.id)) + 1 : 1,
      downloads: 0,
      rating: 5.0,
      reviews: [],
      comments: []
    };

    const nextDb = [...db, approvedItem];
    setDb(nextDb);
    dbMock.saveResources(nextDb);

    const nextPending = pendingUploads.filter(p => p.id !== id);
    setPendingUploads(nextPending);
    dbMock.savePending(nextPending);

    // Update real-time contributors standings
    const contributorName = item.uploadedBy || "Guest Contributor";
    let updatedContributors = [...contributors];
    const existingIdx = updatedContributors.findIndex(c => c.name.toLowerCase() === contributorName.toLowerCase());
    
    if (existingIdx !== -1) {
      updatedContributors[existingIdx] = {
        ...updatedContributors[existingIdx],
        uploads: updatedContributors[existingIdx].uploads + 1,
        points: updatedContributors[existingIdx].points + 25
      };
    } else {
      updatedContributors.push({
        rank: 99,
        name: contributorName,
        uploads: 1,
        downloads: 0,
        points: 25
      });
    }

    // Sort by points descending
    updatedContributors.sort((a, b) => b.points - a.points);
    // Recalculate ranks
    updatedContributors = updatedContributors.map((c, index) => ({
      ...c,
      rank: index + 1
    }));

    setContributors(updatedContributors);
    dbMock.saveContributors(updatedContributors);

    // Sync logged-in user profile stats if they are the uploader
    if (user && user.name.toLowerCase() === contributorName.toLowerCase()) {
      const userRankInList = updatedContributors.find(c => c.name.toLowerCase() === user.name.toLowerCase())?.rank || user.rank;
      const updatedUser = {
        ...user,
        coins: (user.coins !== undefined ? user.coins : 0) + 50,
        rank: userRankInList,
        completed: (user.completed || 0) + 1
      };
      setUser(updatedUser);
      localStorage.setItem('tsec_user', JSON.stringify(updatedUser));
    }

    setContributionPoints(prev => prev + 25);
    pushNotification("Upload Approved", `'${item.title}' is now public!`);
  };

  const rejectPending = (id) => {
    const item = pendingUploads.find(p => p.id === id);
    if (!item) return;

    const nextPending = pendingUploads.filter(p => p.id !== id);
    setPendingUploads(nextPending);
    dbMock.savePending(nextPending);
    pushNotification("Upload Rejected", `'${item.title}' was declined.`);
  };

  // Filtered Resources Engine
  const filteredResources = useMemo(() => {
    let results = [...db];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          (item.teacher && item.teacher.toLowerCase().includes(q)) ||
          item.type.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.toLowerCase().includes(q))
        );
      });
    }

    if (searchSem !== 'all') {
      results = results.filter(item => item.sem.toString() === searchSem);
    }
    if (searchDept !== 'all') {
      results = results.filter(item => item.dept === searchDept);
    }
    if (searchType !== 'all') {
      results = results.filter(item => item.type === searchType);
    }

    if (searchSort === 'newest') {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (searchSort === 'downloads') {
      results.sort((a, b) => b.downloads - a.downloads);
    } else if (searchSort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [db, searchQuery, searchSem, searchDept, searchType, searchSort]);

  // AI Simulations
  const simulateAiSearch = () => {
    if (!aiSearchQuery) return;
    setAiSearchLoading(true);
    setTimeout(() => {
      const q = aiSearchQuery.toLowerCase();
      let match = db.filter(f => {
        return f.title.toLowerCase().includes(q) || f.subject.toLowerCase().includes(q) || f.tags.some(t => t.toLowerCase().includes(q));
      });
      if (match.length === 0) {
        if (q.includes("java") && q.includes("5")) match = db.filter(f => f.id === 1);
        else if (q.includes("dsa") || q.includes("graph")) match = db.filter(f => f.id === 2);
        else if (q.includes("dbms") || q.includes("sql")) match = db.filter(f => f.id === 3);
        else if (q.includes("os") || q.includes("scheduling")) match = db.filter(f => f.id === 4);
      }
      setAiSearchResults(match);
      setAiSearchLoading(false);
    }, 800);
  };

  const simulateAiSummary = (e) => {
    const val = e.target.value;
    setAiSummarySelect(val);
    if (!val) {
      setAiSummaryOutput('');
      return;
    }
    const item = db.find(f => f.id === parseInt(val));
    if (!item) return;

    setAiSummaryLoading(true);
    setTimeout(() => {
      setAiSummaryOutput(`
### 📝 Academic Executive Summary
**Document:** "${item.title}"
**Subject:** ${item.subject} (Semester ${item.sem} | ${item.dept})

---

#### 1. Core Objectives & Focus Areas
- Implements comprehensive configurations matching modern university syllabus requirements.
- Details logical implementation scripts and syntax frameworks corresponding to tags: *${item.tags.join(', ')}*.
- Preserves structure matching exam blueprint vectors with peer rating support (${item.rating}/5.0).

#### 2. Key Takeaways & Code Parameters
- **Implementation Rules:** Code components execute correctly under standard compilation environments (Java Virtual Machine, GCC, Oracle PL/SQL).
- **Execution Output:** Focuses on performance bounds (e.g. Thread synchronization limits, graph matrix traversal complex indices, scheduling timeline metrics).
- **Evaluation Criteria:** Fits standard TSEC laboratory and theory indices.
      `);
      setAiSummaryLoading(false);
    }, 700);
  };

  const handleAiChatSubmit = (e) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userText = aiChatInput;
    setAiChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAiChatInput('');

    setTimeout(() => {
      let botReply = "I don't have detailed notes on this query yet. Try asking about 'Multi-threading', 'CPU Scheduling', or 'SQL Joins'.";
      const q = userText.toLowerCase();

      if (q.includes("threading") || q.includes("java")) {
        botReply = "Java multi-threading executes parallel instructions using classes like 'Thread' or 'Runnable'. Best practice: Use 'synchronized' locks to ensure thread-safe operation on shared instances.";
      } else if (q.includes("scheduling") || q.includes("os")) {
        botReply = "CPU Scheduling schemes determine execution priority. Non-preemptive scheduling (e.g. FCFS, SJF) cannot be interrupted, while preemptive (e.g. Round Robin, SRTF) suspends tasks dynamically to maximize throughput.";
      } else if (q.includes("sql") || q.includes("join") || q.includes("dbms")) {
        botReply = "SQL joins merge fields across datasets. INNER JOIN yields mutual rows, LEFT JOIN keeps all left side indexes, and OUTER JOIN displays complete indices regardless of matching keys.";
      }

      setAiChatMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    }, 900);
  };

  const generateAiDraft = () => {
    setDraftLoading(true);
    setTimeout(() => {
      setDraftOutput(`/* ═══════════════════════════════════════════════════════════════
   THAKUR SHYAMNARAYAN ENGINEERING COLLEGE
   SUBJECT: ${draftSubject.toUpperCase()}
   TOPIC: ${draftTopic.toUpperCase()}
   SCHEME: ${draftFormat}
   ═══════════════════════════════════════════════════════════════ */

#include <stdio.h>
#include <stdlib.h>

// Objective: To implement logical configurations modeling ${draftTopic}.
// Reference parameters match Mumbai University syllabus specifications.

int main() {
    printf("Initializing ${draftTopic} Simulation...\\n");
    printf("Evaluating variables for ${draftSubject}...\\n");
    
    // Core logic mockup
    int status = 1;
    if (status) {
        printf("Verification state: SUCCESS\\n");
    } else {
        printf("Verification state: FAIL\\n");
    }
    
    printf("-------------------------------------------\\n");
    printf("Simulation completed under format: ${draftFormat}\\n");
    return 0;
}
`);
      setDraftLoading(false);
    }, 800);
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    pushNotification("Copied to Clipboard", "Code skeleton copy successful.");
  };

  const generateAiNotes = () => {
    setNotesLoading(true);
    setTimeout(() => {
      setNotesCards([
        { title: "📌 Key Concept Aim", desc: `Explore key architecture bounds for: ${notesTopic}. Understand definitions and primary structural algorithms.` },
        { title: "⚡ Performance Bounds", desc: "Covers context-switching bounds, thread locks, indices structures, and memory access intervals." },
        { title: "📐 Essential Formulas", desc: "Turnaround Time = Completion Time - Arrival Time. \nWaiting Time = Turnaround Time - Burst Time." }
      ]);
      setNotesLoading(false);
    }, 950);
  };

  // Add Deadline Action
  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!deadlineTitle || !deadlineSub || !deadlineDate) return;

    const newDate = {
      id: generateId(),
      title: deadlineTitle,
      subject: deadlineSub,
      date: deadlineDate
    };

    const nextDates = [...deadlines, newDate].sort((a, b) => new Date(a.date) - new Date(b.date));
    setDeadlines(nextDates);
    dbMock.saveDeadlines(nextDates);

    setDeadlineTitle('');
    setDeadlineSub('');
    setDeadlineDate('');
    pushNotification("Deadline Saved", `'${deadlineTitle}' added to submission calendar.`);
  };

  // Calendar Day Cells
  const calendarCells = useMemo(() => {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const cells = [];
    // Previous Month Days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({ day: prevMonthTotalDays - i, isCurrent: false });
    }
    // Current Month Days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = d === 26 && month === 5 && year === 2026;
      const fileDeadlines = deadlines.filter(dl => dl.date === dateStr);

      cells.push({
        day: d,
        isCurrent: true,
        isToday,
        dateStr,
        deadlines: fileDeadlines
      });
    }
    return cells;
  }, [currentCalDate, deadlines]);

  // Directory Explorer Items
  const browseFolderItems = useMemo(() => {
    const stepsCount = browsePath.length;
    if (stepsCount === 0) {
      return {
        type: 'semesters',
        list: [1, 2, 3, 4, 5, 6, 7, 8].map(s => ({
          title: `Semester ${s}`,
          meta: `${db.filter(f => f.sem === s).length} resources`,
          payload: s
        }))
      };
    } else if (stepsCount === 1) {
      const sem = browsePath[0];
      const depts = [
        "Computer Engineering",
        "Information Technology",
        "Artificial Intelligence and Machine Learning",
        "Electronics and Computer Engineering",
        "Mechanical Engineering"
      ];
      return {
        type: 'departments',
        list: depts.map(d => ({
          title: d,
          meta: `${db.filter(f => f.sem === sem && f.dept === d).length} resources`,
          payload: d
        }))
      };
    } else if (stepsCount === 2) {
      const [sem, dept] = browsePath;
      const subjects = [...new Set(db.filter(f => f.sem === sem && f.dept === dept).map(f => f.subject))];
      return {
        type: 'subjects',
        list: subjects.map(s => ({
          title: s,
          meta: `${db.filter(f => f.sem === sem && f.dept === dept && f.subject === s).length} resources`,
          payload: s
        }))
      };
    } else {
      const [sem, dept, sub] = browsePath;
      const files = db.filter(f => f.sem === sem && f.dept === dept && f.subject === sub);
      return {
        type: 'files',
        list: files
      };
    }
  }, [browsePath, db]);

  // Keyboard shortcut Ctrl+K focus simulation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input-main');
        if (searchInput) {
          searchInput.focus();
          setActiveTab('search');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10 text-[var(--text-primary)] transition-colors duration-400 selection:bg-sky-500 selection:text-white">
      
      {/* ═══════════════════════════════════════════ */}
      {/* FLOATING PILL NAVIGATION BAR                */}
      {/* ═══════════════════════════════════════════ */}
      <header className={`tsec-pill-nav ${scrolled ? 'tsec-pill-nav--scrolled' : ''}`}>
        <div className="nav__inner flex items-center justify-between py-3 px-6 md:px-8">
          <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => setActiveTab('home')}>
            <span className="text-xl font-black bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent tracking-tight group-hover:opacity-95 transition-all">TSEC</span>
            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-sky-500/10 bg-sky-500/5 text-sky-500 uppercase tracking-wider font-mono shadow-sm">Hub</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {[
              { key: 'home', label: 'Home' },
              { key: 'browse', label: 'Browse Library', icon: <Folder size={12}/> },
              { key: 'ai', label: 'AI Workspace', icon: <Bot size={12}/> },
              { key: 'calendar', label: 'Deadlines', icon: <CalendarIcon size={12}/> },
              { key: 'leaderboard', label: 'Standings', icon: <Trophy size={12}/> },
              { key: 'pricing', label: 'Pricing' }
            ].map(item => (
              <span 
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  if (item.key === 'browse') setBrowsePath([]);
                }} 
                className={`cursor-pointer text-xs font-semibold flex items-center gap-1.5 px-5 py-2.5 rounded-full transition-all relative select-none ${
                  activeTab === item.key 
                    ? 'text-sky-500 bg-sky-500/5 font-bold' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.icon}
                {item.label}
              </span>
            ))}
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              className="p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              {theme === 'dark' ? <Sun size={14}/> : <Moon size={14}/>}
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                aria-label="View notifications"
                className="p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all relative cursor-pointer shadow-sm hover:scale-105"
              >
                <Bell size={14}/>
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-[var(--bg-primary)] pulse-glow"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-lg p-4 shadow-xl z-50 animate-fade-in">
                  <div className="flex justify-between items-center pb-2.5 border-b border-[var(--border-color)] mb-3">
                    <span className="text-xs font-bold font-heading">Notifications</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} 
                      className="text-[10px] text-sky-500 hover:text-sky-600 font-bold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => setNotifications(notifications.map(x => x.id === n.id ? {...x, read: true} : x))} 
                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                          n.read 
                            ? 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-[var(--bg-tertiary)]' 
                            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] border-l-3 border-l-sky-500'
                        }`}
                      >
                        <div className="text-xs font-bold">{n.title}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-normal">{n.desc}</div>
                        <div className="text-[9px] text-[var(--text-muted)] mt-1.5 flex items-center gap-1 font-mono"><Clock size={9}/>{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Dashboard standing */}
            {user ? (
              <div className="flex items-center gap-3 relative">
                
                {/* Avatar Button */}
                <div className="relative">
                  <button 
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 select-none"
                    aria-label="User profile dropdown"
                  >
                    👤
                  </button>

                  {/* Dropdown panel */}
                  {avatarDropdownOpen && (
                    <>
                      {/* Invisible backdrop for outside click handler */}
                      <div className="fixed inset-0 z-40 cursor-default" onClick={() => setAvatarDropdownOpen(false)}></div>
                      
                      {/* Panel */}
                      <div className="absolute right-0 mt-3.5 w-64 rounded-2xl border border-[var(--border-color)] bg-white dark:bg-slate-950 p-4 shadow-xl z-50 animate-scale-in text-left text-xs font-medium text-[var(--text-secondary)]">
                        {user.role === 'writer' ? (
                          // WRITER DROPDOWN (Anjali Mishra)
                          <div className="flex flex-col gap-3">
                            <div 
                              onClick={() => { setActiveTab('profile'); setAvatarDropdownOpen(false); }}
                              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
                            >
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] flex items-center justify-center text-slate-500 shadow-inner shrink-0 text-base select-none">
                                👤
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-extrabold text-xs text-[var(--text-primary)] truncate leading-tight">{user.name}</h4>
                                <span className="text-[10px] text-[var(--text-muted)] block truncate font-mono mt-0.5">@{user.name.toLowerCase().replace(/\s+/g, '_')}</span>
                                <span className="inline-block text-[9px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10 mt-1 font-heading">
                                  Gold Writer ⭐
                                </span>
                              </div>
                            </div>

                            <hr className="border-[var(--border-color)]" />

                            {/* Writer Stats */}
                            <div className="grid grid-cols-2 gap-2 p-2 bg-[var(--bg-secondary)]/30 rounded-xl border border-[var(--border-color)]/50">
                              <button 
                                onClick={() => { setActiveTab('rewards'); setAvatarDropdownOpen(false); }}
                                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-sky-500 p-1.5 rounded-lg transition-all text-left font-bold"
                              >
                                <span className="text-lg">🪙</span>
                                <span className="text-[var(--text-primary)] font-bold text-[11px] font-sans">Coins</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('leaderboard'); setAvatarDropdownOpen(false); }}
                                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-sky-500 p-1.5 rounded-lg transition-all text-left font-bold"
                              >
                                <span className="text-lg">📈</span>
                                <span className="text-[var(--text-primary)] font-bold text-[11px] font-sans">Level</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('dashboard'); setAvatarDropdownOpen(false); }}
                                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-sky-500 p-1.5 rounded-lg transition-all text-left font-bold"
                              >
                                <span className="text-lg">📝</span>
                                <span className="text-[var(--text-primary)] font-bold text-[11px] font-sans">Orders</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('profile'); setAvatarDropdownOpen(false); }}
                                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-sky-500 p-1.5 rounded-lg transition-all text-left font-bold"
                              >
                                <span className="text-lg">⭐</span>
                                <span className="text-[var(--text-primary)] font-bold text-[11px] font-sans">Rating</span>
                              </button>
                            </div>

                            <hr className="border-[var(--border-color)]" />

                            {/* Writer Links */}
                            <div className="flex flex-col gap-1.5 font-bold">
                              <button 
                                onClick={() => { setActiveTab('profile'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">👤</span>
                                  <span>My Profile</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('dashboard'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">📚</span>
                                  <span>My Assignments</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('rewards'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">💰</span>
                                  <span>Wallet</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('leaderboard'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">🏆</span>
                                  <span>Achievements</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { pushNotification("Info", "Settings panel is currently locked."); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">⚙️</span>
                                  <span>Settings</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              
                              <hr className="border-[var(--border-color)] my-1" />
                              
                              <button 
                                onClick={() => { handleLogout(); setAvatarDropdownOpen(false); }}
                                className="w-full flex items-center gap-3 px-2 py-2 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600 rounded-lg cursor-pointer text-left font-sans text-xs font-black"
                              >
                                <span className="text-base select-none">🚪</span>
                                <span>Logout</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          // CLIENT DROPDOWN (Rahul Sharma / Student)
                          <div className="flex flex-col gap-3">
                            <div 
                              onClick={() => { setActiveTab('profile'); setAvatarDropdownOpen(false); }}
                              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
                            >
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] flex items-center justify-center text-slate-500 shadow-inner shrink-0 text-base select-none">
                                👤
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-extrabold text-xs text-[var(--text-primary)] truncate leading-tight">{user.name}</h4>
                                <span className="text-[10px] text-[var(--text-muted)] block truncate font-mono mt-0.5">@{user.name.toLowerCase().replace(/\s+/g, '_')}</span>
                                <span className="inline-block text-[9px] font-bold text-sky-500 bg-sky-500/5 px-2 py-0.5 rounded-full border border-sky-500/10 mt-1 font-heading">
                                  Client
                                </span>
                              </div>
                            </div>

                            <hr className="border-[var(--border-color)]" />

                            {/* Client Links */}
                            <div className="flex flex-col gap-1.5 font-bold">
                              <button 
                                onClick={() => { setActiveTab('profile'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">👤</span>
                                  <span>My Profile</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('dashboard'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">📄</span>
                                  <span>My Orders</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { pushNotification("Chat", "No new messages in inbox."); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">💬</span>
                                  <span>Messages</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { pushNotification("Wishlist", "Wishlist is currently empty."); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">❤️</span>
                                  <span>Wishlist</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { setActiveTab('rewards'); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">🪙</span>
                                  <span>Wallet</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              <button 
                                onClick={() => { pushNotification("Info", "Settings panel is currently locked."); setAvatarDropdownOpen(false); }}
                                className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left font-sans text-xs"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-base select-none">⚙️</span>
                                  <span>Settings</span>
                                </span>
                                <span className="text-[var(--text-muted)] text-[10px]">→</span>
                              </button>
                              
                              <hr className="border-[var(--border-color)] my-1" />
                              
                              <button 
                                onClick={() => { handleLogout(); setAvatarDropdownOpen(false); }}
                                className="w-full flex items-center gap-3 px-2 py-2 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600 rounded-lg cursor-pointer text-left font-sans text-xs font-black"
                              >
                                <span className="text-base select-none">🚪</span>
                                <span>Logout</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLoginModalOpen(true)} 
                  className="px-4 py-2 rounded-full border border-[var(--border-color)] text-xs font-bold hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
                >
                  Login
                </button>
                <button 
                  onClick={() => setSignupModalOpen(true)} 
                  className="hidden sm:inline-flex px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-xs font-bold text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                >
                  Join Free
                </button>
              </div>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-pointer"
            >
              <Menu size={15}/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[var(--bg-primary)] z-40 flex flex-col justify-center items-center p-8 lg:hidden animate-fade-in">
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="absolute top-6 right-6 p-2 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X size={18}/>
          </button>
          <div className="flex flex-col gap-6 text-center text-lg font-bold">
            <span onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="hover:text-sky-500 transition-all cursor-pointer">Home</span>
            <span onClick={() => { setActiveTab('browse'); setBrowsePath([]); setMobileMenuOpen(false); }} className="hover:text-sky-500 transition-all cursor-pointer">Browse Library</span>
            <span onClick={() => { setActiveTab('ai'); setMobileMenuOpen(false); }} className="hover:text-sky-500 transition-all cursor-pointer">AI Workspace</span>
            <span onClick={() => { setActiveTab('calendar'); setMobileMenuOpen(false); }} className="hover:text-sky-500 transition-all cursor-pointer">Submission Deadlines</span>
            <span onClick={() => { setActiveTab('leaderboard'); setMobileMenuOpen(false); }} className="hover:text-sky-500 transition-all cursor-pointer">Leaderboards</span>
            <span onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }} className="hover:text-sky-500 transition-all cursor-pointer">Pricing Plans</span>
            {user && (
              <span onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className="text-emerald-500 cursor-pointer">My Dashboard</span>
            )}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER ──────────────────────────────── */}
      <main className="flex-grow pt-28 max-w-7xl mx-auto w-full px-4 sm:px-6">

        {/* ── HOME TAB ────────────────────────────────────────────── */}
        {activeTab === 'home' && (
          <div className="animate-fade-in py-6">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto pt-10 pb-16 relative">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-[9px] font-bold text-sky-500 uppercase tracking-widest mb-6 font-mono badge-glow select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ✨ v2.0 Academic Engine Active
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] mb-6 leading-none font-heading">
                Stop Searching <br className="sm:hidden"/>
                <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">WhatsApp Groups.</span>
              </h1>
              
              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                Assignments, Notes, Lab Files, and Previous Year Papers — All in One Place, structured by syllabus modules and verified by peer contributors.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xs sm:max-w-none mx-auto">
                <button 
                  onClick={() => { setActiveTab('browse'); setBrowsePath([]); }} 
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-sky-500/10 active:scale-95"
                >
                  <Folder size={14}/> Browse Library
                </button>
                <button 
                  onClick={() => setActiveTab('upload')} 
                  className="w-full sm:w-auto px-8 py-4 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] font-bold text-[var(--text-primary)] text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:scale-95"
                >
                  <Plus size={14}/> Upload Assignment
                </button>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8 border-y border-[var(--border-color)] mb-14 bg-[var(--bg-secondary)]/30 rounded-2xl px-6">
              {[
                { count: "500+", label: "Assignments" },
                { count: "200+", label: "Revision Notes" },
                { count: "100+", label: "Completed Labs" },
                { count: "50+", label: "Syllabus Subjects" },
                { count: "1,000+", label: "Active Students" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 border-r border-[var(--border-color)]/60 last:border-r-0 md:block first:border-r last:border-0">
                  <div className="text-3xl font-extrabold text-sky-500 font-heading tracking-tight">{stat.count}</div>
                  <div className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Premium Command Bar Search */}
            <div className="max-w-xl mx-auto mb-16">
              <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full py-4 px-6 shadow-sm focus-within:border-sky-500/40 focus-within:ring-4 focus-within:ring-sky-500/5 transition-all">
                <Search className="text-[var(--text-muted)] mr-3" size={16}/>
                <input 
                  type="text" 
                  id="search-input-main"
                  placeholder="Search Java threads, Graph BFS, CPU Scheduling..."
                  className="bg-transparent text-[var(--text-primary)] outline-none w-full text-xs placeholder:text-[var(--text-muted)]"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveTab('search');
                  }}
                />
                <span className="hidden sm:inline-block text-[9px] font-mono font-bold border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-0.5 rounded text-[var(--text-muted)] select-none">Ctrl + K</span>
              </div>
              <div className="flex flex-wrap gap-2.5 justify-center mt-4 text-[10px] text-[var(--text-muted)]">
                <span>Quick queries:</span>
                <button onClick={() => { setSearchQuery('Java Assignment 5'); setActiveTab('search'); }} className="hover:text-sky-500 hover:underline cursor-pointer font-semibold">Java Assignment 5</button>
                <span>•</span>
                <button onClick={() => { setSearchQuery('DSA revision'); setActiveTab('search'); }} className="hover:text-sky-500 hover:underline cursor-pointer font-semibold">DSA revision</button>
                <span>•</span>
                <button onClick={() => { setSearchQuery('DBMS SQL'); setActiveTab('search'); }} className="hover:text-sky-500 hover:underline cursor-pointer font-semibold">DBMS SQL Joins</button>
              </div>
            </div>

            {/* Featured Categories Grid */}
            <div className="mb-16">
              <h2 className="text-xl font-bold font-heading mb-6 tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles size={16} className="text-sky-500"/> Featured Categories
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { title: "Assignments", icon: "📝", type: "Assignments", desc: "Syllabus lab tasks" },
                  { title: "Revision Notes", icon: "📚", type: "Notes", desc: "Shorthand cards" },
                  { title: "University PYQs", icon: "📄", type: "Previous Year Papers", desc: "Past exam sheets" },
                  { title: "Lab Manuals", icon: "💻", type: "Lab Files", desc: "Code output listings" },
                  { title: "Study Archives", icon: "📑", type: "all", desc: "All modules index" }
                ].map((cat, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setActiveTab('search'); setSearchType(cat.type); }} 
                    className="tsec-glass-card tsec-glass-card--hover flex flex-col items-center justify-between p-6 cursor-pointer text-center group h-36"
                  >
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                    <div>
                      <span className="text-xs font-bold block text-[var(--text-primary)]">{cat.title}</span>
                      <span className="text-[8px] text-[var(--text-muted)] mt-1 block leading-none font-medium">{cat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SEARCH TAB ──────────────────────────────────────────── */}
        {activeTab === 'search' && (
          <div className="animate-fade-in py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Search Academic Library</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Refine and query across all semester archives and documents.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Filters Panel */}
              <div className="w-full lg:w-60 shrink-0 flex flex-col gap-4">
                <div className="tsec-glass-card p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
                    <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Filter Criteria</h3>
                    <button 
                      onClick={() => { setSearchSem('all'); setSearchDept('all'); setSearchType('all'); setSearchSort('newest'); }}
                      className="text-[9px] text-sky-500 font-bold hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase font-mono">Semester</label>
                      <select 
                        value={searchSem} 
                        onChange={(e) => setSearchSem(e.target.value)} 
                        className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-colors"
                      >
                        <option value="all">All Semesters</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>Semester {s}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase font-mono">Department</label>
                      <select 
                        value={searchDept} 
                        onChange={(e) => setSearchDept(e.target.value)} 
                        className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-colors"
                      >
                        <option value="all">All Departments</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
                        <option value="Electronics and Computer Engineering">Electronics and Computer Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase font-mono">Resource Type</label>
                      <select 
                        value={searchType} 
                        onChange={(e) => setSearchType(e.target.value)} 
                        className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-colors"
                      >
                        <option value="all">All File Types</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Notes">Revision Notes</option>
                        <option value="Lab Files">Lab Files & Manuals</option>
                        <option value="Previous Year Papers">Previous Year Papers</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase font-mono">Sort By</label>
                      <select 
                        value={searchSort} 
                        onChange={(e) => setSearchSort(e.target.value)} 
                        className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-colors"
                      >
                        <option value="newest">Newest Added</option>
                        <option value="downloads">Most Downloaded</option>
                        <option value="rating">Top Rated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Search Results */}
              <div className="flex-grow">
                <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-5 mb-5 shadow-sm focus-within:border-sky-500/40">
                  <Search className="text-[var(--text-muted)] mr-3" size={16}/>
                  <input 
                    type="text" 
                    value={searchQuery}
                    placeholder="Search by keywords, subject code, teacher name..."
                    className="bg-transparent text-[var(--text-primary)] outline-none w-full text-xs placeholder:text-[var(--text-muted)]"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] cursor-pointer"><X size={12}/></button>
                  )}
                </div>

                {dbLoading ? (
                  <div className="text-center py-12 text-xs text-[var(--text-muted)] animate-pulse">
                    <span className="inline-block skeleton-line w-24 h-4 mb-2"></span>
                    <div>Polling index structures...</div>
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="p-12 border border-dashed border-[var(--border-color)] rounded-2xl text-center bg-[var(--bg-secondary)]/20">
                    <AlertCircle className="mx-auto text-[var(--text-muted)] mb-3" size={32}/>
                    <h3 className="font-bold text-xs text-[var(--text-primary)]">No matching resources found</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">Try modifying your query or adjusting the category filters.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredResources.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => setActiveDetail(item)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 tsec-glass-card tsec-glass-card--hover cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
                            <FileText size={18}/>
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] tracking-tight">{item.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] sm:text-[10px] text-[var(--text-secondary)] mt-1">
                              <span className="font-bold text-sky-500">{item.type}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/40"></span>
                              <span>Sem {item.sem}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/40"></span>
                              <span className="font-medium">{item.dept}</span>
                              {item.teacher && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/40"></span>
                                  <span className="text-[var(--text-muted)]">Prof: {item.teacher}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5 mt-3.5 sm:mt-0 pt-3.5 sm:pt-0 border-t border-[var(--border-color)] sm:border-0">
                          <div className="flex items-center gap-1 text-[10px]">
                            <Star className="text-yellow-500 fill-yellow-500" size={12}/>
                            <span className="font-bold text-[var(--text-primary)]">{item.rating}</span>
                            <span className="text-[var(--text-muted)]">({item.reviews?.length || 0})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }} 
                              className={`p-1.5 rounded-full hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer ${
                                bookmarks.includes(item.id) 
                                  ? 'text-amber-500 bg-amber-500/5 border border-amber-500/10' 
                                  : 'text-[var(--text-muted)] border border-transparent'
                              }`}
                            >
                              <Bookmark size={14} className={bookmarks.includes(item.id) ? 'fill-amber-500' : ''}/>
                            </button>
                            <span className="text-[9px] font-mono border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1 rounded-md text-[var(--text-secondary)] font-bold">{item.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── BROWSE LIBRARY TAB ──────────────────────────────────── */}
        {activeTab === 'browse' && (
          <div className="animate-fade-in py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Library Directory Browser</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Navigate sequentially through departments and modules.</p>
            </div>

            {/* Breadcrumb folder path navigation */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-6 flex-wrap bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] py-2.5 px-4 rounded-xl">
              <button onClick={() => setBrowsePath([])} className="text-[var(--text-muted)] hover:text-sky-500 cursor-pointer font-mono font-bold">ROOT</button>
              {browsePath.map((step, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="text-[var(--text-muted)]/50" size={12}/>
                  <button 
                    onClick={() => setBrowsePath(browsePath.slice(0, idx + 1))} 
                    className={`font-mono cursor-pointer ${
                      idx === browsePath.length - 1 
                        ? 'text-sky-500 font-bold' 
                        : 'text-[var(--text-muted)] hover:text-sky-500 font-bold'
                    }`}
                  >
                    {typeof step === 'number' ? `SEMESTER ${step}` : step.toUpperCase()}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {browsePath.length >= 2 && browsePath[0] >= 6 ? (
              <div className="py-8 flex items-center justify-center">
                <div className="text-center py-12 px-8 border border-dashed border-[var(--border-color)] rounded-[32px] bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm max-w-md w-full flex flex-col items-center justify-center gap-5 shadow-lg animate-scale-in">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-2xl shadow-inner animate-pulse">
                    🚀
                  </div>
                  <div className="text-center">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider font-heading text-[var(--text-primary)]">
                      Coming Soon
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold leading-relaxed mt-2 font-sans">
                      Our community is actively gathering syllabus study materials, lab files, and reference books for this semester branch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBrowsePath(browsePath.slice(0, 1))}
                    className="px-5 py-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[10px] rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center font-heading"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : browseFolderItems.type !== 'files' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {browseFolderItems.list.map((folder, i) => (
                  <div 
                    key={i} 
                    onClick={() => setBrowsePath([...browsePath, folder.payload])}
                    className="p-5 tsec-glass-card tsec-glass-card--hover cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div className="text-3xl">
                      {browseFolderItems.type === 'semesters' ? '📁' : browseFolderItems.type === 'departments' ? '📂' : '📖'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-primary)] tracking-tight leading-tight">{folder.title}</h4>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1.5 block font-semibold">{folder.meta.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display file rows
              <div className="flex flex-col gap-3">
                {browseFolderItems.list.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)]/20">
                    <AlertCircle className="mx-auto text-[var(--text-muted)] mb-2" size={24}/>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">No resources found in this folder pathway.</p>
                  </div>
                ) : (
                  browseFolderItems.list.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => setActiveDetail(item)}
                      className="flex items-center justify-between p-4.5 tsec-glass-card tsec-glass-card--hover cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                          <FileText size={16}/>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] tracking-tight">{item.title}</h4>
                          <span className="text-[10px] text-[var(--text-secondary)] block mt-1 font-medium">{item.type} • Prof: {item.teacher || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }} 
                          className={`p-1.5 rounded-full cursor-pointer transition-all ${
                            bookmarks.includes(item.id) ? 'text-amber-500 bg-amber-500/5' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          <Bookmark size={14} className={bookmarks.includes(item.id) ? 'fill-amber-500' : ''}/>
                        </button>
                        <span className="text-[9px] font-mono border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1 rounded text-[var(--text-secondary)] font-bold">{item.size}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ── UPLOAD ASSIGNMENT TAB ──────────────────────────────── */}
        {activeTab === 'upload' && (
          <div className="animate-fade-in py-6 max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Upload Study Material</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Submit files to help peers. All submissions undergo administrator review.</p>
            </div>

            <form onSubmit={handleUploadAssignment} className="tsec-glass-card p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Document Title</label>
                <input 
                  required 
                  name="title" 
                  type="text" 
                  placeholder="e.g. Java Assignment 6 - Socket Programming" 
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 focus:bg-[var(--bg-primary)] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Subject Name</label>
                  <input 
                    required 
                    name="subject" 
                    type="text" 
                    placeholder="e.g. Java Programming" 
                    className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Teacher Name (Optional)</label>
                  <input 
                    name="teacher" 
                    type="text" 
                    placeholder="e.g. Prof. R. Mehta" 
                    className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Semester</label>
                  <select 
                    name="sem" 
                    className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-all"
                  >
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Department</label>
                  <select 
                    name="dept" 
                    className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-all"
                  >
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
                    <option value="Electronics and Computer Engineering">Electronics and Computer Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Resource Type</label>
                <select 
                  name="type" 
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-all"
                >
                  <option value="Assignments">Assignment Submission</option>
                  <option value="Notes">Shorthand Revision Notes</option>
                  <option value="Lab Files">Completed Lab Manual</option>
                  <option value="Previous Year Papers">University PYQ Exam Sheet</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Description Outline</label>
                <textarea 
                  required 
                  name="desc" 
                  placeholder="Outline topics covered, key formulas, coding libraries, or general context..." 
                  rows="3" 
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]/40 rounded-2xl p-6 text-center select-none cursor-pointer hover:border-[var(--border-hover)] transition-all">
                <span className="text-3xl block">📥</span>
                <h4 className="font-bold text-xs mt-2 text-[var(--text-primary)]">Select PDF Document</h4>
                <p className="text-[9px] text-[var(--text-muted)] mt-1">Maximum file size allowed: 10 MB</p>
                <span className="inline-block mt-3 px-3 py-1 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[9px] font-mono text-[var(--text-secondary)] font-bold">document_file.pdf (1.2 MB)</span>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-md mt-2 cursor-pointer hover:-translate-y-0.5 active:scale-95"
              >
                Submit File for Approval
              </button>
            </form>
          </div>
        )}

        {/* ── TSEC AI COPILOT TAB ─────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div className="animate-fade-in py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">AI Copilot Hub</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Interactive smart tools to parse resources, solve doubts, and generate templates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Selector Toolkit */}
              <div className="flex flex-col gap-2">
                {[
                  { key: 'search', title: 'Semantic File Search', desc: 'Query in natural language', icon: <Search size={14}/> },
                  { key: 'summary', title: 'PDF Summarizer', desc: 'Generate quick outlines', icon: <FileText size={14}/> },
                  { key: 'solver', title: 'Doubt Chat Solver', desc: 'Ask theory and code logic', icon: <MessageSquare size={14}/> },
                  { key: 'draft', title: 'Syllabus Draft Generator', desc: 'Compile template layouts', icon: <FileCode size={14}/> },
                  { key: 'notes', title: 'Flash Revision Cards', desc: 'Translate chapters to summaries', icon: <Award size={14}/> }
                ].map(item => (
                  <button 
                    key={item.key}
                    onClick={() => setAiActiveTab(item.key)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      aiActiveTab === item.key 
                        ? 'border-sky-500 bg-sky-500/5 text-sky-500 shadow-sm' 
                        : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-tertiary)] hover:translate-x-1'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-sky-500/5 text-sky-500 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[var(--text-primary)] leading-none">{item.title}</div>
                      <div className="text-[9px] text-[var(--text-muted)] mt-1 font-medium leading-none">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right View Panel */}
              <div className="lg:col-span-3 min-h-[440px] tsec-glass-card p-6 flex flex-col justify-between">
                
                {/* AI Search */}
                {aiActiveTab === 'search' && (
                  <div className="flex flex-col gap-4 h-full justify-start animate-fade-in">
                    <div>
                      <h3 className="font-bold text-sm text-sky-500 font-heading tracking-tight flex items-center gap-1.5">
                        <Sparkles size={14}/> AI Semantic Search
                      </h3>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Enter questions or sentences like &quot;Need assignment on thread synchronization&quot;.</p>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aiSearchQuery}
                        onChange={(e) => setAiSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') simulateAiSearch(); }}
                        placeholder="e.g. Find the notes with graph algorithms by Prof. Patil..."
                        className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 focus:bg-[var(--bg-primary)] transition-all"
                      />
                      <button 
                        onClick={simulateAiSearch} 
                        className="px-5 rounded-lg bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Search size={12}/> Find
                      </button>
                    </div>

                    <div className="flex-grow overflow-y-auto max-h-64 mt-2">
                      {aiSearchLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-xs text-sky-500 animate-pulse font-medium">
                          <span className="skeleton-line w-36 h-4 mb-2"></span>
                          Running vector search algorithms...
                        </div>
                      ) : aiSearchResults.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)]/20 text-xs text-[var(--text-muted)]">
                          Type a matching topic context, e.g. &quot;Java threads&quot;, &quot;OS&quot;, &quot;Graph MST&quot;, or &quot;SQL Queries&quot;.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {aiSearchResults.map(item => (
                            <div 
                              key={item.id} 
                              onClick={() => setActiveDetail(item)} 
                              className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 flex items-center justify-between cursor-pointer hover:border-sky-500 transition-all hover:bg-[var(--bg-secondary)]"
                            >
                              <div>
                                <h4 className="font-bold text-xs text-[var(--text-primary)]">{item.title}</h4>
                                <span className="text-[9px] text-[var(--text-secondary)] block mt-1">Sem {item.sem} • Tags: {item.tags.join(', ')}</span>
                              </div>
                              <span className="text-[9px] font-mono font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">AI MATCH</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Summarizer */}
                {aiActiveTab === 'summary' && (
                  <div className="flex flex-col gap-4 h-full justify-start animate-fade-in">
                    <div>
                      <h3 className="font-bold text-sm text-sky-500 font-heading tracking-tight flex items-center gap-1.5">
                        <FileText size={14}/> AI Document Summarizer
                      </h3>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Generate granular highlights, key formulae, and syllabus mappings from verified PDFs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <select 
                        value={aiSummarySelect} 
                        onChange={simulateAiSummary} 
                        className="w-full sm:max-w-xs p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500"
                      >
                        <option value="">-- Choose Library Document --</option>
                        {db.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                      </select>
                      {aiSummaryOutput && (
                        <button 
                          onClick={() => copyToClipboard(aiSummaryOutput)} 
                          className="px-3 py-2 rounded-lg border border-[var(--border-color)] text-[10px] font-bold hover:bg-[var(--bg-secondary)] transition-all cursor-pointer flex items-center gap-1"
                        >
                          {isCopied ? <Check size={12} className="text-emerald-500"/> : <Share2 size={12}/>}
                          {isCopied ? 'Copied' : 'Copy Summary'}
                        </button>
                      )}
                    </div>

                    <div className="flex-grow mt-3">
                      {aiSummaryLoading ? (
                        <div className="flex flex-col justify-center items-center py-12 text-xs text-sky-500 animate-pulse font-mono font-medium">
                          <span className="skeleton-line w-48 h-4 mb-2"></span>
                          Compiling semantic outlines...
                        </div>
                      ) : aiSummaryOutput ? (
                        <div className="p-4.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] text-xs leading-relaxed max-w-2xl overflow-y-auto max-h-72">
                          <div className="whitespace-pre-line font-mono text-[10px]">{aiSummaryOutput}</div>
                        </div>
                      ) : (
                        <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)]/20 text-xs text-[var(--text-muted)] font-medium">
                          Select an approved public PDF document from the menu list.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Solver */}
                {aiActiveTab === 'solver' && (
                  <div className="flex flex-col gap-4 h-full justify-between animate-fade-in">
                    <div>
                      <h3 className="font-bold text-sm text-sky-500 font-heading tracking-tight flex items-center gap-1.5">
                        <MessageSquare size={14}/> AI doubt solver Chat
                      </h3>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Solve conceptual code or theoretical questions aligned with course textbooks.</p>
                    </div>

                    <div className="flex-grow overflow-y-auto h-60 max-h-60 p-4.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] flex flex-col gap-4 my-2">
                      {aiChatMessages.map((m, idx) => (
                        <div key={idx} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {m.role !== 'user' && (
                            <div className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center text-[10px] shrink-0 font-bold">AI</div>
                          )}
                          <div 
                            className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                              m.role === 'user' 
                                ? 'bg-sky-500 text-white rounded-tr-none shadow-sm' 
                                : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none shadow-sm'
                            }`}
                          >
                            {m.text}
                          </div>
                          {m.role === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-[10px] shrink-0 font-bold">U</div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef}/>
                    </div>

                    <form onSubmit={handleAiChatSubmit} className="flex gap-2">
                      <input 
                        type="text" 
                        value={aiChatInput}
                        onChange={(e) => setAiChatInput(e.target.value)}
                        placeholder="Ask: 'Explain Dijkstra's shortest path' or 'What is thread state?'"
                        className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500 focus:bg-[var(--bg-primary)] transition-all"
                      />
                      <button type="submit" className="px-5 rounded-lg bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs transition-all cursor-pointer">Send</button>
                    </form>
                  </div>
                )}

                {/* AI Draft */}
                {aiActiveTab === 'draft' && (
                  <div className="flex flex-col gap-4 h-full justify-start animate-fade-in">
                    <div>
                      <h3 className="font-bold text-sm text-sky-500 font-heading tracking-tight flex items-center gap-1.5">
                        <FileCode size={14}/> Code Skeleton Draft Generator
                      </h3>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Build structured aim-objective code mock layouts corresponding to assignments.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                      <div className="md:col-span-5 flex flex-col gap-3 p-4.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 justify-between">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Subject Name</label>
                            <input type="text" value={draftSubject} onChange={(e) => setDraftSubject(e.target.value)} className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500"/>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Experiment Topic</label>
                            <input type="text" value={draftTopic} onChange={(e) => setDraftTopic(e.target.value)} className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500"/>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Index Template Format</label>
                            <select value={draftFormat} onChange={(e) => setDraftFormat(e.target.value)} className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500">
                              <option value="Prof. Mehta Code Index">Prof. Mehta Code Index (Aim, Code, Outputs)</option>
                              <option value="Dr. Patil Thesis Report">Dr. Patil Thesis Report (Aim, Calculations)</option>
                            </select>
                          </div>
                        </div>
                        <button 
                          onClick={generateAiDraft} 
                          className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all mt-2 cursor-pointer"
                        >
                          Compile Skeleton Code
                        </button>
                      </div>

                      <div className="md:col-span-7 p-4 rounded-xl border border-[var(--border-color)] bg-[#070b13] relative min-h-60 max-h-80 overflow-y-auto">
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                          {draftOutput && (
                            <button 
                              onClick={() => copyToClipboard(draftOutput)} 
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#a5b4fc] text-[9px] font-mono border border-slate-700 font-bold transition-all cursor-pointer"
                            >
                              {isCopied ? 'COPIED!' : 'COPY CODE'}
                            </button>
                          )}
                        </div>
                        
                        {draftLoading ? (
                          <div className="flex flex-col items-center justify-center h-full text-xs text-sky-500 animate-pulse font-mono">
                            <span className="skeleton-line w-36 h-4 mb-2"></span>
                            Structuring syntax vectors...
                          </div>
                        ) : draftOutput ? (
                          <pre className="text-[10px] font-mono text-[#a5b4fc] leading-relaxed whitespace-pre">{draftOutput}</pre>
                        ) : (
                          <div className="flex items-center justify-center h-full text-center text-xs text-slate-500 font-mono">
                            Generated layout draft structure will display inside this terminal.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Notes Cards */}
                {aiActiveTab === 'notes' && (
                  <div className="flex flex-col gap-4 h-full justify-start animate-fade-in">
                    <div>
                      <h3 className="font-bold text-sm text-sky-500 font-heading tracking-tight flex items-center gap-1.5">
                        <Award size={14}/> Revision Flash Notes compiler
                      </h3>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Provide complex module topics to generate concise digital revision card decks.</p>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={notesTopic}
                        onChange={(e) => setNotesTopic(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') generateAiNotes(); }}
                        placeholder="e.g. Types of SQL joins and nested trigger rules..."
                        className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs outline-none focus:border-sky-500"
                      />
                      <button 
                        onClick={generateAiNotes} 
                        className="px-5 rounded-lg bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs transition-all cursor-pointer"
                      >
                        Compile Decks
                      </button>
                    </div>

                    <div className="flex-grow mt-3">
                      {notesLoading ? (
                        <div className="flex flex-col justify-center items-center py-12 text-xs text-sky-500 animate-pulse font-medium">
                          <span className="skeleton-line w-40 h-4 mb-2"></span>
                          Compiling outline parameters...
                        </div>
                      ) : notesCards.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {notesCards.map((card, i) => (
                            <div key={i} className="p-4 rounded-xl border border-sky-500/10 bg-[var(--bg-secondary)]/50 shadow-sm flex flex-col justify-between">
                              <h4 className="font-bold text-[10px] text-sky-500 uppercase font-mono tracking-wider mb-2">{card.title}</h4>
                              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium whitespace-pre-line">{card.desc}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)]/20 text-xs text-[var(--text-muted)] font-medium">
                          Input a syllabus topic context above to build revision flashcard sets.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ── DEADLINES TAB ───────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div className="animate-fade-in py-6 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-6 relative">
            
            {/* 1. Hi Anjali! Greeting Card Banner */}
            <div className="p-6 rounded-3xl tsec-glass-card relative overflow-hidden flex flex-col gap-4 text-left">
              {/* Subtle background glow decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex flex-col gap-1 text-left relative z-10">
                <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-[var(--text-primary)] flex items-center gap-2">
                  <span>👋 Hey Buddy!</span>
                  <GraduationCap className="text-purple-500 animate-float-slow" size={24} />
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                  Need help completing your assignments? Order from top writers!
                </p>
              </div>

              {/* Dynamic status pill badges */}
              <div className="flex flex-wrap gap-2.5 mt-1 text-left">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 rounded-full shadow-sm hover:scale-105 transition-all">
                  <Flame size={12} className="animate-pulse" />
                  <span>{dashboardActiveOrders.length} ACTIVE ORDERS</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 rounded-full shadow-sm hover:scale-105 transition-all">
                  <Bot size={12} className="hover-spin-slow" />
                  <span>25+ WRITERS ONLINE</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 rounded-full shadow-sm hover:scale-105 transition-all">
                  <Clock size={12} className="hover-bounce" />
                  <span>24H EXPRESS AVAIL.</span>
                </div>
              </div>
            </div>

            {/* 2. Horizontal/Vertical Stepper Status Indicator */}
            <div className="p-5 rounded-3xl tsec-glass-card">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-3 text-left">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-all duration-300 ${
                    activeAccordion === 'assignment' || activeAccordion === 'manual'
                      ? 'bg-purple-600 text-white ring-4 ring-purple-600/20 animate-pulse'
                      : cartOrder
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {cartOrder ? '✓' : 1}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Order Details</div>
                    <div className="text-[9px] text-[var(--text-muted)] font-medium">Upload questions</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-all duration-300 ${
                    activeAccordion === 'assignment' || activeAccordion === 'manual'
                      ? 'bg-purple-600 text-white ring-4 ring-purple-600/20 animate-pulse'
                      : cartOrder
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {cartOrder ? '✓' : 2}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Lab Manual</div>
                    <div className="text-[9px] text-[var(--text-muted)] font-medium">Provide details</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-all duration-300 ${
                    activeAccordion === 'pricing' && paymentStep === 1
                      ? 'bg-purple-600 text-white ring-4 ring-purple-600/20 animate-pulse'
                      : paymentStep > 1
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {paymentStep > 1 ? '✓' : 3}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Set Deadline</div>
                    <div className="text-[9px] text-[var(--text-muted)] font-medium">Choose speed</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-all duration-300 ${
                    activeAccordion === 'pricing' && paymentStep === 2
                      ? 'bg-purple-600 text-white ring-4 ring-purple-600/20 animate-pulse'
                      : paymentStep > 2
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {paymentStep > 2 ? '✓' : 4}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Pay Order</div>
                    <div className="text-[9px] text-[var(--text-muted)] font-medium">Secure checkout</div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-all duration-300 ${
                    paymentStep === 3
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 shadow-lg'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {paymentStep === 3 ? '✓' : 5}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Order Placed</div>
                    <div className="text-[9px] text-[var(--text-muted)] font-medium">Writers assigned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Congratulations Reward Popup / Modal */}
            {rewardModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 max-w-sm w-full text-center shadow-2xl border border-[var(--border-color)] relative overflow-hidden animate-scale-in">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping"></div>
                    <div className="absolute top-20 right-10 w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="absolute top-4 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center text-3xl mx-auto mb-5 shadow-inner animate-bounce">
                    🎁
                  </div>

                  <h3 className="font-extrabold text-lg text-[var(--text-primary)] font-heading uppercase tracking-wide">
                    🎉 Congratulations!
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mt-2 font-sans">
                    You have successfully collected <span className="text-purple-600 font-bold">100 Loyalty Coins!</span>
                  </p>
                  <p className="text-sm text-[var(--text-primary)] font-extrabold mt-4 leading-normal font-sans">
                    🎁 You have unlocked <span className="text-emerald-600">1 FREE Assignment.</span>
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLoyaltyCoins(prev => prev - 100);
                        setRewardModalOpen(false);
                        pushNotification("Reward Redeemed!", "1 Free Assignment credit applied to your next checkout.");
                      }}
                      className="w-full py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center font-heading"
                    >
                      ✨ Redeem Reward
                    </button>
                    <button
                      type="button"
                      onClick={() => setRewardModalOpen(false)}
                      className="w-full py-2.5 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 text-center font-heading"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CENTERED SECTION: Order Creation Panel */}
            <div className="flex flex-col gap-6 text-left max-w-3xl mx-auto w-full">
              <div className="border-b border-[var(--border-color)] pb-3">
                <h1 className="text-2xl font-extrabold font-heading tracking-tight text-[var(--text-primary)]">
                  Order Creation Panel
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Configure assignment or manual requirements to match writer services.
                </p>
              </div>

              {/* Accordion 1: Assignment Order */}
              <div className="tsec-dashboard-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'assignment' ? null : 'assignment')}
                  className="w-full p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all font-extrabold text-sm tracking-wide text-left cursor-pointer uppercase font-heading text-[var(--text-primary)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-sans font-extrabold">1</span>
                    <span>Assignment Order</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeAccordion === 'assignment' ? 'rotate-180' : ''}`} />
                </button>

                <div className={`accordion-wrapper ${activeAccordion === 'assignment' ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="p-6 border-t border-[var(--border-color)] flex flex-col gap-5">
                      
                      {/* Subject Name Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Subject Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Applied Physics Lab 3 Report"
                          value={assignmentSubject}
                          onChange={(e) => setAssignmentSubject(e.target.value)}
                          className="w-full p-3.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                        />
                      </div>

                      {/* Grid for Deadline and Pages */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Deadline Date Picker */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Deadline Date</label>
                          <input
                            type="date"
                            value={assignmentDeadline}
                            onChange={(e) => setAssignmentDeadline(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium font-mono"
                          />
                        </div>

                        {/* Number of Pages Selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Number of Pages (1-100)</label>
                          <select
                            value={assignmentPages}
                            onChange={(e) => setAssignmentPages(Number(e.target.value))}
                            className="w-full p-3.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                          >
                            {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Page' : 'Pages'}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Drag & Drop File Upload */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">File Upload Section</label>
                        <div className="border-2 border-dashed border-[var(--border-color)] hover:border-blue-500/30 rounded-2xl p-6 bg-slate-50/20 dark:bg-slate-900/10 transition-all text-center flex flex-col items-center justify-center cursor-pointer group relative">
                          <input 
                            type="file" 
                            multiple 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              const formatted = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' }));
                              setAssignmentFiles(prev => [...prev, ...formatted]);
                              pushNotification("File Added", `${files.length} file(s) attached.`);
                            }}
                          />
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
                            <Plus size={18} />
                          </div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">Drag & drop files here or click to browse</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">PDF, Word, or images up to 25MB</p>
                        </div>

                        {/* List uploaded files */}
                        {assignmentFiles.length > 0 && (
                          <div className="flex flex-col gap-1.5 mt-2">
                            {assignmentFiles.map((file, idx) => (
                              <div key={idx} className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex items-center justify-between text-xs font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">FILE</span>
                                  <span className="text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{file.size}</span>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setAssignmentFiles(prev => prev.filter((_, i) => i !== idx));
                                      pushNotification("File Removed", "Attached document removed.");
                                    }}
                                    className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer p-0.5"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Info Block */}
                      <div className="border-t border-[var(--border-color)] pt-5 mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!assignmentSubject || !assignmentDeadline) {
                              pushNotification("Incomplete Fields", "Please specify subject and deadline.");
                              return;
                            }
                            const price = assignmentPages * 10.0;
                            setCartOrder({
                              type: 'Assignment Order',
                              subject: assignmentSubject,
                              deadline: assignmentDeadline,
                              pages: assignmentPages,
                              files: assignmentFiles,
                              price: price
                            });
                            pushNotification("Added to Cart", `'${assignmentSubject}' added to checkout.`);
                            setActiveAccordion('pricing');
                            setPaymentStep(1);

                            // Scroll smoothly to pricing section
                            setTimeout(() => {
                              const el = document.getElementById('pricing-accordion');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 150);
                          }}
                          className="px-5 py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                        >
                          <span>Add to Cart</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion 2: Manual Order */}
              <div className="tsec-dashboard-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'manual' ? null : 'manual')}
                  className="w-full p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all font-extrabold text-sm tracking-wide text-left cursor-pointer uppercase font-heading text-[var(--text-primary)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-sans font-extrabold">2</span>
                    <span>Manual Order</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeAccordion === 'manual' ? 'rotate-180' : ''}`} />
                </button>

                <div className={`accordion-wrapper ${activeAccordion === 'manual' ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="p-6 border-t border-[var(--border-color)] flex flex-col gap-5">
                      
                      {/* Subject Name Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Subject Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Mechanical Workshop Manual 4"
                          value={manualSubject}
                          onChange={(e) => setManualSubject(e.target.value)}
                          className="w-full p-3.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                        />
                      </div>

                      {/* Deadline Date Picker */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Deadline Date</label>
                        <input
                          type="date"
                          value={manualDeadline}
                          onChange={(e) => setManualDeadline(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium font-mono"
                        />
                      </div>

                      {/* Number of Pages Selector */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Number of Pages (1-100)</label>
                        <select
                          value={manualPages}
                          onChange={(e) => setManualPages(Number(e.target.value))}
                          className="w-full p-3.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                        >
                          {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Page' : 'Pages'}</option>
                          ))}
                        </select>
                      </div>

                      {/* Drag & Drop File Upload */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">File Upload Section</label>
                        <div className="border-2 border-dashed border-[var(--border-color)] hover:border-blue-500/30 rounded-2xl p-6 bg-slate-50/20 dark:bg-slate-900/10 transition-all text-center flex flex-col items-center justify-center cursor-pointer group relative">
                          <input 
                            type="file" 
                            multiple 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              const formatted = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' }));
                              setManualFiles(prev => [...prev, ...formatted]);
                              pushNotification("File Added", `${files.length} file(s) attached.`);
                            }}
                          />
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
                            <Plus size={18} />
                          </div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">Drag & drop files here or click to browse</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">PDF, Word, or images up to 25MB</p>
                        </div>

                        {/* List uploaded files */}
                        {manualFiles.length > 0 && (
                          <div className="flex flex-col gap-1.5 mt-2">
                            {manualFiles.map((file, idx) => (
                              <div key={idx} className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex items-center justify-between text-xs font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">FILE</span>
                                  <span className="text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{file.size}</span>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setManualFiles(prev => prev.filter((_, i) => i !== idx));
                                      pushNotification("File Removed", "Attached document removed.");
                                    }}
                                    className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer p-0.5"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Info Block */}
                      <div className="border-t border-[var(--border-color)] pt-5 mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!manualSubject || !manualDeadline) {
                              pushNotification("Incomplete Fields", "Please specify subject and deadline.");
                              return;
                            }
                            const price = manualPages * 15.0;
                            setCartOrder({
                              type: 'Manual Order',
                              subject: manualSubject,
                              deadline: manualDeadline,
                              pages: manualPages,
                              files: manualFiles,
                              price: price
                            });
                            pushNotification("Added to Cart", `'${manualSubject}' manual order added to checkout.`);
                            setActiveAccordion('pricing');
                            setPaymentStep(1);

                            // Scroll smoothly to pricing section
                            setTimeout(() => {
                              const el = document.getElementById('pricing-accordion');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 150);
                          }}
                          className="px-5 py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                        >
                          <span>Add to Cart</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion 3: Pricing & Order / Payment Flow */}
              <div id="pricing-accordion" className="tsec-dashboard-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'pricing' ? null : 'pricing')}
                  className="w-full p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all font-extrabold text-sm tracking-wide text-left cursor-pointer uppercase font-heading text-[var(--text-primary)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-sans font-extrabold">3</span>
                    <span>Pricing & Order</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeAccordion === 'pricing' ? 'rotate-180' : ''}`} />
                </button>

                <div className={`accordion-wrapper ${activeAccordion === 'pricing' ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="p-6 border-t border-[var(--border-color)]">
                      
                      {/* Sub-step 1: Cart display */}
                      {paymentStep === 1 && (
                        <div className="flex flex-col gap-5">
                          {!cartOrder ? (
                            <div className="text-center py-10 text-xs text-[var(--text-muted)] font-medium">
                              No order selected. Fill in your Assignment or Manual order details above and click &apos;Add to Cart&apos;.
                            </div>
                          ) : (
                            <div className="flex flex-col gap-5 animate-fade-in text-left">
                              {/* Selected Order Summary */}
                              <div className="flex flex-col gap-3">
                                <h3 className="font-extrabold text-xs text-[var(--text-primary)] font-heading uppercase tracking-wider font-mono border-b border-[var(--border-color)] pb-2">Selected Order Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-[var(--text-secondary)]">
                                  <div>Order Type: <span className="text-[var(--text-primary)] font-bold">{cartOrder.type}</span></div>
                                  <div>Subject: <span className="text-[var(--text-primary)] font-bold">{cartOrder.subject}</span></div>
                                  <div>Number of Pages: <span className="text-[var(--text-primary)] font-bold">{cartOrder.pages} pages</span></div>
                                  <div>Deadline Date: <span className="text-[var(--text-primary)] font-bold font-mono">{new Date(cartOrder.deadline).toLocaleDateString()}</span></div>
                                </div>
                              </div>

                              {/* Price Calculation Table */}
                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)] flex flex-col gap-3.5">
                                <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                                  <span>Number of Pages</span>
                                  <span>{cartOrder.pages} pages</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                                  <span>Price Per Page</span>
                                  <span>₹{cartOrder.type === 'Assignment Order' ? '10.00' : '15.00'}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                                  <span>Tax (2.5%)</span>
                                  <span>₹{(cartOrder.price * 0.025).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-extrabold text-[var(--text-primary)] border-t border-[var(--border-color)] pt-3">
                                  <span>Total Price</span>
                                  <span className="text-purple-600 font-sans">₹{(cartOrder.price * 1.025).toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Proceed Button */}
                              <div className="flex justify-end mt-1">
                                <button
                                  type="button"
                                  onClick={() => setPaymentStep(2)}
                                  className="px-6 py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                >
                                  <CreditCard size={13} />
                                  <span>Proceed to Payment</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sub-step 2: Payment Portal details */}
                      {paymentStep === 2 && cartOrder && (
                        <div className="max-w-md mx-auto w-full animate-scale-in flex flex-col gap-5 text-left">
                          <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] pb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">🔒</div>
                            <div>
                              <h3 className="font-extrabold text-xs uppercase tracking-wider font-heading text-[var(--text-primary)]">Secure Payment Portal</h3>
                              <p className="text-[10px] text-[var(--text-muted)] font-medium">Verify summary and input payment card info</p>
                            </div>
                          </div>

                          <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex justify-between text-xs font-semibold text-[var(--text-secondary)]">
                            <span>Total Due:</span>
                            <span className="text-purple-600 font-sans">₹{(cartOrder.price * 1.025).toFixed(2)}</span>
                          </div>

                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!paymentCard || !paymentExpiry || !paymentCvv) {
                                pushNotification("Input Error", "Please fill in all credit card details.");
                                return;
                              }
                              pushNotification("Authorizing Payment", "Processing secure card credentials...");
                              setTimeout(() => {
                                // Add to active orders
                                const newOrder = {
                                  id: "TSEC-" + (1000 + Math.floor(Math.random() * 9000)),
                                  subject: cartOrder.subject,
                                  pages: cartOrder.pages,
                                  status: "Pending"
                                };
                                setDashboardActiveOrders(prev => [newOrder, ...prev]);
                                
                                // Add to deadlines list
                                const newDeadline = {
                                  id: generateId(),
                                  name: `${cartOrder.type === 'Assignment Order' ? 'Assignment' : 'Manual'} Submission`,
                                  subject: cartOrder.subject,
                                  orderId: newOrder.id,
                                  dueDate: new Date(cartOrder.deadline).toISOString(),
                                  status: "Active"
                                };
                                setDashboardDeadlines(prev => [newDeadline, ...prev]);

                                // Add 10 loyalty coins (completed order)
                                setLoyaltyCoins(prev => prev + 10);

                                // Increment user's orders count in real-time
                                if (user) {
                                  const updatedUser = {
                                    ...user,
                                    orders: (user.orders || 0) + 1
                                  };
                                  setUser(updatedUser);
                                  localStorage.setItem('tsec_user', JSON.stringify(updatedUser));
                                }

                                setPaymentStep(3); // Go to success step
                                pushNotification("Payment Confirmed", `Homework matched and added to active orders tracker.`);
                              }, 1000);
                            }}
                            className="flex flex-col gap-3.5"
                          >
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Cardholder Name</label>
                              <input 
                                required 
                                type="text" 
                                placeholder="e.g. Anjali Mishra" 
                                value={paymentName} 
                                onChange={(e) => setPaymentName(e.target.value)} 
                                className="p-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 font-semibold"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Card Number</label>
                              <div className="relative flex items-center font-mono">
                                <span className="absolute left-3 text-[var(--text-muted)]">
                                  <Lock size={12} />
                                </span>
                                <input 
                                  required 
                                  type="text" 
                                  placeholder="•••• •••• •••• ••••" 
                                  value={paymentCard} 
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                    const matches = val.match(/\d{4,16}/g);
                                    const match = matches && matches[0] || '';
                                    const parts = [];
                                    for (let i = 0, len = match.length; i < len; i += 4) {
                                      parts.push(match.substring(i, i + 4));
                                    }
                                    setPaymentCard(parts.length > 0 ? parts.join(' ') : val);
                                  }} 
                                  maxLength={19}
                                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 font-medium font-mono"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Expiry Date</label>
                                <input 
                                  required 
                                  type="text" 
                                  placeholder="MM/YY" 
                                  value={paymentExpiry} 
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                    setPaymentExpiry(val.length >= 2 ? val.slice(0, 2) + '/' + val.slice(2, 4) : val);
                                  }} 
                                  maxLength={5}
                                  className="p-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 font-medium font-mono text-center"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">CVV Security</label>
                                <input 
                                  required 
                                  type="password" 
                                  placeholder="•••" 
                                  value={paymentCvv} 
                                  onChange={(e) => setPaymentCvv(e.target.value.replace(/[^0-9]/g, ''))} 
                                  maxLength={3}
                                  className="p-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 font-medium font-mono text-center"
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex flex-col gap-2">
                              <button 
                                type="submit" 
                                className="w-full py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                              >
                                <Lock size={12} />
                                <span>Pay ₹{(cartOrder.price * 1.025).toFixed(2)} Securely</span>
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setPaymentStep(1)}
                                className="w-full py-2.5 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 text-center font-heading"
                              >
                                Back to Cart
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Sub-step 3: Success Screen */}
                      {paymentStep === 3 && (
                        <div className="p-6 text-center max-w-md mx-auto w-full animate-scale-in relative overflow-hidden flex flex-col items-center">
                          {/* Confetti Animation Background */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-10 w-2.5 h-2.5 bg-pink-500 rounded-full animate-confetti"></div>
                            <div className="absolute top-20 right-10 w-3 h-3 bg-purple-500 rounded-full animate-confetti" style={{ animationDelay: '0.3s' }}></div>
                            <div className="absolute top-5 left-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-confetti" style={{ animationDelay: '0.6s' }}></div>
                            <div className="absolute top-32 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-confetti" style={{ animationDelay: '0.1s' }}></div>
                            <div className="absolute top-24 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-confetti" style={{ animationDelay: '0.8s' }}></div>
                          </div>

                          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-2xl mb-4 shadow-inner animate-bounce">
                            ✓
                          </div>
                          
                          <h3 className="font-extrabold text-sm uppercase tracking-wider font-heading text-[var(--text-primary)]">Order Placed Successfully!</h3>
                          <p className="text-[9.5px] text-[var(--text-muted)] font-bold font-mono mt-1 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded border border-[var(--border-color)]">
                            ORDER ID: #TSEC-\8996
                          </p>
                          
                          <p className="text-[11px] text-[var(--text-secondary)] font-semibold leading-relaxed mt-4 max-w-xs">
                            Thank you! Your payment is authorized. Our expert writers have been assigned to your homework order. Loyalty coins have been credited to your account.
                          </p>

                          <div className="mt-6 flex flex-col gap-2 w-full">
                            <button 
                              type="button" 
                              onClick={() => {
                                setPaymentStep(1);
                                setCartOrder(null);
                                setAssignmentSubject('');
                                setAssignmentPages(1);
                                setAssignmentFiles([]);
                                setAssignmentDeadline('');
                                setManualSubject('');
                                setManualPages(1);
                                setManualFiles([]);
                                setManualDeadline('');
                                setPaymentCard('');
                                setPaymentExpiry('');
                                setPaymentCvv('');
                                setActiveAccordion('assignment');
                              }}
                              className="w-full py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center font-heading"
                            >
                              Create New Order
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── LEADERBOARD TAB ─────────────────────────────────────── */}
        {activeTab === 'leaderboard' && (
          <div className="animate-fade-in py-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Contributor Standings</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Standings of peer students uploading verified resources.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { title: "Special Badges", desc: "Earn Master and Expert labels.", icon: "🏅" },
                { title: "Peer Endorsements", desc: "Higher rating amplifies score.", icon: "⭐" },
                { title: "Pro Privileges", desc: "Top 3 unlock unlimited files download.", icon: "⚡" }
              ].map((adv, i) => (
                <div key={i} className="p-4 tsec-glass-card text-center flex flex-col items-center gap-2">
                  <span className="text-2xl">{adv.icon}</span>
                  <div className="font-bold text-xs text-[var(--text-primary)]">{adv.title}</div>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">{adv.desc}</p>
                </div>
              ))}
            </div>

            <div className="tsec-glass-card overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 text-[var(--text-muted)] font-bold uppercase text-[9px] font-mono tracking-wider">
                    <th className="py-3 px-5">Rank</th>
                    <th className="py-3 px-5">Student Contributor</th>
                    <th className="py-3 px-5">Files Uploaded</th>
                    <th className="py-3 px-5 text-right">Points Score</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.map((c, idx) => (
                    <tr key={idx} className="border-b border-[var(--border-color)]/60 last:border-0 hover:bg-[var(--bg-secondary)]/30 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-xs">
                        {c.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-500/20 text-[9px]">👑 #1</span>
                        ) : c.rank === 2 ? (
                          <span className="inline-flex items-center gap-1 bg-slate-400/10 text-slate-500 px-2 py-0.5 rounded-full border border-slate-400/20 text-[9px]">🥈 #2</span>
                        ) : c.rank === 3 ? (
                          <span className="inline-flex items-center gap-1 bg-amber-600/10 text-amber-700 px-2 py-0.5 rounded-full border border-amber-600/20 text-[9px]">🥉 #3</span>
                        ) : (
                          <span className="text-[var(--text-muted)] pl-2">#{c.rank}</span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-bold flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center font-bold text-[10px]">{c.name.charAt(0)}</div>
                        <span className="text-[var(--text-primary)]">{c.name}</span>
                      </td>
                      <td className="py-4 px-5 text-[var(--text-secondary)] font-medium">{c.uploads} documents</td>
                      <td className="py-4 px-5 font-extrabold text-sky-500 text-right text-xs tracking-tight">{c.points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRICING TAB ─────────────────────────────────────────── */}
        {activeTab === 'pricing' && (
          <div className="animate-fade-in py-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Pricing Tiers</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Increase download thresholds and unlock full AI Solver capacities.</p>
              
              <div className="flex justify-center items-center gap-3 mt-6 select-none bg-[var(--bg-secondary)] border border-[var(--border-color)] p-1.5 rounded-full w-fit mx-auto shadow-inner">
                <button 
                  onClick={() => setPricingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    pricingPeriod === 'monthly' ? 'bg-sky-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setPricingPeriod('yearly')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    pricingPeriod === 'yearly' ? 'bg-sky-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Yearly
                  <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">SAVE 15%</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto items-stretch">
              {/* Free Plan */}
              <div className="p-6.5 tsec-glass-card flex flex-col justify-between h-full hover:border-[var(--border-hover)] transition-all">
                <div>
                  <h3 className="font-extrabold text-sm text-[var(--text-primary)] font-heading">Free Student Plan</h3>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Standard resource reading package</p>
                  <div className="text-4xl font-extrabold text-[var(--text-primary)] font-heading my-5">₹0 <span className="text-xs font-normal text-[var(--text-muted)] font-sans">/ month</span></div>
                  <div className="flex flex-col gap-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-5 mt-2">
                    <div className="flex items-center gap-2 font-medium">
                      <Check className="text-emerald-500" size={14}/>
                      <span>Access to 500+ Assignments</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Check className="text-emerald-500" size={14}/>
                      <span>5 downloads per calendar day</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Check className="text-emerald-500" size={14}/>
                      <span>Standard PDF previews</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 text-xs font-bold mt-8 text-[var(--text-secondary)] cursor-not-allowed select-none">
                  Current Active Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="p-6.5 tsec-glass-card border-sky-500/25 flex flex-col justify-between h-full relative shadow-lg hover:border-sky-500/40 transition-all">
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold font-mono text-[8px] py-1 px-3 rounded-full uppercase tracking-wider shadow-md">
                  RECOMMENDED
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[var(--text-primary)] font-heading">Premium Hub Pro</h3>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Uncapped study and AI execution suite</p>
                  <div className="text-4xl font-extrabold text-sky-500 font-heading my-5">
                    {pricingPeriod === 'monthly' ? '₹49' : '₹499'} 
                    <span className="text-xs font-normal text-[var(--text-muted)] font-sans">/ {pricingPeriod === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <div className="flex flex-col gap-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-5 mt-2 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="text-emerald-500" size={14}/>
                      <span>Unlimited document downloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="text-emerald-500" size={14}/>
                      <span>Full AI Solver execution bounds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="text-emerald-500" size={14}/>
                      <span>High-resolution zoom preview PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="text-emerald-500" size={14}/>
                      <span>Exclusive contributor standings priority</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Simulation checkout integration triggered!")} 
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs mt-8 transition-all cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-sky-500/10"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MY DASHBOARD TAB ────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Student Dashboard</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Manage files, bookmarked documents, and track your contribution points.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-6">
              {/* Profile Card */}
              <div className="md:col-span-4 p-5 tsec-glass-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center font-bold text-xs">
                      {user ? user.name.charAt(0) : "S"}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] leading-none">{user ? user.name : "Student Session"}</h3>
                      <span className="text-[9px] text-[var(--text-muted)] uppercase font-mono mt-1 block font-bold">{user ? user.role : "GUEST"}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-mono font-bold">Contribution Standing</span>
                    <div className="text-2xl font-extrabold text-sky-500 font-heading mt-1">{contributionPoints} points</div>
                  </div>
                </div>
                <div className="text-[9px] text-[var(--text-muted)] font-medium leading-normal mt-4">
                  Earn points by uploading assignments and manuals. Points unlock Pro benefits.
                </div>
              </div>

              {/* Bookmarks List */}
              <div className="md:col-span-8 p-5 tsec-glass-card flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs mb-3 text-[var(--text-primary)] font-heading">Bookmarked Resources</h3>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {bookmarks.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)] font-medium py-3">You haven&apos;t bookmarked any files yet.</p>
                    ) : (
                      bookmarks.map(id => {
                        const item = db.find(r => r.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} onClick={() => setActiveDetail(item)} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]/30 hover:border-sky-500/40 cursor-pointer flex justify-between items-center transition-all">
                            <div>
                              <div className="text-xs font-bold text-[var(--text-primary)]">{item.title}</div>
                              <span className="text-[9px] text-[var(--text-secondary)] block mt-0.5 font-medium">{item.subject} • {item.type}</span>
                            </div>
                            <span className="text-[9px] font-mono bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-secondary)] font-bold">{item.size}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ADMIN DASHBOARD TAB ─────────────────────────────────── */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Admin Dashboard</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Review and approve pending student document submissions.</p>
            </div>

            <div className="p-5 tsec-glass-card">
              <div className="pb-3 border-b border-[var(--border-color)] mb-4">
                <h3 className="font-extrabold text-xs text-[var(--text-primary)] font-heading uppercase tracking-wider">Pending Submission Queue</h3>
              </div>
              <div className="flex flex-col gap-3">
                {pendingUploads.length === 0 ? (
                  <div className="p-8 border border-dashed border-[var(--border-color)] rounded-xl text-center bg-[var(--bg-secondary)]/20">
                    <CheckSquare className="mx-auto text-emerald-500 mb-2" size={24}/>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">All uploads are processed. Queue is clean!</p>
                  </div>
                ) : (
                  pendingUploads.map(item => (
                    <div key={item.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-[var(--text-primary)] tracking-tight">{item.title}</h4>
                        <div className="text-[9px] text-[var(--text-secondary)] mt-1 flex gap-3 font-semibold font-mono">
                          <span>SUBJECT: {item.subject.toUpperCase()}</span>
                          <span>•</span>
                          <span>UPLOADER: {item.uploadedBy.toUpperCase()}</span>
                          <span>•</span>
                          <span>SEM: {item.sem}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => approvePending(item.id)} 
                          aria-label="Approve file"
                          className="w-8 h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Check size={14}/>
                        </button>
                        <button 
                          onClick={() => rejectPending(item.id)} 
                          aria-label="Reject file"
                          className="w-8 h-8 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <X size={14}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (() => {
          const dynamicRewards = Math.floor(rewardCoins / 500);
          const currentProgressPercent = Math.floor(((rewardCoins % 500) * 100) / 500);
          const calculatedLevel = Math.floor(rewardCoins / 500) + 1;
          const currentProgressVal = rewardCoins % 500;
          return (
            <div className="animate-fade-in py-6 max-w-5xl mx-auto px-4 sm:px-6 w-full flex flex-col gap-6 text-left relative">
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-8px) rotate(3deg); }
                }
                @keyframes particle-rise {
                  0% { transform: translateY(0) scale(1) rotate(0); opacity: 1; }
                  100% { transform: translateY(-100px) scale(0.4) rotate(360deg); opacity: 0; }
                }
                .animate-float {
                  animation: float 3s ease-in-out infinite;
                }
                .particle {
                  position: absolute;
                  pointer-events: none;
                  animation: particle-rise 1.5s ease-out forwards;
                }
              `}</style>

              {/* Floating coin particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="particle flex items-center justify-center font-bold text-xs select-none z-50"
                  style={{
                    left: p.left,
                    top: p.top,
                    color: p.color,
                    fontSize: p.size,
                    animationDelay: p.delay,
                    animationDuration: p.duration
                  }}
                >
                  🪙
                </div>
              ))}

              {/* 1. Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-yellow-400/20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex-grow flex flex-col gap-3 z-10">
                  <div className="flex items-center gap-3.5">
                    <span className="text-4xl animate-float select-none">🪙</span>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-black font-sans leading-none tracking-tight">
                        {rewardCoins.toLocaleString()} <span className="text-lg font-bold opacity-90">Coins</span>
                      </h1>
                      <p className="text-xs font-bold opacity-90 font-mono mt-1">Level {calculatedLevel} • Explorer</p>
                    </div>
                  </div>

                  <div className="w-full max-w-sm mt-2 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10.5px] font-bold opacity-95">
                      <span>Progress to Level {calculatedLevel + 1} / Reward Card</span>
                      <span>{currentProgressPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden backdrop-blur-sm border border-white/10">
                      <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${currentProgressPercent}%` }}></div>
                    </div>
                    <span className="text-[9px] opacity-75 mt-0.5 font-mono block text-right">{currentProgressVal} / 500 Coins</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto z-10">
                  <button 
                    onClick={() => {
                      const storeSection = document.getElementById('redeem-store');
                      if (storeSection) {
                        storeSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white text-amber-600 font-extrabold text-xs shadow-md hover:bg-amber-50 transition-all active:scale-95 cursor-pointer text-center font-heading"
                  >
                    Redeem Rewards
                  </button>
                  <button 
                    onClick={() => {
                      const missionsSection = document.getElementById('daily-missions');
                      if (missionsSection) {
                        missionsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-700/20 border border-white/30 text-white font-extrabold text-xs hover:bg-amber-700/40 transition-all active:scale-95 cursor-pointer text-center font-heading"
                  >
                    Earn More
                  </button>
                </div>
              </div>

              {/* 2. Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Total Coins", value: rewardCoins.toLocaleString(), emoji: "🪙", color: "text-amber-500 bg-amber-500/5 border-amber-500/10" },
                  { title: "Current Streak", value: `${rewardStreak} Days`, emoji: "🔥", color: "text-rose-500 bg-rose-500/5 border-rose-500/10" },
                  { title: "Level", value: calculatedLevel.toString(), emoji: "🏆", color: "text-purple-500 bg-purple-500/5 border-purple-500/10" },
                  { title: "Reward", value: dynamicRewards.toString(), emoji: "🎁", color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border bg-white dark:bg-slate-950 flex flex-col gap-1.5 shadow-sm text-left ${stat.color}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--text-muted)] font-heading">{stat.title}</span>
                      <span className="text-lg select-none">{stat.emoji}</span>
                    </div>
                    <span className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 grid) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* 3. How to Earn Coins */}
                  <div id="daily-missions" className="p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-sm text-[var(--text-primary)]">How to Earn Coins</h4>
                        <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5 font-bold">Standard Contributor Tasks</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-500 uppercase tracking-wider font-mono">
                        Earn
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {[
                        { id: 'login', title: 'Login Today', points: 10, done: missionLogin, setDone: setMissionLogin },
                        { id: 'assignment', title: 'Order 1 Assignment', points: 10, done: missionAssignment, setDone: setMissionAssignment },
                        { id: 'payment', title: 'Payment', points: 10, done: missionDeadline, setDone: setMissionDeadline },
                        { id: 'review', title: 'Review Sharing (How we help you)', points: 10, done: missionRate, setDone: setMissionRate }
                      ].map(mission => (
                        <div 
                          key={mission.id} 
                          onClick={() => {
                            if (!mission.done) {
                              mission.setDone(true);
                              addCoins(mission.points, mission.title);
                            }
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                            mission.done 
                              ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80' 
                              : 'bg-[var(--bg-secondary)]/30 border-[var(--border-color)] hover:border-sky-500/40 hover:bg-[var(--bg-secondary)]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-base select-none ${mission.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}>
                              {mission.done ? '✅' : '⬜'}
                            </span>
                            <span className={`text-xs font-bold ${mission.done ? 'text-[var(--text-primary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                              {mission.title}
                            </span>
                          </div>
                          <span className={`text-xs font-extrabold font-mono ${mission.done ? 'text-emerald-500' : 'text-sky-500'}`}>
                            +{mission.points} Coins
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Redeem Store */}
                  <div id="redeem-store" className="p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Redeem Store</h4>
                      <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">Use your accumulated coins to purchase exclusive vouchers and benefits.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: 'Amazon Voucher', desc: '₹100 Gift Card', price: 500, emoji: '🎁' },
                        { title: 'Premium Theme', desc: 'Custom developer profile styles', price: 300, emoji: '🎨' },
                        { title: 'Free Assignment Credit', desc: 'Waiver code for one assignment', price: 1000, emoji: '📝' },
                        { title: 'Exclusive Badge', desc: 'Explorer gold contributor badge', price: 250, emoji: '🏅' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/10 hover:bg-[var(--bg-secondary)]/30 transition-all flex flex-col justify-between gap-4 shadow-sm text-left">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl select-none">{item.emoji}</span>
                            <div>
                              <h5 className="font-extrabold text-xs text-[var(--text-primary)]">{item.title}</h5>
                              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-medium leading-normal">{item.desc}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-black font-mono text-amber-500">🪙 {item.price} Coins</span>
                            <button
                              onClick={() => {
                                if (rewardCoins >= item.price) {
                                  setRewardCoins(prev => prev - item.price);
                                  pushNotification("Redeem Success", `Successfully purchased ${item.title}!`);
                                  setCoinHistory(prev => [
                                    { id: Date.now(), type: 'spend', title: `Redeemed ${item.title}`, amount: item.price, time: 'Today' },
                                    ...prev
                                  ]);
                                } else {
                                  pushNotification("Insufficient Balance", `You need ${item.price - rewardCoins} more coins to purchase this.`);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg font-extrabold text-[10.5px] cursor-pointer transition-all active:scale-95 ${
                                rewardCoins >= item.price
                                  ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-[var(--border-color)] cursor-not-allowed'
                              }`}
                            >
                              Redeem
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Coin History */}
                  <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Coin History</h4>
                      <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">Recent coins transactions details.</p>
                    </div>

                    <div className="flex flex-col gap-3 font-mono">
                      {coinHistory.length === 0 ? (
                        <div className="text-center py-6 text-[var(--text-muted)] text-[10.5px] font-bold">
                          No transactions logged yet. Complete missions to earn coins!
                        </div>
                      ) : (
                        coinHistory.map(log => (
                          <div key={log.id} className="flex justify-between items-center p-3 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-secondary)]/20 hover:bg-[var(--bg-secondary)]/40 transition-all text-xs font-semibold">
                            <div className="flex items-center gap-3 text-left">
                              <span className="text-[10px] text-[var(--text-muted)] font-bold">{log.time}</span>
                              <span className="text-[var(--text-primary)] font-bold">{log.title}</span>
                            </div>
                            <span className={`font-black ${log.type === 'earn' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {log.type === 'earn' ? '+' : '-'}{log.amount}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column (4 grid) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* 7. Level System */}
                  <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm">
                    <h4 className="font-extrabold text-[10.5px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Level System</h4>
                    <div className="flex items-center gap-3.5 py-1">
                      <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-xl select-none">
                        🏆
                      </div>
                      <div className="text-left">
                        <h5 className="font-black text-xs text-[var(--text-primary)]">Level {calculatedLevel} Explorer</h5>
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">Next level benefits details</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-xl text-[10.5px] font-semibold text-[var(--text-secondary)] flex flex-col gap-2 text-left">
                      <div className="flex justify-between font-bold">
                        <span>Next Level</span>
                        <span className="text-amber-500">{500 - currentProgressVal} Coins Needed</span>
                      </div>
                      <hr className="border-[var(--border-color)]/50 my-1" />
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 select-none">✔</span>
                        <span>Bronze Profile Frame</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 select-none">✔</span>
                        <span>Faster Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 select-none">✔</span>
                        <span>New Badge</span>
                      </div>
                    </div>
                  </div>

                  {/* 8. Streak Section */}
                  <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm text-left">
                    <h4 className="font-extrabold text-[10.5px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Streak Section</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-rose-500 flex items-center gap-1.5">
                        🔥 {rewardStreak} Day Streak
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold font-mono">Next Reward: 20 Days</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-bold font-mono">
                        <span>Reward: +250 Coins</span>
                        <span>0% Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Achievements */}
                  <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm text-left">
                    <h4 className="font-extrabold text-[10.5px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Achievements</h4>

                    <div className="flex flex-col gap-3">
                      {[
                        { title: 'First Assignment', desc: 'Completed', medal: '🥉', percent: 100 },
                        { title: '10 Assignments', desc: 'Completed', medal: '🥈', percent: 100 },
                        { title: '100 Assignments', desc: '60%', medal: '🥇', percent: 60 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-2.5 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-secondary)]/15">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <span className="text-base select-none">{item.medal}</span>
                              <span className="text-[10.5px] font-bold text-[var(--text-primary)]">{item.title}</span>
                            </span>
                            <span className="text-[9.5px] text-[var(--text-muted)] font-mono font-bold">{item.desc}</span>
                          </div>
                          {item.percent < 100 && (
                            <div className="h-1 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.percent}%` }}></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 9. Leaderboard */}
                  <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm text-left">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-[10.5px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Leaderboard</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/25 bg-amber-500/5 text-amber-500 font-mono">500+ Club</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {(() => {
                        const leaderboardData = [];
                        if (user) {
                          leaderboardData.push({
                            rank: 1,
                            name: `${user.name} (You)`,
                            coins: rewardCoins,
                            rewards: dynamicRewards,
                            avatar: "⭐",
                            isUser: true
                          });
                        }

                        if (leaderboardData.length === 0) {
                          return (
                            <div className="text-center py-4 text-[var(--text-muted)] text-[10px] font-bold">
                              No contributors found
                            </div>
                          );
                        }

                        return leaderboardData.map((student, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border bg-sky-500/5 border-sky-500/20 transition-all">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-mono font-black text-sky-500 w-4 text-center">#{student.rank}</span>
                              <span className="text-sm select-none">{student.avatar}</span>
                              <div className="text-left">
                                <span className="text-[11px] font-bold block text-sky-500">{student.name}</span>
                                <span className="text-[9px] text-[var(--text-muted)] font-semibold font-mono">{student.coins.toLocaleString()} Coins</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-md font-mono border border-amber-500/10">
                                🎁 {student.rewards} Card{student.rewards !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                    
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10px] font-bold text-amber-600 dark:text-amber-500 text-center font-mono mt-1">
                      Earn 500 Coins to get your next Reward Card!
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'profile' && (
          <div className="animate-fade-in py-6 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col gap-6 text-left">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Profile Details & Community Stats */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                
                {/* Profile Card */}
                <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm">
                  <div className="flex flex-col items-center text-center gap-3">
                    {/* LeetCode style user avatar placeholder */}
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] flex items-center justify-center text-slate-400 shadow-inner">
                      <User size={38} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[var(--text-primary)] leading-tight">
                        {user ? user.name : 'Username'}
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono font-medium">
                        @{user ? user.name.toLowerCase().replace(/\s+/g, '_') : 'username'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-secondary)] border-y border-[var(--border-color)] py-2.5 my-1">
                    <span className="text-[11px] font-mono">Rank: <span className="text-[var(--text-primary)]">{(user ? user.rank : 0).toLocaleString()}</span></span>
                    <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">Active</span>
                  </div>

                  <div className="flex justify-around text-center text-xs font-semibold text-[var(--text-secondary)] my-0.5">
                    <div>
                      <div className="text-sm font-black text-[var(--text-primary)]">{user ? (user.following || 0) : 0}</div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Following</div>
                    </div>
                    <div className="w-[1px] h-6 bg-[var(--border-color)]"></div>
                    <div>
                      <div className="text-sm font-black text-[var(--text-primary)]">{user ? (user.followers || 0) : 0}</div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Followers</div>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => pushNotification("Feature Info", "Profile editing is currently locked.")}
                    className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10.5px] rounded-xl border border-emerald-500/15 transition-all cursor-pointer text-center font-heading"
                  >
                    Edit Profile
                  </button>

                  <div className="flex flex-col gap-2.5 text-[11px] text-[var(--text-secondary)] font-medium pt-2 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>India</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-500 hover:text-rose-600 cursor-pointer w-max" onClick={handleLogout}>
                      <span>🚪</span>
                      <span className="font-bold">Logout</span>
                    </div>
                  </div>
                </div>

                {/* Community Stats Card */}
                <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm">
                  <h4 className="font-bold text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">Community Stats</h4>
                  <div className="flex flex-col gap-4.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-3">
                        <span className="text-lg select-none">👀</span>
                        <span>Views</span>
                      </span>
                      <span className="text-sm font-black text-[var(--text-primary)]">
                        0 <span className="text-[10.5px] text-[var(--text-muted)] font-medium ml-1.5">last week 0</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-3">
                        <span className="text-lg select-none">✔️</span>
                        <span>Assignment</span>
                      </span>
                      <span className="text-sm font-black text-[var(--text-primary)]">
                        0 <span className="text-[10.5px] text-[var(--text-muted)] font-medium ml-1.5">last week 0</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-3">
                        <span className="text-lg select-none">💬</span>
                        <span>Discuss</span>
                      </span>
                      <span className="text-sm font-black text-[var(--text-primary)]">
                        0 <span className="text-[10.5px] text-[var(--text-muted)] font-medium ml-1.5">last week 0</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-3">
                        <span className="text-lg select-none">⭐</span>
                        <span>Reputation</span>
                      </span>
                      <span className="text-sm font-black text-[var(--text-primary)]">
                        0 <span className="text-[10.5px] text-[var(--text-muted)] font-medium ml-1.5">last week 0</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: LeetCode solve summary, badge status, heatmap, submissions */}
              <div className="lg:col-span-9 flex flex-col gap-5">
                
                {/* Row 1 Grid: Solve Count & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                  
                  {/* Solve Count Card */}
                  <div className="sm:col-span-7 p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex items-center justify-between gap-6 shadow-sm">
                    
                    {/* SVG Circular Donut Chart */}
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Base Circle */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--border-color)" strokeWidth="2.5"></circle>
                        {/* Orders Circle (Blue) */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#0ea5e9" 
                          strokeWidth="2.5" 
                          strokeDasharray={`${user ? user.orders : 0} ${100 - (user ? user.orders : 0)}`} 
                          strokeDashoffset="100"
                        ></circle>
                        {/* Contributions Circle (Purple) */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#a855f7" 
                          strokeWidth="2.5" 
                          strokeDasharray={`${user ? (contributors.find(c => c.name.toLowerCase() === user.name.toLowerCase())?.uploads || 0) : 0} ${100 - (user ? (contributors.find(c => c.name.toLowerCase() === user.name.toLowerCase())?.uploads || 0) : 0)}`} 
                          strokeDashoffset={`${100 - (user ? user.orders : 0)}`}
                        ></circle>
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-[var(--text-primary)] leading-tight">{user ? user.orders : 0}</span>
                        <span className="text-[9px] text-sky-500 font-bold mt-0.5 uppercase tracking-wider">Orders</span>
                      </div>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="flex-grow flex flex-col gap-3 text-left">
                      {/* Orders */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10.5px] font-bold">
                          <span className="text-sky-500">Orders</span>
                          <span className="text-[var(--text-primary)]">{user ? user.orders : 0} <span className="text-[9.5px] text-[var(--text-muted)] font-medium">/ 1000</span></span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min((user ? user.orders : 0) * 100 / 1000, 100)}%` }}></div>
                        </div>
                      </div>
                      {/* Contributions */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10.5px] font-bold">
                          <span className="text-purple-500">Contributions</span>
                          <span className="text-[var(--text-primary)]">{user ? (contributors.find(c => c.name.toLowerCase() === user.name.toLowerCase())?.uploads || 0) : 0} <span className="text-[9.5px] text-[var(--text-muted)] font-medium">/ 1000</span></span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((user ? (contributors.find(c => c.name.toLowerCase() === user.name.toLowerCase())?.uploads || 0) : 0) * 100 / 1000, 100)}%` }}></div>
                        </div>
                      </div>
                      {/* Blank / Placeholder Spacer */}
                      <div className="flex flex-col gap-1 select-none opacity-0 pointer-events-none">
                        <div className="flex justify-between text-[10.5px] font-bold">
                          <span>Placeholder</span>
                          <span>0</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                          <div className="h-full bg-slate-200 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Badges Card */}
                  <div className="sm:col-span-5 p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col justify-between gap-3 shadow-sm text-left min-h-[125px]">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Badges</span>
                      <span className="text-xs font-black text-[var(--text-primary)]">0</span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center py-2.5">
                      <p className="text-[10.5px] text-[var(--text-muted)] font-bold">No badges unlocked yet</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-1 font-medium">Badges you earn will appear here.</p>
                    </div>
                  </div>

                </div>

                {/* Row 2: Heatmap Calendar */}
                {(() => {
                  const userOrdersCount = user ? user.orders : 0;
                  const userContribsCount = user ? (contributors.find(c => c.name.toLowerCase() === user.name.toLowerCase())?.uploads || 0) : 0;
                  const totalSubmissions = userOrdersCount + userContribsCount;
                  
                  // Compute deterministic set of indexes to light up based on totalSubmissions
                  const activeIndices = new Set();
                  for (let s = 0; s < totalSubmissions; s++) {
                    const idx = (s * 101) % 365;
                    activeIndices.add(idx);
                  }
                  
                  return (
                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm text-left">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <h4 className="font-bold text-xs text-[var(--text-primary)]">{totalSubmissions} submissions in the past one year</h4>
                        <div className="flex gap-4 text-[10.5px] font-semibold text-[var(--text-secondary)] font-mono">
                          <span>Total active days: <span className="text-emerald-500 font-bold">{totalSubmissions}</span></span>
                          <span>•</span>
                          <span>Max streak: <span className="text-emerald-500 font-bold">{totalSubmissions}</span></span>
                        </div>
                      </div>

                      {/* LeetCode Heatmap Grid Grid */}
                      <div className="overflow-x-auto w-full pb-2">
                        <div className="flex gap-1.5 min-w-[650px] justify-between text-[8px] font-mono text-[var(--text-muted)] font-bold mb-1 px-1">
                          {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, idx) => (
                            <span key={`${m}-${idx}`} className="w-[38px] text-center">{m}</span>
                          ))}
                        </div>

                        <div className="grid grid-flow-col grid-rows-7 gap-[3.5px] min-w-[650px]">
                          {(() => {
                            const cells = [];
                            // Generate 365 squares
                            for (let i = 0; i < 365; i++) {
                              let opacityClass = "bg-slate-100 dark:bg-slate-900 border border-slate-200/20"; // 0 submissions
                              
                              if (activeIndices.has(i)) {
                                // Determine intensity based on index to make it look organic
                                if (i % 3 === 0) {
                                  opacityClass = "bg-emerald-500 border border-emerald-500/30"; // deep green
                                } else if (i % 3 === 1) {
                                  opacityClass = "bg-emerald-500/70 border border-emerald-500/20"; // medium green
                                } else {
                                  opacityClass = "bg-emerald-500/40 border border-emerald-500/10"; // light green
                                }
                              }

                              cells.push(
                                <div 
                                  key={i} 
                                  className={`w-2.5 h-2.5 rounded-sm transition-colors duration-300 ${opacityClass}`}
                                  title={`Day ${i}: Activity level calculated`}
                                ></div>
                              );
                            }
                            return cells;
                          })()}
                        </div>

                        <div className="flex justify-end items-center gap-1.5 mt-4 text-[9px] font-mono text-[var(--text-muted)] px-1">
                          <span>Less</span>
                          <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-900"></div>
                          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20"></div>
                          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40"></div>
                          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70"></div>
                          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
                          <span>More</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Row 3: Submissions List */}
                <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-slate-950 flex flex-col gap-4 shadow-sm text-left">
                  
                  {/* Accepted submissions tabs */}
                  <div className="flex border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] gap-4 sm:gap-6 pb-2.5 flex-wrap">
                    {[
                      { id: 'all', name: 'All', icon: <ListChecks size={13} /> },
                      { id: 'recent', name: 'Recent Orders', icon: <FileText size={13} /> },
                      { id: 'active', name: 'Active', icon: <Clock size={13} /> },
                      { id: 'delivered', name: 'Delivered', icon: <CheckSquare size={13} /> }
                    ].map(tab => {
                      const isActive = activeSubmissionsTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSubmissionsTab(tab.id)}
                          className={`flex items-center gap-1.5 pb-2.5 px-1 transition-all select-none border-b-2 cursor-pointer font-bold ${
                            isActive 
                              ? 'text-sky-500 border-sky-500' 
                              : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {tab.icon}
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 text-xs font-semibold text-[var(--text-secondary)]">
                    {(() => {
                      const filteredOrders = dashboardActiveOrders.filter(order => {
                        if (activeSubmissionsTab === 'all') return true;
                        if (activeSubmissionsTab === 'recent') return true;
                        if (activeSubmissionsTab === 'active') {
                          return order.status === 'Pending' || order.status === 'In Progress' || order.status === 'Under Review';
                        }
                        if (activeSubmissionsTab === 'delivered') {
                          return order.status === 'Delivered';
                        }
                        return true;
                      });

                      if (filteredOrders.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center text-center py-6 text-[var(--text-muted)]">
                            <span className="text-xl mb-1 select-none">📦</span>
                            <p className="font-bold text-[10.5px]">No orders in this tab</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-0.5 font-medium">Any matching orders will appear here.</p>
                          </div>
                        );
                      }

                      return filteredOrders.map((order, idx) => {
                        const deadlineItem = dashboardDeadlines.find(d => d.orderId === order.id);
                        const deadlineDateText = deadlineItem 
                          ? new Date(deadlineItem.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'No deadline';
                        
                        return (
                          <div key={order.id || idx} className="flex justify-between items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)]/60 transition-all text-left">
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded font-mono">{order.id}</span>
                              <span className="text-[var(--text-primary)] font-bold">{order.subject}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[10.5px] text-[var(--text-muted)] font-mono">
                              <span className="text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded text-[9.5px] font-bold">{order.status}</span>
                              <span>{deadlineDateText}</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* ═══════════════════════════════════════════ */}
      {/* FOOTER SECTION                              */}
      {/* ═══════════════════════════════════════════ */}
      <footer className="footer bg-[var(--bg-secondary)] border-t border-[var(--border-color)] mt-20 py-10 px-6 text-center text-xs text-[var(--text-muted)] select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-medium">
          <span>&copy; 2026 TSEC Assignment Hub. Built for Thakur Shyamnarayan Engineering College.</span>
          <span className="font-mono text-[10px]">&quot;Everything You Need for College, All in One Place.&quot;</span>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════ */}
      {/* INTERACTIVE DETAILS MODAL VIEW               */}
      {/* ═══════════════════════════════════════════ */}
      {activeDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4.5 border-b border-[var(--border-color)] flex justify-between items-center shrink-0 bg-[var(--bg-secondary)]/50">
              <div>
                <h3 className="font-extrabold text-sm text-[var(--text-primary)] font-heading tracking-tight">{activeDetail.title}</h3>
                <span className="text-[10px] text-[var(--text-secondary)] font-medium mt-1 block">{activeDetail.subject} • {activeDetail.type}</span>
              </div>
              <button 
                onClick={() => setActiveDetail(null)} 
                className="p-1.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer"
              >
                <X size={16}/>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* PDF Canvas Preview */}
                <div className="md:col-span-7 flex flex-col gap-3">
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 flex flex-col gap-3 shadow-inner">
                    
                    {/* Document Viewer Toolbar */}
                    <div className="flex justify-between items-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-2 text-[10px] text-[var(--text-secondary)] flex-wrap gap-2 shadow-sm font-semibold select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded font-mono text-[9px] font-bold">PDF</span>
                        <span>DOCUMENT PREVIEW</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))} className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-primary)] cursor-pointer"><ZoomOut size={12}/></button>
                          <span className="font-mono text-[9px] w-10 text-center">{pdfZoom}%</span>
                          <button onClick={() => setPdfZoom(Math.min(150, pdfZoom + 10))} className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-primary)] cursor-pointer"><ZoomIn size={12}/></button>
                        </div>
                        <div className="w-px h-3.5 bg-[var(--border-color)]"></div>
                        <button className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-primary)] cursor-pointer" onClick={() => alert("Simulation zoom set to fit page bounds.")}><Maximize2 size={12}/></button>
                        <button className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-primary)] cursor-pointer" onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Share reference link copied to clipboard!"); }}><Share2 size={12}/></button>
                      </div>
                    </div>
                    
                    {/* PDF Pages container */}
                    <div className="h-72 overflow-y-auto border border-[var(--border-color)] bg-slate-400 dark:bg-slate-900 rounded-lg p-4 flex flex-col gap-4 items-center snap-y">
                      {/* Page 1 (Title Cover) */}
                      <div className="pdf-mock-page shrink-0 snap-start" style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}>
                        <div className="pdf-mock-page__watermark">TSEC ARCHIVE</div>
                        <div className="border-b border-slate-100 pb-2 mb-4 text-center text-[7px] font-mono tracking-widest text-slate-400 font-bold">THAKUR SHYAMNARAYAN ENGINEERING COLLEGE</div>
                        <div className="flex-grow flex flex-col justify-center items-center text-center gap-3">
                          <span className="text-3xl block">📄</span>
                          <h4 className="font-extrabold text-[10px] text-slate-800 leading-snug tracking-tight uppercase font-heading">{activeDetail.title}</h4>
                          <span className="text-[7px] text-slate-400 font-bold tracking-wider font-mono">SEMESTER {activeDetail.sem} • {activeDetail.dept.toUpperCase()}</span>
                        </div>
                        <div className="text-[7px] font-mono text-slate-400 text-center font-bold">Page 1 of 3</div>
                      </div>
                      
                      {/* Page 2 (Content Outline) */}
                      <div className="pdf-mock-page shrink-0 snap-start text-[8px] text-slate-700 leading-relaxed" style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}>
                        <div className="pdf-mock-page__watermark">TSEC ARCHIVE</div>
                        <h5 className="font-bold text-[9px] text-slate-800 mb-2 font-heading tracking-tight border-b border-slate-100 pb-1">I. EXPERIMENT DESCRIPTION</h5>
                        <p className="font-medium">{activeDetail.desc}</p>
                        
                        <h5 className="font-bold text-[9px] text-slate-800 mt-4 mb-1.5 font-heading tracking-tight">II. CONTEXT ARCHITECTURE</h5>
                        <p className="font-medium">The syntax model implements core configurations matching syllabus specifications.</p>
                        
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg font-mono text-[7px] text-slate-800 my-2 shadow-inner">
                          {activeDetail.id === 1 ? (
                            <span>class ThreadRunner implements Runnable &#123;<br/>&nbsp;&nbsp;public void run() &#123; System.out.println(&quot;Active&quot;); &#125;<br/>&#125;</span>
                          ) : activeDetail.id === 2 ? (
                            <span>void dfs(int u) &#123;<br/>&nbsp;&nbsp;visited[u] = true;<br/>&nbsp;&nbsp;for(int v : adj[u]) if(!visited[v]) dfs(v);<br/>&#125;</span>
                          ) : activeDetail.id === 3 ? (
                            <span>SELECT student_name, score<br/>FROM tsec_grades<br/>WHERE sem = 3 ORDER BY score DESC;</span>
                          ) : (
                            <span>#include &lt;stdio.h&gt;<br/>int main() &#123; return 0; &#125;</span>
                          )}
                        </div>
                        <div className="text-[7px] font-mono text-slate-400 text-center font-bold mt-auto pt-4">Page 2 of 3</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDownload(activeDetail.id)} 
                      className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:-translate-y-0.5"
                    >
                      <Download size={14}/> Download PDF File ({activeDetail.size})
                    </button>
                  </div>
                </div>

                {/* Details Table & Metadata */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <div className="p-4.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 flex flex-col gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono block mb-2">Subject Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDetail.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-500">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden text-[10px] bg-[var(--bg-primary)]">
                      {[
                        { label: "Syllabus Module", val: `Semester ${activeDetail.sem}` },
                        { label: "Department", val: activeDetail.dept },
                        { label: "Course Teacher", val: activeDetail.teacher || "N/A" },
                        { label: "Contributor Uploader", val: activeDetail.uploadedBy },
                        { label: "Upload Registered", val: activeDetail.date },
                        { label: "Total Downloads", val: `${activeDetail.downloads} times` }
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between p-3 border-b border-[var(--border-color)]/60 last:border-0 font-medium">
                          <span className="text-[var(--text-secondary)]">{row.label}</span>
                          <span className="font-bold text-[var(--text-primary)]">{row.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Comments / Reviews sub-view */}
              <div className="mt-6 border-t border-[var(--border-color)] pt-5">
                <div className="flex border-b border-[var(--border-color)] gap-5 mb-4 text-[10px] font-bold uppercase font-mono tracking-wider select-none">
                  <button 
                    onClick={() => setDetailModalTab('preview')} 
                    className={`pb-2.5 cursor-pointer font-bold ${
                      detailModalTab === 'preview' ? 'text-sky-500 border-b-2 border-sky-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Ratings & Reviews ({activeDetail.reviews?.length || 0})
                  </button>
                  <button 
                    onClick={() => setDetailModalTab('comments')} 
                    className={`pb-2.5 cursor-pointer font-bold ${
                      detailModalTab === 'comments' ? 'text-sky-500 border-b-2 border-sky-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Doubts Thread ({activeDetail.comments?.length || 0})
                  </button>
                </div>

                {detailModalTab === 'preview' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <form onSubmit={handleAddReview} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">Rate this file:</span>
                        <div className="flex gap-1 text-yellow-500 cursor-pointer">
                          {[1,2,3,4,5].map(s => (
                            <span 
                              key={s} 
                              onClick={() => setReviewStars(s)} 
                              className={`text-sm ${s <= reviewStars ? 'text-yellow-500 font-bold' : 'text-slate-300 dark:text-slate-700'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          required 
                          type="text" 
                          placeholder="Write brief feedback about accuracy and format..." 
                          value={reviewContent} 
                          onChange={(e) => setReviewContent(e.target.value)} 
                          className="p-2.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-sky-500 flex-grow"
                        />
                        <button type="submit" className="py-2 px-5 bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Submit</button>
                      </div>
                    </form>

                    <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto">
                      {activeDetail.reviews?.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)] font-medium">No reviews submitted yet. Be the first!</p>
                      ) : (
                        activeDetail.reviews?.map((r, i) => (
                          <div key={i} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/25 text-xs flex flex-col gap-1.5">
                            <div className="flex justify-between font-bold">
                              <span className="text-[var(--text-primary)]">{r.author}</span>
                              <span className="text-yellow-500 font-bold">{"★".repeat(r.stars)}</span>
                            </div>
                            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{r.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {detailModalTab === 'comments' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto">
                      {activeDetail.comments?.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)] font-medium py-2">No doubts registered on this folder yet.</p>
                      ) : (
                        activeDetail.comments?.map((c, i) => (
                          <div key={i} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-xs flex flex-col gap-1.5">
                            <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-bold font-mono">
                              <span>{c.author.toUpperCase()}</span>
                              <span>{c.date}</span>
                            </div>
                            <p className="text-[var(--text-primary)] font-medium leading-normal">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input 
                        required 
                        type="text" 
                        placeholder="Type doubt question for peers..." 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        className="p-3 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] outline-none focus:border-sky-500 w-full"
                      />
                      <button type="submit" className="py-3 px-5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg cursor-pointer">Post</button>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* AUTHENTICATION MODALS                       */}
      {/* ═══════════════════════════════════════════ */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleLogin} className="w-full max-w-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm font-heading uppercase tracking-wider text-[var(--text-primary)]">Student Sign In</h3>
              <button type="button" onClick={() => setLoginModalOpen(false)} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-pointer"><X size={14}/></button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Email Address</label>
              <input 
                required 
                type="email" 
                placeholder="e.g. admin@tsec.edu or student@tsec.edu" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className="p-2.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Secret Key / Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                value={loginPass} 
                onChange={(e) => setLoginPass(e.target.value)} 
                className="p-2.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-sky-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer transition-all active:scale-95 mt-2"
            >
              Sign In Session
            </button>
          </form>
        </div>
      )}

      {signupModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSignup} className="w-full max-w-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm font-heading uppercase tracking-wider text-[var(--text-primary)]">Student Registration</h3>
              <button type="button" onClick={() => setSignupModalOpen(false)} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-pointer"><X size={14}/></button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Full Name</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Aditya Sen" 
                value={signupName} 
                onChange={(e) => setSignupName(e.target.value)} 
                className="p-2.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Email Address</label>
              <input 
                required 
                type="email" 
                placeholder="e.g. aditya.sen@tsec.edu" 
                value={signupEmail} 
                onChange={(e) => setSignupEmail(e.target.value)} 
                className="p-2.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                value={signupPass} 
                onChange={(e) => setSignupPass(e.target.value)} 
                className="p-2.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-sky-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer transition-all active:scale-95 mt-2"
            >
              Register Account
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
