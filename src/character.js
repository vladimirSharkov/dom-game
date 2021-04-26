/* globals e */

import {e} from "./dom.js";

Object.assign(window.game, (function () {
    const templates = {
        player: {
            name: 'Player',
            img: 'player.png',
            hp: 100,
            dmg: 25,
            attackRating: 10,
            defense: 10
        },
        rat: {
            name: 'Giant Rat',
            level: 1,
            ai: true,
            img: 'rat.png',
            hp: 30,
            dmg: 10,
            attackRating: 3,
            defense: 5
        },
        skeleton: {
            name: 'Skeleton',
            level: 2,
            ai: true,
            img: 'skeleton.png',
            hp: 50,
            dmg: 15,
            attackRating: 5,
            defense: 8
        },
        goblin: {
            name: 'Goblin',
            level: 4,
            ai: true,
            img: 'goblin.png',
            hp: 100,
            dmg: 15,
            attackRating: 8,
            defense: 12
        }
    }
    return {
        templates,
        createCharacter
    }

    function createCharacter(type) {
        const character = Object.assign({
            alive: true,
            attack,
            takeDamage
        }, templates[type]);
        character.maxHp = character.hp;

        const element = createCharacterCard(character);

        return {
            character,
            element
        };

        function attack(target) {
            console.log(`${character.name} attack ${target.name} for ${character.dmg}`)
            target.takeDamage(character.dmg)

            const chance = Math.min(character.attackRating / target.defense, 1);
            if (chance>= Math.random()){
                target.takeDamage(character.dmg)
            }
        }

        function takeDamage(incomingDmg) {
            console.log(`${character.name} took ${incomingDmg} dmg`)
            character.hp = Math.max(character.hp - incomingDmg, 0);
            if (character.hp === 0) {
                character.alive = false;
            }
            element.update();
        }
    }


    function createCharacterCard(character) {
        const stats = {
            hp: e('span', {}, `${character.hp} / ${character.maxHp}`)
        }
        const element = e('article', {className: 'character-card'},
            e('div', {className: 'portrait'}, e('img', {src: 'assets/' + character.img})),
            e('div', {className: 'description'},
                e('h3', {}, character.name),
                e('ul', {className: 'stats'},
                    e('li', {}, 'HP: ', stats.hp),
                    e('li', {}, 'Damage: ', e('span', {}, character.dmg)),
                )
            )
        );
        element.update = update;

        return element;

        function update() {
            stats.hp.textContent = `${character.hp} / ${character.maxHp}`;
            if (character.alive === false) {
                element.classList.add('wasted');
            }
        }

    }
})())



