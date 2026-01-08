import { deleteInvDB, addToInventory, getInventory, getInvInfo} from "../firebaseDnDFlavor.js";

export default function Inventory() {
    let state = {
        newItem: {
            name: "",
            quantity: "",
        },
        invs: []
    };

    let isInitialized = false;

    const setNewItem = (updates) => {
        state.newItem = { ...state.newItem, ...updates };
        renderInputs();
    };

    const setInvs = (updater) => {
        const newInvs = typeof updater === 'function' ? updater(state.invs) : updater;
        state.invs = newInvs;
        renderInventoryList();
    };

    const onChange = (e) => {
        setNewItem({ [e.target.id]: e.target.value });
    };

    const loadInventoryData = async () => {
        const invIDs = await getInventory(localStorage.getItem('currentUid'), localStorage.getItem('curID'));
        console.log("l5 + " + invIDs[0]);

        const newData = invIDs.filter((data) => data != 0);
        const invCollections = [newData.length];
        console.log("l22 Invs total" + newData.length);

        for(let i = 0; i < newData.length; i++){
            invCollections[i] = await getInvInfo(localStorage.getItem('currentUid'), localStorage.getItem('curID'), newData[i]);
            console.log("l27 Inv " + i + " has id of " + invCollections[i].id);
        }

        if(newData.length != 0){
            state.invs = invCollections.map((currentInvs) => ({...currentInvs}));
        }
        renderInventoryList();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newInvItem = {
            id: crypto.randomUUID(),
            name: state.newItem.name,
            quantity: state.newItem.quantity,
        };

        console.log("set Invs function ln 19");
        state.invs = [...state.invs, newInvItem];

        await addToInventory(
            localStorage.getItem('currentUid'),
            localStorage.getItem('curID'),
            newInvItem.id,
            newInvItem.name,
            newInvItem.quantity
        );
        console.log("new item, id is " + newInvItem.id);

        state.newItem = { name: "", quantity: "" };
        resetInput();
        renderInventoryList();
    };

    const deleteInv = async (id) => {
        await deleteInvDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), "inv");
        await deleteInvDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), id);

        state.invs = state.invs.filter(inv => inv.id !== id);
        renderInventoryList();
    };

    const resetInput = () => {
        const container = document.getElementById('inventory');
        const inputs = container.querySelectorAll("input");
        inputs.forEach(element => {
            element.value = "";
        });
    };

    const renderInputs = () => {
        const nameInput = document.getElementById('name');
        const quantityInput = document.getElementById('quantity');
        
        if (nameInput && document.activeElement !== nameInput) {
            nameInput.value = state.newItem.name || '';
        }
        if (quantityInput && document.activeElement !== quantityInput) {
            quantityInput.value = state.newItem.quantity || '';
        }
    };

    const renderInventoryList = () => {
        const listContainer = document.getElementById('inventory-itemlist');
        if (!listContainer) return;

        if (state.invs.length === 0) {
            listContainer.innerHTML = "Click 'Add Item' to start your inventory!";
        } else {
            listContainer.innerHTML = state.invs.map(inv => `
                <li data-key="${inv.id}">
                    <ul class="sl-inner">
                        <li>Item: ${inv.name}</li>
                        <li>Quantity: ${inv.quantity}</li>
                    </ul>
                    <button class="btn delete-inv-btn" data-id="${inv.id}" id="il-delete">Delete</button>
                </li>
            `).join('');

            const deleteButtons = listContainer.querySelectorAll('.delete-inv-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', () => deleteInv(btn.dataset.id));
            });
        }
    };

    const render = () => {
        const container = document.getElementById('inventory');
        if (!container) return;

        container.innerHTML = `
            <form class="new-inv-form" id="inventory-form">
                <div class="form-row">
                    <label for="name"><img src="../images/itemName.png"></img></label>
                    <input 
                        type="text" 
                        id="name"
                        placeholder="Rope..."
                        value="">
                    </input>
                    <label for="quantity"><img src="../images/quantity.png"></img></label>
                    <input 
                        type="text" 
                        id="quantity"
                        placeholder="5000..."
                        value="">
                    </input>
                </div>
                <button type="button" class="btn reset-btn"><img src="../images/addItem.png"></img></button>
            </form>
            <div id="inventory-wrap">
                <h1 class="header" id="inventory-title">Inventory</h1>
                <ul id="inventory-itemlist">
                </ul>
            </div>
        `;

        attachEventListeners();
        isInitialized = true;
    };

    const attachEventListeners = () => {
        const container = document.getElementById('inventory');
        if (!container) return;

        const form = container.querySelector('.new-inv-form');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        const nameInput = container.querySelector('#name');
        const quantityInput = container.querySelector('#quantity');
        
        if (nameInput) {
            nameInput.addEventListener('input', onChange);
        }
        if (quantityInput) {
            quantityInput.addEventListener('input', onChange);
        }

        const resetBtn = container.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resetInput();
                handleSubmit(e);
            });
        }
    };

    render();
    loadInventoryData();
}
