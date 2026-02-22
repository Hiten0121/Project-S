// // const password = document.getElementById('password');
// // const confirmPassword = document.getElementById('confirmPassword');
// // const message = document.getElementById('message');
// // const form = document.getElementById('signupForm');

// // // Real-time matching validation
// // function validatePassword() {
// //     if (confirmPassword.value === "") {
// //         message.innerText = "";
// //     } else if (password.value !== confirmPassword.value) {
// //         message.innerText = "Passwords do not match";
// //         message.style.color = "#ff4d4d";
// //     } else {
// //         message.innerText = "Passwords match!";
// //         message.style.color = "#2ecc71";
// //     }
// // }

// // password.addEventListener('keyup', validatePassword);
// // confirmPassword.addEventListener('keyup', validatePassword);

// // form.addEventListener('submit', function(e) {
// //     e.preventDefault();
    
// //     if (password.value !== confirmPassword.value) {
// //         alert("Passwords must match to proceed!");
// //         return;
// //     }

// //     // Logic for successful registration
// //     const btn = document.querySelector('.login-btn');
// //     btn.innerText = "Creating Account...";
// //     btn.disabled = true;

// //     setTimeout(() => {
// //         alert("Account created successfully!");
// //         btn.innerText = "Register";
// //         btn.disabled = false;
// //     }, 2000);
// // });

// // const signupForm = document.getElementById('signupForm');

// // signupForm.addEventListener('submit', function(e) {
// //     e.preventDefault();
    
// //     // 1. Capture the new user's data
// //     const newUsername = document.getElementById('username').value;
// //     const newEmail = document.getElementById('email').value;
// //     const password = document.getElementById('password').value;
// //     const confirmPassword = document.getElementById('confirmPassword').value;

// //     // 2. Validate passwords match
// //     if (password !== confirmPassword) {
// //         alert("Passwords do not match!");
// //         return;
// //     }

// //     // 3. Visual Feedback
// //     const btn = document.querySelector('.login-btn');
// //     btn.innerText = "Creating Account...";
// //     btn.disabled = true;

// //     // 4. Simulate saving to a database and redirecting
// //     setTimeout(() => {
// //         // Store the username so the Dashboard can welcome them
// //         localStorage.setItem('username', newUsername);
        
// //         alert("Account created successfully! Welcome to your dashboard.");
        
// //         // Redirect to the Home/Dashboard page
// //         window.location.href = "dashboard.html"; 
// //     }, 1500);
// // });

// const signupForm = document.getElementById('signupForm');
// const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirmPassword');
// const message = document.getElementById('message');

// /**
//  * 1. Real-time Password Matching Validation
//  * Provides instant feedback to the user while they type.
//  */
// function validatePassword() {
//     if (confirmPassword.value === "") {
//         message.innerText = "";
//     } else if (password.value !== confirmPassword.value) {
//         message.innerText = "Passwords do not match";
//         message.style.color = "#ff4d4d";
//     } else {
//         message.innerText = "Passwords match!";
//         message.style.color = "#2ecc71";
//     }
// }

// password.addEventListener('keyup', validatePassword);
// confirmPassword.addEventListener('keyup', validatePassword);

// /**
//  * 2. Form Submission Logic
//  * Connects to Supabase to register the user.
//  */
// // signupForm.addEventListener('submit', async function(e) {
// //     e.preventDefault();
    
// //     // Capture user input
// //     const newUsername = document.getElementById('username').value;
// //     const newEmail = document.getElementById('email').value;
// //     const userPassword = password.value;
// //     const userConfirmPassword = confirmPassword.value;

// //     // Validate passwords match before sending to server
// //     if (userPassword !== userConfirmPassword) {
// //         alert("Passwords do not match!");
// //         return;
// //     }

// //     // Visual Feedback: Disable button to prevent double-clicks
// //     const btn = document.querySelector('.login-btn');
// //     const originalBtnText = btn.innerText;
// //     btn.innerText = "Creating Account...";
// //     btn.disabled = true;

// //     try {
// //         /**
// //          * 3. Supabase Registration
// //          * We pass the username in 'options.data' so your SQL Trigger 
// //          * can find it and create your profile automatically.
// //          */
// //         const { data, error } = await _supabase.auth.signUp({
// //             email: newEmail,
// //             password: userPassword,
// //             options: {
// //                 data: {
// //                     username: newUsername,
// //                     full_name: newUsername // Defaulting full name to username
// //                 }
// //             }
// //         });

// //         if (error) throw error;

// //         // 4. Handle Success
// //         if (data.user) {
// //             // Save username to localStorage for the Dashboard welcome message
// //             localStorage.setItem('username', newUsername);
            
// //             alert("Account created successfully! Please check your email for a verification link.");
            
// //             // Redirect to dashboard (or login page)
// //             window.location.href = "dashboard.html"; 
// //         }

// //     } catch (error) {
// //         // Handle Errors (e.g., Email already exists, weak password)
// //         alert("Signup Error: " + error.message);
// //         btn.innerText = originalBtnText;
// //         btn.disabled = false;
// //     }
// // });

// // const signupForm = document.getElementById('signupForm');

// signupForm.addEventListener('submit', async function(e) {
//     // 1. STOP the form from reloading the page automatically
//     e.preventDefault(); 
    
//     // 2. Capture data
//     const newUsername = document.getElementById('username').value;
//     const newEmail = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;

//     // 3. Validation
//     if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     // 4. UI Feedback
//     const btn = document.querySelector('.login-btn');
//     const originalText = btn.innerText;
//     btn.innerText = "Creating Account...";
//     btn.disabled = true;

//     try {
//         // 5. REAL Supabase Signup
//         // We pass the username so your SQL Trigger can create the profile
//         const { data, error } = await _supabase.auth.signUp({
//             email: newEmail,
//             password: password,
//             options: {
//                 data: {
//                     username: newUsername
//                 }
//             }
//         });

