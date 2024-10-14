import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Rising Stonks!";
document.title = gameName;
let counter: number = 0;
let lastTime: number = 0;
let growthRate: number = 0;

const itemsPurchased: { [key: string]: number } = {
  PennyStocks: 0,
  BlueChips: 0,
  HedgeFunds: 0
};

const upgrades = [
  { name: "PennyStocks", initialCost: 10, currentCost: 10, growthRateIncrease: 0.1 },
  { name: "BlueChips", initialCost: 100, currentCost: 100, growthRateIncrease: 2.0 },
  { name: "HedgeFunds", initialCost: 1000, currentCost: 1000, growthRateIncrease: 50 }
];

function updateDisplay() {
  const counterDiv = document.getElementById("counterDisplay");
  if (counterDiv) {
      counterDiv.innerText = `${Math.floor(counter)} stonks 📈`;
  }

  const growthRateDiv = document.getElementById("growthRateDisplay");
  if (growthRateDiv) {
      growthRateDiv.innerText = `Current Growth Rate: ${growthRate.toFixed(2)} stonks/sec 📈`;
  }

  const upgradeStatusDiv = document.getElementById("upgradeStatus");
  if (upgradeStatusDiv) {
      upgradeStatusDiv.innerHTML = `
            Items Purchased: <br>
            Penny Stocks: ${itemsPurchased.PennyStocks} <br>
            Blue Chips: ${itemsPurchased.BlueChips} <br>
            Hedge Funds: ${itemsPurchased.HedgeFunds}
      `;
  }

  upgrades.forEach(upgrade => {
    const button = document.getElementById(`upgrade${upgrade.name}`) as HTMLButtonElement;
    if (button) {
        button.disabled = counter < upgrade.currentCost;
        button.innerText = `Buy ${upgrade.name} (+${upgrade.growthRateIncrease.toFixed(1)} stonks/sec for ${upgrade.currentCost.toFixed(1)} stonks)`;
    }
});

}

function addMainButton() {
  const button = document.createElement("button");

  button.innerText = "📈 Click Me for Stonks!";

  button.style.fontSize = "20px";
  button.style.padding = "10px 20px";
  button.style.cursor = "pointer";

  button.addEventListener("click", () => {
      counter++;
      updateDisplay();
  });

  document.body.appendChild(button);

  const counterDiv = document.createElement("div");
  counterDiv.id = "counterDisplay";
  counterDiv.style.fontSize = "18px";
  counterDiv.style.marginTop = "10px";
  document.body.appendChild(counterDiv);

  const growthRateDiv = document.createElement("div");
  growthRateDiv.id = "growthRateDisplay";
  growthRateDiv.style.fontSize = "16px";
  growthRateDiv.style.marginTop = "10px";
  document.body.appendChild(growthRateDiv);

  const upgradeStatusDiv = document.createElement("div");
  upgradeStatusDiv.id = "upgradeStatus";
  upgradeStatusDiv.style.fontSize = "16px";
  upgradeStatusDiv.style.marginTop = "10px";
  document.body.appendChild(upgradeStatusDiv);
}

function addUpgradeButtons() {
  upgrades.forEach(upgrade => {
      const upgradeButton = document.createElement("button");
      upgradeButton.id = `upgrade${upgrade.name}`;
      
      upgradeButton.innerText = `Buy ${upgrade.name} (+${upgrade.growthRateIncrease.toFixed(1)} stonks/sec for ${upgrade.currentCost.toFixed(1)} stonks)`;
      
      upgradeButton.style.fontSize = "16px";
      upgradeButton.style.marginTop = "10px";
      upgradeButton.style.padding = "10px 20px";
      upgradeButton.style.cursor = "pointer";

      upgradeButton.disabled = true;

      upgradeButton.addEventListener("click", () => {
        if (counter >= upgrade.currentCost) {
            counter -= upgrade.currentCost;
            growthRate += upgrade.growthRateIncrease; // Increase the growth rate
            itemsPurchased[upgrade.name]++; // Track the number of items purchased

            // Increase the price by a factor of 1.15
            upgrade.currentCost *= 1.15;

            updateDisplay();
        }
    });

      document.body.appendChild(upgradeButton);
  });
}


function animateCounter(timestamp: number) {
  if (!lastTime) lastTime = timestamp;

  const deltaTime = timestamp - lastTime;

  counter += (growthRate * deltaTime) / 1000;

  lastTime = timestamp;

  updateDisplay();

  requestAnimationFrame(animateCounter);
}

addMainButton();
addUpgradeButtons();

requestAnimationFrame(animateCounter);
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
