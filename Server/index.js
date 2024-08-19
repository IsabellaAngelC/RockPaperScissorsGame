const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = {
  players: [],
  moves: {},
  result: null,
};

let timer;

// Endpoint para registrar al jugador y su movimiento
app.post("/user", (request, response) => {
  const { name, profilePicture, move } = request.body;

  // Añadir jugador a la lista
  db.players.push({ name, profilePicture, move });

  // Registrar el movimiento del jugador
  db.moves[name] = move;

  // Iniciar el temporizador si es el primer jugador
  if (Object.keys(db.moves).length === 1) {
    startTimer();
  }

  // Si ambos jugadores han enviado sus movimientos, determina el ganador
  if (Object.keys(db.moves).length === 2) {
    determineWinner();
  }

  response.status(201).send({ message: "Player registered" });
});

// Función para iniciar el temporizador de 10 segundos
function startTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (Object.keys(db.moves).length === 1) {
      const [firstPlayer] = db.players;
      db.result = `${firstPlayer.name} wins by default!`;
    } else {
      determineWinner();
    }
  }, 10000);
}

// Función para determinar el ganador basado en los movimientos
function determineWinner() {
  const players = Object.keys(db.moves);
  const moves = Object.values(db.moves);
  let result = '';

  if (moves[0] === moves[1]) {
    result = "It's a tie!";
  } else if (
    (moves[0] === "rock" && moves[1] === "scissors") ||
    (moves[0] === "scissors" && moves[1] === "paper") ||
    (moves[0] === "paper" && moves[1] === "rock")
  ) {
    result = `${players[0]} wins!`;
  } else {
    result = `${players[1]} wins!`;
  }

  db.result = result;
  clearTimeout(timer); // Limpiar el temporizador después de determinar el ganador
}

// Endpoint para obtener el resultado del juego
app.get("/result", (request, response) => {
  response.send({ result: db.result || "Waiting for both players..." });
});

// Endpoint para obtener los jugadores
app.get("/users", (request, response) => {
  response.send(db);
});

// Nueva ruta para vaciar la lista de jugadores
app.delete("/reset-users", (request, response) => {
  db.players = [];
  db.moves = {};
  db.result = null;
  clearTimeout(timer); // Limpiar el temporizador
  response.status(200).send({ message: "Players reset successfully" });
});

app.listen(5050, () => {
  console.log(`Server is running on http://localhost:5050`);
});
