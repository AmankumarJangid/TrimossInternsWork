document.body.innerHTML = '';

const welcomeBox = document.createElement('div');
welcomeBox.style.display = 'flex';
welcomeBox.style.flexDirection = 'column';
welcomeBox.style.alignItems = 'center';
welcomeBox.style.justifyContent = 'center';
welcomeBox.style.background = '#fff';
welcomeBox.style.boxShadow = '0 4px 24px rgba(60,60,90,0.08)';
welcomeBox.style.borderRadius = '12px';
welcomeBox.style.padding = '40px 32px 32px 32px';
welcomeBox.style.marginTop = '80px';
welcomeBox.style.fontFamily = 'consolas';
welcomeBox.style.fontSize = '1.2rem';
welcomeBox.style.minWidth = '340px';

const hello = document.createElement('div');
hello.textContent = 'Hello! Welcome.';
hello.style.fontWeight = 'bold';
hello.style.fontSize = '1.4rem';
hello.style.marginBottom = '18px';

const projectLabel = document.createElement('label');
projectLabel.textContent = 'Project name: ';
projectLabel.style.marginBottom = '8px';

const projectInput = document.createElement('input');
projectInput.type = 'text';
projectInput.placeholder = 'Enter project name';
projectInput.style.fontFamily = 'consolas';
projectInput.style.fontSize = '1.1rem';
projectInput.style.padding = '4px 10px';
projectInput.style.marginBottom = '12px';
projectInput.style.border = '1px solid #ccc';
projectInput.style.borderRadius = '5px';
projectInput.style.width = '180px';

const openBtn = document.createElement('button');
openBtn.textContent = 'Open Project';
openBtn.style.fontFamily = 'consolas';
openBtn.style.fontSize = '1.1rem';
openBtn.style.margin = '0 8px 0 0';

const newBtn = document.createElement('button');
newBtn.textContent = 'New Project';
newBtn.style.fontFamily = 'consolas';
newBtn.style.fontSize = '1.1rem';

const msg = document.createElement('div');
msg.style.color = '#d00';
msg.style.marginTop = '12px';
msg.style.fontSize = '1.05rem';

welcomeBox.appendChild(hello);
welcomeBox.appendChild(projectLabel);
welcomeBox.appendChild(projectInput);
welcomeBox.appendChild(openBtn);
welcomeBox.appendChild(newBtn);
welcomeBox.appendChild(msg);

document.body.appendChild(welcomeBox);

let triangles = [];
let ctx, cols = 0, rows = 0, lineWidthPx = 3.78;
const side = 37.8;
const h = side * Math.sqrt(3)/2;
let currentProjectName = '';
let isSaved = true;

//Main App
function loadMainApp(projectName, loadExisting) {
  document.body.innerHTML = ''; // Clear welcome box
  currentProjectName = projectName;
  document.title = projectName;

document.body.style.height = '100vh';
document.body.style.margin = '0';
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.alignItems = 'center';
document.body.style.justifyContent = 'center';
document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)';

//Container (controls and canvas)
const container = document.createElement('div');
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.marginTop = '48px';

//Controls row
const controls = document.createElement('div');
controls.style.display = 'flex';
controls.style.alignItems = 'center';
controls.style.marginBottom = '24px';

//Grid size [AREA]
const gridLabel = document.createElement('label');
gridLabel.textContent = 'Area(mm^2)(l*b) : ';
gridLabel.style.fontFamily = 'consolas';
gridLabel.style.fontSize = '1.1rem';
gridLabel.style.marginRight = '8px';

const gridInput = document.createElement('input');
gridInput.type = 'text';
gridInput.style.width = '60px';
gridInput.style.marginRight = '18px';
gridInput.style.fontFamily = 'consolas';
gridInput.style.fontSize = '1.1rem';
gridInput.style.textAlign = 'center';
gridInput.style.border = '1px solid #ccc';
gridInput.style.borderRadius = '5px';
gridInput.style.padding = '2px 6px';

const lineLabel = document.createElement('label');
lineLabel.textContent = 'Stencil(mm): ';
lineLabel.style.fontFamily = 'consolas';
lineLabel.style.fontSize = '1.1rem';
lineLabel.style.marginRight = '8px';

const lineInput = document.createElement('input');
lineInput.type = 'number';
lineInput.min = '0.00';
lineInput.step = '0.01';
lineInput.style.width = '50px';
lineInput.style.marginRight = '18px';
lineInput.style.fontFamily = 'consolas';
lineInput.style.fontSize = '1.1rem';
lineInput.style.textAlign = 'center';
lineInput.style.border = '1px solid #ccc';
lineInput.style.borderRadius = '5px';
lineInput.style.padding = '2px 6px';

