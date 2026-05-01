document.addEventListener("DOMContentLoaded", () => {
let decayInterval = null; //established the decayInterval
    // Grab the screens from the DOM
    const homeScreen = document.getElementById("home-screen");
    const nameScreen = document.getElementById("name-entry-screen");
    const countryScreen = document.getElementById("country-entry-screen");
    const storyScreenOne = document.getElementById("story-screen-1");
    const instructionScreen = document.getElementById("instruction-screen");
    const petSelectScreen = document.getElementById("pet-selection-screen");
    const confirmPetNameScreen = document.getElementById("naming-pet-screen");
    const gameDashboard  = document.getElementById("game-dashboard");

    //Grab the buttons from the DOM
    const startBtn = document.getElementById("home-start-button");
    const confirmNameBtn = document.getElementById("confirm-name-btn");
    const confirmCountryBtn = document.getElementById("confirm-country-btn");
    const backToBeginningBtn = document.getElementById("restart-button");

    //this is a resusable function that allows for ease of navigation between  screens
    function showScreen(screenToShow) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));

        const screen = document.getElementById(screenToShow);
        if (!screen) {
            console.error("Screen not found:", screenToShow);
            return;
        }
        screen.classList.add('active');
    }

    startBtn.addEventListener("click", () => {
        showScreen("name-entry-screen");
    });


    //ensures that a name has been entered without spaces
    function validateEntry(fieldData, screenToShow) {
        var element = document.getElementById(fieldData); 

        if (!element) 
        {
            console.error("Element not found:" + fieldData);
            return false;
        }

        var x = element.value.trim(); 

        if (x === "") {
            alert("A value must be entered!");
            return false;
        }

        showScreen(screenToShow);
        return true;
    }


    //gets the pet name and displays a message 
    function printPetName(fieldData, screenToShow) {
        let inputPetName = validateEntry(fieldData, screenToShow);

        if (inputPetName) {
            let petName = document.getElementById("pet-name-entry-box").value;
            alert("Your Algo Pal's name is " + petName + "!");
            return true;
        }
    }


    //gets the players name to store
    function getEnteredName(enteredName) {
        let playerName = "";
        playerName = document.getElementById(enteredName).value;
        document.getElementById("player-name").textContent = playerName;
        document.getElementById("player-name-1").textContent = playerName;

    }


    //confirms that the name is entered and stored
    confirmNameBtn.addEventListener("click", () => {
        getEnteredName("name-entry-box");
        validateEntry("name-entry-box", "country-entry-screen");
    });


    //grabs all the countries that are stored with the json file so that it can be displayed
    fetch("data/countries.json")
        .then(res => res.json())
        .then(data => {
            let select = document.getElementById("countrySelect");

            data.sort((a, b) => a.name.localeCompare(b.name)); //sorts alphabetically

            data.forEach(country => {
                let option = document.createElement("option");
                option.value = country.name;
                option.textContent = country.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading countries:", error));

        //gets the selected country from the drop down and displays it where necessary
    function getPlayerCountry() {
        let playerCountry = "";
        playerCountry = document.getElementById("countrySelect").value;
        document.getElementById("player-country").textContent = playerCountry;
        document.getElementById("player-country-1").textContent = playerCountry;

    }


  //confirms a country has been selected 
    confirmCountryBtn.addEventListener("click", () => {
        getPlayerCountry();
        validateEntry("countrySelect", "story-screen-1");
    });


    //navigation for the player story
    document.querySelectorAll(".skip-button").forEach(btn => {
        btn.addEventListener("click", () => {
            showScreen("instruction-screen");
        });
    });


//
    document.querySelectorAll(".next-button").forEach(btn => {
        btn.addEventListener("click", () => {
            const current = document.querySelector(".screen.active");
            const next = current.nextElementSibling;
            if (next && next.classList.contains("screen")) {
                current.classList.remove("active");
                next.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".back-button").forEach(btn => {
        btn.addEventListener("click", () => {
            const current = document.querySelector(".screen.active");
            const prev = current.previousElementSibling;
            if (prev && prev.classList.contains("screen")) {
                current.classList.remove("active");
                prev.classList.add("active");
            }
        });
    });

    //at the end of the instruction, go to pet selection screen
    const petSelectionBtn = document.getElementById("instruction-end");

    petSelectionBtn.addEventListener("click", () => {
        showScreen("pet-selection-screen");
    });


    // get the pet name and save it, prints a message if successful, also validates if something has been entered
    const confirmPetNameBtn = document.getElementById("confirm-pet-name-btn");

   function getPetName(enteredPetName) {
        let petName = "";
        petName = document.getElementById(enteredPetName).value;
        document.getElementById("pet-name-1").textContent = petName;

    }

confirmPetNameBtn.addEventListener("click", () => {
    validateEntry("pet-name-entry-box", "game-dashboard");
    printPetName("pet-name-entry-box", "game-dashboard");
    getPetName("pet-name-entry-box");

//the runaway screen, allows for user to restart the game
  backToBeginningBtn.addEventListener("click", () => {
            showScreen("home-screen");
    });


//generates random percentages between 20% to 70% 
function getRandomStat(){
    return Math.floor(Math.random() * (70 - 20 + 1)) + 20;
}

    petStats = {
        hunger:  getRandomStat(),
        happiness:  getRandomStat(),
        energy:  getRandomStat(),
        cleanliness:  getRandomStat()
    };
    updateStatDisplays();
    updatePointsDisplay();
    startDecayTimer();
});

//goes back to the pet selection screen if player wants to redo their choice
    const backToPetSelectionBtn = document.getElementById("back-to-selection-btn");
    backToPetSelectionBtn.addEventListener("click", () => {
        const current = document.querySelector(".screen.active");
        const prev = current.previousElementSibling;
        if (prev && prev.classList.contains("screen")) {
            current.classList.remove("active");
            prev.classList.add("active");
        }
    });

    //verfies which one of the pets are selected
    const options = document.querySelectorAll('.pet-option');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const isSelected = option.classList.contains('selected');

            options.forEach(o => o.classList.remove('selected'));

            if (!isSelected) {
                option.classList.add('selected');
            }
        });
    });

    //verifies that a pet was selected, displays a message if nothing was selected
    function verifyPetSelection(toNextScreen) {
        const petSelected = document.querySelector('.pet-option.selected');
        if (!petSelected) {
            alert("An option must be selected!");
            return false;
        }
        showScreen(toNextScreen);
        return true;
    }


    const confirmPetSelectionBtn = document.getElementById("pet-selection-button");

    confirmPetSelectionBtn.addEventListener("click", () => {
        verifyPetSelection("naming-pet-screen");
    });

//storage of categories for purchase within the store
    const storeCategories = [
        {
            name: "Toys",
            items: [
                { id: 'ball', name: 'Bouncy Ball', price: 15 },
                { id: 'squeaky_toy', name: 'Squeaky Mouse', price: 18 },
                { id: 'plushie', name: 'Cozy Plushie', price: 22 }
            ]
        },
        {
            name: "Food",
            items: [
                { id: 'chicken_leg', name: 'Chicken Leg', price: 20 },
                { id: 'kibble', name: 'Premium Kibble', price: 15 },
                { id: 'boiled_egg', name: 'Boiled Egg', price: 12 }
            ]
        },
        {
            name: "Rest",
            items: [
                { id: 'pet_bed', name: 'Fluffy Bed', price: 35 },
                { id: 'cardboard_box', name: 'Cardboard Box', price: 8 },
                { id: 'pet_cot', name: 'Raised Cot', price: 28 }
            ]
        },
        {
            name: "Cleanliness",
            items: [
                { id: 'soft_brush', name: 'Brush', price: 18 },
                { id: 'bar_soap', name: 'Soap', price: 12 },
                { id: 'liquid_soap', name: 'Shampoo', price: 15 }
            ]
        }
    ];

    let currentCategoryIndex = 0; 


    //gets current amount of Algo Points available to the user
    function getCurrentPoints() {
        const pointsElem = document.getElementById('algo-point-counter');
        if (pointsElem) {
            return parseInt(pointsElem.innerText, 10) || 0;
        }
        return 0;
    }

    //updates the algo point conter
    function updatePointsDisplay() {
        const pointsSpan = document.getElementById('store-points-display');
        if (pointsSpan) {
            pointsSpan.innerText = getCurrentPoints();
        }
    }


    //mapping items from the store to the player's inventory
    const storeToInventoryMap = {
    'Bouncy Ball': 'ball',       
    'Squeaky Mouse': 'squeaky_toy', 
    'Cozy Plushie': 'plushie',
    'Chicken Leg': 'chicken_leg',
    'Premium Kibble': 'kibble',
    'Boiled Egg': 'boiled_egg',
    'Fluffy Bed': 'pet_bed',
    'Cardboard Box': 'cardboard_box',
    'Raised Cot': 'pet_cot',
    'Brush': 'soft_brush',
    'Soap': 'bar_soap',
    'Shampoo': 'liquid_soap'
    };

    //this is navigation for the store 
    function setupStoreBuyButtons() {
    document.querySelectorAll('#store-items-list .buy-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }

        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const price = parseInt(this.getAttribute('data-price'));
            const itemName = this.getAttribute('data-name');
            let currentPoints = getCurrentPoints();

            if (currentPoints >= price) {
                currentPoints -= price;
                const pointsElem = document.getElementById('algo-point-counter');
                if (pointsElem) {
                    pointsElem.innerText = currentPoints.toString().padStart(2, '0');
                }
                updatePointsDisplay();

                const inventoryId = storeToInventoryMap[itemName];
                if (inventoryId) {
                    addToInventory(inventoryId, 1);
                    alert(`You bought ${itemName}! It has been added to your inventory.`);
                    
                    if (isInventoryMenuOpen) {
                        renderInventory();
                    }
                } else {
                    alert(`You bought ${itemName}! `);
                }
            } else {
                alert(`Not enough points! Need ${price} points. You have ${currentPoints}.`);
            }
        });
    });
}
// Displays the items within the store based on the category asigned to it: Happiness, Rest etc. 
    function renderCurrentCategory() {
        const container = document.getElementById('store-items-list');
        const categoryTitle = document.getElementById('store-category-title');

        if (!container) return;

        const category = storeCategories[currentCategoryIndex];
        if (categoryTitle) categoryTitle.textContent = category.name;

        container.innerHTML = '';

        category.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'store-item';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                </div>
                <div class="item-price">
                    <span> ${item.price}</span>
                </div>
                <button class="buy-btn" data-price="${item.price}" data-name="${item.name}"> BUY </button>
            `;
            container.appendChild(itemDiv);
        });

        setupStoreBuyButtons();
    }

    function prevCategory() {
        currentCategoryIndex--;
        if (currentCategoryIndex < 0) {
            currentCategoryIndex = storeCategories.length - 1;
        }
        renderCurrentCategory();
    }

    function nextCategory() {
        currentCategoryIndex++;
        if (currentCategoryIndex >= storeCategories.length) {
            currentCategoryIndex = 0;
        }
        renderCurrentCategory();
    }

    function openStoreMenu() {
        const storeMenu = document.getElementById('store-mini-menu');
        if (!storeMenu) return;

        currentCategoryIndex = 0; 
        updatePointsDisplay();
        renderCurrentCategory();
        storeMenu.classList.remove('hidden');
        isMenuOpen = true;
    }

    function closeStoreMenu() {
        const storeMenu = document.getElementById('store-mini-menu');
        if (storeMenu) {
            storeMenu.classList.add('hidden');
            isMenuOpen = false;
        }
    }

    let isMenuOpen = false;

    const storeContainer = document.getElementById('store-container');
    const storeMenu = document.getElementById('store-mini-menu');

    if (storeContainer) {
        storeContainer.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isMenuOpen) {
                closeStoreMenu();
            } else {
                openStoreMenu();
            }
        });
    }

    const prevBtn = document.getElementById('store-prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            prevCategory();
        });
    }

    const nextBtn = document.getElementById('store-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nextCategory();
        });
    }

    const closeBtn = document.getElementById('close-store-menu');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeStoreMenu();
        });
    }

    document.addEventListener('click', function(e) {
        if (isMenuOpen && storeContainer && !storeContainer.contains(e.target)) {
            closeStoreMenu();
        }
    });

    if (storeMenu) {
        storeMenu.classList.add('hidden');
    }


    // default values for the player inventory
    let playerInventory = {
        'ball': { name: 'Bouncy Ball', category: 'Toys', count: 0 },
        'squeaky_toy': { name: ' Squeaky Mouse', category: 'Toys', count: 0 },
        'plushie': { name: ' Cozy Plushie', category: 'Toys', count: 0 },
        'chicken_leg': { name: ' Chicken Leg', category: 'Food', count: 0 },
        'kibble': { name: 'Premium Kibble', category: 'Food', count: 0 },
        'boiled_egg': { name: ' Boiled Egg', category: 'Food', count: 0 },
        'pet_bed': { name: 'Fluffy Bed', category: 'Rest', count: 0 },
        'cardboard_box': { name: ' Cardboard Box', category: 'Rest', count: 0 },
        'pet_cot': { name: 'Raised Cot', category: 'Rest', count: 0 },
        'soft_brush': { name: 'Brush', category: 'Cleanliness', count: 0 },
        'bar_soap': { name: 'Soap', category: 'Cleanliness', count: 0 },
        'liquid_soap': { name: 'Shampoo', category: 'Cleanliness', count: 0 }
    };

    //loads the inventory of purchased items 
    function loadInventory() {
        const savedInventory = localStorage.getItem('algoPetsInventory');
        if (savedInventory) {
            try {
                const parsed = JSON.parse(savedInventory);
                Object.keys(playerInventory).forEach(key => {
                    if (parsed[key] && typeof parsed[key].count === 'number') {
                        playerInventory[key].count = parsed[key].count;
                    }
                });
            } catch (e) {
                console.error('Failed to load inventory:', e);
            }
        }
    }

    //saves the purchased items to inventory json local storage 
    function saveInventory() {
        localStorage.setItem('algoPetsInventory', JSON.stringify(playerInventory));
    }


    // adds up the total items purchases, increments with each purchase
    function addToInventory(itemId, quantity = 1) {
        if (playerInventory[itemId]) {
            playerInventory[itemId].count += quantity;
            saveInventory();
            renderInventory(); 
            return true;
        }
        return false;
    }

    // gets the current count of items 
    function getItemCount(itemId) {
        return playerInventory[itemId] ? playerInventory[itemId].count : 0;
    }

    function getTotalItemCount() {
        let total = 0;
        Object.keys(playerInventory).forEach(key => {
            total += playerInventory[key].count;
        });
        return total;
    }


    //displays the inventory within the specified area
    function renderInventory() {
        const container = document.getElementById('inventory-items-list');
        if (!container) return;

        const ownedItems = Object.keys(playerInventory).filter(key => playerInventory[key].count > 0);

        if (ownedItems.length === 0) {
            container.innerHTML = '<div class="empty-inventory">No items yet!<br>Visit the store to buy items!</div>';
        } else {
            container.innerHTML = '';
            ownedItems.forEach(key => {
                const item = playerInventory[key];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.innerHTML = `
                    <div class="inventory-item-info">
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-category">${item.category}</div>
                    </div>
                    <div class="inventory-item-count">✖ ${item.count}</div>
                `;
                container.appendChild(itemDiv);
            });
        }

        const totalSpan = document.getElementById('total-items-count');
        if (totalSpan) {
            totalSpan.innerText = getTotalItemCount();
        }
    }

    let isInventoryMenuOpen = false;
    const inventoryContainer = document.getElementById('player-inventory-container');
    const inventoryMenu = document.getElementById('inventory-mini-menu');

    function openInventoryMenu() {
        if (!inventoryMenu) return;
        renderInventory(); 
        inventoryMenu.classList.remove('hidden');
        isInventoryMenuOpen = true;
    }

    function closeInventoryMenu() {
        if (inventoryMenu) {
            inventoryMenu.classList.add('hidden');
            isInventoryMenuOpen = false;
        }
    }

    if (inventoryContainer) {
        inventoryContainer.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isInventoryMenuOpen) {
                closeInventoryMenu();
            } else {
                openInventoryMenu();
            }
        });
    }

    // Close inventory button
    const closeInventoryBtn = document.getElementById('close-inventory-menu');
    if (closeInventoryBtn) {
        closeInventoryBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeInventoryMenu();
        });
    }

    // Close inventory when clicking outside
    document.addEventListener('click', function(e) {
        if (isInventoryMenuOpen && inventoryContainer && !inventoryContainer.contains(e.target)) {
            closeInventoryMenu();
        }
    });

    // Initialize inventory on page load
    loadInventory();
    
    // Initial render of inventory
    if (inventoryMenu && inventoryMenu.classList.contains('hidden') === false) {
        renderInventory();
    }

// maps the pet stats back to the catergory it falls under - e.g food replinishes hunger stat 
const categoryToStatMap = {
    'Food': { stat: 'hunger', displayName: 'Hunger', effect: '+2', maxEffect: 100, message: 'yum!' },
    'Toys': { stat: 'happiness', displayName: 'Happiness', effect: '+3', maxEffect: 100, message: 'had so much fun!' },
    'Rest': { stat: 'energy', displayName: 'Energy', effect: '+9', maxEffect: 100, message: 'took a cozy nap!' },
    'Cleanliness': { stat: 'cleanliness', displayName: 'Cleanliness', effect: '+8', maxEffect: 100, message: 'feels so fresh!' }
};

let currentInteractionStat = null;

//displays the items available for each type of interaction
function openPetInteractionMenu(statKey, displayName) {
    const interactionMenu = document.getElementById('pet-interaction-menu');
    if (!interactionMenu) {
        console.error("Pet interaction menu not found");
        return;
    }
    
    currentInteractionStat = statKey;
    
    const menuTitle = document.getElementById('interaction-menu-title');
    if (menuTitle) {
        menuTitle.textContent = `Use ${displayName} Items`;
    }
    
    let category = null;
    let effectAmount = 0;
    let message = '';
    
    for (const [cat, data] of Object.entries(categoryToStatMap)) {
        if (data.stat === statKey) {
            category = cat;
            effectAmount = parseInt(data.effect);
            message = data.message;
            break;
        }
    }
    
    if (!category) {
        console.error("No category found for stat:", statKey);
        return;
    }
    
    const usableItems = Object.entries(playerInventory)
        .filter(([id, item]) => item.category === category && item.count > 0)
        .map(([id, item]) => ({
            id: id,
            name: item.name,
            count: item.count,
            effect: effectAmount,
            message: message
        }));
    
    const itemsContainer = document.getElementById('interaction-items-list');
    if (!itemsContainer) return;
    
    if (usableItems.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-interaction-items">
                No ${category.toLowerCase()} items available!<br>
                Visit the store to buy some!
            </div>
        `;
    } else {
        itemsContainer.innerHTML = '';
        usableItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'interaction-item';
            itemDiv.innerHTML = `
                <div class="interaction-item-info">
                    <div class="interaction-item-name">${item.name}</div>
                </div>
                <div class="interaction-item-count"> ${item.count}</div>
                <button class="use-item-btn" data-item-id="${item.id}" data-item-name="${item.name}">
                    USE
                </button>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }
    
    interactionMenu.classList.remove('hidden');
    isInteractionMenuOpen = true;
}

function closePetInteractionMenu() {
    const interactionMenu = document.getElementById('pet-interaction-menu');
    if (interactionMenu) {
        interactionMenu.classList.add('hidden');
        isInteractionMenuOpen = false;
        currentInteractionStat = null;
    }
}

//allows for use of available items for the pets
function useItemOnPet(itemId, itemName, statKey, effectAmount, message) {
    if (!playerInventory[itemId] || playerInventory[itemId].count <= 0) {
        alert(`You don't have any ${itemName} left!`);
        closePetInteractionMenu();
        return;
    }
    
    let currentStatValue = petStats[statKey];
    let newStatValue = Math.min(currentStatValue + effectAmount, 100);
    petStats[statKey] = newStatValue;
    
    playerInventory[itemId].count--;
    saveInventory();
    
    updateStatDisplays();
    
    const petName = document.getElementById("pet-name-display")?.textContent || "Your Algo Pal";
    alert(`${petName} used ${itemName}! ${message} ${message.includes('Hunger') ? 'Hunger' : message.includes('Happiness') ? 'Happiness' : message.includes('Energy') ? 'Energy' : 'Cleanliness'} increased by ${effectAmount}!`);
    
    if (currentInteractionStat) {
        const displayName = categoryToStatMap[Object.keys(categoryToStatMap).find(key => categoryToStatMap[key].stat === currentInteractionStat)]?.displayName || '';
        openPetInteractionMenu(currentInteractionStat, displayName);
    } else {
        closePetInteractionMenu();
    }
}

