 const moodData = {
      happy: {
        message: "Looks like you're feeling happy today! 🌟",
        sound: { freq: 800, duration: 100 },
        actionText: "Spread the joy!"
      },
      calm: {
        message: "Looks like you're feeling calm today 🌿",
        sound: { freq: 400, duration: 200 },
        actionText: "Breathe deeply"
      },
      stressed: {
        message: "Feeling stressed? Let's tackle it! 💪",
        sound: { freq: 600, duration: 80 },
        actionText: "Release tension!"
      },
      sleepy: {
        message: "Feeling sleepy today? Time to rest 🌙",
        sound: { freq: 300, duration: 300 },
        actionText: "Rest well"
      }
    };

    let currentMood = 'happy';
    let audioContext;

    // Initialize Audio Context on first user interaction
    function initAudio() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    function playSound(freq, duration) {
      initAudio();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + duration / 1000);
    }

    function setMood(mood) {
      currentMood = mood;
      document.body.className = mood;
      
      const data = moodData[mood];
      document.getElementById('moodMessage').textContent = data.message;
      
      playSound(data.sound.freq, data.sound.duration);
      
      // Store in memory (not localStorage as per instructions)
      window.lastMood = mood;
      
      createParticles();
    }

    function doAction() {
      const data = moodData[currentMood];
      playSound(data.sound.freq + 200, data.sound.duration);
      
      const btn = document.querySelector('.action-btn');
      const originalText = btn.textContent;
      btn.textContent = data.actionText;
      
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }

    function createParticles() {
      // Remove old particles
      document.querySelectorAll('.particle').forEach(p => p.remove());
      
      // Create new particles based on mood
      const particleCount = currentMood === 'stressed' ? 20 : currentMood === 'sleepy' ? 8 : 15;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 60 + 20;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
        
        document.body.appendChild(particle);
      }
    }

    // Check for stored mood on load
    window.addEventListener('DOMContentLoaded', () => {
      const stored = window.lastMood;
      if (stored) {
        setMood(stored);
      } else {
        createParticles();
      }
    });

    // Initialize with default particles
    createParticles();