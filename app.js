const balanceElement = document.querySelector("#balance");
const openButton = document.querySelector("#openButton");
const earnButton = document.querySelector("#earnButton");
const caseVisual = document.querySelector("#caseVisual");
const statusMessage = document.querySelector("#statusMessage");
const inventoryList = document.querySelector("#inventoryList");
const emptyState = document.querySelector("#emptyState");
const itemCount = document.querySelector("#itemCount");
const rouletteTrack = document.querySelector(".roulette-track");
const caseList = document.querySelector("#caseList");
const caseName = document.querySelector("#caseName");
const caseStamp = document.querySelector("#caseStamp");
const caseCount = document.querySelector("#caseCount");

let balance = 1000;
let opening = false;
let inventory = [];
let selectedCase = "Fracture Case";

const cases = [
  "CS:GO Weapon Case", "CS:GO Weapon Case 2", "CS:GO Weapon Case 3",
  "eSports 2013 Case", "eSports 2013 Winter Case", "eSports 2014 Summer Case",
  "Operation Bravo Case", "Operation Phoenix Weapon Case", "Operation Winter Offensive Weapon Case",
  "Huntsman Weapon Case", "Operation Breakout Weapon Case", "Operation Vanguard Weapon Case",
  "Chroma Case", "Chroma 2 Case", "Chroma 3 Case", "Falchion Case", "Shadow Case",
  "Revolver Case", "Operation Wildfire Case", "Gamma Case", "Gamma 2 Case", "Glove Case",
  "Spectrum Case", "Spectrum 2 Case", "Horizon Case", "Danger Zone Case", "Prisma Case",
  "Prisma 2 Case", "CS20 Case", "Shattered Web Case", "Operation Broken Fang Case",
  "Fracture Case", "Snakebite Case", "Operation Riptide Case", "Dreams & Nightmares Case",
  "Recoil Case", "Revolution Case", "Kilowatt Case", "Gallery Case", "Fever Case"
];

const drops = [
  { name: "MP9 | Capillary", rarity: "Mil-Spec", color: "blue", chance: 79.92 },
  { name: "P250 | Verdigris", rarity: "Restricted", color: "purple", chance: 15.98 },
  { name: "M4A4 | Tooth Fairy", rarity: "Classified", color: "pink", chance: 3.2 },
  { name: "AK-47 | Legion of Anubis", rarity: "Covert", color: "red", chance: .64 },
  { name: "* Karambit | Autotronic", rarity: "Special Item", color: "gold", chance: .26 }
];

function renderCases() {
  caseCount.textContent = `${cases.length} CASES`;
  caseList.innerHTML = cases.map((caseItem) => `<button class="case-card${caseItem === selectedCase ? " is-selected" : ""}" type="button" data-case="${caseItem}"><span class="case-card-icon">*</span><span>${caseItem}</span></button>`).join("");
}

caseList.addEventListener("click", (event) => {
  const selectedButton = event.target.closest("[data-case]");
  if (!selectedButton || opening) return;
  selectedCase = selectedButton.dataset.case;
  caseName.textContent = selectedCase;
  caseStamp.textContent = `CONTAINER ${cases.indexOf(selectedCase) + 1}`.padStart(13, "0");
  caseList.querySelector(".is-selected")?.classList.remove("is-selected");
  selectedButton.classList.add("is-selected");
  statusMessage.textContent = `${selectedCase} selected. Ready to open.`;
});

function updateWallet() {
  balanceElement.textContent = balance.toLocaleString();
  openButton.disabled = opening || balance < 250;
}

function chooseDrop() {
  const roll = Math.random() * 100;
  let total = 0;
  for (const drop of drops) {
    total += drop.chance;
    if (roll <= total) return drop;
  }
  return drops[0];
}

function addDrop(drop) {
  inventory.unshift(drop);
  inventory = inventory.slice(0, 5);
  emptyState.hidden = true;
  inventoryList.querySelectorAll(".inventory-item").forEach((item) => item.remove());
  inventory.forEach((item) => {
    const element = document.createElement("div");
    element.className = "inventory-item";
    element.innerHTML = `<span class="item-swatch ${item.color}">${item.name.split(" |")[0].slice(0, 2)}</span><span class="item-info"><span class="item-name">${item.name}</span><span class="item-rarity">${item.rarity}</span></span>`;
    inventoryList.append(element);
  });
  itemCount.textContent = `${inventory.length} ${inventory.length === 1 ? "ITEM" : "ITEMS"}`;
}

openButton.addEventListener("click", () => {
  if (opening || balance < 250) return;
  opening = true;
  balance -= 250;
  updateWallet();
  caseVisual.classList.add("is-opening");
  rouletteTrack.style.setProperty("--roll-distance", `-${Math.floor(Math.random() * 240 + 420)}px`);
  statusMessage.textContent = "Unlocking the case...";
  window.setTimeout(() => {
    const drop = chooseDrop();
    caseVisual.classList.remove("is-opening");
    opening = false;
    addDrop(drop);
    statusMessage.innerHTML = `You pulled <strong class="${drop.color}">${drop.name}</strong> · ${drop.rarity}`;
    updateWallet();
  }, 1100);
});

earnButton.addEventListener("click", () => {
  balance += 100;
  statusMessage.textContent = "+100 credits added to your balance.";
  updateWallet();
});

updateWallet();
renderCases();
