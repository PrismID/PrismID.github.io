// app.js

// ==========================================
// 1. Import Firebase Core and SDK Modals
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// ==========================================
// 2. Firebase Connection Credentials
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBcyURO4MBB9A1MI2KGV9WEX5TW5zJ29Cg",
    authDomain: "prism-id-10a9d.firebaseapp.com",
    projectId: "prism-id-10a9d",
    storageBucket: "prism-id-10a9d.firebasestorage.app",
    messagingSenderId: "193963126709",
    appId: "1:193963126709:web:ba741a72cb28735f5833fc",
    measurementId: "G-L31DMX5QCS"
};

// ==========================================
// 3. Service Initialization
// ==========================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 4. Integrated Projects Configuration
// ==========================================
const projects = [
    {
        id: 'voxu',
        name: 'Voxu',
        description: 'The social network. Share updates, build connections, and explore your feed.',
        icon: '../Voxu.png',
        url: 'https://voxuapp.github.io'
    },
    {
        id: 'whiteboard',
        name: 'Whiteboard Wonders',
        description: 'Collaborative, real-time drawing space.',
        icon: '../Whiteboard Wonders.png',
        url: 'https://whiteboard-wonders.web.app'
    }
];
// ==========================================
// 5. Global DOM Target Cache Locators
// ==========================================
const projectsGrid = document.getElementById('projects-grid');
const welcomeBtn = document.getElementById('welcome-message');
const dropdownMenu = document.getElementById('dropdown-menu');
const logoutBtn = document.getElementById('logout-btn');
// ==========================================
// 6. Form Bindings and Event Interceptors
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');

    // --- SIGNUP PROCESSING FLOW ---
    if (signupBtn) {
        console.log("Signup context initialized.");
        signupBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            if (!usernameInput || !passwordInput) return;

            const rawUsername = usernameInput.value.trim();
            const usernameLower = rawUsername.toLowerCase();
            const password = passwordInput.value;

            if (!rawUsername || !password) {
                alert("Please fill out all fields.");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            // Fake Email for username generator
            const generatedEmail = `${usernameLower}@prismid.com`;

            try {
                console.log(`Registering backend profile identity: ${generatedEmail}`);

                // Phase 1: Authentication Core Registration
                const userCredential = await createUserWithEmailAndPassword(auth, generatedEmail, password);
                const user = userCredential.user;
                console.log("Authentication entity mapped! ID:", user.uid);

                // Phase 2: Create Firestore user entry
                console.log("Writing user profile registry documentation data...");
                await setDoc(doc(db, "users", user.uid), {
                    username: usernameLower,
                    displayName: rawUsername,
                    createdAt: new Date().toISOString(),
                    tutorialCompleted: false // Initialize OASS flag
                });

                console.log("Firestore profile synchronized successfully.");
                window.location.href = "../dashboard/";

            } catch (error) {
                console.error("Signup lifecycle break encountered:", error.code, error.message);
                if (error.code === 'auth/email-already-in-use') {
                    alert("That username is already taken. Please select another.");
                } else {
                    alert(`Signup Exception Encountered: ${error.message}`);
                }
            }
        });
    }

    // --- LOGIN PROCESSING FLOW ---
    if (loginBtn) {
        console.log("Login context initialized.");
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            if (!usernameInput || !passwordInput) return;

            const usernameLower = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value;

            if (!usernameLower || !password) {
                alert("Please complete all parameters.");
                return;
            }

            const generatedEmail = `${usernameLower}@prismid.com`;

            try {
                console.log(`Processing backend verification request for: ${generatedEmail}`);
                await signInWithEmailAndPassword(auth, generatedEmail, password);
                console.log("Verification checks cleared.");
                window.location.href = "../dashboard/";
            } catch (error) {
                console.error("Login verification reject mismatch:", error.message);
                alert("Authentication failed: Invalid username or password entry.");
            }
        });
    }
});
// ==========================================
// 7. Dynamic App Matrix Generator
// ==========================================

