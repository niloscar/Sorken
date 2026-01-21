/**
 * Declare config object.
 */

const cfg = {
    tools: [
        {
            name: 'Eraser',
            className: 10,
        },
    ],
    tiles: [
        {
            name: 'Grass',
            className: [11, 12, 13],
        },
        {
            name: 'Open door',
            className: 35,
        },
    ],
    blocks: [
        {
            name: 'Brick wall',
            className: 30,
        },
        {
            name: 'Metal wall',
            className: 31,
        },
        {
            name: 'Crystal wall',
            className: 32,
        },
        {
            name: 'Mirrored wall',
            className: 33,
        },
        {
            name: 'Green crystal wall',
            className: 34,
        },
        {
            name: 'Closed door',
            className: 36,
        },
    ],
    items: [],
};

/**
 * Declare DOM elements object.
 */
const dom = {};
dom.area = document.getElementById('flash');

/**
 * Declare state object.
 */
const state = {};
state.currentTool = {
    type: 'blocks',
    name: 'Brick wall',
    className: 19,
}
state.map = {};
state.painting = false;
state.lastPaintedId = null;
state.history = { undo: [], redo: [] };
let dragStartSnap = null;

/**
 * Create blank sheet.
 * @param {number} width    - Width (tiles) of game area.
 * @param {number} height   - Height (tiles) of game area.
 * @param {number} tile     - Tiletype to fill ground with.
 */
function blankSheet(width, height, tile=10) {
    for (let layer of ['tileLayer','blockLayer']) {

        state.map[layer] = document.createElement('div');
        state.map[layer].id = layer;
        dom.area.appendChild(state.map[layer]);

        
        if (layer === 'tileLayer') {
            state.map[layer].classList.add('show');
            state.map.active = layer;
        }
        let prefix = (layer === 'tileLayer') ? 't' : 'b';
        
        state.map.blank = new Array(width * height).fill(layer === 'tileLayer' ? tile : 10)

        for(let [i, tileType] of state.map.blank.entries()) {
            const el = document.createElement('div');
            el.id = `${layer}_n${i}`;
            el.classList.add(`tile`,`${prefix}${tileType}`);
            state.map[layer].appendChild(el);
        }

    }
    state.map.meta = { width: width, height: height };
}
blankSheet(24, 24, 11);

function updateActiveLayer() {
    const blockOn = dom.inputs.blockLayer.checked;
    const tileOn  = dom.inputs.tileLayer.checked;

    state.map.active = blockOn 
        ? 'blockLayer'
        : tileOn  ? 'tileLayer'
            : null;
}

function initSidebar() {
    dom.sidebar = document.querySelector('aside');
    dom.inputs = {};

    for (const layer of ['blockLayer','tileLayer']) {
        const group = document.createElement('div');
        const input = document.createElement('input');
        const label = document.createElement('label');

        input.type = 'checkbox';
        input.id = `input_${layer}`;
        label.htmlFor = input.id;
        label.textContent = layer;

        dom.inputs[layer] = input;

        if (layer === 'tileLayer') input.checked = true;

        input.addEventListener('change', () => {
            state.map[layer].classList.toggle('show', input.checked);
            document.querySelectorAll('.submenu-tiles')?.forEach(el => el.classList.toggle('show', !dom.inputs.blockLayer.checked));
            updateActiveLayer();
        });

        group.append(input, label);
        dom.sidebar.appendChild(group);
    }

    const btnHandlers = {
        Export: exportFunction,
        Undo: undoFunction,
        Redo: redoFunction,
    };

    for (let val of ['Undo','Redo','Export']) {
        const button = document.createElement('button');
        button.innerText = val;
        button.id = `btn-${val.toLowerCase()}`;

        dom[`btn${val}`] = button;
        dom.sidebar.appendChild(button);

        button.addEventListener('click', btnHandlers[val]);
    }

    state.map.tileLayer.classList.toggle('show', dom.inputs.tileLayer.checked);
    state.map.blockLayer.classList.toggle('show', dom.inputs.blockLayer.checked);
    updateActiveLayer();
}

(() => {
    if (!dom.area) return;

    dom.menu = document.createElement('div');
    dom.menu.id = 'context-menu';
    document.querySelector('body').appendChild(dom.menu);


    contextMenuContent('tools');
    contextMenuContent('tiles');
    contextMenuContent('blocks');

    document.addEventListener('click', (e) => {
    if (dom.menu.classList.contains('open') && !dom.menu.contains(e.target)) {
        dom.menu.classList.remove('open');
    }
    });

    document.addEventListener('contextmenu', (e) => {
        if (dom.menu.contains(e.target)) return;
        e.preventDefault();

        // stoppa ev. pågående drag
        state.painting = false;

        dom.menu.classList.add('open');
        dom.menu.style.left = `${e.clientX - 16}px`;
        dom.menu.style.top  = `${e.clientY - 16}px`;
    });

    
})();

function randCName(arr) {
    if (Array.isArray(arr)) {
        const minCeiled = Math.ceil(0);
        const maxFloored = Math.floor(arr.length - 1);
        const result = arr[Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)];
        return result;
    } else {
        return arr;
    }
}

