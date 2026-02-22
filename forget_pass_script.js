// Simulated Data (In a real app, this comes from your database)
const mockDatabase = {
    "test@example.com": ["User_One", "Creative_Mind99"],
    "dev@work.com": ["Admin_Dev"]
};

function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(s => s.style.display = 'none');
    document.getElementById(`step${stepNumber}`).style.display = 'block';
}

// 1. Send Email & Find Usernames
function sendRecoveryEmail() {
    const email = document.getElementById('resetEmail').value;
    const usernames = mockDatabase[email];

    if (usernames) {
        const select = document.getElementById('usernameSelect');
        select.innerHTML = usernames.map(u => `<option value="${u}">${u}</option>`).join('');
        
        document.getElementById('stepDescription').innerText = "We found multiple accounts. Pick one:";
        showStep(2);
    } else {
        alert("No accounts found with that email.");
    }
}

// 2. Request Code
function requestVerificationCode() {
    const selectedUser = document.getElementById('usernameSelect').value;
    alert(`A 6-digit verification code has been sent to your email for account: ${selectedUser}`);
    
    document.getElementById('stepDescription').innerText = "Verify your identity & set new password";
    showStep(3);
}

// 3. Finalize
function finalizeReset() {
    const code = document.getElementById('verificationCode').value;
    if (code.length === 6) {
        alert("Password updated successfully! Redirecting to login...");
        window.location.href = "index.html";
    } else {
        alert("Invalid verification code.");
    }
}
