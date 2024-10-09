import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Rising Stonks!";
document.title = gameName;
let counter: number = 0;
let lastTime: number = 0;
let growthRate: number = 0;

function updateCounterDisplay() {
  const counterDiv = document.getElementById("counterDisplay");
  if (counterDiv) {
    counterDiv.innerText = `${Math.floor(counter)} shares!`;
  }

  const upgradeButton = document.getElementById("upgradeButton") as HTMLButtonElement;
    if (upgradeButton) {
        upgradeButton.disabled = counter < 10; // Disable if counter is less than 10
    }

}
function addrandomButton() {
  const button = document.createElement("button");

  button.innerText = "Stonks!";

  button.style.fontSize = "20px";
  button.style.padding = "10px 20px";
  button.style.cursor = "pointer";

  button.addEventListener("click", () => {
    counter++;
    updateCounterDisplay();
  });

  document.body.appendChild(button);

  const counterDiv = document.createElement("div");
  counterDiv.id = "counterDisplay";
  counterDiv.style.fontSize = "18px";
  counterDiv.style.marginTop = "10px";

  updateCounterDisplay();

  document.body.appendChild(counterDiv);
}

function addUpgradeButton() {
    const upgradeButton = document.createElement("button");
    upgradeButton.id = "upgradeButton";
    
    upgradeButton.innerText = "Buy Upgrade (+1 Growth Rate for 10 stonks)";
    
    upgradeButton.style.fontSize = "16px";
    upgradeButton.style.marginTop = "10px";
    upgradeButton.style.padding = "10px 20px";
    upgradeButton.style.cursor = "pointer";

    upgradeButton.disabled = true;

    upgradeButton.addEventListener("click", () => {
        if (counter >= 10) {
            counter -= 10;
            growthRate += 1; 
            updateCounterDisplay();
        }
    });

    document.body.appendChild(upgradeButton);
}

function animateCounter(timestamp: number) {
  if (!lastTime) lastTime = timestamp;

  const deltaTime = timestamp - lastTime;

  counter += deltaTime / 1000;

  lastTime = timestamp;

  updateCounterDisplay();

  requestAnimationFrame(animateCounter);
}

addrandomButton();
addUpgradeButton();

requestAnimationFrame(animateCounter);
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
