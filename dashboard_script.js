// // document.addEventListener('DOMContentLoaded', () => {
// //     const feed = document.getElementById('feed-container');
// //     const displayUser = document.getElementById('display-username');
// //     const profileIcon = document.getElementById('profileIcon');
// //     const userInitial = document.getElementById('userInitial');

// //     // 1. GET LOGGED IN USER DATA
// //     const savedUser = localStorage.getItem('username');

// //     if (!savedUser) {
// //         // If no user is found, redirect back to login
// //         window.location.href = "index.html";
// //         return;
// //     }

// //     // 2. UPDATE UI WITH USER DATA
// //     if (displayUser) displayUser.innerText = savedUser;
    
// //     // Set Profile Initials (e.g., "A" for Admin)
// //     const initial = savedUser.charAt(0).toUpperCase();
// //     if (profileIcon) profileIcon.innerHTML = `<span>${initial}</span>`;
// //     if (userInitial) userInitial.innerHTML = `<span>${initial}</span>`;


// //     // 3. POST GENERATOR FUNCTION
// //     function createPost(index) {
// //         const post = document.createElement('article');
// //         post.className = 'post';
// //         post.innerHTML = `
// //             <div class="post-header">
// //                 <div class="user-info">
// //                     <div class="mini-profile"></div>
// //                     <strong>User_${index}</strong>
// //                 </div>
// //                 <span>•••</span>
// //             </div>
// //             <div class="post-image">
// //                 <p style="color: #999">Dynamic Post Content #${index}</p>
// //             </div>
// //             <div class="post-actions">
// //                 <span class="like-btn" style="cursor:pointer;" onclick="toggleLike(this)">🤍</span> 
// //                 <span>💬</span> 
// //                 <span>✈️</span>
// //             </div>
// //             <div class="post-details">
// //                 <p><strong>User_${index}</strong> Just another day in the code! #webdev #${index}</p>
// //                 <span class="post-time">${index} HOURS AGO</span>
// //             </div>
// //         `;
// //         return post;
// //     }

// //     // 4. INITIAL FEED LOAD (5 Posts)
// //     for(let i=1; i<=5; i++) {
// //         feed.appendChild(createPost(i));
// //     }

// //     // 5. INFINITE SCROLL LOGIC
// //     window.addEventListener('scroll', () => {
// //         if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
// //             const nextIndex = feed.children.length + 1;
// //             feed.appendChild(createPost(nextIndex));
// //         }
// //     });

// //     // 6. LOGOUT FUNCTIONALITY
// //     // Click on profile icon to logout
// //     // if (profileIcon) {
// //     //     profileIcon.addEventListener('click', () => {
// //     //         if(confirm("Do you want to logout?")) {
// //     //             localStorage.removeItem('username');
// //     //             window.location.href = "index.html";
// //     //         }
// //     //     });
// //     // }
// //     /**
// //      * Logout Logic
// //      * Ends the Supabase session and redirects to the login page.
// //      */
// //     async function handleLogout() {
// //         try {
// //             // 1. Tell Supabase to invalidate the session
// //             const { error } = await _supabase.auth.signOut();
            
// //             if (error) throw error;

// //             // 2. Clear local data
// //             localStorage.removeItem('username');
            
// //             // 3. Send them back to the login page
// //             alert("Logged out successfully.");
// //             window.location.href = "login.html";

// //         } catch (error) {
// //             console.error("Error logging out:", error.message);
// //             alert("Logout failed. Please try again.");
// //         }
// //     }

// //     // 7. FOLLOW BUTTON LOGIC (Toggle text)
// //     document.querySelectorAll('.follow-btn').forEach(btn => {
// //         btn.addEventListener('click', function() {
// //             if (this.innerText === "Follow") {
// //                 this.innerText = "Following";
// //                 this.style.color = "#262626";
// //             } else {
// //                 this.innerText = "Follow";
// //                 this.style.color = "#0095f6";
// //             }
// //         });
// //     });
// // });

