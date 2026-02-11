document.addEventListener('DOMContentLoaded', () => {

    // --- Data ---
    const foodData = [
        {
            id: 1,
            name: "Broccoli",
            type: "vegetable",
            calories: 34,
            unit: "100g",
            description: "A green superfood packed with fiber and vitamins C and K.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f966.svg"
        },
        {
            id: 2,
            name: "Carrot",
            type: "vegetable",
            calories: 41,
            unit: "100g",
            description: "Crunchy and sweet, excellent for eye health and immunity.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f955.svg"
        },
        {
            id: 3,
            name: "Spinach",
            type: "vegetable",
            calories: 23,
            unit: "100g",
            description: "Leafy green rich in iron and antioxidants for energy.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f96c.svg"
        },
        {
            id: 4,
            name: "Apple",
            type: "fruit",
            calories: 52,
            unit: "1 medium",
            description: "Crisp and refreshing, full of fiber to keep you full.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f34e.svg"
        },
        {
            id: 5,
            name: "Banana",
            type: "fruit",
            calories: 89,
            unit: "1 medium",
            description: "High in potassium, great for quick energy and muscle function.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f34c.svg"
        },
        {
            id: 6,
            name: "Berries",
            type: "fruit",
            calories: 57,
            unit: "100g",
            description: "Sweet, tangy, and loaded with heart-healthy antioxidants.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f353.svg"
        },
        {
            id: 7,
            name: "Grilled Chicken",
            type: "meat",
            calories: 165,
            unit: "100g",
            description: "Lean protein that helps build and repair muscle tissue.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f357.svg"
        },
        {
            id: 8,
            name: "Salmon Fish",
            type: "meat",
            calories: 208,
            unit: "100g",
            description: "Rich in omega-3 fatty acids for brain and heart health.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f41f.svg"
        },
        {
            id: 9,
            name: "Lean Mutton",
            type: "meat",
            calories: 143,
            unit: "100g",
            description: "A good source of iron and protein for strength and vitality.",
            image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f969.svg"
        }
    ];

    // --- Elements ---
    const calculateBtn = document.getElementById('calculate-btn');
    const ageInput = document.getElementById('age');
    const resultMessage = document.getElementById('result-message');
    const foodGallery = document.getElementById('food-gallery');
    const foodGrid = document.getElementById('food-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // --- Event Listeners ---
    calculateBtn.addEventListener('click', handleCalculation);

    // Initial Render
    renderFoodGrid('all');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            // Filter
            renderFoodGrid(btn.dataset.category);
        });
    });

    // --- Functions ---

    function handleCalculation() {
        const age = parseInt(ageInput.value);
        const gender = document.querySelector('input[name="gender"]:checked').value;

        if (!age || age < 1) {
            alert("Please enter a valid age.");
            return;
        }

        const calories = calculateDailyCalories(age, gender);

        resultMessage.style.display = 'block';
        resultMessage.innerHTML = `Based on your age (${age}) and gender (${gender}), your estimated daily requirement is <strong>${calories} kcal</strong>.`;
        resultMessage.classList.remove('hidden');
    }

    function calculateDailyCalories(age, gender) {
        // Simplified estimate based on average needs
        // Real formulas (Mifflin-St Jeor) usually require weight custom height.
        // We will use age-based averages for this awareness tool.

        let base = 2000;

        if (gender === 'male') {
            if (age < 18) base = 2400;     // Growing teen
            else if (age < 30) base = 2600; // Young adult
            else if (age < 50) base = 2400; // Adult
            else base = 2200;               // Older adult
        } else {
            if (age < 18) base = 2000;     // Growing teen
            else if (age < 30) base = 2200; // Young adult
            else if (age < 50) base = 2000; // Adult
            else base = 1800;               // Older adult
        }

        return base;
    }

    function renderFoodGrid(category) {
        foodGrid.innerHTML = ''; // Clear current

        const filtered = category === 'all'
            ? foodData
            : foodData.filter(item => item.type === category);

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

});
