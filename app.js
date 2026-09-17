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
const caseTitle = document.querySelector("#caseTitle");
const caseStamp = document.querySelector("#caseStamp");
const caseCount = document.querySelector("#caseCount");
const casePrice = document.querySelector("#casePrice");
const buttonPrice = document.querySelector("#buttonPrice");

let balance = 0;
let opening = false;
let starterRollAvailable = true;
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
  { name: "MP9 | Capillary", skinKey: "mp9-capillary", rarity: "Mil-Spec", color: "blue", chance: 79.92, baseValue: 1.25 },
  { name: "P250 | Verdigris", skinKey: "p250-verdigris", rarity: "Restricted", color: "purple", chance: 15.98, baseValue: 2.4 },
  { name: "M4A4 | Tooth Fairy", skinKey: "m4a4-tooth-fairy", rarity: "Classified", color: "pink", chance: 3.2, baseValue: 10 },
  { name: "AK-47 | Legion of Anubis", skinKey: "ak47-legion-of-anubis", rarity: "Covert", color: "red", chance: .64, baseValue: 85 }
];

const specialDrops = [
  { name: "* Butterfly Knife | Fade", skinKey: "butterfly-fade", rarity: "Rare Special Item", color: "gold", baseValue: 320 },
  { name: "* Sport Gloves | Vice", skinKey: "sport-gloves-vice", rarity: "Rare Special Item", color: "gold", baseValue: 180 }
];

const conditions = [
  { name: "Factory New", chance: 2, min: 0, max: .07, multiplier: 1.4 },
  { name: "Minimal Wear", chance: 13, min: .07, max: .15, multiplier: 1.05 },
  { name: "Field-Tested", chance: 40, min: .15, max: .38, multiplier: .75 },
  { name: "Well-Worn", chance: 25, min: .38, max: .45, multiplier: .55 },
  { name: "Battle-Scarred", chance: 20, min: .45, max: 1, multiplier: .4 }
];

const spinnerPool = [
  ...drops,
  ...specialDrops,
  { name: "Glock-18 | Vogue", skinKey: "glock-vogue", rarity: "Classified", color: "pink" },
  { name: "MAC-10 | Disco Tech", skinKey: "mac10-disco-tech", rarity: "Restricted", color: "purple" },
  { name: "SG 553 | Dragon Tech", skinKey: "sg553-dragon-tech", rarity: "Mil-Spec", color: "blue" },
  { name: "USP-S | Printstream", skinKey: "usp-printstream", rarity: "Covert", color: "red" },
  { name: "FAMAS | Meow 36", skinKey: "famas-meow-36", rarity: "Mil-Spec", color: "blue" },
  { name: "AWP | Neo-Noir", skinKey: "awp-neo-noir", rarity: "Classified", color: "pink" },
  { name: "Galil AR | Chromatic Aberration", skinKey: "galil-chromatic-aberration", rarity: "Restricted", color: "purple" }
];

function renderCases() {
  caseCount.textContent = `${cases.length} CASES`;
  caseList.innerHTML = cases.map(([caseItem, price]) => `<button class="case-card${caseItem === selectedCase ? " is-selected" : ""}" type="button" data-case="${caseItem}"><span class="case-card-icon">*</span><span class="case-card-name">${caseItem}</span><strong>${formatPrice(price)}</strong></button>`).join("");
}

function updateCaseDetails() {
  const [, price] = getCase();
  casePrice.textContent = starterRollAvailable ? "FREE" : price.toFixed(2);
  buttonPrice.textContent = starterRollAvailable ? "FREE" : price.toFixed(2);
  openButton.dataset.cost = price;
  caseTitle.textContent = selectedCase.toUpperCase();
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
  balanceElement.textContent = balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  openButton.disabled = opening || (!starterRollAvailable && balance < getCase()[1]);
}