function applyToolToTile(tileEl) {
  if (!tileEl || !tileEl.id) return;
  if (!/_(n\d{1,4})$/.test(tileEl.id)) return; // matchar tileLayer_n123 osv

  // Undvik att måla samma tile flera gånger i rad.
  if (tileEl.id === state.lastPaintedId) return;
  state.lastPaintedId = tileEl.id;

  // To bort gamla classer på tilen.
  for (const c of [...tileEl.classList]) {
    if (/^[tb]\d{2}$/.test(c)) tileEl.classList.remove(c);
  }

  // Välj prefix baserat på aktivt lager.
  const prefix = (state.map.active === 'blockLayer') ? 'b' : 't';
  tileEl.classList.add(`${prefix}${randCName(state.currentTool.className)}`);
}

// Kontrollera vilken tile som är under muspekaren.
function tileUnderPointer(e) {
  const layer = state.map.active;
  if (!layer) return null;

  const el = document.elementFromPoint(e.clientX, e.clientY);
  return el?.closest?.(`#${layer} .tile`) ?? null;
}

document.addEventListener('pointerdown', (e) => {
  // Om högerklick, stoppa.
  if (e.button !== 0) return;

  // Om menyn är öppen, stoppa.
  if (dom.menu?.classList.contains('open')) return;

  const tileEl = tileUnderPointer(e);
  if (!tileEl) return;

  dragStartSnap = snapshotMap();
  state.painting = true;
  state.lastPaintedId = null;
  applyToolToTile(tileEl);
});

document.addEventListener('pointermove', (e) => {
  if (!state.painting) return;

  const tileEl = tileUnderPointer(e);
  if (!tileEl) return;

  applyToolToTile(tileEl);
});

function stopPaint() {
    state.painting = false;
    state.lastPaintedId = null;

    if (dragStartSnap) {
        state.history.undo.push(dragStartSnap);
        state.history.redo.length = 0;
        dragStartSnap = null;
    }
}

document.addEventListener('pointerup', stopPaint);
document.addEventListener('pointercancel', stopPaint);


function contextMenuContent(tools) {

    const prefix = (tools === 'tiles') ? 't' : 'b'; 
    const heading = document.createElement('h4');

    heading.innerText = tools;
    dom.menu.appendChild(heading);

    const submenu = document.createElement('ul');
    dom.menu.appendChild(submenu);

    heading.className = submenu.className = 'submenu-' + tools;
    const show = (tools === 'blocks') || (state.map.active === 'tileLayer');
    [heading, submenu].forEach(el => el.classList.toggle('show', show));

    for (let tool of cfg[tools]) {

        const el = document.createElement('li');
        const img = document.createElement('i');

        img.className = `tile ${prefix}${randCName(tool.className)}`;
        el.innerText = tool.name;
        el.prepend(img);
        submenu.append(el);

        el.addEventListener('click', () => {
            state.currentTool = {
                type: tools,
                name: tool.name,
                className: tool.className
            };

            dom.menu.querySelectorAll('.active').forEach(x => x.classList.remove('active'));
            el.classList.add('active');

            dom.menu.classList.remove('open'); // Stäng menyn när man gör ett val i den.
        });

    }
}

initSidebar();

function exportFunction() {
    dom.modal = document.createElement('div');
    dom.wrapper = document.createElement('div');
    dom.closeBtn = document.createElement('button');
    dom.closeBtn.innerText = 'Close';
    dom.modal.appendChild(dom.wrapper);
    dom.modal.appendChild(dom.closeBtn);
    dom.closeBtn.addEventListener('click', e => {
        dom.modal.remove();
    })
    dom.modal.id = 'modal';
    state.map.export = [];
    const layers = ['tileLayer','blockLayer'];

    const exportLayers = (layers) => {
        for (let layer of layers) {
            state.map.export[layer] = [];
            const children = state.map[layer].children;
            const re = (layer === 'tileLayer') ? /^t\d{2}$/ : /^b\d{2}$/;
            for (const el of children) {
                const cls = [...el.classList].find(c => re.test(c)); 
                const num = cls ? Number(cls.replace(/\D+/g, '')) : null;
                state.map.export[layer].push(num);
            }
        }
    }

    exportLayers(layers);


    for (let i in state.map.export) {
        dom['pre' + i] = document.createElement('pre');
        dom['pre' + i].innerText = `${i} = [\n${state.map.export[i]
            .map((v, idx) => (idx > 0 && idx % state.map.meta.width === 0 ? '\n' : '') + v)
            .join(',')}\n];`;
        dom.wrapper.appendChild(dom['pre' + i]);
    }

    document.querySelector('body').appendChild(dom.modal);
}

function undoFunction() {
  const prev = state.history.undo.pop();
  if (!prev) return;
  state.history.redo.push(snapshotMap());
  restoreMap(prev);
}

function redoFunction() {
  const next = state.history.redo.pop();
  if (!next) return;
  state.history.undo.push(snapshotMap());
  restoreMap(next);
}


function snapshotMap() {
  const snap = {};
  for (const layer of ['tileLayer', 'blockLayer']) {
    const re = layer === 'tileLayer' ? /^t\d{2}$/ : /^b\d{2}$/;
    snap[layer] = [...state.map[layer].children].map(el =>
      [...el.classList].find(c => re.test(c)) ?? null
    );
  }
  return snap;
}

function restoreMap(snap) {
  for (const layer of ['tileLayer', 'blockLayer']) {
    const re = layer === 'tileLayer' ? /^t\d{2}$/ : /^b\d{2}$/;
    const kids = state.map[layer].children;
    for (let i = 0; i < kids.length; i++) {
      for (const c of [...kids[i].classList]) if (re.test(c)) kids[i].classList.remove(c);
      if (snap[layer][i]) kids[i].classList.add(snap[layer][i]);
    }
  }
}
