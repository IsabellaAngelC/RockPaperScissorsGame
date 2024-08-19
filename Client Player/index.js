document.getElementById("submit-button").addEventListener("click", submitPlayerData);


async function submitPlayerData(event) {
  renderLoadingState();
  event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

  const playerName = document.getElementById("player-name").value;
  const move = document.getElementById("move").value;

  const player = {
    name: playerName,
    profilePicture: "https://avatar.iran.liara.run/public/13", // Puedes usar una URL dinámica si lo prefieres
    move: move
  };

  

  try {
    const response = await fetch("http://localhost:5050/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Especificar el tipo de contenido como JSON
      },
      body: JSON.stringify(player), // Convertir los datos a una cadena JSON
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    renderData(playerName, move);
  } catch (error) {
    renderErrorState();
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Loading...</p>";
  console.log("Loading...");
}

function renderData(player) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  const div = document.createElement("div");
  div.className = "item";
  
}
