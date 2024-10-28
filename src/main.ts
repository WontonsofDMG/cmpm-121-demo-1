import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Rising Stonks!";
document.title = gameName;

interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

const availableItems: Item[] = [
  { 
      name: "Penny Stocks", 
      cost: 10, 
      rate: 0.1, 
      description: "Small investments with tiny returns, but they add up!" 
  },
  { 
      name: "Blue Chips", 
      cost: 100, 
      rate: 2, 
      description: "Solid, reliable stocks from well-established companies." 
  },
  { 
      name: "Hedge Funds", 
      cost: 1000, 
      rate: 50, 
      description: "High-risk, high-reward hedge funds that rake in stonks fast!" 
  },
  { 
      name: "Tech Startups", 
      cost: 5000, 
      rate: 200, 
      description: "Invest in cutting-edge tech startups. The next unicorn awaits!" 
  },
  { 
      name: "Real Estate", 
      cost: 20000, 
      rate: 1000, 
      description: "A reliable investment in properties that generate huge returns over time." 
  }
];

let counter: number = 0;
const OneSecond: number = 1000;
const CostScale: number = 1.15;
let lastTime: number = 0;
let growthRate: number = 0;

const itemsPurchased: { [key: string]: number } = {};

availableItems.forEach((item) => {
  itemsPurchased[item.name] = 0;
});

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
    let statusHTML = `Items Purchased: <br>`;
    availableItems.forEach((item) => {
      statusHTML += `${item.name}: ${itemsPurchased[item.name]} <br>`;
    });
    upgradeStatusDiv.innerHTML = statusHTML;
  }

  availableItems.forEach((item) => {
    const button = document.getElementById(
      `upgrade${item.name.replace(/\s+/g, "")}`,
    ) as HTMLButtonElement;
    if (button) {
      button.disabled = counter < item.cost;
      button.innerText = `Buy ${item.name} (+${item.rate.toFixed(1)} stonks/sec for ${Math.floor(item.cost)} stonks)\n${item.description}`;
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
  availableItems.forEach((item) => {
    const upgradeButton = document.createElement("button");
    upgradeButton.id = `upgrade${item.name.replace(/\s+/g, "")}`;
    upgradeButton.innerText = `Buy ${item.name} (+${item.rate.toFixed(1)} stonks/sec for ${Math.floor(item.cost)} stonks)\n${item.description}`;
    upgradeButton.style.fontSize = "16px";
    upgradeButton.style.marginTop = "10px";
    upgradeButton.style.padding = "10px 20px";
    upgradeButton.style.cursor = "pointer";
    upgradeButton.disabled = true;

    upgradeButton.addEventListener("click", () => {
      if (counter >= item.cost) {
        counter -= Math.floor(item.cost);
        growthRate += item.rate;
        itemsPurchased[item.name]++;
        item.cost *= CostScale;
        updateDisplay();
      }
    });

    document.body.appendChild(upgradeButton);
  });
}

function animateCounter(timestamp: number) {
  if (!lastTime) lastTime = timestamp;

  const deltaTime = timestamp - lastTime;

  counter += (growthRate * deltaTime) / OneSecond;

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
