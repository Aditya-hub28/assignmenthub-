/* ═══════════════════════════════════════════════════════════════
   SUPABASE.JS — Unified Real & Mock Backend Layer
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial Seed Data for fallback
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
  { id: "seed-1", name: "Java Threading Assignment 5", subject: "Java Programming", dueDate: "2026-06-27T10:00:00.000Z", status: "Active" },
  { id: "seed-2", name: "DSA Graph Assignment", subject: "Data Structures & Algorithms", dueDate: "2026-06-28T12:00:00.000Z", status: "Active" },
  { id: "seed-3", name: "DBMS SQL Experiment", subject: "Database Management Systems", dueDate: "2026-06-30T17:00:00.000Z", status: "Active" },
  { id: "seed-4", name: "OS Scheduling Lab", subject: "Operating Systems", dueDate: "2026-07-02T14:30:00.000Z", status: "Active" }
];

const initialContributors = [
  { rank: 1, name: "Sneha G.", uploads: 95, downloads: 480, points: 950 },
  { rank: 2, name: "Aditya S.", uploads: 82, downloads: 420, points: 820 },
  { rank: 3, name: "Rohan K.", uploads: 78, downloads: 390, points: 780 },
  { rank: 4, name: "Snehal M.", uploads: 70, downloads: 310, points: 700 },
  { rank: 5, name: "Amit Shah", uploads: 65, downloads: 290, points: 650 },
  { rank: 20, name: "Anjali Mishra", uploads: 0, downloads: 0, points: 0 }
];

// Helper to load mock DB from localStorage
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

function uniqueValues(values) {
  return [...new Set(values.filter(value => value !== undefined && value !== null))];
}

async function syncTableRows(table, rows, keyColumn) {
  if (!isRealSupabase || !supabase) {
    return rows;
  }

  const normalizedRows = Array.isArray(rows) ? rows.filter(Boolean) : [];
  const nextKeys = uniqueValues(normalizedRows.map(row => row[keyColumn]));

  const { data: existingRows, error: fetchError } = await supabase
    .from(table)
    .select(keyColumn);
  if (fetchError) throw fetchError;

  const existingKeys = uniqueValues((existingRows || []).map(row => row[keyColumn]));
  const removedKeys = existingKeys.filter(key => !nextKeys.includes(key));

  if (removedKeys.length > 0) {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .in(keyColumn, removedKeys);
    if (deleteError) throw deleteError;
  }

  if (normalizedRows.length > 0) {
    const { error: upsertError } = await supabase
      .from(table)
      .upsert(normalizedRows, { onConflict: keyColumn });
    if (upsertError) throw upsertError;
  }

  return normalizedRows;
}

// Unified Authenticator & Database functions
export const backend = {
  // Auth Operations
  signUp: async (email, password, name, avatar = '⭐', location = 'India') => {
    if (isRealSupabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, avatar, location }
        }
      });
      if (error) throw error;
      
      // Seed a profile inside profiles table
      const profileData = {
        id: data.user.id,
        name: name,
        email: email,
        role: 'client', // Default to student
        avatar: avatar,
        location: location,
        coins: 120,
        level: 1,
        orders: 0,
        rating: 5.0,
        streak: 1,
        rank: 500,
        completed: 0,
        delivered: 0,
        onTime: 100
      };
      
      const { error: profileError } = await supabase.from('profiles').insert([profileData]);
      if (profileError) console.error("Error creating profile:", profileError);
      
      return { user: { ...data.user, ...profileData } };
    } else {
      // Mock signup
      const users = loadMockData('mock_users', []);
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) throw new Error("Email already registered.");
      
      const isWriter = email.includes('writer') || email === 'anjali@gmail.com';
      const role = isWriter ? 'writer' : 'client';
      const newUser = {
        name: name.toUpperCase(),
        email: email.toLowerCase(),
        role: role,
        avatar: avatar,
        location: location,
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
      
      users.push({ ...newUser, password });
      saveMockData('mock_users', users);
      return { user: newUser };
    }
  },

  signIn: async (email, password) => {
    if (isRealSupabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      return { user: profile };
    } else {
      // Mock login
      const users = loadMockData('mock_users', []);
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!match) {
        // Fallback for default seed accounts (e.g. aditya@gmail.com or anjali@gmail.com) if not explicitly registered
        const isWriter = email.includes('writer') || email === 'anjali@gmail.com';
        const role = isWriter ? 'writer' : 'client';
        const defaultUser = {
          name: isWriter ? 'Anjali Mishra' : 'Rahul Sharma',
          email: email.toLowerCase(),
          role: role,
          avatar: '⭐',
          location: 'India',
          coins: role === 'writer' ? 2450 : 120,
          level: role === 'writer' ? 18 : 3,
          orders: role === 'writer' ? 56 : 5,
          rating: role === 'writer' ? 4.9 : 4.5,
          streak: role === 'writer' ? 15 : 4,
          rank: role === 'writer' ? 18 : 142,
          completed: role === 'writer' ? 124 : 8,
          delivered: role === 'writer' ? 98 : 0,
          onTime: role === 'writer' ? 97 : 100
        };
        return { user: defaultUser };
      }
      return { user: match };
    }
  },

  signInWithGoogle: async () => {
    if (isRealSupabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined
        }
      });
      if (error) throw error;
      return { user: null };
    } else {
      // Mock Google Login
      const defaultGoogleUser = {
        name: "GOOGLE STUDENT",
        email: "google.student@tsec.edu",
        role: "client",
        avatar: "⭐",
        location: "India",
        coins: 120,
        level: 1,
        orders: 0,
        rating: 5.0,
        streak: 1,
        rank: 500,
        completed: 0,
        delivered: 0,
        onTime: 100
      };
      return { user: defaultGoogleUser };
    }
  },

  getProfile: async (userId) => {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
    return null;
  },

  updateProfile: async (userId, updates) => {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    return updates;
  },

  signOut: async () => {
    if (isRealSupabase) {
      await supabase.auth.signOut();
    }
  },

  // Resources DB operations
  getResources: async () => {
    if (isRealSupabase) {
      const { data, error } = await supabase.from('resources').select('*');
      if (error) throw error;
      return data;
    } else {
      return loadMockData('resources', initialResources);
    }
  },

  getPending: async () => {
    if (isRealSupabase) {
      const { data, error } = await supabase.from('pending_resources').select('*');
      if (error) throw error;
      return data;
    } else {
      return loadMockData('pending', initialPending);
    }
  },

  uploadResource: async (resource) => {
    if (isRealSupabase) {
      const { data, error } = await supabase.from('resources').insert([resource]).select();
      if (error) throw error;
      return data[0];
    } else {
      const resources = loadMockData('resources', initialResources);
      const newResource = { id: Date.now(), ...resource };
      resources.push(newResource);
      saveMockData('resources', resources);
      return newResource;
    }
  },

  addReview: async (resourceId, review) => {
    if (isRealSupabase) {
      // First get current reviews
      const { data: resource, error: getError } = await supabase
        .from('resources')
        .select('reviews')
        .eq('id', resourceId)
        .single();
      if (getError) throw getError;
      
      const currentReviews = resource.reviews || [];
      const updatedReviews = [review, ...currentReviews];
      const totalStars = updatedReviews.reduce((sum, entry) => sum + entry.stars, 0);
      const rating = parseFloat((totalStars / updatedReviews.length).toFixed(1));
      
      const { data, error } = await supabase
        .from('resources')
        .update({ reviews: updatedReviews, rating })
        .eq('id', resourceId)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const resources = loadMockData('resources', initialResources);
      const idx = resources.findIndex(r => r.id === resourceId);
      if (idx !== -1) {
        resources[idx].reviews = [review, ...(resources[idx].reviews || [])];
        const totalStars = resources[idx].reviews.reduce((sum, entry) => sum + entry.stars, 0);
        resources[idx].rating = parseFloat((totalStars / resources[idx].reviews.length).toFixed(1));
        saveMockData('resources', resources);
      }
      return resources[idx];
    }
  },

  addComment: async (resourceId, comment) => {
    if (isRealSupabase) {
      const { data: resource, error: getError } = await supabase
        .from('resources')
        .select('comments')
        .eq('id', resourceId)
        .single();
      if (getError) throw getError;
      
      const currentComments = resource.comments || [];
      const updatedComments = [...currentComments, comment];
      
      const { data, error } = await supabase
        .from('resources')
        .update({ comments: updatedComments })
        .eq('id', resourceId)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const resources = loadMockData('resources', initialResources);
      const idx = resources.findIndex(r => r.id === resourceId);
      if (idx !== -1) {
        resources[idx].comments = [...(resources[idx].comments || []), comment];
        saveMockData('resources', resources);
      }
      return resources[idx];
    }
  },

  // Deadlines DB operations
  getDeadlines: async (userId) => {
    if (isRealSupabase) {
      if (!userId || userId === 'anonymous') {
        return [];
      }
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('userId', userId);
      if (error) throw error;
      return data;
    } else {
      return loadMockData('deadlines', initialDeadlines);
    }
  },

  addDeadline: async (deadline) => {
    if (isRealSupabase) {
      const { data, error } = await supabase.from('deadlines').insert([deadline]).select();
      if (error) throw error;
      return data[0];
    } else {
      const deadlines = loadMockData('deadlines', initialDeadlines);
      const newDeadline = { id: Date.now().toString(), ...deadline };
      deadlines.push(newDeadline);
      saveMockData('deadlines', deadlines);
      return newDeadline;
    }
  },

  toggleDeadlineStatus: async (deadlineId, status) => {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('deadlines')
        .update({ status: status })
        .eq('id', deadlineId)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const deadlines = loadMockData('deadlines', initialDeadlines);
      const idx = deadlines.findIndex(d => d.id === deadlineId);
      if (idx !== -1) {
        deadlines[idx].status = status;
        saveMockData('deadlines', deadlines);
      }
      return deadlines[idx];
    }
  },

  deleteDeadline: async (deadlineId) => {
    if (isRealSupabase) {
      const { error } = await supabase
        .from('deadlines')
        .delete()
        .eq('id', deadlineId);
      if (error) throw error;
    } else {
      const deadlines = loadMockData('deadlines', initialDeadlines);
      const updated = deadlines.filter(d => d.id !== deadlineId);
      saveMockData('deadlines', updated);
    }
  },

  // Orders
  getOrders: async (userId) => {
    if (isRealSupabase) {
      if (!userId || userId === 'anonymous') {
        return [];
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('userId', userId);
      if (error) throw error;
      return data;
    } else {
      return loadMockData('active_orders', []);
    }
  },

  addOrder: async (order) => {
    if (isRealSupabase) {
      const { data, error } = await supabase.from('orders').insert([order]).select();
      if (error) throw error;
      return data[0];
    } else {
      const orders = loadMockData('active_orders', []);
      orders.push(order);
      saveMockData('active_orders', orders);
      return order;
    }
  },

  // Contributors DB operations
  getContributors: async () => {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('contributors')
        .select('*')
        .order('points', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return loadMockData('contributors', initialContributors);
    }
  },

  updateContributorPoints: async (name, points, uploads) => {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('contributors')
        .update({ points, uploads })
        .eq('name', name)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const contributors = loadMockData('contributors', initialContributors);
      const idx = contributors.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
      if (idx !== -1) {
        contributors[idx].points = points;
        contributors[idx].uploads = uploads;
        saveMockData('contributors', contributors);
      }
      return contributors[idx];
    }
  },

  // Backwards compatibility legacy save wrappers
  saveResources: async (data) => {
    if (isRealSupabase) {
      return syncTableRows('resources', data, 'id');
    }
    saveMockData('resources', data);
  },
  savePending: async (data) => {
    if (isRealSupabase) {
      return syncTableRows('pending_resources', data, 'id');
    }
    saveMockData('pending', data);
  },
  saveDeadlines: async (data) => {
    if (isRealSupabase) {
      return syncTableRows('deadlines', data, 'id');
    }
    saveMockData('deadlines', data);
  },
  saveContributors: async (data) => {
    if (isRealSupabase) {
      return syncTableRows('contributors', data, 'name');
    }
    saveMockData('contributors', data);
  }
};
