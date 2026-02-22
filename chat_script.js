/**
 * chat_script.js - Final Integrated Version
 */

// --- UI Element Selectors ---
const searchInput = document.getElementById('userSearch');
const resultsContainer = document.getElementById('search-results');
const userList = document.getElementById('userList');
const emptyState = document.getElementById('empty-state');
const activeChat = document.getElementById('active-chat');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatHeaderName = document.getElementById('chat-header-name');
const chatHeaderImg = document.getElementById('chat-header-img');
const requestBar = document.getElementById('request-actions');

let currentRecipientId = null; 
let currentTab = 'accepted'; 

/**
 * 1. SEARCH LOGIC
 */
searchInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length < 1) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
    }

    const { data: users, error } = await _supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchTerm}%`)
        .limit(5);

    if (!error) renderSearchResults(users);
});

function renderSearchResults(users) {
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'block';
    
    if (users.length === 0) {
        resultsContainer.innerHTML = '<div class="search-item" style="padding:10px; color:gray;">No users found</div>';
        return;
    }

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'search-item';
        div.style = "display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-bottom:1px solid #eee;";
        div.innerHTML = `
            <div style="width:30px; height:30px; background:#ddd; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px;">
                ${user.username.charAt(0).toUpperCase()}
            </div>
            <span>${user.username}</span>
        `;
        div.onclick = () => {
            startChatWith(user, 'accepted'); 
            resultsContainer.style.display = 'none';
            searchInput.value = '';
        };
        resultsContainer.appendChild(div);
    });
}

/**
 * 2. CHAT WINDOW & HISTORY
 */
async function startChatWith(user, tabType) {
    currentRecipientId = user.id;
    const { data: { user: me } } = await _supabase.auth.getUser();
    
    if (emptyState) emptyState.style.display = 'none';
    activeChat.style.display = 'flex';
    chatHeaderName.innerText = user.username;

    // FIX: Check if we have EVER accepted this person (Persistent connection check)
    const { data: alreadyAccepted } = await _supabase
        .from('messages')
        .select('id')
        .or(`and(sender_id.eq.${me.id},recipient_id.eq.${user.id}),and(sender_id.eq.${user.id},recipient_id.eq.${me.id})`)
        .eq('status', 'accepted')
        .limit(1);

    if (alreadyAccepted && alreadyAccepted.length > 0) {
        requestBar.style.display = 'none';
    } else {
        // Only show bar if I am the RECIPIENT of a 'request' message
        const { data: requestMsg } = await _supabase
            .from('messages')
            .select('status')
            .eq('sender_id', user.id)
            .eq('recipient_id', me.id)
            .eq('status', 'request')
            .limit(1);

        if (requestMsg && requestMsg.length > 0) {
            showRequestBar(user);
        } else {
            requestBar.style.display = 'none';
        }
    }

    loadChatHistory(user.id);
}

async function loadChatHistory(recipientId) {
    const { data: { user: me } } = await _supabase.auth.getUser();
    
    const { data: messages, error } = await _supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${me.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${me.id})`)
        .order('created_at', { ascending: true });

    chatMessages.innerHTML = '';
    if (messages) {
        messages.forEach(msg => {
            renderMessage(msg, me.id);
            if (msg.recipient_id === me.id && !msg.is_seen) {
                markAsSeen(msg.id);
            }
        });
    }
}

/**
 * 3. SENDING & REAL-TIME
 */
async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentRecipientId) return;

    const { data: { user: me } } = await _supabase.auth.getUser();

    // Check if conversation is already accepted to maintain status
    const { data: conn } = await _supabase
        .from('messages')
        .select('status')
        .or(`and(sender_id.eq.${me.id},recipient_id.eq.${currentRecipientId}),and(sender_id.eq.${currentRecipientId},recipient_id.eq.${me.id})`)
        .eq('status', 'accepted')
        .limit(1);

    const { error } = await _supabase.from('messages').insert([{ 
        text: text, 
        sender_id: me.id, 
        recipient_id: currentRecipientId,
        username: localStorage.getItem('username') || 'Anonymous', 
        recipient_username: chatHeaderName.innerText, 
        status: (conn && conn.length > 0) ? 'accepted' : 'request',
        is_seen: false
    }]);

    if (!error) {
        messageInput.value = '';
        loadChatHistory(currentRecipientId);
        loadSidebar(currentTab);
    }
}

// Global Listener for Database Changes
_supabase
    .channel('chat_updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, async (payload) => {
        const { data: { user: me } } = await _supabase.auth.getUser();
        const msg = payload.new || payload.old;

        // If currently talking to this person, update chat window
        if (currentRecipientId && 
           ((msg.sender_id === me.id && msg.recipient_id === currentRecipientId) ||
            (msg.sender_id === currentRecipientId && msg.recipient_id === me.id))) {
            
            if (payload.eventType === 'INSERT') {
                renderMessage(msg, me.id);
            } else {
                loadChatHistory(currentRecipientId);
            }
        }
        // Always refresh sidebar for any message activity
        loadSidebar(currentTab);
    })
    .subscribe();

/**
 * 4. SIDEBAR & TABS
 */
