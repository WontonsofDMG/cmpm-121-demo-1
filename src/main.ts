import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My okay game";
document.title = gameName;
let counter: number = 0;

function updateCounterDisplay() {
  const counterDiv = document.getElementById("counterDisplay");
  if (counterDiv) {
    counterDiv.innerText = `${counter} presses!`;
  }
}
function addrandomButton() {
  const button = document.createElement("button");

  button.innerText = "Button!";

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

function incrementCounterAutomatically() {
    setInterval(() => {
        counter++;
        updateCounterDisplay();
    }, 1000); // Increments every 1000ms (1 second)
}

addrandomButton();
incrementCounterAutomatically();
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
