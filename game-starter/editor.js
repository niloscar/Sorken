/**
 * Declare DOM elements object.
 */
const dom = {};
dom.area = document.getElementById('flash');

/**
 * Declare state object.
 */
const state = {};
state.map = {};

/**
 * Create blank sheet.
 * @param {number} width    - Width (tiles) of game area.
 * @param {number} height   - Height (tiles) of game area.
 * @param {number} tile     - Default tile type.
 */
function blankSheet(width, height, tile=10) {
    state.map.blank = new Array(width * height).fill(tile)
    for(let [i, tileType] of state.map.blank.entries()) {
        const el = document.createElement('div');
        el.id = `n${i}`;
        el.classList.add(`tile`,`t${tileType}`);
        dom.area.appendChild(el);
    }
}
blankSheet(24, 24, 10);

(() => {
    if (!dom.area) return;
    const events = ['click','contextmenu'];

    const tools = [
        {
            name: 'Grass',
            className: '10',
        },
        {
            name: 'Wall',
            className: '19',
        }
    ]
    let currentTool = 't19';

    const menu = document.createElement('ul');
    menu.id = 'context-menu';
    document.querySelector('body').appendChild(menu);

    for (let tool of tools) {
        const el = document.createElement('li');
        const img = document.createElement('i');
        img.className = `tile t${tool.className}`;
        el.innerText = 'Test';
        el.prepend(img);
        menu.append(el);
        el.addEventListener('click', () => {
            currentTool = `t${tool.className}`;
            console.log(`t${tool.className}`);
        });
    }

    for (let event of events) document.addEventListener(event, (e) => {
        e.preventDefault();

        if (event === 'click') {
            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
            } else {
                if (!/n\d{1,3}/.test(e.target.id)) return;
                for (const c of [...e.target.classList]) {
                    if (/^t\d{2}$/.test(c)) e.target.classList.remove(c);
                }
                e.target.classList.add(currentTool);
            }
        }

        if (event === 'contextmenu' && !menu.contains(e.target)) {
            menu.classList.toggle('open');
            menu.style.left = `${e.clientX - 16}px`;
            menu.style.top = `${e.clientY -16}px`;
        }
    });
    
})();



