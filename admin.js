/* ============================================
   FOODIE KDY — ADMIN PANEL LOGIC (Firebase)
   ============================================ */

(function () {
    'use strict';

    // =============== DEFAULT DATA ===============
    const DEFAULTS = {
        siteTitle: 'Foodie KDY',
        sloganPrefix: 'Healthy food gives',
        sloganWords: ['Strength', 'Focus', 'Healthy Body'],
        videoUrl: 'https://www.youtube.com/embed/RE5tvaveVak',
        footerText: '© 2026 Healthy Food Awareness. Eat Smart, Live Strong.',
        awarenessHeading: 'Why Clean Eating Matters',
        awarenessCta: 'Ready to find out what your body needs?',
        awarenessCards: [
            { icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f4aa.svg', title: 'Strength & Energy', text: 'Fuel your body with the right nutrients to stay active and strong throughout the day.' },
            { icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f9e0.svg', title: 'Sharp Focus', text: 'Balanced meals improve concentration and brain function.' },
            { icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2764.svg', title: 'Long-term Health', text: 'Prevent chronic diseases and boost your immune system with natural foods.' }
        ],
        foodData: [
            { id: 1, name: "Broccoli", type: "vegetable", calories: 34, unit: "100g", description: "A green superfood packed with fiber and vitamins C and K.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f966.svg" },
            { id: 2, name: "Carrot", type: "vegetable", calories: 41, unit: "100g", description: "Crunchy and sweet, excellent for eye health and immunity.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f955.svg" },
            { id: 3, name: "Spinach", type: "vegetable", calories: 23, unit: "100g", description: "Leafy green rich in iron and antioxidants for energy.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f96c.svg" },
            { id: 4, name: "Apple", type: "fruit", calories: 52, unit: "1 medium", description: "Crisp and refreshing, full of fiber to keep you full.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f34e.svg" },
            { id: 5, name: "Banana", type: "fruit", calories: 89, unit: "1 medium", description: "High in potassium, great for quick energy and muscle function.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f34c.svg" },
            { id: 6, name: "Berries", type: "fruit", calories: 57, unit: "100g", description: "Sweet, tangy, and loaded with heart-healthy antioxidants.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f353.svg" },
            { id: 7, name: "Grilled Chicken", type: "meat", calories: 165, unit: "100g", description: "Lean protein that helps build and repair muscle tissue.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f357.svg" },
            { id: 8, name: "Salmon Fish", type: "meat", calories: 208, unit: "100g", description: "Rich in omega-3 fatty acids for brain and heart health.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f41f.svg" },
            { id: 9, name: "Lean Mutton", type: "meat", calories: 143, unit: "100g", description: "A good source of iron and protein for strength and vitality.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f969.svg" }
        ],
        calorieSettings: {
            male: { teen: 2400, young: 2600, adult: 2400, older: 2200 },
            female: { teen: 2000, young: 2200, adult: 2000, older: 1800 }
        },
        adminCredentials: { username: 'admin@foodiekdy', password: 'foodiekdy@3' }
    };

    // =============== STORAGE ===============
    // Live data cache — loaded from Firebase on init
    let liveData = {};

    function get(key) {
        return liveData[key] ?? DEFAULTS[key];
    }

    async function save(key, value) {
        liveData[key] = value;
        if (isFirebaseConfigured()) {
            await fbSet(key, value);
        }
    }

    // =============== DOM HELPERS ===============
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    function showToast(message) {
        const toast = $('#toast');
        toast.textContent = message || 'Saved successfully!';
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    // =============== STATUS BAR ===============
    function updateDbStatus() {
        const dot = $('#db-status-dot');
        const label = $('#db-status-label');
        if (!dot || !label) return;

        if (isFirebaseConfigured()) {
            dot.style.background = '#4caf50';
            label.textContent = 'Firebase Connected';
        } else {
            dot.style.background = '#FFB74D';
            label.textContent = 'Local Only (configure firebase-config.js)';
        }
    }

    // =============== LOGIN ===============
    const loginOverlay = $('#login-overlay');
    const dashboard = $('#admin-dashboard');
    const loginBtn = $('#login-btn');
    const loginError = $('#login-error');

    if (sessionStorage.getItem('foodieKDY_admin_loggedIn') === 'true') {
        loginOverlay.classList.add('hidden');
        dashboard.classList.remove('hidden');
    }

    loginBtn.addEventListener('click', () => {
        const username = $('#login-username').value.trim();
        const password = $('#login-password').value;
        const creds = get('adminCredentials');

        if (username === creds.username && password === creds.password) {
            loginOverlay.classList.add('hidden');
            dashboard.classList.remove('hidden');
            sessionStorage.setItem('foodieKDY_admin_loggedIn', 'true');
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });

    $('#login-password').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });

    $('#logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('foodieKDY_admin_loggedIn');
        location.reload();
    });

    // =============== SIDEBAR NAVIGATION ===============
    const navItems = $$('.nav-item');
    const adminSections = $$('.admin-section');
    const pageTitle = $('#page-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const sectionId = 'sec-' + item.dataset.section;
            adminSections.forEach(s => s.classList.remove('active'));
            const target = document.getElementById(sectionId);
            if (target) target.classList.add('active');

            pageTitle.textContent = item.textContent.trim();
            $('#sidebar').classList.remove('open');
        });
    });

    $('#menu-toggle').addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
    });

    // =============== SITE SETTINGS ===============
    function loadSiteSettings() {
        $('#site-title').value = get('siteTitle');
        $('#site-slogan-prefix').value = get('sloganPrefix');
        $('#site-slogan-words').value = get('sloganWords').join(', ');
        $('#video-url').value = get('videoUrl');
        $('#footer-text').value = get('footerText');
    }

    $('#save-site-settings').addEventListener('click', async () => {
        const btn = $('#save-site-settings');
        btn.disabled = true;
        btn.textContent = '⏳ Saving...';

        const wordsStr = $('#site-slogan-words').value;
        const wordsArr = wordsStr.split(',').map(w => w.trim()).filter(Boolean);

        await save('siteTitle', $('#site-title').value.trim() || DEFAULTS.siteTitle);
        await save('sloganPrefix', $('#site-slogan-prefix').value.trim() || DEFAULTS.sloganPrefix);
        await save('sloganWords', wordsArr.length ? wordsArr : DEFAULTS.sloganWords);
        await save('videoUrl', $('#video-url').value.trim() || DEFAULTS.videoUrl);
        await save('footerText', $('#footer-text').value.trim() || DEFAULTS.footerText);

        btn.disabled = false;
        btn.textContent = '💾 Save Site Settings';
        showToast('✅ Site settings saved!');
    });

    // =============== AWARENESS ===============
    function loadAwareness() {
        $('#awareness-heading').value = get('awarenessHeading');
        $('#awareness-cta').value = get('awarenessCta');
        renderAwarenessCards();
    }

    function renderAwarenessCards() {
        const cards = get('awarenessCards');
        const container = $('#awareness-cards-container');
        container.innerHTML = '';

        cards.forEach((card, i) => {
            const el = document.createElement('div');
            el.className = 'awareness-card-editor';
            el.innerHTML = `
                <h4>Card ${i + 1}: ${card.title}</h4>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Title</label>
                        <input type="text" class="aw-title" data-index="${i}" value="${card.title}">
                    </div>
                    <div class="input-group">
                        <label>Icon URL</label>
                        <input type="text" class="aw-icon" data-index="${i}" value="${card.icon}">
                    </div>
                </div>
                <div class="input-group">
                    <label>Description</label>
                    <textarea class="aw-text" data-index="${i}" rows="2">${card.text}</textarea>
                </div>
            `;
            container.appendChild(el);
        });
    }

    $('#save-awareness').addEventListener('click', async () => {
        const btn = $('#save-awareness');
        btn.disabled = true;
        btn.textContent = '⏳ Saving...';

        await save('awarenessHeading', $('#awareness-heading').value.trim() || DEFAULTS.awarenessHeading);
        await save('awarenessCta', $('#awareness-cta').value.trim() || DEFAULTS.awarenessCta);

        const cards = JSON.parse(JSON.stringify(get('awarenessCards'))); // deep copy
        $$('.aw-title').forEach(input => { cards[parseInt(input.dataset.index)].title = input.value.trim(); });
        $$('.aw-icon').forEach(input => { cards[parseInt(input.dataset.index)].icon = input.value.trim(); });
        $$('.aw-text').forEach(input => { cards[parseInt(input.dataset.index)].text = input.value.trim(); });

        await save('awarenessCards', cards);

        btn.disabled = false;
        btn.textContent = '💾 Save Awareness Cards';
        showToast('✅ Awareness section saved!');
    });

    // =============== FOOD MANAGER ===============
    let currentFilter = 'all';
    let editingFoodId = null;

    function renderFoodList() {
        const foods = get('foodData');
        const list = $('#food-list');
        list.innerHTML = '';

        const filtered = currentFilter === 'all'
            ? foods
            : foods.filter(f => f.type === currentFilter);

        if (filtered.length === 0) {
            list.innerHTML = '<p style="color: var(--admin-text-muted); text-align:center; padding:30px;">No food items found. Click "Add New Food" to get started.</p>';
            return;
        }

        filtered.forEach(food => {
            const row = document.createElement('div');
            row.className = 'food-row';
            row.innerHTML = `
                <img src="${food.image}" alt="${food.name}" class="food-row-img">
                <div class="food-row-info">
                    <h4>${food.name}</h4>
                    <span>${food.description}</span>
                </div>
                <span class="food-row-badge ${food.type}">${food.type}</span>
                <span class="food-row-calories">${food.calories} kcal / ${food.unit}</span>
                <div class="food-row-actions">
                    <button class="edit-btn" data-id="${food.id}">✏️</button>
                    <button class="delete-btn" data-id="${food.id}">🗑️</button>
                </div>
            `;
            list.appendChild(row);
        });

        list.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openFoodModal(parseInt(btn.dataset.id)));
        });

        list.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this food item?')) {
                    deleteFood(parseInt(btn.dataset.id));
                }
            });
        });
    }

    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderFoodList();
        });
    });

    const foodModal = $('#food-modal');
    let uploadedBase64 = ''; // holds base64 from file upload

    // ---- Image Upload Logic ----
    const fileInput = $('#food-image-file');
    const imagePreview = $('#image-preview');
    const uploadPlaceholder = $('#upload-placeholder');
    const uploadArea = $('#image-upload-area');

    function showImagePreview(src) {
        imagePreview.src = src;
        imagePreview.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
    }

    function resetImagePreview() {
        imagePreview.src = '';
        imagePreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        uploadedBase64 = '';
        fileInput.value = '';
    }

    function processImageFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            // Resize to max 200px to keep Firebase data small
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 200;
                let w = img.width, h = img.height;
                if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                    else { w = Math.round(w * MAX / h); h = MAX; }
                }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                uploadedBase64 = canvas.toDataURL('image/webp', 0.8);
                showImagePreview(uploadedBase64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', (e) => {
        processImageFile(e.target.files[0]);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        processImageFile(e.dataTransfer.files[0]);
    });

    function openFoodModal(foodId = null) {
        editingFoodId = foodId;
        resetImagePreview();

        if (foodId) {
            const food = get('foodData').find(f => f.id === foodId);
            if (!food) return;
            $('#modal-title').textContent = 'Edit Food Item';
            $('#food-name').value = food.name;
            $('#food-type').value = food.type;
            $('#food-calories').value = food.calories;
            $('#food-unit').value = food.unit;
            $('#food-desc').value = food.description;
            $('#food-image').value = food.image.startsWith('data:') ? '' : food.image;
            if (food.image) showImagePreview(food.image);
        } else {
            $('#modal-title').textContent = 'Add New Food';
            $('#food-name').value = '';
            $('#food-type').value = 'vegetable';
            $('#food-calories').value = '';
            $('#food-unit').value = '100g';
            $('#food-desc').value = '';
            $('#food-image').value = '';
        }
        foodModal.classList.remove('hidden');
    }

    function closeFoodModal() {
        foodModal.classList.add('hidden');
        editingFoodId = null;
        resetImagePreview();
    }

    $('#add-food-btn').addEventListener('click', () => openFoodModal());
    $('#modal-close').addEventListener('click', closeFoodModal);
    $('#modal-cancel').addEventListener('click', closeFoodModal);
    foodModal.addEventListener('click', (e) => { if (e.target === foodModal) closeFoodModal(); });

    $('#modal-save').addEventListener('click', async () => {
        const name = $('#food-name').value.trim();
        const type = $('#food-type').value;
        const calories = parseInt($('#food-calories').value);
        const unit = $('#food-unit').value.trim();
        const description = $('#food-desc').value.trim();
        const image = uploadedBase64 || $('#food-image').value.trim();

        if (!name || !calories || !unit) {
            alert('Please fill in at least the name, calories, and unit fields.');
            return;
        }

        const foods = JSON.parse(JSON.stringify(get('foodData')));

        if (editingFoodId) {
            const idx = foods.findIndex(f => f.id === editingFoodId);
            if (idx !== -1) foods[idx] = { ...foods[idx], name, type, calories, unit, description, image };
        } else {
            const maxId = foods.reduce((max, f) => Math.max(max, f.id), 0);
            foods.push({ id: maxId + 1, name, type, calories, unit, description, image: image || 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f37d.svg' });
        }

        await save('foodData', foods);
        renderFoodList();
        closeFoodModal();
        showToast(editingFoodId ? '✅ Food item updated!' : '✅ New food item added!');
    });

    async function deleteFood(foodId) {
        let foods = JSON.parse(JSON.stringify(get('foodData')));
        foods = foods.filter(f => f.id !== foodId);
        await save('foodData', foods);
        renderFoodList();
        showToast('🗑️ Food item deleted.');
    }

    // =============== CALORIE SETTINGS ===============
    function loadCalorieSettings() {
        const cal = get('calorieSettings');
        $('#cal-male-teen').value = cal.male.teen;
        $('#cal-male-young').value = cal.male.young;
        $('#cal-male-adult').value = cal.male.adult;
        $('#cal-male-older').value = cal.male.older;
        $('#cal-female-teen').value = cal.female.teen;
        $('#cal-female-young').value = cal.female.young;
        $('#cal-female-adult').value = cal.female.adult;
        $('#cal-female-older').value = cal.female.older;
    }

    $('#save-calorie-settings').addEventListener('click', async () => {
        const btn = $('#save-calorie-settings');
        btn.disabled = true;
        btn.textContent = '⏳ Saving...';

        const cal = {
            male: {
                teen: parseInt($('#cal-male-teen').value) || DEFAULTS.calorieSettings.male.teen,
                young: parseInt($('#cal-male-young').value) || DEFAULTS.calorieSettings.male.young,
                adult: parseInt($('#cal-male-adult').value) || DEFAULTS.calorieSettings.male.adult,
                older: parseInt($('#cal-male-older').value) || DEFAULTS.calorieSettings.male.older
            },
            female: {
                teen: parseInt($('#cal-female-teen').value) || DEFAULTS.calorieSettings.female.teen,
                young: parseInt($('#cal-female-young').value) || DEFAULTS.calorieSettings.female.young,
                adult: parseInt($('#cal-female-adult').value) || DEFAULTS.calorieSettings.female.adult,
                older: parseInt($('#cal-female-older').value) || DEFAULTS.calorieSettings.female.older
            }
        };

        await save('calorieSettings', cal);
        btn.disabled = false;
        btn.textContent = '💾 Save Calorie Settings';
        showToast('✅ Calorie settings saved!');
    });

    // =============== RESET ALL ===============
    $('#reset-all-btn').addEventListener('click', async () => {
        if (confirm('This will reset ALL settings to defaults. Are you sure?')) {
            if (isFirebaseConfigured()) {
                await db.ref('foodieKDY').remove();
            }
            liveData = {};
            loadAll();
            showToast('🔄 All settings reset to defaults.');
        }
    });

    // =============== INIT — LOAD FROM FIREBASE ===============
    function loadAll() {
        loadSiteSettings();
        loadAwareness();
        renderFoodList();
        loadCalorieSettings();
        updateDbStatus();
    }

    async function init() {
        if (isFirebaseConfigured()) {
            try {
                const data = await fbGetAll();
                if (data) liveData = data;
            } catch (err) {
                console.error('Firebase read error:', err);
            }
        }
        loadAll();
    }

    init();

})();