//updates the status percentages
function updateStatDisplays() {
    const hungerFill = document.getElementById('hunger-meter');
    const boredomFill = document.getElementById('boredom-meter');
    const restFill = document.getElementById('rest-meter');
    const cleanlinessFill = document.getElementById('cleanliness-meter');
    
    if (hungerFill) hungerFill.style.width = `${petStats.hunger}%`;
    if (boredomFill) boredomFill.style.width = `${petStats.happiness}%`;
    if (restFill) restFill.style.width = `${petStats.energy}%`;
    if (cleanlinessFill) cleanlinessFill.style.width = `${petStats.cleanliness}%`;
    
    const hungerText = document.getElementById('hunger-meter');
    const boredomText = document.getElementById('boredom-meter');
    const restText = document.getElementById('rest-meter');
    const cleanlinessText = document.getElementById('cleanliness-meter');
    
    if (hungerText) hungerText.textContent = `${petStats.hunger}%`;
    if (boredomText) boredomText.textContent = `${petStats.happiness}%`;
    if (restText) restText.textContent = `${petStats.energy}%`;
    if (cleanlinessText) cleanlinessText.textContent = `${petStats.cleanliness}%`;
}


//only opens up the correct items based on the category they are used for 
function setupInteractionButtons() {
    const hungerContainer = document.getElementById('hunger-container');
    const boredomContainer = document.getElementById('boredom-container');
    const restContainer = document.getElementById('rest-container');
    const cleanlinessContainer = document.getElementById('cleanliness-container');
    
    const hungerBtn = document.getElementById('hunger-btn');
    const boredomBtn = document.getElementById('boredom-btn');
    const restBtn = document.getElementById('rest-btn');
    const cleanlinessBtn = document.getElementById('cleanliness-btn');
    
    if (hungerContainer) {
        hungerContainer.style.cursor = 'pointer';
        hungerContainer.addEventListener('click', () => openPetInteractionMenu('hunger', 'Hunger'));
    } else if (hungerBtn) {
        hungerBtn.addEventListener('click', () => openPetInteractionMenu('hunger', 'Hunger'));
    }
    
    if (boredomContainer) {
        boredomContainer.style.cursor = 'pointer';
        boredomContainer.addEventListener('click', () => openPetInteractionMenu('happiness', 'Happiness'));
    } else if (boredomBtn) {
        boredomBtn.addEventListener('click', () => openPetInteractionMenu('happiness', 'Happiness'));
    }
    
    if (restContainer) {
        restContainer.style.cursor = 'pointer';
        restContainer.addEventListener('click', () => openPetInteractionMenu('energy', 'Energy'));
    } else if (restBtn) {
        restBtn.addEventListener('click', () => openPetInteractionMenu('energy', 'Energy'));
    }
    
    if (cleanlinessContainer) {
        cleanlinessContainer.style.cursor = 'pointer';
        cleanlinessContainer.addEventListener('click', () => openPetInteractionMenu('cleanliness', 'Cleanliness'));
    } else if (cleanlinessBtn) {
        cleanlinessBtn.addEventListener('click', () => openPetInteractionMenu('cleanliness', 'Cleanliness'));
    }
}