function generateTempCode() {
    // Creates a random alphanumeric string (e.g., "7a2b9c4d")
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function renderProjects(user) {
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('a');
        card.className = "group block p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500 rounded-2xl transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-xl cursor-pointer";
        card.innerHTML = `
            <div class="flex items-start space-x-4">
                <div class="bg-slate-700 p-2 rounded-xl flex-shrink-0 flex items-center justify-center w-24 h-24 group-hover:scale-110 transition-transform duration-200">
                    <img src="${project.icon}" alt="${project.name} Logo" class="w-full h-full object-scale-down">
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        ${project.name}
                    </h3>
                    <p class="text-slate-400 text-sm mt-2 leading-relaxed">
                        ${project.description}
                    </p>
                </div>
            </div>
        `;

        if (!user) {
            card.onclick = (e) => {
                e.preventDefault();
                window.location.href = `LoadingScreen.html?app=${project.id}`;
            };
        } else {
            // NEW: The Secure Bridge Logic
            card.onclick = async (e) => {
                e.preventDefault();

                // 1. Generate the ticket
                const tempCode = generateTempCode();

                try {
                    // 2. Save it to Firestore with a 60-second expiration
                    await setDoc(doc(db, "bridge_codes", tempCode), {
                        uid: user.uid,
                        targetApp: project.id,
                        createdAt: new Date().getTime(),
                        expiresAt: new Date().getTime() + 60000
                    });

                    // 3. Send them to the app with the temporary code
                    window.location.href = `${project.url}?code=${tempCode}`;
                } catch (error) {
                    console.error("Failed to generate bridge code:", error);
                    alert("Could not connect to app. Please try again.");
                }
            };
        }

        projectsGrid.appendChild(card);
    });
}
//===========================================
// 8. Onboarding Automatic Saver System (OASS)
//===========================================
const OASS = {
    async markComplete(uid) {
        await setDoc(doc(db, "users", uid), { tutorialCompleted: true }, { merge: true });
        localStorage.setItem('onboardingCompleted', 'true');
    }
};

// ==========================================
// 9. Session State Observer Lifecycle Guard
// ==========================================
onAuthStateChanged(auth, async (user) => {
    const profileElement = document.getElementById('user-profile');
    const currentPath = window.location.pathname;
    const isOnOnboarding = currentPath.includes("dashboard/");

    if (user) {
        console.log("Active session context mapped:", user.uid);
        if (profileElement) profileElement.classList.remove('hidden');

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                // FIX: If the user hasn't finished the tutorial, 
                // we don't redirect. We just show the hidden overlay.
                if (userData.tutorialCompleted !== true) {
                    const overlay = document.getElementById('onboarding-overlay');
                    if (overlay) overlay.classList.remove('hidden');
                }

                if (welcomeBtn) {
                    welcomeBtn.innerText = `Welcome, ${userData.displayName}! ▼`;
                }

                renderProjects(user);
            }
        } catch (error) {
            console.error("Database query failed:", error);
        }
    }
});

// ==========================================
// 10. Floating UI Dropdown Control Map
// ==========================================
if (welcomeBtn && dropdownMenu) {
    welcomeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// ==========================================
// 11. Clean Session Sign-Out Interceptor
// ==========================================
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            console.log("Session logged out");
            localStorage.removeItem('onboardingCompleted'); // Clear OASS
            window.location.href = "../index.html";
        }).catch((err) => {
            console.error("Wipe command intercepted an execution exception:", err);
        });
    });
}

// ==========================================
// 12. Unified Onboarding Step Controller
// ==========================================
let currentStep = 0;
const steps = document.querySelectorAll('.onboarding-step');
const nextBtn = document.getElementById('next-btn');

if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        const overlay = document.getElementById('onboarding-overlay');

        // Logic for the LAST step
        if (currentStep === steps.length - 1) {
            overlay.classList.add('hidden');

            if (user) {
                try {
                    await setDoc(doc(db, "users", user.uid), { tutorialCompleted: true }, { merge: true });
                    localStorage.setItem('onboardingCompleted', 'true');
                    console.log("Onboarding finished and saved.");
                } catch (error) {
                    console.error("Error saving final onboarding state:", error);
                }
            }
            return;
        }

        // Logic for ANIMATING between steps
        // 1. Fade out current
        steps[currentStep].classList.replace('opacity-100', 'opacity-0');

        setTimeout(() => {
            // 2. Hide current
            steps[currentStep].classList.add('hidden');

            // 3. Increment
            currentStep++;

            // 4. Show next
            steps[currentStep].classList.remove('hidden');
            // Trigger reflow
            steps[currentStep].offsetWidth;
            steps[currentStep].classList.replace('opacity-0', 'opacity-100');

            // Change button text to "Finish" if we are at the last step
            if (currentStep === steps.length - 1) {
                nextBtn.innerText = "Finish";
            }
        }, 500);
    });
}

// ==========================================
// 13. Dropdown Action Controller
// ==========================================

if (dropdownMenu) {
    dropdownMenu.addEventListener('click', (e) => {
        // Find the closest element that HAS the data-action attribute
        const target = e.target.closest('[data-action]');

        // If they clicked something without an action, exit safely
        if (!target) return;

        e.preventDefault(); // Prevent page reload

        // Now safely get the action and pass it
        const action = target.getAttribute('data-action');
        handleMenuAction(action);

        // Close the menu after clicking
        dropdownMenu.classList.remove('show');
    });
}

function handleMenuAction(action) {
    switch (action) {
        case 'updates':
            console.log("Action fired: Updates");
            // TODO: Add your custom UI logic here (e.g., open a modal)
            break;
        case 'security':
            console.log("Action fired: Security");
            // TODO: Add your custom UI logic here (e.g., open a modal)
            break;
        case 'settings':
            console.log("Action fired: Settings");
            // TODO: Add your custom UI logic here (e.g., open a modal)
            break;
        default:
            console.warn("Unknown action:", action);
    }
}
