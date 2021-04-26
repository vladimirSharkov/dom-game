import {html} from "../node_modules/lit-html/lit-html.js";

const cardTemplate = () => html`
        <article class=${character.alive === true ? "character-card" :"wasted"}>
            <div class="portrait"><img src="../assets/player.png"></div>
            <div class="description">
                <h3>${character.name}</h3>
                <ul class="stats">
                    <li>HP: <span>${character.hp} / ${character.maxHp}</span></li>
                    <li>Damage: <span>${character.dmg}</span></li>
                </ul>
            </div>
        </article>
    `;