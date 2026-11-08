  const buttons = document.querySelectorAll('.lang-switch button');
  function applyLang(lang) {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.querySelectorAll('[data-ru]').forEach(el => {
      if (el.dataset[lang]) el.textContent = el.dataset[lang];
    });
    document.documentElement.lang = lang;
  }
  buttons.forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  // default to English on load
  applyLang('en');

  const YT_ID = 'BEquHyzrkGU';
  const heroYT = document.getElementById('heroYT');
  const modal = document.getElementById('videoModal');
  const modalSlot = document.getElementById('modalVideoSlot');

  // Pause/play the muted background iframe via postMessage (no API load needed)
  function bgCommand(func) {
    if (!heroYT || !heroYT.contentWindow) return;
    heroYT.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [] }), '*');
  }

  function openModal() {
    modal.classList.add('open');
    // full player with sound and controls
    modalSlot.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + YT_ID +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1" ' +
      'title="EnerVeles" frameborder="0" ' +
      'allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
    bgCommand('pauseVideo');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modalSlot.innerHTML = '';   // stop the modal video
    bgCommand('playVideo');
    document.body.style.overflow = '';
  }
  const watchBtn = document.getElementById('watchBtn');
  if (watchBtn) watchBtn.addEventListener('click', openModal);
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal(); });
  // Ensure the history loop video plays (some browsers block multi-video autoplay)
  const loopClip = document.querySelector('.loop-clip');
  if (loopClip) {
    const tryPlay = () => { loopClip.play().catch(() => {}); };
    tryPlay();
    // retry when it scrolls into view
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) tryPlay(); });
      }, { threshold: 0.2 });
      io.observe(loopClip);
    }
  }

  // Hover-to-video: static photo comes alive on hover, showing more motion
  document.querySelectorAll('.hv-wrap').forEach(wrap => {
    const vid = wrap.querySelector('video');
    if (!vid) return;
    let hideTimer;
    function activate() {
      clearTimeout(hideTimer);
      wrap.classList.add('hv-active');
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
    function deactivate() {
      wrap.classList.remove('hv-active');
      hideTimer = setTimeout(() => vid.pause(), 400);
    }
    wrap.addEventListener('mouseenter', activate);
    wrap.addEventListener('mouseleave', deactivate);
    // touch devices: tap to toggle
    wrap.addEventListener('touchstart', (e) => {
      if (wrap.classList.contains('hv-active')) { deactivate(); }
      else { activate(); }
    }, { passive: true });
  });