let isInteractionMenuOpen = false;
const interactionMenu = document.getElementById('pet-interaction-menu');

document.addEventListener('click', function(e) {
    if (isInteractionMenuOpen && interactionMenu && !interactionMenu.contains(e.target)) {
        const isStatClick = e.target.closest('#hunger-container, #boredom-container, #rest-container, #cleanliness-container, #hunger-btn, #boredom-btn, #rest-btn, #cleanliness-btn');
        if (!isStatClick) {
            closePetInteractionMenu();
        }
    }
});

const closeInteractionBtn = document.getElementById('close-interaction-menu');
if (closeInteractionBtn) {
    closeInteractionBtn.addEventListener('click', closePetInteractionMenu);
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('use-item-btn')) {
        const itemId = e.target.getAttribute('data-item-id');
        const itemName = e.target.getAttribute('data-item-name');
        
        if (currentInteractionStat) {
            let effectAmount = 0;
            let message = '';
            
            for (const [cat, data] of Object.entries(categoryToStatMap)) {
                if (data.stat === currentInteractionStat) {
                    effectAmount = parseInt(data.effect);
                    message = data.message;
                    break;
                }
            }
            
            useItemOnPet(itemId, itemName, currentInteractionStat, effectAmount, message);
        }
    }
});

 setupInteractionButtons();

