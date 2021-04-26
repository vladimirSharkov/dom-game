Object.assign(window.game, (function () {
    return {
        encounterController,
        generateEncounter
    };

    function generateEncounter(difficulty) {
        let options = Object.entries(game.templates).filter(([k, v]) => v.ai);
        const selected = [];
        let encounterLevel = 0;

        while (encounterLevel <= difficulty && options.length > 0) {
            const minLevel = Math.floor(difficulty / 3);
            const maxLevel = difficulty - encounterLevel;
            options = options.filter(([k, v]) => v.level <= maxLevel && v.level >= minLevel);


            if (options.length > 0) {
                const index = Math.floor(Math.random() * options.length);

                const current = options[index];
                encounterLevel += current[1].level
                selected.push(game.createCharacter(current[0]))
            }
        }
        return selected;
    }

    function encounterController(enemySlot, player) {
        let characters = [];
        let initiative;

        enemySlot.addEventListener('click', selectTarget)

        return {
            enter,
            onPlayerAttack,
            onEnemyAttack,
            selectTarget
        };

        function onPlayerAttack() {
            enableTargetTing(player)
        }

        function onEnemyAttack() {
            enableTargetTing()
        }

        function selectTarget({target}) {
            while (target && target.classList && target.classList.contains('targettable') === false) {
                target = target.parentNode;
            }
            if (target && target.classList && target.classList.contains('targettable')) {
                const selected = characters.find(e => e.element === target);
                if (selected) {
                    characters[initiative].character.attack(selected.character)
                }
                disableTargetTing();
                nextTurn()
            } else {
                disableTargetTing();
            }
        }

        function enableTargetTing(source) {
            characters
                .filter(e => e.character.alive === true && e !== source)
                .forEach(e => (e.element.classList.add('targettable')))
        }

        function disableTargetTing() {
            characters.forEach(e => (e.element.classList.remove('targettable')))
        }

        function nextTurn() {
            if (player.character.alive === false) {
                game.events.onEncounterEnd(false)
            } else if (characters.filter(c => c.character.alive).length === 1) {
                game.events.onEncounterEnd(true)
            }

            do {
                initiative = (initiative + 1) % characters.length;
            } while (characters[initiative].character.alive === false);

            characters.forEach(c => c.element.classList.remove('active'))
            characters[initiative].element.classList.add('active');
            game.events.onBeginTurn(characters[initiative]);
        }

        function enter(enemies) {
            enemySlot.innerHTML = '';
            enemies.forEach(e => enemySlot.appendChild(e.element));

            characters = [player, ...enemies];
            initiative = -1;

            nextTurn()
        }
    }
})());
