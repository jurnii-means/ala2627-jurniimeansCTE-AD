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
const casePrice = document.querySelector("#casePrice");
const buttonPrice = document.querySelector("#buttonPrice");

let balance = 1000;
let opening = false;
let inventory = [];
let selectedCase = "Fracture Case";

const cases = [
  ["CS:GO Weapon Case", 70], ["CS:GO Weapon Case 2", 15], ["CS:GO Weapon Case 3", 10],
  ["eSports 2013 Case", 50], ["eSports 2013 Winter Case", 25], ["eSports 2014 Summer Case", 15],
  ["Operation Bravo Case", 50], ["Operation Phoenix Weapon Case", 3], ["Operation Winter Offensive Weapon Case", 15],
  ["Huntsman Weapon Case", 8], ["Operation Breakout Weapon Case", 12], ["Operation Vanguard Weapon Case", 1.5],
  ["Chroma Case", 1.5], ["Chroma 2 Case", 2], ["Chroma 3 Case", 2], ["Falchion Case", 1.2], ["Shadow Case", 1.5],
  ["Revolver Case", 2], ["Operation Wildfire Case", 2], ["Gamma Case", 3], ["Gamma 2 Case", 2], ["Glove Case", 8],
  ["Spectrum Case", 3], ["Spectrum 2 Case", 2], ["Horizon Case", 1], ["Danger Zone Case", 1], ["Prisma Case", .8],
  ["Prisma 2 Case", .8], ["CS20 Case", 1.5], ["Shattered Web Case", 3.5], ["Operation Broken Fang Case", 4],
  ["Fracture Case", .7], ["Snakebite Case", .5], ["Operation Riptide Case", 10], ["Dreams & Nightmares Case", 1.5],
  ["Recoil Case", .3], ["Revolution Case", .4], ["Kilowatt Case", .2], ["Gallery Case", .3], ["Fever Case", .2]
];

function getCase(name = selectedCase) {
  return cases.find(([caseName]) => caseName === name);
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

const drops = [
  { name: "MP9 | Capillary", rarity: "Mil-Spec", color: "blue", chance: 79.92 },
  { name: "P250 | Verdigris", rarity: "Restricted", color: "purple", chance: 15.98 },
  { name: "M4A4 | Tooth Fairy", rarity: "Classified", color: "pink", chance: 3.2 },
  { name: "AK-47 | Legion of Anubis", rarity: "Covert", color: "red", chance: .64 }
];

const specialDrops = [
  { name: "* Butterfly Knife | Fade", rarity: "Rare Special Item", color: "gold" },
  { name: "* Sport Gloves | Vice", rarity: "Rare Special Item", color: "gold" }
];

function renderCases() {
  caseCount.textContent = `${cases.length} CASES`;
  caseList.innerHTML = cases.map(([caseItem, price]) => `<button class="case-card${caseItem === selectedCase ? " is-selected" : ""}" type="button" data-case="${caseItem}"><span class="case-card-icon">*</span><span class="case-card-name">${caseItem}</span><strong>${formatPrice(price)}</strong></button>`).join("");
}

function updateCaseDetails() {
  const [, price] = getCase();
  casePrice.textContent = price.toFixed(2);
  buttonPrice.textContent = price.toFixed(2);
  openButton.dataset.cost = price;
}

caseList.addEventListener("click", (event) => {
  const selectedButton = event.target.closest("[data-case]");
  if (!selectedButton || opening) return;
  selectedCase = selectedButton.dataset.case;
  updateCaseDetails();
  caseName.textContent = selectedCase;
  caseStamp.textContent = `CONTAINER ${cases.indexOf(selectedCase) + 1}`.padStart(13, "0");
  caseList.querySelector(".is-selected")?.classList.remove("is-selected");
  selectedButton.classList.add("is-selected");
  statusMessage.textContent = `${selectedCase} selected. Ready to open.`;
});

function updateWallet() {
  balanceElement.textContent = balance.toLocaleString();
  openButton.disabled = opening || balance < getCase()[1];
}

function chooseDrop() {
  if (Math.random() < .1) {
    return specialDrops[Math.floor(Math.random() * specialDrops.length)];
  }
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
    const itemLabel = item.name.replace("* ", "").split(" |")[0];
    element.innerHTML = `<span class="item-swatch ${item.color}">${itemLabel.slice(0, 2)}</span><span class="item-info"><span class="item-name">${item.name}</span><span class="item-rarity">${item.rarity}</span></span>`;
    inventoryList.append(element);
  });
  itemCount.textContent = `${inventory.length} ${inventory.length === 1 ? "ITEM" : "ITEMS"}`;
}

openButton.addEventListener("click", () => {
  const price = getCase()[1];
  if (opening || balance < price) return;
  opening = true;
  balance -= price;
  updateWallet();
  caseVisual.classList.add("is-opening");
  rouletteTrack.style.setProperty("--roll-distance", `-${Math.floor(Math.random() * 240 + 420)}px`);
  statusMessage.textContent = "Unlocking the case...";
  window.setTimeout(() => {
    if (opening) statusMessage.textContent = "Searching the collection...";
  }, 1200);
  window.setTimeout(() => {
    if (opening) statusMessage.textContent = "The reel is slowing down...";
  }, 5200);
  window.setTimeout(() => {
    const drop = chooseDrop();
    caseVisual.classList.remove("is-opening");
    opening = false;
    addDrop(drop);
    statusMessage.innerHTML = `You pulled <strong class="${drop.color}">${drop.name}</strong> · ${drop.rarity}`;
    updateWallet();
  }, 8000);
});

earnButton.addEventListener("click", () => {
  balance += 100;
  statusMessage.textContent = "+100 credits added to your balance.";
  updateWallet();
});

updateWallet();
renderCases();
updateCaseDetails();