//maps the correct image based on what the user had selected , updates it and loads it unto specific areas

const petImages = {
    'pet-img-1': 'assets/dalmation/dog-1-dalmation-content.png',
    'pet-img-2': 'assets/tabby/cat-2-tabby-content.png', 
    'pet-img-3': 'assets/shepard/dog-1-shepard-content.png',
    'pet-img-4': 'assets/tuxedo/cat-2-tuxedo-content.png'
};

const petHeadShot = {
    'pet-img-1': 'assets/dalmation/dog-1-dalmation.png',
    'pet-img-2': 'assets/tabby/cat-2-tabby.png', 
    'pet-img-3': 'assets/shepard/dog-1-shepard.png',
    'pet-img-4': 'assets/tuxedo/cat-2-tuxedo.png'
};

let selectedPetId = 'pet-img-1';

function updateSelectedPetImage(petId, targetScreen = 'naming') {
    const namingImagePath = petHeadShot[petId];
    const dashboardImagePath = petImages[petId];
    
    if (namingImagePath && dashboardImagePath) {
        selectedPetId = petId;
        
        const selectedPetImg = document.getElementById('selected-pet-img');
        if (selectedPetImg) {
            selectedPetImg.src = namingImagePath;
        }
        
        const dashboardImg = document.getElementById('dashboard-pet-img');
        if (dashboardImg && targetScreen === 'dashboard') {
            dashboardImg.src = dashboardImagePath;
        }
        
        localStorage.setItem('selectedPetId', petId);
        localStorage.setItem('selectedPetNamingImage', namingImagePath);
        localStorage.setItem('selectedPetDashboardImage', dashboardImagePath);
    }
}

