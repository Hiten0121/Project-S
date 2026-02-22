// --- Supabase Setup ---
const supabaseUrl = 'https://safklrqukcpjyiwhnfsh.supabase.co';
const supabaseKey = 'sb_publishable_MSnhzCA-8Lxu_yGmNdoBvw_jsJ1oTa_';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- Firebase Setup ---
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_KEY",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of your config
};
firebase.initializeApp(firebaseConfig);
const _db = firebase.firestore();

// --- Unified Database Object ---
const DB = {
    // SQL: Handle Account Creation
    async registerUser(username, email, password) {
        const { data, error } = await _supabase
            .from('users')
            .insert([{ username, email, password }]);
        return { data, error };
    },

    // NoSQL: Handle Real-time Chat
    sendMessage(chatId, messageData) {
        return _db.collection('chats').doc(chatId).collection('messages').add({
            ...messageData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    // Bridge: Get user from SQL and their posts from NoSQL
    async getProfile(username) {
        const sqlProfile = await _supabase.from('users').select('*').eq('username', username).single();
        const nosqlPosts = await _db.collection('posts').where('author', '==', username).get();
        
        return {
            profile: sqlProfile.data,
            posts: nosqlPosts.docs.map(doc => doc.data())
        };
    }
};