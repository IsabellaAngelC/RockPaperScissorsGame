document.getElementById("fetch-button").addEventListener("click", fetchData);
document.addEventListener("DOMContentLoaded", async () => {
  await resetUsers();
  fetchData();
  startResultPolling(); // Iniciar la actualización automática de resultados
});

async function fetchData() {
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:5050/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error(error);
    renderErrorState();
  }
}

async function resetUsers() {
  try {
    const response = await fetch("http://localhost:5050/reset-users", {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to reset players");
    }
    console.log("Players reset successfully");
  } catch (error) {
    console.error("Error resetting players:", error);
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Failed to load data</p>";
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Loading...</p>";
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = "";

  if (data.players.length > 0) {
    data.players.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `<img src="${item.profilePicture}" /><p>${item.name} chose ${item.move}</p>`;
      container.appendChild(div);
    });
  }
}

function startResultPolling() {
  setInterval(async () => {
    try {
      const response = await fetch("http://localhost:5050/result");
      if (!response.ok) {
        throw new Error("Failed to fetch result");
      }
      const data = await response.json();
      displayResult(data.result);
    } catch (error) {
      console.error("Error fetching result:", error);
    }
  }, 10000); // Intervalo de 10 segundos
}

function displayResult(result) {
  const container = document.getElementById("result-container");
  container.innerHTML = `<p>${result}</p>`;
}