function loadPetToDashboard() {
    const savedPetId = localStorage.getItem('selectedPetId');
    const savedDashboardImage = localStorage.getItem('selectedPetDashboardImage');
    const savedNamingImage = localStorage.getItem('selectedPetNamingImage');
    
    if (savedPetId && savedDashboardImage) {
        selectedPetId = savedPetId;
        const dashboardImg = document.getElementById('dashboard-pet-img');
        if (dashboardImg) {
            dashboardImg.src = savedDashboardImage;
        }
    } else if (savedPetId && petHeadShot[savedPetId]) {
        const dashboardImg = document.getElementById('dashboard-pet-img');
        if (dashboardImg) {
            dashboardImg.src = petHeadShot[savedPetId];
        }
    }
}

function loadPetForNamingScreen() {
    const savedPetId = localStorage.getItem('selectedPetId');
    const savedNamingImage = localStorage.getItem('selectedPetNamingImage');
    
    if (savedPetId && savedNamingImage) {
        const namingPreview = document.getElementById('selected-pet-img');
        if (namingPreview) {
            namingPreview.src = savedNamingImage;
        }
    } else if (savedPetId && petImages[savedPetId]) {
        const namingPreview = document.getElementById('selected-pet-img');
        if (namingPreview) {
            namingPreview.src = petImages[savedPetId];
        }
    }
}

