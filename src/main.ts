import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My okay game";
document.title = gameName;
function addrandomButton() {

    const button = document.createElement("button");

    button.innerText = "Button!";

    button.style.fontSize = "20px";
    button.style.padding = "10px 20px";
    button.style.cursor = "pointer";

    document.body.appendChild(button);
}
addrandomButton();
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
