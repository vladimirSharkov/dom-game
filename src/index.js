/* globals e, game */
import {e} from "./dom.js";


Object.assign(window.game, (function () {
    const playerSlot = document.getElementById('player')
    const enemySlot = document.getElementById('enemies')


    const player = game.createCharacter('player');


    const encounterController = game.encounterController(enemySlot, player);

    const controls = e('div', {id: 'controls'},
        e('button', {onclick:  encounterController.onPlayerAttack}, 'Attack')
    );
    disableControls();

    playerSlot.appendChild(player.element);
    playerSlot.appendChild(controls);

    game.events.onBeginTurn.subscribe(onBeginTurn);
    game.events.onEncounterEnd.subscribe(onEncounterEnd)



    let difficulty = 5;
    encounterController.enter(game.generateEncounter(difficulty));

    function onBeginTurn(controller) {
        if (controller.character.ai) {
            disableControls();
            setTimeout(()=>{
                encounterController.onEnemyAttack();
                encounterController.selectTarget({target:player.element})
            },500)

        } else {
            enableControls();
        }
    }
    
    function onEncounterEnd(victory) {
        if (victory){
            alert('Enemies defeated!');
            difficulty++;
            encounterController.enter(game.generateEncounter(difficulty));
            disableControls();
        }else {
            alert('You Died');
            disableControls();
        }
    }

    function enableControls() {
        [...controls.children].forEach(c => c.disable === false)
    }

    function disableControls() {
        [...controls.children].forEach(c => c.disable === true)
    }
})())
