const balanceElement = document.querySelector("#balance");
const openButton = document.querySelector("#openButton");
const earnButton = document.querySelector("#earnButton");
const caseVisual = document.querySelector("#caseVisual");
const statusMessage = document.querySelector("#statusMessage");
const inventoryList = document.querySelector("#inventoryList");
const emptyState = document.querySelector("#emptyState");
const itemCount = document.querySelector("#itemCount");

let balance = 1000;
let opening = false;
let inventory = [];

const drops = [
  { name: "Carbon Fiber", rarity: "Mil-Spec", color: "blue", chance: 79.92 },
  { name: "Static Bloom", rarity: "Restricted", color: "purple", chance: 15.98 },
  { name: "Afterimage", rarity: "Classified", color: "pink", chance: 3.2 },
  { name: "Redline Protocol", rarity: "Covert", color: "red", chance: .64 },
  { name: "Neon Fang", rarity: "Special Item", color: "gold", chance: .26 }
];

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
    element.innerHTML = `<span class="item-swatch ${item.color}">${item.name.charAt(0)}</span><span class="item-info"><span class="item-name">${item.name}</span><span class="item-rarity">${item.rarity}</span></span>`;
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
