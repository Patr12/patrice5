const canvas = document.getElementById('simulation-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            size: Math.random() * 5 + 1,
            color: 'rgba(255, 255, 255, 0.5)'
        });
    }
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    });

    requestAnimationFrame(updateParticles);
}

function runSimulation() {
    const chemical1 = prompt("Ingiza kemikali ya kwanza (mfano: H2O, HCl, C2H5OH):");
    const chemical2 = prompt("Ingiza kemikali ya pili (mfano: Na, NaOH, O2):");

    fetch('/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chemical1: chemical1, chemical2: chemical2 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            createReactionEffect(
                data.chemical1,
                data.chemical2,
                data.reaction,
                data.colorBefore,
                data.colorAfter,
                data.product,
                data.smoke
            );
        } else {
            alert("Hakuna majibu yanayoonekana!");
        }
    });
}

function createReactionEffect(chemical1, chemical2, reaction, colorBefore, colorAfter, product, smoke) {
    const vrContainer = document.getElementById('vr-container');
    vrContainer.innerHTML = ''; // Clear previous content

    // Onyesha equation ya kemikali kabla ya majibu
    const equationDiv = document.createElement('div');
    equationDiv.className = 'equation';
    equationDiv.textContent = `${chemical1} + ${chemical2} → ${product}`;
    vrContainer.appendChild(equationDiv);

    // Onyesha rangi kabla ya majibu
    vrContainer.style.backgroundColor = colorBefore;

    // Onyesha rangi baada ya majibu na equation
    setTimeout(() => {
        vrContainer.style.backgroundColor = colorAfter;
        const reactionDiv = document.createElement('div');
        reactionDiv.className = 'reaction';
        reactionDiv.textContent = `Reaction: ${reaction}`;
        vrContainer.appendChild(reactionDiv);
        
        if (smoke) {
            const smokeDiv = document.createElement('div');
            smokeDiv.className = 'smoke';
            smokeDiv.textContent = '💨 Smoke effect';
            vrContainer.appendChild(smokeDiv);
        }

        // Unda chembe za maabara
        createParticles();
        updateParticles();
    }, 2000); // Chelewesha mabadiliko kwa sekunde 2 ili kuonyesha majibu
}

document.getElementById('run-simulation').addEventListener('click', runSimulation);