const colorLabel = document.createElement('label');
colorLabel.textContent = 'Color: ';
colorLabel.style.fontFamily = 'consolas';
colorLabel.style.fontSize = '1.1rem';
colorLabel.style.marginRight = '8px';

const colorPicker = document.createElement('input');
colorPicker.type = 'color';
colorPicker.value = '#ff0000';
colorPicker.style.width = '40px';
colorPicker.style.height = '32px';
colorPicker.style.border = '2px solid #ddd';
colorPicker.style.borderRadius = '6px';
colorPicker.style.marginLeft = '8px';
colorPicker.style.cursor = 'pointer';
colorPicker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';

const hexDisplay = document.createElement('span');
hexDisplay.textContent = colorPicker.value.toUpperCase();
hexDisplay.style.marginLeft = '12px';
hexDisplay.style.fontFamily = 'consolas';
hexDisplay.style.fontSize = '1.1rem';
hexDisplay.style.padding = '2px 8px';
hexDisplay.style.background = '#f3f3f3';
hexDisplay.style.borderRadius = '5px';
hexDisplay.style.border = '1px solid #ddd';

const saveBtn = document.createElement('button');
saveBtn.textContent = 'Save Project';
saveBtn.style.marginRight = '8px';
saveBtn.style.fontFamily = 'consolas';
saveBtn.style.fontSize = '1.1rem';

//Assemble controls
controls.appendChild(gridLabel);
controls.appendChild(gridInput);
controls.appendChild(lineLabel);
controls.appendChild(lineInput);
controls.appendChild(colorLabel);
controls.appendChild(colorPicker);
controls.appendChild(hexDisplay);
controls.appendChild(saveBtn);
controls.appendChild(exportBtn);
controls.appendChild(importBtn);

//Canvas
const canvas = document.createElement('canvas');
canvas.width = 1100;
canvas.height = 650;
canvas.style.display = 'block';
canvas.style.background = '#f9fafb';
canvas.style.border = 'none';
canvas.style.borderRadius = '12px';
canvas.style.boxShadow = '0 4px 24px rgba(60,60,90,0.08)';
canvas.style.marginTop = '30px';

//DOM
container.appendChild(controls);
container.appendChild(canvas);
document.body.innerHTML = '';
document.body.appendChild(container);

ctx = canvas.getContext('2d');

//Restore saved file
 if (loadExisting) {
  const key = 'pickNfill_' + projectName;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const obj = JSON.parse(data);
      gridInput.value = obj.gridInput || '';
      lineInput.value = obj.lineInput || '';
      parseLineWidth();
      calculateGridFromArea(); // This generates the grid and fills triangles[]
      // Now restore triangle colors
      if (obj.triangles && obj.triangles.length === triangles.length) {
        for (let i = 0; i < triangles.length; i++) {
          triangles[i].color = obj.triangles[i].color;
        }
      }
      redrawTriangles();
      isSaved = true;
    } catch (e) {
      console.log(e);
      alert('Failed to load project!');
    }
  }
} else {
  calculateGridFromArea();
  parseLineWidth();
  drawGrid();
}

function parseLineWidth() {
  let mm = parseFloat(lineInput.value);
  if (isNaN(mm) || mm <= 0) mm = 1;
  lineWidthPx = mm * 3.78;
}

//Grid size from area
function calculateGridFromArea() {
  const match = gridInput.value.match(/^(\d+)\s*\*\s*(\d+)$/);
  if (match) {
    const lengthMM = parseInt(match[1], 10);
    const breadthMM = parseInt(match[2], 10);

    const sideMM = 10;
    const hMM = sideMM * Math.sqrt(3) / 2;

    // Horizontally
    cols = Math.floor((lengthMM - sideMM) / (sideMM / 2)) + 1;
    if (cols < 1) cols = 1;

    // Vertically
    rows = Math.floor(breadthMM / hMM);
    if (rows < 1) rows = 1;

    drawGrid();
  }
}

function drawGrid() {
  triangles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = lineWidthPx;

  //Centering grid horizontally in canvas
  const gridWidth = side + (cols - 1) * (side / 2);
  const xOffset = (canvas.width - gridWidth) / 2;

  const yOffset = 50;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = xOffset + col * side / 2;
      let y = yOffset + row * h;
      if ((row + col) % 2 === 0) {
        let verts = [
          [x, y + h],
          [x + side / 2, y],
          [x + side, y + h]
        ];
        triangles.push({ verts, color: null });
      } else {
        let verts = [
          [x, y],
          [x + side, y],
          [x + side / 2, y + h]
        ];
        triangles.push({ verts, color: null });
      }
    }
  }
  redrawTriangles();
}