// // // Helper for Like Toggle
// // function toggleLike(element) {
// //     if (element.innerHTML === '🤍') {
// //         element.innerHTML = '❤️';
// //         element.style.color = 'red';
// //     } else {
// //         element.innerHTML = '🤍';
// //         element.style.color = 'black';
// //     }
// // }

// /**
//  * 1. SECURITY GATE
//  * Immediately checks if a user is actually logged in via Supabase.
//  * If no session exists, it kicks them back to the login page.
//  */
// async function checkUser() {
//     const { data: { session } } = await _supabase.auth.getSession();
//     if (!session) {
//         window.location.href = "login.html";
//     }
// }
// checkUser();

// /**
//  * 2. GLOBAL LOGOUT FUNCTION
//  * Placed outside DOMContentLoaded so the 'onclick' attribute in HTML works.
//  */
// async function handleLogout() {
//     try {
//         const { error } = await _supabase.auth.signOut();
//         if (error) throw error;

//         // Clear local storage and redirect
//         localStorage.removeItem('username');
//         alert("Logged out successfully.");
//         window.location.href = "login.html";
//     } catch (error) {
//         console.error("Error logging out:", error.message);
//         alert("Logout failed. Please try again.");
//     }
// }

// /**
//  * 3. MAIN DASHBOARD LOGIC
//  */
// document.addEventListener('DOMContentLoaded', async () => {
//     const feed = document.getElementById('feed-container');
//     const displayUser = document.getElementById('display-username');
//     const profileIcon = document.getElementById('profileIcon');

//     // Update UI with username from localStorage
//     const savedUser = localStorage.getItem('username');
//     if (savedUser) {
//         if (displayUser) displayUser.innerText = savedUser;
        
//         const initial = savedUser.charAt(0).toUpperCase();
//         if (profileIcon) profileIcon.innerHTML = `<span>${initial}</span>`;
//     }

//     // Load initial feed
//     loadRealFeed();

//     /**
//      * FETCH REAL POSTS FROM SUPABASE
//      * Joins 'posts' with 'profiles' to show usernames and avatars.
//      */
//     async function loadRealFeed() {
//         if (!feed) return;

//         const { data: posts, error } = await _supabase
//             .from('posts')
//             .select(`
//                 *,
//                 profiles (username, avatar_url)
//             `)
//             .order('created_at', { ascending: false });

//         if (error) {
//             console.error("Error loading feed:", error);
//             return;
//         }

//         // Clear placeholders and render real data
//         feed.innerHTML = ''; 
//         posts.forEach(post => {
//             const postElement = document.createElement('article');
//             postElement.className = 'post';
//             postElement.innerHTML = `
//                 <div class="post-header">
//                     <div class="user-info">
//                         <img src="${post.profiles?.avatar_url || 'https://via.placeholder.com/150'}" class="mini-profile">
//                         <strong>${post.profiles?.username || 'Unknown'}</strong>
//                     </div>
//                     <span>•••</span>
//                 </div>
//                 <div class="post-image">
//                     <img src="${post.image_url}" alt="Post Image" style="width: 100%; display: block;">
//                 </div>
//                 <div class="post-actions">
//                     <span class="like-btn" onclick="toggleLike(this)">🤍</span> 
//                     <span>💬</span> 
//                     <span>✈️</span>
//                 </div>
//                 <div class="post-details">
//                     <p><strong>${post.profiles?.username || 'User'}</strong> ${post.caption || ''}</p>
//                     <span class="post-time">${new Date(post.created_at).toLocaleDateString()}</span>
//                 </div>
//             `;
//             feed.appendChild(postElement);
//         });
//     }

//     // Infinite Scroll Logic (Simplified for demonstration)
//     window.addEventListener('scroll', () => {
//         if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
//             // In a real app, you would fetch the next "page" of data here
//         }
//     });