const petOptions = document.querySelectorAll('.pet-option');
petOptions.forEach(option => {
    option.addEventListener('click', () => {
        const petId = option.id;
        updateSelectedPetImage(petId, 'naming');
    });
});

if (confirmPetNameBtn) {
    confirmPetNameBtn.addEventListener('click', () => {
        loadPetToDashboard();
    });
}

const observer = new MutationObserver(() => {
    const dashboard = document.getElementById('game-dashboard');
    if (dashboard && dashboard.classList.contains('active')) {
        loadPetToDashboard();
    }
    
    const namingScreen = document.getElementById('naming-pet-screen');
    if (namingScreen && namingScreen.classList.contains('active')) {
        loadPetForNamingScreen();
    }
});
observer.observe(document.body, { attributes: false, childList: true, subtree: true });

loadPetForNamingScreen();


//starts applying the decay to the current pet status percentages
function applyDecay() {
    
    const oldStats = {...petStats};
    
    petStats.hunger = Math.max(0, petStats.hunger - 2);
    petStats.happiness = Math.max(0, petStats.happiness - 2);
    petStats.energy = Math.max(0, petStats.energy - 2);
    petStats.cleanliness = Math.max(0, petStats.cleanliness - 2);
    
    updateStatDisplays();
    
    if (petStats.hunger <= 0 || petStats.happiness <= 0 || 
        petStats.energy <= 0 || petStats.cleanliness <= 0) {
    checkifPetRunaway();
    }
}