function drawTriangle(verts, fill) {
  ctx.beginPath();
  ctx.moveTo(verts[0][0], verts[0][1]);
  ctx.lineTo(verts[1][0], verts[1][1]);
  ctx.lineTo(verts[2][0], verts[2][1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = '#333';
  ctx.lineWidth = lineWidthPx;
  ctx.stroke();
}

function redrawTriangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let t of triangles) {
    drawTriangle(t.verts, t.color);
  }
}

function pointInTriangle(px, py, verts) {
  function sign(p1, p2, p3) {
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) -
           (p2[0] - p3[0]) * (p1[1] - p3[1]);
  }
  let b1 = sign([px, py], verts[0], verts[1]) < 0.0;
  let b2 = sign([px, py], verts[1], verts[2]) < 0.0;
  let b3 = sign([px, py], verts[2], verts[0]) < 0.0;
  return ((b1 === b2) && (b2 === b3));
}
canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for (let i = triangles.length - 1; i >= 0; i--) {
    if (pointInTriangle(x, y, triangles[i].verts)) {
      // Toggle: if already filled, unfill; else fill
      if (triangles[i].color) {
        triangles[i].color = null;
      } else {
        triangles[i].color = colorPicker.value;
      }
      redrawTriangles();
      break;
    }
  }
});

//Dynamic HEX code
colorPicker.addEventListener('input', function() {
  hexDisplay.textContent = colorPicker.value.toUpperCase();
});

//Area input changes
gridInput.addEventListener('input', calculateGridFromArea);

lineInput.addEventListener('input', function() {
  parseLineWidth();
  drawGrid();
});

saveBtn.addEventListener('click', function() {
  const name = currentProjectName;
  if (!name) {
    alert('Not a project name!');
    return;
  }
  isSaved = true;
  const data = {
    gridInput: gridInput.value,
    lineInput: lineInput.value,
    triangles: triangles.map(t => ({ color: t.color })),
  };
  localStorage.setItem('pickNfill_' + name, JSON.stringify(data));
  alert('Project saved!');
});

//Unsave on change
function markUnsaved() { isSaved = false; }
gridInput.addEventListener('input', markUnsaved);
lineInput.addEventListener('input', markUnsaved);
colorPicker.addEventListener('input', markUnsaved);
canvas.addEventListener('click', markUnsaved);

window.addEventListener('beforeunload', function(e) {
  if (!isSaved) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Save before leaving?';
    return e.returnValue;
  }
});

if(!loadExisting){
    calculateGridFromArea();
    parseLineWidth();
    drawGrid();
  }
}

openBtn.onclick = function() {
  msg.textContent = '';
  const name = projectInput.value.trim();
  if (!name) return;
  const key = 'pickNfill_' + name;
  const data = localStorage.getItem(key);
  if (data) {
    loadMainApp(name, true);
  } else {
    msg.textContent = 'No such file exists!';
  }
};

newBtn.onclick = function() {
    msg.textContent = '';
  const name = projectInput.value.trim();
  if (!name) return;
  const key = 'pickNfill_' + name;
  const data = localStorage.getItem(key);
  if(!data){
      loadMainApp(name, false);
    }else{
      msg.textContent='project already exists!';
    }
}

function updateBtnState() {
  const hasName = !!projectInput.value.trim();
  openBtn.disabled = !hasName;
  newBtn.disabled = !hasName;
}
projectInput.addEventListener('input', updateBtnState);
updateBtnState();

  projectInput.focus();
projectInput.addEventListener('keyup', function(e) {
  if (e.key === 'Enter') openBtn.click();
});
projectInput.addEventListener('input', function() {
  msg.textContent = '';
});
const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export Project';
exportBtn.onclick = function() {
  const name = currentProjectName;
  const data = localStorage.getItem('pickNfill_' + name);
  if (!data) {
    alert('No project data to export!');
    return;
  }
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name + '.json';
  a.click();
  URL.revokeObjectURL(url);
};

const importBtn = document.createElement('button');
importBtn.textContent = 'Import Project';
importBtn.onclick = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const obj = JSON.parse(evt.target.result);
        if (!obj.gridInput || !obj.lineInput || !obj.triangles) {
          alert('Invalid project file!');
          return;
        }
        const name = prompt('Enter a name for the imported project:');
        if (!name) return;
        localStorage.setItem('pickNfill_' + name, JSON.stringify(obj));
        alert('Project imported as "' + name + '"!');
      } catch (e) {
        alert('Failed to import project!');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};