//     // Follow Button Delegation
//     document.addEventListener('click', (e) => {
//         if (e.target.classList.contains('follow-btn')) {
//             const btn = e.target;
//             if (btn.innerText === "Follow") {
//                 btn.innerText = "Following";
//                 btn.style.color = "#262626";
//             } else {
//                 btn.innerText = "Follow";
//                 btn.style.color = "#0095f6";
//             }
//         }
//     });
// });

// /**
//  * 4. GLOBAL UI HELPERS
//  */
// function toggleLike(element) {
//     if (element.innerHTML === '🤍') {
//         element.innerHTML = '❤️';
//         element.style.color = 'red';
//     } else {
//         element.innerHTML = '🤍';
//         element.style.color = 'black';
//     }
// }

/**
 * dashboard_script.js
 * Integrated with Supabase Profiles, Posts, and Suggestions
 */

/**
 * 1. SECURITY GATE
 */
async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = "login.html";
    }
}
checkUser();

/**
 * 2. GLOBAL LOGOUT
 */
async function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        await _supabase.auth.signOut();
        localStorage.removeItem('username');
        window.location.href = "login.html";
    }
}

/**
 * 3. MAIN INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', async () => {
    const feed = document.getElementById('feed-container');
    const displayUser = document.getElementById('display-username');
    const profileIcon = document.getElementById('profileIcon');
    const suggestionsList = document.querySelector('.suggestions-list');

    // Update UI Header with logged-in user
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
        if (displayUser) displayUser.innerText = savedUser;
        const initial = savedUser.charAt(0).toUpperCase();
        if (profileIcon) profileIcon.innerHTML = `<span>${initial}</span>`;
    }

    // Load Data
    loadRealFeed();
    loadRealSuggestions();

    /**
     * FETCH REAL POSTS
     */
    // async function loadRealFeed() {
    //     if (!feed) return;
    //     feed.innerHTML = '<p style="text-align:center; padding:20px;">Loading feed...</p>';

    //     const { data: posts, error } = await _supabase
    //         .from('posts')
    //         .select(`
    //             *,
    //             profiles:user_id (username, avatar_url)
    //         `)
    //         .order('created_at', { ascending: false });

    //     if (error) {
    //         feed.innerHTML = '<p>Error loading posts.</p>';
    //         return;
    //     }

    //     feed.innerHTML = ''; 
    //     if (posts.length === 0) {
    //         feed.innerHTML = '<p style="text-align:center; padding:40px; color:gray;">No posts yet. Be the first to post!</p>';
    //         return;
    //     }

    //     posts.forEach(post => {
    //         const postElement = document.createElement('article');
    //         postElement.className = 'post';
    //         const username = post.profiles?.username || 'Unknown';
    //         const avatar = post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${username}`;

    //         postElement.innerHTML = `
    //             <div class="post-header">
    //                 <div class="user-info">
    //                     <img src="${avatar}" class="mini-profile">
    //                     <strong>${username}</strong>
    //                 </div>
    //                 <span style="cursor:pointer;">•••</span>
    //             </div>
    //             <div class="post-image">
    //                 <img src="${post.image_url}" alt="Post Image" style="width: 100%; border-radius: 4px;">
    //             </div>
    //             <div class="post-actions">
    //                 <span class="like-btn" onclick="toggleLike(this)" style="cursor:pointer; font-size:1.5rem;">🤍</span> 
    //                 <span style="cursor:pointer; font-size:1.5rem;">💬</span> 
    //                 <span style="cursor:pointer; font-size:1.5rem;">✈️</span>
    //             </div>
    //             <div class="post-details">
    //                 <p><strong>${username}</strong> ${post.caption || ''}</p>
    //                 <span class="post-time">${formatDate(post.created_at)}</span>
    //             </div>
    //         `;
    //         feed.appendChild(postElement);
    //     });
    // }
    
    async function loadRealFeed() {
        const { data: posts, error } = await _supabase
            .from('posts')
            .select('*, profiles:user_id (username, avatar_url)')
            .order('created_at', { ascending: false });

        if (error || !posts) return;
        feed.innerHTML = ''; 
        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="user-info">
                        <img src="${post.profiles?.avatar_url || 'default-avatar.png'}" class="mini-profile">
                        <strong>${post.profiles?.username || 'User'}</strong>
                    </div>
                </div>
                <div class="post-image"><img src="${post.image_url}" style="width:100%"></div>
                <div class="post-details">
                    <p><strong>${post.profiles?.username}</strong> ${post.caption || ''}</p>
                </div>`;
            feed.appendChild(postElement);
        });
    }

    /**
     * FETCH REAL USER SUGGESTIONS
     */
    // async function loadRealSuggestions() {
    //     if (!suggestionsList) return;

    //     const { data: { user } } = await _supabase.auth.getUser();
        
    //     // Fetch users that are NOT the logged-in user
    //     const { data: profiles, error } = await _supabase
    //         .from('profiles')
    //         .select('id, username, avatar_url')
    //         .neq('id', user.id) 
    //         .limit(5);

    //     if (error || !profiles) return;

    //     suggestionsList.innerHTML = ''; 
    //     profiles.forEach(profile => {
    //         const avatar = profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`;
    //         const div = document.createElement('div');
    //         div.className = 'suggestion-item';
    //         div.style = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;";
    //         div.innerHTML = `
    //             <div style="display: flex; align-items: center; gap: 10px;">
    //                 <img src="${avatar}" class="mini-profile" style="width:32px; height:32px; border-radius:50%;">
    //                 <div>
    //                     <strong style="display:block; font-size:0.9rem;">${profile.username}</strong>
    //                     <span style="font-size:0.75rem; color:gray;">Suggested for you</span>
    //                 </div>
    //             </div>
    //             <button class="follow-btn" 
    //                     data-id="${profile.id}" 
    //                     style="background:none; border:none; color:#0095f6; font-weight:bold; cursor:pointer; font-size:0.85rem;">
    //                 Follow
    //             </button>
    //         `;
    //         suggestionsList.appendChild(div);
    //     });
    // }

    async function loadRealSuggestions() {
        const { data: { user } } = await _supabase.auth.getUser();
        const { data: profiles } = await _supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .neq('id', user.id).limit(5);

        if (!profiles || !suggestionsList) return;
        suggestionsList.innerHTML = '';
        profiles.forEach(p => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <span>${p.username}</span>
                <button class="follow-btn" onclick="followUser('${p.id}')">Follow</button>`;
            suggestionsList.appendChild(div);
        });
    }

    // Follow Button Logic (Database + UI)
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('follow-btn')) {
            const btn = e.target;
            const targetId = btn.getAttribute('data-id');
            const { data: { user } } = await _supabase.auth.getUser();

            if (btn.innerText === "Follow") {
                const { error } = await _supabase.from('followers').insert([
                    { follower_id: user.id, following_id: targetId }
                ]);
                
                if (!error) {
                    btn.innerText = "Following";
                    btn.style.color = "#262626";
                }
            } else {
                await _supabase.from('followers')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', targetId);
                    
                btn.innerText = "Follow";
                btn.style.color = "#0095f6";
            }
        }
    });
});

/**
 * 4. GLOBAL HELPERS
 */
function toggleLike(element) {
    if (element.innerHTML === '🤍') {
        element.innerHTML = '❤️';
        element.style.color = 'red';
    } else {
        element.innerHTML = '🤍';
        element.style.color = 'black';
    }
}

function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    const diffInHours = Math.floor((new Date() - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
        return diffInHours === 0 ? 'JUST NOW' : `${diffInHours} HOURS AGO`;
    }
    return date.toLocaleDateString(undefined, options).toUpperCase();
}