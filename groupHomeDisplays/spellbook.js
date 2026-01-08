import { deleteSpellDB, addToSpells, getSpells, getSpellInfo} from "../firebaseDnDFlavor.js";

export default function SpellBook() {
    let state = {
        newItem: {
            title: "",
            castTime: "",
            range: "",
            components: "",
            duration: "",
            description: "",
            prepared: true,
        },
        spells: []
    };

    let isInitialized = false;

    const setNewItem = (updates) => {
        state.newItem = { ...state.newItem, ...updates };
        renderInputs();
    };

    const setSpells = (updater) => {
        const newSpells = typeof updater === 'function' ? updater(state.spells) : updater;
        state.spells = newSpells;
        renderSpellList();
    };

    const checkHandler = async (e) => {
        const spellId = e.target.dataset.spellId;
        const newPreparedState = e.target.checked;
        
        console.log("is checked is " + newPreparedState);
        
        const spell = state.spells.find(s => s.id === spellId);
        if (spell) {
            spell.prepared = newPreparedState;
            
            await addToSpells(
                localStorage.getItem('currentUid'),
                localStorage.getItem('curID'),
                spell.id,
                spell.title,
                spell.castTime,
                spell.range,
                spell.components,
                spell.duration,
                spell.description,
                spell.prepared
            );
        }
    };

    const onChange = (e) => {
        setNewItem({ [e.target.id]: e.target.value });
        console.log("set new item is happening");
    };

    const loadSpellData = async () => {
        const spellIDs = await getSpells(localStorage.getItem('currentUid'), localStorage.getItem('curID'));

        const newData = spellIDs.filter((data) => data != 0);
        const spellCollections = [newData.length];

        for(let i = 0; i < newData.length; i++){
            spellCollections[i] = await getSpellInfo(localStorage.getItem('currentUid'), localStorage.getItem('curID'), newData[i]);
        }

        if(newData.length != 0){
            state.spells = spellCollections.map((currentSpells) => ({...currentSpells}));
        }
        renderSpellList();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newSpell = {
            id: crypto.randomUUID(),
            title: state.newItem.title,
            castTime: state.newItem.castTime,
            range: state.newItem.range,
            components: state.newItem.components,
            duration: state.newItem.duration,
            description: state.newItem.description,
            prepared: true
        };

        console.log("set spells function ln 19");
        state.spells = [...state.spells, newSpell];

        console.log("l61: spell.prepared is " + newSpell.prepared);
        console.log("163: title is " + newSpell.title);
        
        await addToSpells(
            localStorage.getItem('currentUid'),
            localStorage.getItem('curID'),
            newSpell.id,
            newSpell.title,
            newSpell.castTime,
            newSpell.range,
            newSpell.components,
            newSpell.duration,
            newSpell.description,
            newSpell.prepared
        );
        console.log("new item, id is " + newSpell.id);

        state.newItem = { title: "", castTime: "", range: "", components: "", duration: "", description: "", prepared: true };
        resetInput();
        renderSpellList();
    };

    const deleteSpell = async (id) => {
        await deleteSpellDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), "spell");
        await deleteSpellDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), id);

        state.spells = state.spells.filter(spell => spell.id !== id);
        renderSpellList();
    };

    const resetInput = () => {
        const container = document.getElementById('spellbook');
        const inputs = container.querySelectorAll("#spellForm input");
        inputs.forEach(element => {
            element.value = "";
        });
    };

    const collapseform = async () => {
        var spellForm = document.getElementById("spellForm");
        spellForm.classList.toggle('expand');
    };

    const renderInputs = () => {
        const inputs = ['title', 'castTime', 'range', 'components', 'duration', 'description'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input && document.activeElement !== input) {
                input.value = state.newItem[inputId] || '';
            }
        });
    };

    const renderSpellList = () => {
        const listContainer = document.getElementById('spelllist');
        if (!listContainer) return;

        if (state.spells.length === 0) {
            listContainer.innerHTML = "No Spells";
        } else {
            listContainer.innerHTML = state.spells.map(spell => `
                <li data-key="${spell.id}">
                    <ul class="sl-inner">
                        <li>Title: ${spell.title}</li>
                        <li>Cast Time: ${spell.castTime}</li>
                        <li>Range: ${spell.range}</li>
                        <li>Components: ${spell.components}</li>
                        <li>Duration: ${spell.duration}</li>
                        <li>Description: ${spell.description}</li>
                        <li id="checkbox-slli">
                            <label for="prepared-${spell.id}">Prepared</label>
                            <input
                                id="prepared-${spell.id}"
                                type="checkbox"
                                ${spell.prepared ? 'checked' : ''}
                                class="prepared-checkbox"
                                data-spell-id="${spell.id}">
                            </input>
                        </li>
                    </ul>
                    <button class="btn delete-spell-btn" data-id="${spell.id}" id="sl-delete">Delete</button>
                </li>
            `).join('');

            const deleteButtons = listContainer.querySelectorAll('.delete-spell-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', () => deleteSpell(btn.dataset.id));
            });

            const checkboxes = listContainer.querySelectorAll('.prepared-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', checkHandler);
            });
        }
    };

    const render = () => {
        const container = document.getElementById('spellbook');
        if (!container) return;

        container.innerHTML = `
            <form class="new-spell-form" id="spellForm">
                <div class="form-row">
                    <label for="title">Spell Name</label>
                    <input type="text" id="title" placeholder="Summon Goblin Horde..." value="">
                    </input>
                    <label for="castTime">Cast Time</label>
                    <input type="text" id="castTime" placeholder="50 hours..." value="">
                    </input>
                    <label for="range">Range</label>
                    <input type="text" id="range" placeholder="100 miles..." value="">
                    </input>
                    <label for="components">Components</label>
                    <input type="text" id="components" placeholder="Blood of your enemies..." value="">
                    </input>
                    <label for="duration">Duration</label>
                    <input type="text" id="duration" placeholder="forever..." value="">
                    </input>
                    <label for="description">Description</label>
                    <input type="text" id="description" placeholder="summon your friendly horde of Goblins to eat your enemies..." value="">
                    </input>
                </div>
                <button type="button" id="addspell-btn" class="btn reset-spell-btn"><img src="../images/addSpell.png"></img></button>
            </form>
            <button id="collapsebtn" class="btn collapse-btn"><box-icon name='collapse-vertical' type='regular' color='#fbf2e3'></box-icon></button>
            <div id="spell-wrap">
                <h1 id="sl-header" class="header">Spell List</h1>
                <ul id="spelllist">
                </ul>
            </div>
        `;

        attachEventListeners();
        isInitialized = true;
    };

    const attachEventListeners = () => {
        const container = document.getElementById('spellbook');
        if (!container) return;

        const form = container.querySelector('.new-spell-form');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        const inputs = ['title', 'castTime', 'range', 'components', 'duration', 'description'];
        inputs.forEach(inputId => {
            const input = container.querySelector(`#${inputId}`);
            if (input) {
                input.addEventListener('input', onChange);
            }
        });

        const resetBtn = container.querySelector('.reset-spell-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resetInput();
                handleSubmit(e);
            });
        }

        const collapseBtn = container.querySelector('.collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', collapseform);
        }
    };

    render();
    loadSpellData();
}
