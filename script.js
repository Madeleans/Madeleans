<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Müllfänger-Spiel</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: white;
            text-align: center;
            color: #333;
            margin: 0;
            padding: 0;
        }
        canvas {
            background: #c3e6cb;
            display: block;
            margin: auto;
            border: 2px solid #333;
        }
        .game-container {
            margin-top: 20px;
        }
        .score {
            font-size: 20px;
            font-weight: bold;
            margin-top: 10px;
        }
        button {
            margin-top: 10px;
            padding: 10px 15px;
            font-size: 16px;
            cursor: pointer;
            border: none;
            background: #6a5acd;
            color: white;
            border-radius: 5px;
        }
        button:hover {
            background: #5a4bbd;
        }
    </style>
</head>
<body>

    <h1>Spiele das Müllfänger-Spiel</h1>
    <p>Fange den Müll mit dem Netz!</p>
    <div class="score">Punkte: <span id="score">0</span></div>

    <div class="game-container">
        <canvas id="gameCanvas" width="400" height="500"></canvas>
    </div>

    <button onclick="startGame()">Neustart</button>

    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        
        let score = 0;
        let gameInterval;
        
        const net = {
            x: 180,
            y: 450,
            width: 60,
            height: 40,
            img: new Image()
        };
        net.img.src = "netz.png"; // Ersetze mit dem Netz-Bild
        
        const trashImages = ["flasche.png", "dose.png", "plastik.png"]; // Ersetze mit echten Bildern
        
        let trashItems = [];

        function createTrash() {
            const img = new Image();
            img.src = trashImages[Math.floor(Math.random() * trashImages.length)];
            
            trashItems.push({
                x: Math.random() * (canvas.width - 40),
                y: -50,
                width: 40,
                height: 40,
                img: img,
                speed: 2 + Math.random() * 3
            });
        }

        function updateGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Netz zeichnen
            ctx.drawImage(net.img, net.x, net.y, net.width, net.height);
            
            // Müll bewegen und zeichnen
            for (let i = 0; i < trashItems.length; i++) {
                let trash = trashItems[i];
                trash.y += trash.speed;
                ctx.drawImage(trash.img, trash.x, trash.y, trash.width, trash.height);

                // Kollision mit Netz prüfen
                if (
                    trash.y + trash.height >= net.y &&
                    trash.x + trash.width >= net.x &&
                    trash.x <= net.x + net.width
                ) {
                    score++;
                    document.getElementById("score").textContent = score;
                    trashItems.splice(i, 1);
                    i--;
                } else if (trash.y > canvas.height) {
                    trashItems.splice(i, 1);
                    i--;
                }
            }

            if (Math.random() < 0.02) createTrash();
        }

        function startGame() {
            score = 0;
            document.getElementById("score").textContent = score;
            trashItems = [];
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, 20);
        }

        // PC-Steuerung
        canvas.addEventListener("mousemove", function (event) {
            let rect = canvas.getBoundingClientRect();
            let mouseX = event.clientX - rect.left;
            net.x = Math.max(0, Math.min(canvas.width - net.width, mouseX - net.width / 2));
        });

        // Touch-Steuerung
        canvas.addEventListener("touchmove", function (event) {
            let rect = canvas.getBoundingClientRect();
            let touchX = event.touches[0].clientX - rect.left;
            net.x = Math.max(0, Math.min(canvas.width - net.width, touchX - net.width / 2));
        });

        startGame();
    </script>

</body>
</html>