//         if (error) throw error;

//         if (data.user) {
//             // Save username for the dashboard welcome message
//             localStorage.setItem('username', newUsername);
            
//             alert("Signup successful! Please verify your email.");
            
//             // 6. Only redirect AFTER success
//             window.location.href = "dashboard.html"; 
//         }

//     } catch (err) {
//         alert("Signup Error: " + err.message);
//         // Reset button so user can try again
//         btn.innerText = originalText;
//         btn.disabled = false;
//     }
// });

// const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirmPassword');
// const message = document.getElementById('message');
// const form = document.getElementById('signupForm');

// // Real-time matching validation
// function validatePassword() {
//     if (confirmPassword.value === "") {
//         message.innerText = "";
//     } else if (password.value !== confirmPassword.value) {
//         message.innerText = "Passwords do not match";
//         message.style.color = "#ff4d4d";
//     } else {
//         message.innerText = "Passwords match!";
//         message.style.color = "#2ecc71";
//     }
// }

// password.addEventListener('keyup', validatePassword);
// confirmPassword.addEventListener('keyup', validatePassword);

// form.addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     if (password.value !== confirmPassword.value) {
//         alert("Passwords must match to proceed!");
//         return;
//     }

//     // Logic for successful registration
//     const btn = document.querySelector('.login-btn');
//     btn.innerText = "Creating Account...";
//     btn.disabled = true;

//     setTimeout(() => {
//         alert("Account created successfully!");
//         btn.innerText = "Register";
//         btn.disabled = false;
//     }, 2000);
// });

// const signupForm = document.getElementById('signupForm');

// signupForm.addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     // 1. Capture the new user's data
//     const newUsername = document.getElementById('username').value;
//     const newEmail = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;

//     // 2. Validate passwords match
//     if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     // 3. Visual Feedback
//     const btn = document.querySelector('.login-btn');
//     btn.innerText = "Creating Account...";
//     btn.disabled = true;

//     // 4. Simulate saving to a database and redirecting
//     setTimeout(() => {
//         // Store the username so the Dashboard can welcome them
//         localStorage.setItem('username', newUsername);
        
//         alert("Account created successfully! Welcome to your dashboard.");
        
//         // Redirect to the Home/Dashboard page
//         window.location.href = "dashboard.html"; 
//     }, 1500);
// });

const signupForm = document.getElementById('signupForm');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const message = document.getElementById('message');

/**
 * 1. Real-time Password Matching Validation
 * Provides instant feedback to the user while they type.
 */
function validatePassword() {
    if (confirmPassword.value === "") {
        message.innerText = "";
    } else if (password.value !== confirmPassword.value) {
        message.innerText = "Passwords do not match";
        message.style.color = "#ff4d4d";
    } else {
        message.innerText = "Passwords match!";
        message.style.color = "#2ecc71";
    }
}

password.addEventListener('keyup', validatePassword);
confirmPassword.addEventListener('keyup', validatePassword);

/**
 * 2. Form Submission Logic
 * Connects to Supabase to register the user.
 */
// signupForm.addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     // Capture user input
//     const newUsername = document.getElementById('username').value;
//     const newEmail = document.getElementById('email').value;
//     const userPassword = password.value;
//     const userConfirmPassword = confirmPassword.value;

//     // Validate passwords match before sending to server
//     if (userPassword !== userConfirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     // Visual Feedback: Disable button to prevent double-clicks
//     const btn = document.querySelector('.login-btn');
//     const originalBtnText = btn.innerText;
//     btn.innerText = "Creating Account...";
//     btn.disabled = true;

//     try {
//         /**
//          * 3. Supabase Registration
//          * We pass the username in 'options.data' so your SQL Trigger 
//          * can find it and create your profile automatically.
//          */
//         const { data, error } = await _supabase.auth.signUp({
//             email: newEmail,
//             password: userPassword,
//             options: {
//                 data: {
//                     username: newUsername,
//                     full_name: newUsername // Defaulting full name to username
//                 }
//             }
//         });

//         if (error) throw error;

//         // 4. Handle Success
//         if (data.user) {
//             // Save username to localStorage for the Dashboard welcome message
//             localStorage.setItem('username', newUsername);
            
//             alert("Account created successfully! Please check your email for a verification link.");
            
//             // Redirect to dashboard (or login page)
//             window.location.href = "dashboard.html"; 
//         }

//     } catch (error) {
//         // Handle Errors (e.g., Email already exists, weak password)
//         alert("Signup Error: " + error.message);
//         btn.innerText = originalBtnText;
//         btn.disabled = false;
//     }
// });

// const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async function(e) {
    // 1. STOP the form from reloading the page automatically
    e.preventDefault(); 
    
    // 2. Capture data
    const newUsername = document.getElementById('username').value;
    const newEmail = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 3. Validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // 4. UI Feedback
    const btn = document.querySelector('.login-btn');
    const originalText = btn.innerText;
    btn.innerText = "Creating Account...";
    btn.disabled = true;

    try {
        // 5. REAL Supabase Signup
        // We pass the username so your SQL Trigger can create the profile
        const { data, error } = await _supabase.auth.signUp({
            email: newEmail,
            password: password,
            options: {
                data: {
                    username: newUsername
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            // Save username for the dashboard welcome message
            localStorage.setItem('username', newUsername);
            
            alert("Signup successful! Please verify your email.");
            
            // 6. Only redirect AFTER success
            window.location.href = "dashboard.html"; 
        }

    } catch (err) {
        alert("Signup Error: " + err.message);
        // Reset button so user can try again
        btn.innerText = originalText;
        btn.disabled = false;
    }
});