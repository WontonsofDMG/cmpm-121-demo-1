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

let counter: number = 0;
const OneSecond: number = 1000;
const CostScale: number = 1.15;
let lastTime: number = 0;
let growthRate: number = 0;
const stonkScale: number = 4; // Variable to control the number of points to skip
const interpolRate: number = 300; // Variable to control the number of interpolation steps

const itemsPurchased: { [key: string]: number } = {};

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

availableItems.forEach((item) => {
  itemsPurchased[item.name] = 0;
});

const stonksHistory: number[] = [];
let gridOffsetX: number = 0;
let fakeStonks: number = 0;
let nextFluctuationTime: number = 0;
const currentGridSpacing = 20; // Initial grid spacing

function updateFakeStonks() {
  const currentTime = Date.now();
  if (currentTime >= nextFluctuationTime) {
    // Simulate fake stock price increases and decreases
    const fluctuation = (Math.random() - 0.5) * Math.sqrt(counter) * (Math.random() + 0.5) * Math.log(counter + 1); // Increased fluctuation range as stock grows
    fakeStonks = counter + fluctuation;

    // Set the next fluctuation time to 0.1 seconds
    nextFluctuationTime = currentTime + 100;
  }
}

function drawLine() {
  const canvas = document.getElementById("stonksCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Record the current fake stonks value
  stonksHistory.push(fakeStonks);

  // Remove old points that are off the canvas
  while (stonksHistory.length > canvas.width / stonkScale * 4) {
    stonksHistory.shift();
  }

  // Determine the maximum stonks value for scaling
  const maxStonks = Math.max(...stonksHistory, counter);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 0.5;
  gridOffsetX -= 1; // Move grid horizontally at the same speed as the line
  if (gridOffsetX <= -currentGridSpacing) {
    gridOffsetX = 0;
  }
  for (let x = gridOffsetX; x < canvas.width; x += currentGridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += currentGridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw line
  const startX = canvas.width - 50; // Start the line 50 pixels from the right edge
  ctx.lineWidth = 2;
  for (let i = stonksHistory.length - 1, x = startX; i > 0; i -= stonkScale, x -= stonkScale) {
    const startY = canvas.height - (stonksHistory[i] / maxStonks) * canvas.height;
    const endY = canvas.height - (stonksHistory[Math.max(i - stonkScale, 0)] / maxStonks) * canvas.height;
    const stepX = stonkScale / interpolRate;
    const stepY = (endY - startY) / interpolRate;
    for (let j = 0; j < interpolRate; j++) {
      ctx.beginPath();
      ctx.moveTo(x - j * stepX, startY + j * stepY);
      ctx.lineTo(x - (j + 1) * stepX, startY + (j + 1) * stepY);
      ctx.strokeStyle = stonksHistory[i] < stonksHistory[Math.max(i - stonkScale, 0)] ? "#ff0000" : "#00ff00";
      ctx.stroke();
    }
  }
}

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
  drawLine();
}

function addMainButton() {
  const canvas = document.createElement("canvas");
  canvas.id = "stonksCanvas";
  canvas.height = 200;
  // Create a temporary element to measure the text width
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.visibility = "hidden";
  tempDiv.style.fontSize = "20px";
  tempDiv.style.padding = "10px 20px";
  tempDiv.innerText = "📈 Click Me for Stonks!";
  document.body.appendChild(tempDiv);
  const textWidth = tempDiv.offsetWidth;
  document.body.removeChild(tempDiv);
  canvas.width = textWidth;
  canvas.style.border = "2px solid black"; // Add a black border around the canvas
  app.append(canvas);
  const header = document.createElement("h1");
  header.innerHTML = gameName;
  app.append(header);
  const button = document.createElement("button");
  button.innerText = "📈 Click Me for Stonks!";
  button.style.fontSize = "20px";
  button.style.padding = "10px 20px";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => {
    counter++;
    updateDisplay();
  });
  app.appendChild(button);
  const counterDiv = document.createElement("div");
  counterDiv.id = "counterDisplay";
  counterDiv.style.fontSize = "18px";
  counterDiv.style.marginTop = "10px";
  app.appendChild(counterDiv);
  const growthRateDiv = document.createElement("div");
  growthRateDiv.id = "growthRateDisplay";
  growthRateDiv.style.fontSize = "16px";
  growthRateDiv.style.marginTop = "10px";
  app.appendChild(growthRateDiv);
  const upgradeStatusDiv = document.createElement("div");
  upgradeStatusDiv.id = "upgradeStatus";
  upgradeStatusDiv.style.fontSize = "16px";
  upgradeStatusDiv.style.marginTop = "10px";
  app.appendChild(upgradeStatusDiv);
}

function addUpgradeButtons() {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "buttonContainer";
  app.appendChild(buttonContainer);
  availableItems.forEach((item) => {
    const upgradeButton = document.createElement("button");
    upgradeButton.id = `upgrade${item.name.replace(/\s+/g, "")}`;
    upgradeButton.innerText = `Buy ${item.name} (+${item.rate.toFixed(1)} stonks/sec for ${Math.floor(item.cost)} stonks)\n${item.description}`;
    upgradeButton.style.fontSize = "16px";
    upgradeButton.style.marginTop = "10px";
    upgradeButton.style.padding = "10px 20px";
    upgradeButton.style.cursor = "pointer";
    upgradeButton.disabled = true;
    if (item.name === "Real Estate") {
      upgradeButton.classList.add("big");
    }
    upgradeButton.addEventListener("click", () => {
      if (counter >= item.cost) {
        counter -= Math.floor(item.cost);
        growthRate += item.rate;
        itemsPurchased[item.name]++;
        item.cost *= CostScale;
        updateDisplay();
      }
    });
    buttonContainer.appendChild(upgradeButton);
  });
}

function animateCounter(timestamp: number) {
  if (!lastTime) lastTime = timestamp;

  const deltaTime = timestamp - lastTime;

  counter += (growthRate * deltaTime) / OneSecond;

  lastTime = timestamp;

  updateFakeStonks();
  updateDisplay();

  requestAnimationFrame(animateCounter);
}

addMainButton();
addUpgradeButtons();

requestAnimationFrame(animateCounter);