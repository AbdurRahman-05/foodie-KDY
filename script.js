document.addEventListener('DOMContentLoaded', () => {

    // =============== DEFAULT DATA ===============
    const defaultFoodData = [
        { id: 1, name: "Broccoli", type: "vegetable", calories: 34, unit: "100g", description: "A green superfood packed with fiber and vitamins C and K.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f966.svg" },
        { id: 2, name: "Carrot", type: "vegetable", calories: 41, unit: "100g", description: "Crunchy and sweet, excellent for eye health and immunity.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f955.svg" },
        { id: 3, name: "Spinach", type: "vegetable", calories: 23, unit: "100g", description: "Leafy green rich in iron and antioxidants for energy.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f96c.svg" },
        { id: 4, name: "Apple", type: "fruit", calories: 52, unit: "1 medium", description: "Crisp and refreshing, full of fiber to keep you full.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f34e.svg" },
        { id: 5, name: "Banana", type: "fruit", calories: 89, unit: "1 medium", description: "High in potassium, great for quick energy and muscle function.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f34c.svg" },
        { id: 6, name: "Berries", type: "fruit", calories: 57, unit: "100g", description: "Sweet, tangy, and loaded with heart-healthy antioxidants.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f353.svg" },
        { id: 7, name: "Grilled Chicken", type: "meat", calories: 165, unit: "100g", description: "Lean protein that helps build and repair muscle tissue.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f357.svg" },
        { id: 8, name: "Salmon Fish", type: "meat", calories: 208, unit: "100g", description: "Rich in omega-3 fatty acids for brain and heart health.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f41f.svg" },
        { id: 9, name: "Lean Mutton", type: "meat", calories: 143, unit: "100g", description: "A good source of iron and protein for strength and vitality.", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f969.svg" }
    ];

    const defaultCalorieSettings = {
        male: { teen: 2400, young: 2600, adult: 2400, older: 2200 },
        female: { teen: 2000, young: 2200, adult: 2000, older: 1800 }
    };

    const defaultAwarenessCards = [
        { icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f4aa.svg', title: 'Strength & Energy', text: 'Fuel your body with the right nutrients to stay active and strong throughout the day.' },
        { icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f9e0.svg', title: 'Sharp Focus', text: 'Balanced meals improve concentration and brain function.' },
        { icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2764.svg', title: 'Long-term Health', text: 'Prevent chronic diseases and boost your immune system with natural foods.' }
    ];

    // =============== ELEMENTS ===============
    const calculateBtn = document.getElementById('calculate-btn');
    const ageInput = document.getElementById('age');
    const resultMessage = document.getElementById('result-message');
    const foodGrid = document.getElementById('food-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const nextBtns = document.querySelectorAll('.next-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const sections = document.querySelectorAll('.step-section');
    const calcNextBtn = document.getElementById('btn-to-food');
    const header = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    const dynamicWord = document.getElementById('dynamic-word');

    // =============== APPLY DATA TO PAGE ===============
    function applyData(data) {
        const d = data || {};

        // Food & calorie data
        const foodData = d.foodData || defaultFoodData;
        const calorieSettings = d.calorieSettings || defaultCalorieSettings;
        const awarenessCards = d.awarenessCards || defaultAwarenessCards;
        const words = d.sloganWords || ["Strength", "Focus", "Healthy Body"];

        // Site title
        if (d.siteTitle) {
            const logoEl = document.querySelector('.logo-text');
            if (logoEl) logoEl.textContent = d.siteTitle;
            document.title = d.siteTitle;
        }

        // Slogan prefix
        if (d.sloganPrefix) {
            const sloganEl = document.querySelector('.slogan');
            if (sloganEl) {
                sloganEl.innerHTML = '';
                sloganEl.appendChild(document.createTextNode(d.sloganPrefix + ' '));
                sloganEl.appendChild(dynamicWord);
            }
        }

        // Video
        if (d.videoUrl) {
            const iframe = document.querySelector('.video-container iframe');
            if (iframe) iframe.src = d.videoUrl;
        }

        // Footer
        if (d.footerText) {
            const footerEl = document.querySelector('footer p');
            if (footerEl) footerEl.textContent = d.footerText;
        }

        // Awareness heading
        if (d.awarenessHeading) {
            const headingEl = document.querySelector('#step-awareness .awareness-content > h2');
            if (headingEl) headingEl.textContent = d.awarenessHeading;
        }

        // Awareness CTA
        if (d.awarenessCta) {
            const ctaEl = document.querySelector('.cta-text');
            if (ctaEl) ctaEl.textContent = d.awarenessCta;
        }

        // Awareness info cards
        const infoCards = document.querySelectorAll('.info-card');
        if (awarenessCards && infoCards.length === awarenessCards.length) {
            infoCards.forEach((card, i) => {
                const c = awarenessCards[i];
                const img = card.querySelector('.info-icon');
                const h3 = card.querySelector('h3');
                const p = card.querySelector('p');
                if (img) img.src = c.icon;
                if (h3) h3.textContent = c.title;
                if (p) p.textContent = c.text;
            });
        }

        // =============== FOOD GRID ===============
        function renderFoodGrid(category) {
            foodGrid.innerHTML = '';
            const filtered = category === 'all' ? foodData : foodData.filter(item => item.type === category);
            filtered.forEach(food => {
                const card = document.createElement('div');
                card.className = 'food-card';
                card.innerHTML = `
                    <img src="${food.image}" alt="${food.name}" class="food-image">
                    <div class="food-info">
                        <span class="badge ${food.type}">${food.type}</span>
                        <h3>${food.name}</h3>
                        <p class="food-desc">${food.description}</p>
                        <p class="food-calories">${food.calories} kcal / ${food.unit}</p>
                    </div>
                `;
                foodGrid.appendChild(card);
            });
        }

        renderFoodGrid('all');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderFoodGrid(btn.dataset.category);
            });
        });

        // =============== CALORIE CALCULATOR ===============
        function calculateDailyCalories(age, gender) {
            const cal = calorieSettings;
            if (gender === 'male') {
                if (age < 18) return cal.male.teen;
                else if (age < 30) return cal.male.young;
                else if (age < 50) return cal.male.adult;
                else return cal.male.older;
            } else {
                if (age < 18) return cal.female.teen;
                else if (age < 30) return cal.female.young;
                else if (age < 50) return cal.female.adult;
                else return cal.female.older;
            }
        }

        let dailyCalorieGoal = 0;

        calculateBtn.addEventListener('click', () => {
            const age = parseInt(ageInput.value);
            const gender = document.querySelector('input[name="gender"]:checked').value;
            if (!age || age < 1) { alert("Please enter a valid age."); return; }
            const calories = calculateDailyCalories(age, gender);
            dailyCalorieGoal = calories;
            resultMessage.style.display = 'block';
            resultMessage.innerHTML = `Based on your age (${age}) and gender (${gender}), your estimated daily requirement is <strong>${calories} kcal</strong>.`;
            resultMessage.classList.remove('hidden');
            calcNextBtn.classList.remove('hidden');
        });

        // =============== MEAL PLANNER ===============
        const mpGoalEl = document.getElementById('mp-goal');
        const mpConsumedEl = document.getElementById('mp-consumed');
        const mpRemainingEl = document.getElementById('mp-remaining');
        const mpProgressEl = document.getElementById('mp-progress');
        const mpFoodSelector = document.getElementById('mp-food-selector');
        const mpPlate = document.getElementById('mp-plate');
        const mpSuggestion = document.getElementById('mp-suggestion');
        const mpTabs = document.querySelectorAll('.mp-tab');
        let mpCurrentCat = 'all';
        let plate = []; // { id, name, image, caloriesPer100g, grams }

        // Tab filtering
        if (mpTabs) {
            mpTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    mpTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    mpCurrentCat = tab.dataset.mpCat;
                    renderMpFoodSelector();
                });
            });
        }

        function renderMpFoodSelector() {
            if (!mpFoodSelector) return;
            mpFoodSelector.innerHTML = '';
            const filtered = mpCurrentCat === 'all' ? foodData : foodData.filter(f => f.type === mpCurrentCat);

            filtered.forEach(food => {
                const chip = document.createElement('div');
                chip.className = 'mp-food-chip';
                chip.innerHTML = `
                    <img src="${food.image}" alt="${food.name}">
                    <span>${food.name}</span>
                    <span class="chip-cal">${food.calories} kcal/${food.unit}</span>
                    <button class="chip-add" title="Add to plate">+</button>
                `;
                // Click the + button to add
                chip.querySelector('.chip-add').addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToPlate(food);
                });
                // Also allow clicking the whole chip
                chip.addEventListener('click', () => addToPlate(food));
                mpFoodSelector.appendChild(chip);
            });
        }

        function addToPlate(food) {
            const existing = plate.find(p => p.id === food.id);
            if (existing) {
                existing.grams += 100;
            } else {
                plate.push({
                    id: food.id,
                    name: food.name,
                    image: food.image,
                    caloriesPer100g: food.calories,
                    unit: food.unit,
                    grams: 100
                });
            }
            renderPlate();
        }

        function removeFromPlate(foodId) {
            plate = plate.filter(p => p.id !== foodId);
            renderPlate();
        }

        function renderPlate() {
            if (!mpPlate) return;
            const goal = dailyCalorieGoal || 2000;
            if (mpGoalEl) mpGoalEl.textContent = goal;

            if (plate.length === 0) {
                mpPlate.innerHTML = '<p class="mp-empty">Click ➕ on foods above to add them!</p>';
                updateCalorieProgress(0);
                updateMealSplit(0);
                if (mpSuggestion) mpSuggestion.classList.add('hidden');
                return;
            }

            mpPlate.innerHTML = '';
            let totalCalories = 0;

            plate.forEach(item => {
                const itemCals = Math.round((item.caloriesPer100g / 100) * item.grams);
                totalCalories += itemCals;

                const row = document.createElement('div');
                row.className = 'mp-plate-item';
                row.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <span class="plate-name">${item.name}</span>
                    <div class="plate-qty">
                        <input type="number" value="${item.grams}" min="10" step="10" data-id="${item.id}">
                        <span>g</span>
                    </div>
                    <span class="plate-kcal">${itemCals} kcal</span>
                    <button class="plate-remove" data-id="${item.id}">✕</button>
                `;
                mpPlate.appendChild(row);
            });

            // Quantity change handlers
            mpPlate.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('input', () => {
                    const id = parseInt(input.dataset.id);
                    const item = plate.find(p => p.id === id);
                    if (item) {
                        item.grams = Math.max(0, parseInt(input.value) || 0);
                        renderPlate();
                    }
                });
            });

            // Remove handlers
            mpPlate.querySelectorAll('.plate-remove').forEach(btn => {
                btn.addEventListener('click', () => removeFromPlate(parseInt(btn.dataset.id)));
            });

            updateCalorieProgress(totalCalories);
            updateMealSplit(totalCalories);
            generateSuggestion(totalCalories);
        }

        function updateCalorieProgress(consumed) {
            if (!mpConsumedEl || !mpProgressEl) return;
            const goal = dailyCalorieGoal || 2000;
            const remaining = goal - consumed;

            mpConsumedEl.textContent = consumed;

            const remainLabel = document.getElementById('mp-remaining-label');
            if (remainLabel) {
                remainLabel.innerHTML = remaining >= 0
                    ? `Remaining: <strong>${remaining}</strong> kcal`
                    : `Over by: <strong style="color:#ef5350">${Math.abs(remaining)}</strong> kcal`;
            }

            const pct = Math.min((consumed / goal) * 100, 100);
            mpProgressEl.style.width = pct + '%';
            mpProgressEl.classList.toggle('over', consumed > goal);
        }

        // ---- MEAL SPLIT (Breakfast 30% / Lunch 40% / Dinner 30%) ----
        function updateMealSplit(totalConsumed) {
            const goal = dailyCalorieGoal || 2000;
            const bfCal = Math.round(goal * 0.30);
            const luCal = Math.round(goal * 0.40);
            const diCal = Math.round(goal * 0.30);

            const bfEl = document.getElementById('split-breakfast');
            const luEl = document.getElementById('split-lunch');
            const diEl = document.getElementById('split-dinner');
            const bfFoods = document.getElementById('split-breakfast-foods');
            const luFoods = document.getElementById('split-lunch-foods');
            const diFoods = document.getElementById('split-dinner-foods');

            if (bfEl) bfEl.textContent = bfCal + ' kcal';
            if (luEl) luEl.textContent = luCal + ' kcal';
            if (diEl) diEl.textContent = diCal + ' kcal';

            // Distribute plate items across meals proportionally
            if (plate.length === 0) {
                if (bfFoods) bfFoods.innerHTML = '<em>No foods yet</em>';
                if (luFoods) luFoods.innerHTML = '<em>No foods yet</em>';
                if (diFoods) diFoods.innerHTML = '<em>No foods yet</em>';
                return;
            }

            // Split plate items across meals: first items to breakfast, middle to lunch, rest to dinner
            const mealItems = { breakfast: [], lunch: [], dinner: [] };
            let runningCal = 0;

            plate.forEach(item => {
                const itemCals = Math.round((item.caloriesPer100g / 100) * item.grams);
                if (runningCal < bfCal) {
                    const available = bfCal - runningCal;
                    if (itemCals <= available) {
                        mealItems.breakfast.push({ name: item.name, grams: item.grams, kcal: itemCals });
                        runningCal += itemCals;
                    } else {
                        // Split this item between breakfast and lunch
                        const bfGrams = Math.round((available / item.caloriesPer100g) * 100);
                        const remaining = item.grams - bfGrams;
                        mealItems.breakfast.push({ name: item.name, grams: bfGrams, kcal: available });
                        runningCal += available;
                        const remCal = Math.round((item.caloriesPer100g / 100) * remaining);
                        mealItems.lunch.push({ name: item.name, grams: remaining, kcal: remCal });
                        runningCal += remCal;
                    }
                } else if (runningCal < bfCal + luCal) {
                    const available = (bfCal + luCal) - runningCal;
                    if (itemCals <= available) {
                        mealItems.lunch.push({ name: item.name, grams: item.grams, kcal: itemCals });
                        runningCal += itemCals;
                    } else {
                        const luGrams = Math.round((available / item.caloriesPer100g) * 100);
                        const remaining = item.grams - luGrams;
                        mealItems.lunch.push({ name: item.name, grams: luGrams, kcal: available });
                        runningCal += available;
                        const remCal = Math.round((item.caloriesPer100g / 100) * remaining);
                        mealItems.dinner.push({ name: item.name, grams: remaining, kcal: remCal });
                        runningCal += remCal;
                    }
                } else {
                    mealItems.dinner.push({ name: item.name, grams: item.grams, kcal: itemCals });
                    runningCal += itemCals;
                }
            });

            // Render meal food lists
            function renderMealFoods(container, items) {
                if (!container) return;
                if (items.length === 0) {
                    container.innerHTML = '<em>—</em>';
                    return;
                }
                container.innerHTML = items.map(i =>
                    `<div class="meal-food-item"><span>${i.name}</span><span>${i.grams}g (${i.kcal} kcal)</span></div>`
                ).join('');
            }

            renderMealFoods(bfFoods, mealItems.breakfast);
            renderMealFoods(luFoods, mealItems.lunch);
            renderMealFoods(diFoods, mealItems.dinner);
        }

        // ---- AUTO-FILL PRESETS ----
        function autoFillByCategory(category) {
            const goal = dailyCalorieGoal || 2000;
            let foods;
            if (category === 'mix') {
                foods = [...foodData]; // all foods
            } else {
                foods = foodData.filter(f => f.type === category);
            }
            if (foods.length === 0) return;

            plate = [];
            const caloriesPerFood = Math.ceil(goal / foods.length);

            foods.forEach(food => {
                const gramsNeeded = Math.round((caloriesPerFood / food.calories) * 100);
                plate.push({
                    id: food.id,
                    name: food.name,
                    image: food.image,
                    caloriesPer100g: food.calories,
                    unit: food.unit,
                    grams: Math.max(10, gramsNeeded)
                });
            });
            renderPlate();
        }

        // Bind auto-fill buttons
        const autoVeg = document.getElementById('auto-veg');
        const autoFruit = document.getElementById('auto-fruit');
        const autoProtein = document.getElementById('auto-protein');
        const autoMix = document.getElementById('auto-mix');
        const autoClear = document.getElementById('auto-clear');

        if (autoVeg) autoVeg.addEventListener('click', () => autoFillByCategory('vegetable'));
        if (autoFruit) autoFruit.addEventListener('click', () => autoFillByCategory('fruit'));
        if (autoProtein) autoProtein.addEventListener('click', () => autoFillByCategory('meat'));
        if (autoMix) autoMix.addEventListener('click', () => autoFillByCategory('mix'));
        if (autoClear) autoClear.addEventListener('click', () => { plate = []; renderPlate(); });

        function generateSuggestion(consumed) {
            if (!mpSuggestion) return;
            const goal = dailyCalorieGoal || 2000;
            const remaining = goal - consumed;

            if (remaining <= 0) {
                mpSuggestion.classList.remove('hidden');
                mpSuggestion.innerHTML = consumed === goal
                    ? '🎉 <strong>Perfect!</strong> You\'ve reached your daily calorie goal exactly!'
                    : '⚠️ You\'re <strong>' + Math.abs(remaining) + ' kcal over</strong> your daily goal. Consider reducing portions.';
                return;
            }

            const plateIds = plate.map(p => p.id);
            const unused = foodData.filter(f => !plateIds.includes(f.id));
            let suggestions = [];

            unused.slice(0, 3).forEach(food => {
                const gramsNeeded = Math.round((remaining / food.calories) * 100);
                if (gramsNeeded > 0) {
                    suggestions.push(`<strong>${gramsNeeded}g</strong> of ${food.name}`);
                }
            });

            plate.slice(0, 2).forEach(item => {
                const extraGrams = Math.round((remaining / item.caloriesPer100g) * 100);
                if (extraGrams > 0) {
                    suggestions.push(`<strong>${extraGrams}g more</strong> of ${item.name}`);
                }
            });

            if (suggestions.length > 0) {
                mpSuggestion.classList.remove('hidden');
                mpSuggestion.innerHTML = `💡 You still need <strong>${remaining} kcal</strong>. Try adding: ${suggestions.join(' or ')}.`;
            } else {
                mpSuggestion.classList.add('hidden');
            }
        }

        // Observe section changes to init meal planner
        const mpSection = document.getElementById('step-meal-planner');
        if (mpSection) {
            const observer = new MutationObserver(() => {
                if (mpSection.classList.contains('active')) {
                    if (mpGoalEl) mpGoalEl.textContent = dailyCalorieGoal || 2000;
                    if (!dailyCalorieGoal) dailyCalorieGoal = 2000;
                    renderMpFoodSelector();
                    renderPlate();
                }
            });
            observer.observe(mpSection, { attributes: true, attributeFilter: ['class'] });
        }

        renderMpFoodSelector();

        // =============== MEAL REMINDERS (Browser Notifications) ===============
        let remindersActive = false;
        let reminderInterval = null;
        const btnRemind = document.getElementById('btn-set-reminders');
        const reminderStatus = document.getElementById('reminder-status');

        // Get meal items for notification body
        function getMealFoodsText(mealKey) {
            const container = document.getElementById('split-' + mealKey + '-foods');
            if (!container) return 'Your planned foods';
            const items = container.querySelectorAll('.meal-food-item');
            if (items.length === 0) return 'No foods planned yet';
            let lines = [];
            items.forEach(item => {
                lines.push(item.textContent.trim());
            });
            return lines.join('\n');
        }

        function sendMealNotification(mealName, mealEmoji, mealKey) {
            const kcalEl = document.getElementById('split-' + mealKey);
            const kcal = kcalEl ? kcalEl.textContent : '';
            const foods = getMealFoodsText(mealKey);

            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(mealEmoji + ' ' + mealName + ' Time!', {
                    body: kcal + '\n' + foods,
                    icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f37d.svg',
                    tag: 'foodiekdy-' + mealKey,
                    requireInteraction: true
                });
            }
        }

        // Track which notifications already fired today (avoid repeats)
        let firedToday = {};

        function checkAndFireReminders() {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            const todayKey = now.toDateString();

            // Reset fired tracker at midnight
            if (firedToday._date !== todayKey) {
                firedToday = { _date: todayKey };
            }

            const meals = [
                { key: 'breakfast', name: 'Breakfast', emoji: '🌅', inputId: 'remind-breakfast' },
                { key: 'lunch', name: 'Lunch', emoji: '☀️', inputId: 'remind-lunch' },
                { key: 'dinner', name: 'Dinner', emoji: '🌙', inputId: 'remind-dinner' }
            ];

            meals.forEach(meal => {
                const input = document.getElementById(meal.inputId);
                if (!input) return;
                const setTime = input.value; // "HH:MM"
                if (currentTime === setTime && !firedToday[meal.key]) {
                    firedToday[meal.key] = true;
                    sendMealNotification(meal.name, meal.emoji, meal.key);
                }
            });
        }

        if (btnRemind) {
            btnRemind.addEventListener('click', async () => {
                if (remindersActive) {
                    // Disable
                    remindersActive = false;
                    clearInterval(reminderInterval);
                    reminderInterval = null;
                    btnRemind.textContent = '🔔 Enable Meal Reminders';
                    btnRemind.classList.remove('active');
                    if (reminderStatus) reminderStatus.textContent = 'Reminders disabled.';
                    return;
                }

                // Request notification permission
                if (!('Notification' in window)) {
                    if (reminderStatus) reminderStatus.textContent = '❌ Notifications are not supported in this browser.';
                    return;
                }

                let perm = Notification.permission;
                if (perm === 'default') {
                    perm = await Notification.requestPermission();
                }

                if (perm !== 'granted') {
                    if (reminderStatus) reminderStatus.textContent = '❌ Please allow notifications in your browser settings.';
                    return;
                }

                // Enable reminders
                remindersActive = true;
                firedToday = { _date: new Date().toDateString() };
                reminderInterval = setInterval(checkAndFireReminders, 30000); // check every 30 seconds
                checkAndFireReminders(); // check immediately

                btnRemind.textContent = '✅ Reminders Active — Click to Disable';
                btnRemind.classList.add('active');

                const bfTime = document.getElementById('remind-breakfast')?.value || '08:00';
                const luTime = document.getElementById('remind-lunch')?.value || '13:00';
                const diTime = document.getElementById('remind-dinner')?.value || '19:00';
                if (reminderStatus) {
                    reminderStatus.innerHTML = `🔔 Active! Breakfast at <strong>${bfTime}</strong>, Lunch at <strong>${luTime}</strong>, Dinner at <strong>${diTime}</strong>`;
                }

                // Test notification immediately
                new Notification('🍽️ Foodie KDY Reminders Active!', {
                    body: 'You\'ll be notified at meal times with your planned foods.',
                    icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f514.svg'
                });
            });
        }

        // =============== INTRO ANIMATION ===============
        playIntro(words);
    }

    // =============== INTRO ANIMATION ===============
    function playIntro(words) {
        let index = 0;
        dynamicWord.innerText = words[0] || 'Strength';

        const interval = setInterval(() => {
            dynamicWord.classList.add('fade-out');
            setTimeout(() => {
                index++;
                if (index < words.length) {
                    dynamicWord.innerText = words[index];
                    dynamicWord.classList.remove('fade-out');
                    dynamicWord.classList.add('scale-up');
                    setTimeout(() => dynamicWord.classList.remove('scale-up'), 200);
                } else {
                    clearInterval(interval);
                    finishIntro();
                }
            }, 300);
        }, 1200);
    }

    function finishIntro() {
        header.classList.remove('full-screen');
        dynamicWord.classList.remove('fade-out');
        setTimeout(() => {
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('visible');
        }, 1000);
    }

    // =============== NAVIGATION ===============
    function showSection(sectionId) {
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === sectionId) {
                sec.classList.add('active');
                window.scrollTo(0, 0);
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => showSection(btn.dataset.next));
    });
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => showSection(btn.dataset.back));
    });

    // =============== INIT — LOAD FROM FIREBASE ===============
    async function init() {
        let data = null;

        if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
            try {
                data = await fbGetAll();
            } catch (err) {
                console.warn('Firebase read failed, using defaults:', err);
            }
        }

        applyData(data);
    }

    init();

});