function chooseDrop() {
  if (Math.random() < .0026) {
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

function createItem(drop) {
  const roll = Math.random() * 100;
  let total = 0;
  let condition = conditions[conditions.length - 1];
  for (const option of conditions) {
    total += option.chance;
    if (roll <= total) {
      condition = option;
      break;
    }
  }
  const wear = condition.min + Math.random() * (condition.max - condition.min);
  const value = drop.baseValue * condition.multiplier;
  return {
    ...drop,
    condition: condition.name,
    wear: wear.toFixed(4),
    value: value.toFixed(2)
  };
}

function buildRoulette(winningDrop) {
  const winningIndex = 42;
  const cardWidth = 132;
  const cardGap = 8;
  const trackPadding = 18;
  const cards = [];

  for (let index = 0; index < 48; index += 1) {
    const item = index === winningIndex
      ? winningDrop
      : spinnerPool[Math.floor(Math.random() * spinnerPool.length)];
    const [weapon, skin] = item.name.split(" | ");
    const card = document.createElement("span");
    card.className = `roulette-card ${item.color}`;
    const preview = document.createElement("span");
    preview.className = `skin-preview ${item.skinKey}`;
    const weaponImage = document.createElement("span");
    weaponImage.className = "weapon-image";
    const previewLabel = document.createElement("span");
    previewLabel.textContent = weapon.replace("* ", "");
    preview.append(weaponImage, previewLabel);
    const skinName = document.createElement("span");
    skinName.className = "skin-card-name";
    skinName.textContent = skin || "Special Item";
    card.append(preview, skinName);
    cards.push(card);
  }

  rouletteTrack.replaceChildren(...cards);
  const pointerPosition = caseVisual.clientWidth / 2;
  const winningCardPosition = trackPadding + winningIndex * (cardWidth + cardGap) + cardWidth / 2;
  rouletteTrack.style.setProperty("--roll-distance", `${pointerPosition - winningCardPosition}px`);
}

function addDrop(drop) {
  inventory.unshift(drop);
  inventory = inventory.slice(0, 5);
  renderInventory();
}

function renderInventory() {
  emptyState.hidden = true;
  inventoryList.querySelectorAll(".inventory-item").forEach((item) => item.remove());
  emptyState.hidden = inventory.length > 0;
  inventory.forEach((item, index) => {
    const element = document.createElement("div");
    element.className = "inventory-item";
    element.innerHTML = `<span class="item-swatch ${item.color} ${item.skinKey}"><span class="weapon-image"></span></span><span class="item-info"><span class="item-name">${item.name}</span><span class="item-rarity">${item.rarity}</span><span class="item-details">${item.condition} <b>·</b> Float ${item.wear}</span></span><strong class="item-value">$${item.value}</strong><button class="sell-button" type="button" data-inventory-index="${index}">SELL WEAPON</button>`;
    inventoryList.append(element);
  });
  itemCount.textContent = `${inventory.length} ${inventory.length === 1 ? "ITEM" : "ITEMS"}`;
}

earnButton.addEventListener("click", () => {
  balance += 1;
  statusMessage.textContent = "+$1 added to your balance.";
  updateWallet();
});

inventoryList.addEventListener("click", (event) => {
  const sellButton = event.target.closest("[data-inventory-index]");
  if (!sellButton || opening) return;
  const itemIndex = Number(sellButton.dataset.inventoryIndex);
  const [item] = inventory.splice(itemIndex, 1);
  if (!item) return;
  balance += Number(item.value);
  renderInventory();
  updateWallet();
  statusMessage.textContent = `Sold ${item.name} for $${item.value}.`;
});

openButton.addEventListener("click", () => {
  const price = getCase()[1];
  if (opening || (!starterRollAvailable && balance < price)) return;
  const drop = chooseDrop();
  opening = true;
  if (starterRollAvailable) {
    starterRollAvailable = false;
    updateCaseDetails();
  } else {
    balance -= price;
  }
  updateWallet();
  caseVisual.classList.remove("is-opening");
  void caseVisual.offsetWidth;
  buildRoulette(drop);
  caseVisual.classList.add("is-opening");
  statusMessage.textContent = "Unlocking the case...";
  window.setTimeout(() => {
    if (opening) statusMessage.textContent = "Searching the collection...";
  }, 1200);
  window.setTimeout(() => {
    if (opening) statusMessage.textContent = "The reel is slowing down...";
  }, 5200);
  window.setTimeout(() => {
    caseVisual.classList.remove("is-opening");
    opening = false;
    const item = createItem(drop);
    addDrop(item);
    statusMessage.innerHTML = `You pulled <strong class="${item.color}">${item.name}</strong> · ${item.condition}`;
    updateWallet();
  }, 8000);
});

updateWallet();
renderCases();
updateCaseDetails();
buildRoulette(drops[0]);
