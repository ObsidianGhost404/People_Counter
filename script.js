(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Decorative sample values in the hero panel; these are illustrative, not a live sensor feed.
  const values = { occupancy: document.getElementById('occupancy'), inside: document.getElementById('in-count'), outside: document.getElementById('out-count') };
  const video = document.getElementById('project-video');
  const soundButton = document.getElementById('sound-hint');
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4300);
  }
  soundButton?.addEventListener('click', () => {
    showToast('The demo contains its original audio. Press play on the video, then use the speaker icon and your device volume to adjust sound.');
  });
  // Keep playback fully user-controlled; browsers block autoplay with sound by design.
  video?.addEventListener('play', () => {
    if (video.muted) showToast('Video is muted. Tap the speaker icon in the player to enable audio.');
  });
  video?.addEventListener('error', () => {
    showToast('The video could not load. Make sure assets/project-demo.mp4 is present in the uploaded repository.');
  });

  // A subtle pointer tilt on the hero illustration, disabled for touch and reduced-motion users.
  const visual = document.querySelector('.hero-visual');
  const panel = document.querySelector('.glass-panel');
  if (visual && panel && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    visual.addEventListener('pointermove', event => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      panel.style.transform = `rotateY(${-7 + x * 5}deg) rotateX(${3 - y * 4}deg) translateY(-2px)`;
    });
    visual.addEventListener('pointerleave', () => panel.style.transform = '');
  }
})();