//if any of the statuses reaches 0, the pet runaway screen will appear
function checkifPetRunaway()
{
    if(petStats.hunger <=0 || petStats.happiness <=0 || petStats.energy <= 0 || petStats.cleanliness <= 0){
        if(decayInterval){
            clearInterval(decayInterval);
            decayInterval = null;
        }

        const petNameSpan = document.getElementById("pet-name-1");
        const petName = petNameSpan ? petNameSpan.textContent : "Your Algo Pal";

        let reason = ""
        if (petStats.hunger <=0) reason = "starvation";
        else if (petStats.happiness <= 0) reason = "boredom";
        else if (petStats.energy <= 0) reason = "exhaustion";
        else if (petStats.cleanliness <= 0) reason = "neglect";

    const runawayText = document.getElementById("runaway-text");
    
    if(runawayText) 
        {
        runawayText.textContent = `Oh no! ${petName} has run away due to ${reason}! ${petName} couldn't handle it anymore.`;
        }
    const runawayScreen = document.getElementById("runaway-screen");  
    
    if (runawayScreen){
    showScreen("runaway-screen");
    } else {
            console.error("Runaway screen not found!");
            // Fallback to alert if screen doesn't exist
            alert(`Oh no! ${petName} has run away due to ${reason}!`);
        }
    }

}