async function loadSidebar(tabType = 'accepted') {
    currentTab = tabType;
    const { data: { user: me } } = await _supabase.auth.getUser();
    
    let query = _supabase.from('messages').select('*');

    if (tabType === 'accepted') {
        // PRIMARY: SENT messages OR RECEIVED messages that are 'accepted'
        query = query.or(`sender_id.eq.${me.id},and(recipient_id.eq.${me.id},status.eq.accepted)`);
    } else {
        // REQUESTS: ONLY incoming messages that are still 'request'
        query = query.eq('recipient_id', me.id).eq('status', 'request');
    }

    const { data: messages, error } = await query.order('created_at', { ascending: false });
    if (error) return;

    userList.innerHTML = '';
    const seenUsers = new Set();
    
    messages?.forEach(msg => {
        const otherUserId = (msg.sender_id === me.id) ? msg.recipient_id : msg.sender_id;
        
        if (!seenUsers.has(otherUserId)) {
            seenUsers.add(otherUserId);
            
            let displayUsername = "";
            const myName = localStorage.getItem('username') || "User";

            if (msg.sender_id === me.id && msg.recipient_id === me.id) {
                displayUsername = `${myName} (you)`;
            } else if (msg.sender_id === me.id) {
                displayUsername = msg.recipient_username || "User"; 
            } else {
                displayUsername = msg.username || "Unknown";
            }

            const item = document.createElement('div');
            item.className = 'user-chat-item';
            item.style = "padding: 15px; border-bottom: 1px solid #efefef; cursor: pointer; display: flex; align-items: center; gap: 10px;";
            
            item.innerHTML = `
                <div style="width: 40px; height: 40px; background: #0095f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                    ${displayUsername.charAt(0).toUpperCase()}
                </div>
                <div style="flex: 1; overflow: hidden;">
                    <div style="font-weight: bold;">${displayUsername}</div>
                    <div style="font-size: 0.8rem; color: gray; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${msg.sender_id === me.id ? 'You: ' : ''}${msg.text}
                    </div>
                </div>`;
            
            item.onclick = () => startChatWith({ id: otherUserId, username: displayUsername }, tabType);
            userList.appendChild(item);
        }
    });
}

function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (event) event.target.classList.add('active');
    
    const targetType = (type === 'primary') ? 'accepted' : 'request';
    loadSidebar(targetType);
}

async function acceptRequest(otherUserId) {
    const { data: { user: me } } = await _supabase.auth.getUser();

    // HANDSHAKE: Update all messages between us to 'accepted'
    const { error } = await _supabase
        .from('messages')
        .update({ status: 'accepted' })
        .or(`and(sender_id.eq.${otherUserId},recipient_id.eq.${me.id}),and(sender_id.eq.${me.id},recipient_id.eq.${otherUserId})`);

    if (!error) {
        requestBar.style.display = 'none';
        loadSidebar('accepted'); 
        loadChatHistory(otherUserId);
    }
}

async function blockUser(targetId) {
    if (!confirm("Block and delete conversation?")) return;
    const { data: { user: me } } = await _supabase.auth.getUser();
    
    await _supabase.from('messages').delete()
        .or(`and(sender_id.eq.${me.id},recipient_id.eq.${targetId}),and(sender_id.eq.${targetId},recipient_id.eq.${me.id})`);
    
    activeChat.style.display = 'none';
    loadSidebar(currentTab);
}

function showRequestBar(user) {
    requestBar.style.display = 'block';
    requestBar.style.padding = '15px';
    requestBar.style.background = '#f9f9f9';
    requestBar.style.borderBottom = '1px solid #dbdbdb';
    requestBar.style.textAlign = 'center';

    requestBar.innerHTML = `
        <p style="margin-bottom: 10px; font-size: 0.9rem;"><strong>${user.username}</strong> wants to connect.</p>
        <div style="display: flex; justify-content: center; gap: 10px;">
            <button onclick="acceptRequest('${user.id}')" style="background:#0095f6; color:white; border:none; padding:8px 20px; border-radius:4px; font-weight:bold; cursor:pointer;">Accept</button>
            <button onclick="blockUser('${user.id}')" style="background:none; border:none; color:#ed4956; font-weight:bold; cursor:pointer;">Block</button>
        </div>
    `;
}

/**
 * 5. UI HELPERS
 */
function renderMessage(msg, myId) {
    const isMe = msg.sender_id === myId;
    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const seenStatus = isMe ? (msg.is_seen ? '✓✓' : '✓') : '';

    const div = document.createElement('div');
    div.style = `display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 12px;`;

    div.innerHTML = `
        <div style="max-width: 75%; padding: 10px 14px; border-radius: 18px; 
                    background: ${isMe ? '#0095f6' : '#efefef'}; 
                    color: ${isMe ? 'white' : 'black'}; font-size: 0.9rem;">
            <span>${msg.text}</span>
            <div style="display:flex; justify-content:flex-end; gap:5px; font-size:0.6rem; opacity:0.7; margin-top:4px;">
                <span>${time}</span> <span>${seenStatus}</span>
            </div>
        </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function markAsSeen(msgId) {
    await _supabase.from('messages').update({ is_seen: true }).eq('id', msgId);
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    loadSidebar('accepted');
    messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
});