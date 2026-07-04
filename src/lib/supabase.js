/* ═══════════════════════════════════════════════════════════════
   SUPABASE.JS — Real / Mock Database Layer
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial Seeds
const initialResources = [
  {
    id: 1,
    title: "Java Assignment 5 - Multi-Threading",
    subject: "Java Programming",
    sem: 3,
    dept: "Computer Engineering",
    teacher: "Prof. R. Mehta",
    type: "Assignments",
    uploadedBy: "Aditya S.",
    date: "2026-06-15",
    size: "1.4 MB",
    downloads: 142,
    rating: 4.8,
    desc: "Comprehensive assignment covering Java Multi-threading concepts including Runnable interface, Thread class, synchronization, and producer-consumer problem.",
    tags: ["Java", "Multi-Threading", "Semester 3"],
    reviews: [
      { author: "Sneha G.", stars: 5, content: "Helpful, teacher accepted my submission with this format!", tags: ["Teacher accepted", "Helpful"] },
      { author: "Rahul P.", stars: 4, content: "Easy to understand, good formatting of code blocks.", tags: ["Easy to understand", "Good formatting"] }
    ],
    comments: [
      { author: "Yash M.", text: "Can anyone explain the wait-notify mechanism in problem 3?", date: "2026-06-16" }
    ]
  },
  {
    id: 2,
    title: "DSA Notes - Graph Algorithms",
    subject: "Data Structures & Algorithms",
    sem: 3,
    dept: "Computer Engineering",
    teacher: "Dr. P. Patil",
    type: "Notes",
    uploadedBy: "Rohan K.",
    date: "2026-06-20",
    size: "3.2 MB",
    downloads: 320,
    rating: 4.9,
    desc: "Handwritten and scanned revision notes for Graph Traversals (BFS, DFS), Minimum Spanning Trees (Kruskal, Prim), and Shortest Paths (Dijkstra). Includes clean complexity tables.",
    tags: ["DSA", "Graphs", "Algorithms"],
    reviews: [
      { author: "Snehal M.", stars: 5, content: "Absolutely clear handwriting. Scored full in unit test!", tags: ["Helpful"] }
    ],
    comments: [
      { author: "Prof. R. Mehta", text: "Excellent notes! Highly recommended for mid-sems.", date: "2026-06-21" }
    ]
  },
  {
    id: 3,
    title: "DBMS Lab Manual - SQL Queries",
    subject: "Database Management Systems",
    sem: 4,
    dept: "Information Technology",
    type: "Lab Files",
    teacher: "Prof. S. Rane",
    uploadedBy: "Sneha G.",
    date: "2026-05-10",
    size: "2.1 MB",
    downloads: 85,
    rating: 4.5,
    desc: "Completed lab experiments for DDL, DML, nested queries, joins, views, and PL/SQL triggers with output screenshots.",
    tags: ["DBMS", "SQL", "Lab Manual"],
    reviews: [
      { author: "Amit M.", stars: 4, content: "Great lab manual, all queries executed perfectly in Oracle DB.", tags: ["Easy to understand"] }
    ],
    comments: []
  },
  {
    id: 4,
    title: "OS Assignment - CPU Scheduling",
    subject: "Operating Systems",
    sem: 4,
    dept: "Computer Engineering",
    teacher: "Prof. M. Shah",
    type: "Assignments",
    uploadedBy: "Amit M.",
    date: "2026-06-05",
    size: "950 KB",
    downloads: 215,
    rating: 4.6,
    desc: "Detailed numerical questions and solutions on CPU Scheduling algorithms: FCFS, SJF, SRTF, Round Robin, and Priority Scheduling.",
    tags: ["OS", "CPU Scheduling", "Semester 4"],
    reviews: [],
    comments: []
  },
  {
    id: 5,
    title: "Semester 4 PYQs - Math IV",
    subject: "Applied Mathematics IV",
    sem: 4,
    dept: "Computer Engineering",
    teacher: "N/A",
    type: "Previous Year Papers",
    uploadedBy: "Hrishikesh B.",
    date: "2026-04-18",
    size: "4.5 MB",
    downloads: 512,
    rating: 4.7,
    desc: "Previous Year Question papers for Mumbai University Mathematics-IV exam from 2021 to 2025. Covers Laplace Transforms, Complex Variables, and Probability Matrices.",
    tags: ["Maths", "PYQ", "University"],
    reviews: [
      { author: "Tanvi S.", stars: 5, content: "Superb collection. Clean PDFs.", tags: ["Helpful"] }
    ],
    comments: []
  },
  {
    id: 6,
    title: "Web Technology Lab - HTML/CSS/JS",
    subject: "Web Development",
    sem: 4,
    dept: "Information Technology",
    teacher: "Prof. K. Sen",
    type: "Lab Files",
    uploadedBy: "Rahul P.",
    date: "2026-06-11",
    size: "2.8 MB",
    downloads: 98,
    rating: 4.4,
    desc: "Comprehensive lab experiments demonstrating dynamic DOM manipulation, form validation, AJAX requests, and clean flexbox layout styling.",
    tags: ["Web Dev", "JS", "CSS"],
    reviews: [],
    comments: []
  }
];

const initialPending = [
  {
    id: 101,
    title: "Java Assignment 6 - Socket Programming",
    subject: "Java Programming",
    sem: 3,
    dept: "Computer Engineering",
    teacher: "Prof. R. Mehta",
    type: "Assignments",
    uploadedBy: "Jay R.",
    date: "2026-06-25",
    size: "1.1 MB",
    desc: "Socket programming assignment covering TCP client-server chat application and UDP packet sender.",
    tags: ["Java", "Socket Programming"]
  }
];

const initialDeadlines = [
  { id: 1, title: "Java Threading Assignment 5", subject: "Java Programming", date: "2026-06-27" },
  { id: 2, title: "DSA Graph Assignment", subject: "Data Structures & Algorithms", date: "2026-06-28" },
  { id: 3, title: "DBMS SQL Experiment", subject: "Database Management Systems", date: "2026-06-30" },
  { id: 4, title: "OS Scheduling Lab", subject: "Operating Systems", date: "2026-07-02" }
];

const initialContributors = [
  { rank: 1, name: "Sneha G.", uploads: 45, downloads: 180, points: 450 },
  { rank: 2, name: "Aditya S.", uploads: 32, downloads: 220, points: 380 },
  { rank: 3, name: "Rohan K.", uploads: 28, downloads: 120, points: 290 },
  { rank: 4, name: "Snehal M.", uploads: 20, downloads: 90, points: 210 },
  { rank: 5, name: "Prof. R. Mehta", uploads: 15, downloads: 350, points: 150 }
];

// Helper to load mock DB from localStorage safely on Client Side
function loadMockData(key, defaultData) {
  if (typeof window === "undefined") return defaultData;
  const stored = localStorage.getItem(`tsec_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultData;
    }
  }
  localStorage.setItem(`tsec_${key}`, JSON.stringify(defaultData));
  return defaultData;
}

function saveMockData(key, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`tsec_${key}`, JSON.stringify(data));
}

// Unified client-side mock wrapper mimicking Supabase behavior
export const dbMock = {
  // Resources
  getResources: async () => {
    return loadMockData('resources', initialResources);
  },
  saveResources: async (data) => {
    saveMockData('resources', data);
  },

  // Pending Queue
  getPending: async () => {
    return loadMockData('pending', initialPending);
  },
  savePending: async (data) => {
    saveMockData('pending', data);
  },

  // Deadlines
  getDeadlines: async () => {
    return loadMockData('deadlines', initialDeadlines);
  },
  saveDeadlines: async (data) => {
    saveMockData('deadlines', data);
  },

  // Contributors
  getContributors: async () => {
    return loadMockData('contributors', initialContributors);
  },
  saveContributors: async (data) => {
    saveMockData('contributors', data);
  }
};
