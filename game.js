document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startGameBtn").addEventListener("click", function () {
        document.getElementById("gamePopup").style.display = "block";
        setupGame();
    });

    document.getElementById("submitGroupBtn").addEventListener("click", function () {
        if (selectedWords.length === 4) {
            checkGroup(selectedWords);
        } else {
            alert("Please select exactly 4 words to form a group.");
        }
    });

    document.getElementById("closePopup").addEventListener("click", function () {
        document.getElementById("gamePopup").style.display = "none";
    });

    // Define all possible groups
    const allGroups = [
        { words: ["HAMLET", "OTHELLO", "MACBETH", "LEAR"], theme: "SHAKESPEARE TRAGEDIES", color: "Yellow" },
        { words: ["SUNFLOWER", "TULIP", "ROSE", "DAISY"], theme: "FLOWERS", color: "Yellow" },
        { words: ["PIANO", "GUITAR", "VIOLIN", "DRUMS"], theme: "MUSICAL INSTRUMENTS", color: "Yellow" },
        { words: ["ORION", "DRACO", "LYRA", "SCORPIUS"], theme: "CONSTELLATIONS", color: "Green" },
        { words: ["EAGLE", "FALCON", "HAWK", "CONDOR"], theme: "BIRDS OF PREY", color: "Green" },
        { words: ["HEART", "CLUB", "SPADE", "DIAMOND"], theme: "CARD SUITS", color: "Green" },
        { words: ["JUPITER", "SATURN", "NEPTUNE", "MARS"], theme: "SOLAR SYSTEM PLANETS", color: "Green" },
        { words: ["BEAGLE", "BOXER", "POODLE", "MASTIFF"], theme: "DOG BREEDS", color: "Blue" },
        { words: ["COPPER", "GOLD", "SILVER", "PLATINUM"], theme: "METAL ELEMENTS", color: "Blue" },
        { words: ["SPHINX", "PYRAMIDS", "PHARAOH", "NILE"], theme: "ANCIENT EGYPT", color: "Blue" },
        { words: ["NILE", "AMAZON", "MISSISSIPPI", "YANGTZE"], theme: "RIVERS", color: "Blue" },
        { words: ["SHERLOCK", "POIROT", "MARPLE", "HOLMES"], theme: "FICTIONAL DETECTIVES", color: "Purple" },
        { words: ["SALSA", "TANGO", "WALTZ", "FOXTROT"], theme: "DANCE STYLES", color: "Purple" },
        { words: ["SOPRANO", "ALTO", "TENOR", "BASS"], theme: "SINGING VOICES", color: "Purple" },
        { words: ["PYTHON", "JAVA", "RUBY", "C++"], theme: "PROGRAMMING LANGUAGES", color: "Purple" },
        { words: ["GIRAFFE", "ANTELOPE", "ZEBRA", "WILDEBEEST"], theme: "SAVANNA ANIMALS", color: "Yellow" },
        { words: ["TESLA", "FARADAY", "EDISON", "CURIE"], theme: "FAMOUS SCIENTISTS", color: "Green" },
        { words: ["ALGEBRA", "CALCULUS", "GEOMETRY", "TRIGONOMETRY"], theme: "MATH BRANCHES", color: "Green" },
        { words: ["FALCON", "ATLAS", "SATURN", "DELTA"], theme: "ROCKETS", color: "Blue" },
        { words: ["PIXEL", "BITMAP", "VECTOR", "RASTER"], theme: "GRAPHIC FORMATS", color: "Blue" },
        { words: ["HYDROGEN", "HELIUM", "OXYGEN", "NITROGEN"], theme: "COMMON GASES", color: "Blue" },
        { words: ["SITAR", "TABLA", "VEENA", "HARMONIUM"], theme: "INDIAN MUSICAL INSTRUMENTS", color: "Purple" },
        { words: ["CELSIUS", "FAHRENHEIT", "KELVIN", "RANKINE"], theme: "TEMPERATURE SCALES", color: "Purple" },
        { words: ["OPERA", "BALLET", "SYMPHONY", "SONATA"], theme: "CLASSICAL MUSIC FORMS", color: "Purple" },
        { words: ["KILIMANJARO", "EVEREST", "DENALI", "ELBRUS"], theme: "MOUNTAIN PEAKS", color: "Purple" }
    ];


    // Function to randomly select 4 groups with one of each color
    function selectRandomGroups(allGroups, numGroups = 4) {
        // Shuffle allGroups array randomly
        const shuffled = allGroups.sort(() => 0.5 - Math.random());

        // Initialize arrays to store groups of each color
        const yellowGroups = [];
        const greenGroups = [];
        const blueGroups = [];
        const purpleGroups = [];

        // Iterate through shuffled array and categorize groups by color
        shuffled.forEach(group => {
            switch (group.color) {
                case "Yellow":
                    if (yellowGroups.length === 0) yellowGroups.push(group);
                    break;
                case "Green":
                    if (greenGroups.length === 0) greenGroups.push(group);
                    break;
                case "Blue":
                    if (blueGroups.length === 0) blueGroups.push(group);
                    break;
                case "Purple":
                    if (purpleGroups.length === 0) purpleGroups.push(group);
                    break;
            }
        });

        // Randomly select remaining groups from each color category
        const remainingGroups = shuffled.filter(group =>
            group.color !== "Yellow" && group.color !== "Green" &&
            group.color !== "Blue" && group.color !== "Purple"
        );
        const selectedGroups = yellowGroups.concat(greenGroups, blueGroups, purpleGroups, remainingGroups.slice(0, numGroups - 4));

        return selectedGroups;
    }

    // Select 4 random groups to use in the game
    const groups = selectRandomGroups(allGroups);

    let remainingWords = groups.flatMap(group => group.words);
    shuffleArray(remainingWords);
    let selectedWords = [];
    let correctGroups = [];

    function setupGame() {
        const grid = document.getElementById("grid");
        grid.innerHTML = ''; // Clear the grid
        remainingWords.forEach(word => {
            let wordDiv = document.createElement('div');
            wordDiv.className = 'word';
            wordDiv.textContent = word;
            wordDiv.addEventListener('click', function () { selectWord(word, wordDiv); });
            grid.appendChild(wordDiv);
        });
        grid.style.gridTemplateColumns = `repeat(${Math.ceil(remainingWords.length / 4)}, 1fr)`;
    }

    function selectWord(word, element) {
        if (selectedWords.includes(word)) {
            element.classList.remove('selected');
            selectedWords = selectedWords.filter(w => w !== word);
        } else {
            if (selectedWords.length < 4) {
                element.classList.add('selected');
                selectedWords.push(word);
            }
        }
    }

    function checkGroup(selectedWords) {
        let correctGroup = groups.find(group => selectedWords.every(word => group.words.includes(word)));
        if (correctGroup && !correctGroups.includes(correctGroup)) {
            correctGroups.push(correctGroup);
            updateSelectedWordsDisplay(correctGroup);
            remainingWords = remainingWords.filter(word => !selectedWords.includes(word));
            resetSelection();
            setupGame(); // Rearrange the grid
        } else {
            alert("Incorrect group. Try again!");
            resetSelection();
        }
    }

    function updateSelectedWordsDisplay(correctGroup) {
        const selectedWordsDiv = document.getElementById('selectedWords');
        let groupDiv = document.createElement('div');
        groupDiv.textContent = correctGroup.words.join(', ') + ' - ' + correctGroup.theme;
        groupDiv.className = 'group';
        groupDiv.style.backgroundColor = getGroupColor(correctGroup.theme);
        selectedWordsDiv.appendChild(groupDiv);
    }

    function resetSelection() {
        document.querySelectorAll('.word.selected').forEach(div => div.classList.remove('selected'));
        selectedWords = []; // Reset the selection
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function getGroupColor(theme) {
        const group = groups.find(g => g.theme === theme);
        return group ? group.color : '#ddd'; // Default color if not found
    }

    // Your existing game logic continues here
});