//starts the decay timer
function startDecayTimer(){
    if(decayInterval){
         clearInterval(decayInterval);
        decayInterval = null;
    }

    decayInterval = setInterval(applyDecay, 10000);
}

//stops the timer when called
function stopDecayTimer(){
    if (decayInterval){
        clearInterval(decayInterval);
        decayInterval = null;
    }
}

//updates the pet status as time passes
function updateStatDisplays() {
    const hungerFill = document.getElementById('hunger-meter');
    const boredomFill = document.getElementById('boredom-meter');
    const restFill = document.getElementById('rest-meter');
    const cleanlinessFill = document.getElementById('cleanliness-meter');
    
    if (hungerFill) {
        hungerFill.textContent = `${petStats.hunger}%`;
        hungerFill.style.width = `${petStats.hunger}%`;
    }
    if (boredomFill) {
        boredomFill.textContent = `${petStats.happiness}%`;
        boredomFill.style.width = `${petStats.happiness}%`;
    }
    if (restFill) {
        restFill.textContent = `${petStats.energy}%`;
        restFill.style.width = `${petStats.energy}%`;
    }
    if (cleanlinessFill) {
        cleanlinessFill.textContent = `${petStats.cleanliness}%`;
        cleanlinessFill.style.width = `${petStats.cleanliness}%`;
    }
}

});