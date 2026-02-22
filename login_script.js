// document.getElementById('loginForm').addEventListener('submit', function(e) {
//     // 1. STOP the page from refreshing immediately
//     e.preventDefault(); 

//     const testUser = {
//         identifier: "admin",
//         password: "password123"
//     };

//     // Grab the inputs
//     const inputIdentifier = document.getElementById('identifier').value;
//     const inputPassword = document.getElementById('password').value;
//     const btn = document.querySelector('.login-btn');
//     const originalText = btn.innerText;

//     // 2. Immediate Feedback
//     btn.innerText = "Checking...";
//     btn.style.opacity = "0.7";
//     btn.disabled = true;

//     console.log("Attempting login with:", inputIdentifier);

//     setTimeout(() => {
//         if (inputIdentifier === testUser.identifier && inputPassword === testUser.password) {
//             localStorage.setItem('username', inputIdentifier);
//             alert("Login successful!");
//             window.location.href = "dashboard.html"; 
//         } else {
//             // 3. This is the part that handles the 'False' case
//             console.error("Login Failed");
//             alert("❌ Error: Invalid Username or Password."); 
            
//             // RESET button so the user can try again without the page refreshing
//             btn.innerText = originalText;
//             btn.style.opacity = "1";
//             btn.disabled = false;
//         }
//     }, 1200);
// });

/**
 * Login Logic
 * Connects to Supabase Auth to verify real user credentials.
 */
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    // 1. Prevent the page from refreshing
    e.preventDefault(); 

    // Grab the inputs
    const email = document.getElementById('identifier').value; // Supabase uses email for login
    const password = document.getElementById('password').value;
    const btn = document.querySelector('.login-btn');
    const originalText = btn.innerText;

    // 2. Immediate Visual Feedback
    btn.innerText = "Verifying...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    try {
        /**
         * 3. Supabase Authentication Call
         * This replaces the testUser logic with a real database check.
         */
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // 4. Handle Successful Login
        if (data.user) {
            // Fetch profile data to get the username (since Auth only stores email)
            const { data: profile } = await _supabase
                .from('profiles')
                .select('username')
                .eq('id', data.user.id)
                .single();

            // Store user info for the Dashboard
            localStorage.setItem('username', profile ? profile.username : email);
            
            alert("Login successful! Welcome back.");
            window.location.href = "dashboard.html"; 
        }

    } catch (error) {
        // 5. Handle Errors (Wrong password, user doesn't exist, etc.)
        console.error("Login Failed:", error.message);
        alert("❌ Login Error: " + error.message); 
        
        // Reset button so the user can try again
        btn.innerText = originalText;
        btn.style.opacity = "1";
        btn.disabled = false;
    }
});