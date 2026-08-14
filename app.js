// app.js

// ==========================================
// 1. Import Firebase Core and SDK Modals
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const welcomeBtn = document.getElementById('welcome-message') || document.querySelector('.welcome-message');
const dropdownMenu = document.getElementById('dropdown-menu') || document.querySelector('.dropdown-menu');
const logoutBtn = document.getElementById('logout-btn') || document.querySelector('.logout-btn');

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

            const generatedEmail = `${usernameLower}@prismid.com`;

            try {
                console.log(`Registering backend profile identity: ${generatedEmail}`);

                const userCredential = await createUserWithEmailAndPassword(auth, generatedEmail, password);
                const user = userCredential.user;
                console.log("Authentication entity mapped! ID:", user.uid);

                console.log("Writing user profile registry documentation data...");
                await setDoc(doc(db, "users", user.uid), {
                    username: usernameLower,
                    displayName: rawUsername,
                    createdAt: new Date().toISOString(),
                    tutorialCompleted: false
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
            card.onclick = async (e) => {
                e.preventDefault();

                const tempCode = generateTempCode();

                try {
                    await setDoc(doc(db, "bridge_codes", tempCode), {
                        uid: user.uid,
                        targetApp: project.id,
                        createdAt: new Date().getTime(),
                        expiresAt: new Date().getTime() + 60000
                    });

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

// ==========================================
// 8. Onboarding Automatic Saver System (OASS)
// ==========================================
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
    const profileElement = document.getElementById('user-profile') || document.querySelector('.user-profile');

    if (user) {
        console.log("Active session context mapped:", user.uid);
        if (profileElement) profileElement.classList.remove('hidden');

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                if (userData.tutorialCompleted !== true) {
                    const overlay = document.getElementById('onboarding-overlay') || document.querySelector('.onboarding-overlay');
                    if (overlay) overlay.classList.remove('hidden');
                }

                if (welcomeBtn) {
                    if (userData.displayName && userData.displayName.toLowerCase() === "prismid") {
                        welcomeBtn.innerText = "Welcome, Admin! ▼";
                    } else {
                        welcomeBtn.innerText = `Welcome, ${userData.displayName || 'User'}! ▼`;
                    }
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
            localStorage.removeItem('onboardingCompleted');
            const redirectPath = window.location.pathname.includes('/dashboard/') || window.location.pathname.includes('/settings/') ? "../index.html" : "index.html";
            window.location.href = redirectPath;
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
        const overlay = document.getElementById('onboarding-overlay') || document.querySelector('.onboarding-overlay');

        if (currentStep === steps.length - 1) {
            if (overlay) overlay.classList.add('hidden');

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

        steps[currentStep].classList.replace('opacity-100', 'opacity-0');

        setTimeout(() => {
            steps[currentStep].classList.add('hidden');
            currentStep++;
            steps[currentStep].classList.remove('hidden');
            steps[currentStep].offsetWidth;
            steps[currentStep].classList.replace('opacity-0', 'opacity-100');

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
        const target = e.target.closest('[data-action], #logout-btn');
        if (!target) return;

        e.preventDefault();
        const action = target.id === 'logout-btn' ? 'logout' : target.getAttribute('data-action');
        handleMenuAction(action);
        dropdownMenu.classList.remove('show');
    });
}

function handleMenuAction(action) {
    switch (action) {
        case 'updates':
            console.log("Action fired: Updates");
            break;
        case 'security':
            console.log("Action fired: Security");
            break;
        case 'settings':
            window.location.href = window.location.pathname.includes('/dashboard/') ? "../settings/" : "settings/";
            break;
        case 'logout':
            signOut(auth).then(() => {
                localStorage.removeItem('onboardingCompleted');
                const redirectPath = window.location.pathname.includes('/dashboard/') || window.location.pathname.includes('/settings/') ? "../index.html" : "index.html";
                window.location.href = redirectPath;
            }).catch((err) => {
                console.error("Logout failed:", err);
            });
            break;
        default:
            console.warn("Unknown action:", action);
    }
}
