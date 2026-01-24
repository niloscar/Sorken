/**
 * Declare config object.
 */

const cfg = {
    tools: [
        {
            name: 'Eraser',
            className: 10,
        },
        {
            name: 'Rotate',
            className: 'rotate',
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
        {
            name: 'Finish',
            className: 99,
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
        {
            name: 'Portal',
            className: 90,
        },
        {
            name: 'Cheese',
            className: 20,
        },
    ],
    items: [
        {
            name: 'Light rod',
            className: 22,
        },
    ],
    enemies: [
        {
            name: 'Misse',
            className: 55,
        },
        {
            name: 'Simba',
            className: 56,
        },
        {
            name: 'Findus',
            className: 57,
        },
        {
            name: 'Pelle',
            className: 58,
        },
        {
            name: 'Felix',
            className: 59,
        },
    ],
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

        for(let [i, tileType] of Object.entries(state.map.blank)) {
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
            updateActiveLayer();
            updateContextMenuVisibility();
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
    contextMenuContent('enemies');
    contextMenuContent('items');
    updateContextMenuVisibility();

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

  let prefix, className;
  if (state.currentTool.className === 'rotate') {
    // To bort gamla classer på tilen.
    let rotation = false;
    for (const c of [...tileEl.classList]) {
        if (/^[r]\d{1,3}$/.test(c)) {
            rotation = true;
            tileEl.classList.remove(c);
            className = (Number(c.slice(1)) === 270) ? 0 : Number(c.slice(1)) + 90;
        } else {
            rotation = false;
            className = 90;
        }
    }
    console.log(className);

    console.log(rotation ? 'Jepp': 'Nepp');

    // Välj prefix baserat på aktivt verktyg.
    prefix = 'r';
  } else {
    // To bort gamla classer på tilen.
    for (const c of [...tileEl.classList]) {
        if (/^[tb]\d{2}$/.test(c)) tileEl.classList.remove(c);
    }

    // Välj prefix baserat på aktivt lager.
    prefix = (state.map.active === 'blockLayer') ? 'b' : 't';
    className = randCName(state.currentTool.className);
}

  tileEl.classList.add(`${prefix}${className}`);
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

function updateContextMenuVisibility() {
  for (const tools of ['tools', 'tiles', 'blocks', 'enemies', 'items']) {
    const show =
      (state.map.active === 'blockLayer')
        ? tools !== 'tiles'
        : (state.map.active === 'tileLayer')
          ? !['enemies', 'items'].includes(tools)
          : false;

    document
      .querySelectorAll('.submenu-' + tools)
      .forEach(el => {
        el.classList.toggle('show', show);

        if (tools === 'blocks') {
          el.classList.toggle('caution', state.map.active !== 'blockLayer');
        }
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
    state.map.export = {};
    const layers = ['tileLayer','blockLayer'];

    const exportLayers = (layers) => {
        state.map.export.rotationLayer = [];
        for (let layer of layers) {
            state.map.export[layer] = [];
            const children = state.map[layer].children;
            const re = (layer === 'tileLayer') ? /^t\d{2}$/ : /^b\d{2}$/;
            for (const [i, el] of Object.entries(children)) {
                const cls = [...el.classList].find(c => re.test(c)); 
                const num = cls ? Number(cls.replace(/\D+/g, '')) : null;
                state.map.export[layer].push(num);

                const rotCls = [...el.classList].find(c => /^r\d{1,3}$/.test(c));
                const deg = rotCls ? Number(rotCls.slice(1)) : 0;
                const current = state.map.export.rotationLayer[i];
                state.map.export.rotationLayer[i] =
                (current != null && current !== 0) ? current : deg;
            }
        }
    }

    exportLayers(layers);

    // for (let key in state.map.export) {
    //     dom['pre_' + key] = document.createElement('pre');
    //     dom['pre_' + key].innerText = `${key == 'tileLayer' ? 'gameArea' : 'gameBlocks'} = [\n${state.map.export[key]
    //         .map((v, idx) => (idx > 0 && idx % state.map.meta.width === 0 ? '\n' : '') + v)
    //         .join(',')}\n]${key == 'tileLayer' ? ',' : ';'}`;
    //     dom.wrapper.appendChild(dom['pre_' + key]);
    // }
    // document.querySelector('body').appendChild(dom.modal);

    const fixString = (string) => string.trim().replace(/[^a-zA-Z0-9\s]/g, '');

    state.map.export.meta = {};
    (function getMapAuthor() {
        let name = prompt('Vad heter du?');
        if (!name) return getMapAuthor();
        state.map.export.meta.author = fixString(name);
    })();

    (function getFileName() {
        let fileName = prompt('Vad vill du att din karta ska heta?');
        if (!fileName) return getFileName();
        state.map.export.meta.mapName = fileName.trim();
        state.map.export.meta.fileName = fixString(fileName).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '.json';
    })();

    state.map.export.meta.created = new Date().toLocaleDateString('sv-SE') + ' @' + new Date().toLocaleTimeString('sv-SE');
    state.map.export.meta.height = state.map.meta.height;
    state.map.export.meta.width = state.map.meta.width;

    downloadJsonFile(state.map.export.meta.fileName, state.map.export);
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

function downloadJsonFile(filename, data) {
console.log('keys', data && Object.keys(data));

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
