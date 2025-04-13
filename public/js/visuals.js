document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("flag-container");
    const flags = [
        "🇺🇸", "🇫🇷", "🇯🇵", "🇧🇷", "🇩🇪", "🇮🇳", "🇨🇦", "🇰🇷", "🇬🇧", "🇦🇺",
        "🇪🇸", "🇮🇹", "🇷🇺", "🇨🇳", "🇮🇩", "🇲🇽", "🇷🇴", "🇵🇱", "🇺🇦", "🇳🇱",
        "🇲🇾", "🇸🇬", "🇦🇷", "🇧🇬", "🇧🇳", "🇮🇪", "🇳🇴", "🇭🇺", "🇸🇮",
        "🇻🇳", "🇦🇪", "🇸🇧", "🇹🇷", "🇿🇲", "🇱🇰", "🇶🇦", "🇨🇱", "🇿🇦", "🇲🇾",
    ];          
  
    const containerRect = container.getBoundingClientRect();
    const flagElements = [];
  
    // Loop through each flag only once
    flags.forEach(flagEmoji => {
      const flag = document.createElement("div");
      flag.className = "flag";
      flag.textContent = flagEmoji;
  
      // Random starting position
      let x = Math.random() * (container.clientWidth - 50);
      let y = Math.random() * (container.clientHeight - 50);
  
      // Random center for circular motion (a small radius)
      let centerX = x;
      let centerY = y;
      let radius = Math.random() * 50 + 30; // Random size for the circular path
      let angle = Math.random() * Math.PI * 2; // Random starting angle
  
      // Slow speed (circle movement control) - Reduced speed for slower motion
      let speed = 0.005 + Math.random() * 0.005; // Even slower speed for the flags
  
      // Apply styles (bigger flags)
      flag.style.position = "absolute";
      flag.style.left = `${x}px`;
      flag.style.top = `${y}px`;
      flag.style.fontSize = "48px"; // Larger flags
      flag.style.transition = "transform 0.2s";
      flag.style.cursor = "pointer";
  
      // Hover bounce effect
      flag.addEventListener("mouseenter", () => {
        flag.style.transform = "scale(1.6) rotate(20deg)";
      });
      flag.addEventListener("mouseleave", () => {
        flag.style.transform = "scale(1) rotate(0deg)";
      });
  
      // Store flag + its circular motion details
      flagElements.push({ el: flag, centerX, centerY, radius, angle, speed });
      container.appendChild(flag);
    });
  
    function animate() {
      for (const flag of flagElements) {
        // Calculate new position using circular motion
        flag.angle += flag.speed; // Increase angle based on speed
  
        // Calculate the X and Y positions in a circle (sine and cosine)
        flag.x = flag.centerX + flag.radius * Math.cos(flag.angle);
        flag.y = flag.centerY + flag.radius * Math.sin(flag.angle);
  
        // Update the flag's position on screen
        flag.el.style.left = `${flag.x}px`;
        flag.el.style.top = `${flag.y}px`;
      }
  
      requestAnimationFrame(animate); // Keep animating
    }
  
    animate();
  });
  