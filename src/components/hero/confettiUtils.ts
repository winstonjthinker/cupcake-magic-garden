
import "../../styles/confetti.css";

export const showConfetti = () => {
  const confettiCount = 100;
  const colors = ['#FFD6E0', '#A5D8FF', '#FFC107', '#FF9FB5'];
  
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(confettiContainer);
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'absolute';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-5vh';
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.zIndex = '9999';
      
      // Set animation
      confetti.style.position = 'absolute';
      confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
      
      confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confettiContainer.contains(confetti)) {
          confettiContainer.removeChild(confetti);
        }
      }, 5000);
    }, i * 20);
  }
  
  // Remove container after all confetti are gone
  setTimeout(() => {
    if (document.body.contains(confettiContainer)) {
      document.body.removeChild(confettiContainer);
    }
  }, 7000);
};
