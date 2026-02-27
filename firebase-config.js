// ============================================
// FIREBASE CONFIGURATION — Foodie KDY
// ============================================
// 
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it anything (e.g. "foodie-kdy")
// 3. Disable Google Analytics (optional) → Create Project
// 4. Click the web icon (</>) → register your app (any nickname)
// 5. Copy the firebaseConfig values below
// 6. Go to "Build" → "Realtime Database" → "Create Database"
// 7. Choose a location → Start in TEST MODE → Enable
// 8. Done! Replace the placeholders below with your values.
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyBBS9wLK3JxGTuw_hfhtXm-vu_w5GPaBEU",
    authDomain: "foodiekdy.firebaseapp.com",
    databaseURL: "https://foodiekdy-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "foodiekdy",
    storageBucket: "foodiekdy.firebasestorage.app",
    messagingSenderId: "881611639915",
    appId: "1:881611639915:web:a61c82cd7b6a4e9534752e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================
// SHARED HELPER FUNCTIONS
// ============================================

// Read a value from Firebase
function fbGet(path) {
    return db.ref('foodieKDY/' + path).once('value').then(snap => snap.val());
}

// Write a value to Firebase
function fbSet(path, value) {
    return db.ref('foodieKDY/' + path).set(value);
}

// Read all site data at once
function fbGetAll() {
    return db.ref('foodieKDY').once('value').then(snap => snap.val());
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}
