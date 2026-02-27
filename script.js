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

        calculateBtn.addEventListener('click', () => {
            const age = parseInt(ageInput.value);
            const gender = document.querySelector('input[name="gender"]:checked').value;
            if (!age || age < 1) { alert("Please enter a valid age."); return; }
            const calories = calculateDailyCalories(age, gender);
            resultMessage.style.display = 'block';
            resultMessage.innerHTML = `Based on your age (${age}) and gender (${gender}), your estimated daily requirement is <strong>${calories} kcal</strong>.`;
            resultMessage.classList.remove('hidden');
            calcNextBtn.classList.remove('hidden');
        });

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
