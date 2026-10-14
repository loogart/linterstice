// Add Pier Olivier's confirmed booking URL here when it is available.
const BOOKING_URL = '';
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu(){ mobileNav.hidden=true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Ouvrir le menu'); }
menuButton.addEventListener('click',()=>{ const open=menuButton.getAttribute('aria-expanded')!=='true'; mobileNav.hidden=!open; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu'); });
mobileNav.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const dialog = document.getElementById('booking-dialog');
document.querySelectorAll('[data-offer]').forEach(button=>button.addEventListener('click',()=>{ if(BOOKING_URL){window.location.assign(BOOKING_URL);return;} const offer=button.dataset.offer; document.getElementById('booking-title').textContent=offer||'Réserver une séance';dialog.showModal(); }));
document.querySelectorAll('.dialog-close,.dialog-dismiss').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('.ambient-video')];
function updateMotion(){videos.forEach(video=>{if(reduceMotion.matches||document.hidden)video.pause();else video.play().catch(()=>{});});}
reduceMotion.addEventListener('change',updateMotion);document.addEventListener('visibilitychange',updateMotion);updateMotion();
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    // Scroll position controls these reveals in both directions.
    gsap.utils.toArray('.reveal:not(.hero-title):not(.hero-description)').forEach(el => {
      gsap.from(el, {
        autoAlpha: 0, y: 36, ease: 'sine.out',
        scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 66%', scrub: 0.7 }
      });
    });
    // Arrival unfolds over roughly two seconds, separate from scroll reveals.
    const arrival = gsap.timeline({ defaults: { ease: 'sine.out' } });
    arrival.from('.hero-title .eyebrow', { autoAlpha: 0, y: 10, duration: 1.6 }, 0);
    arrival.from('.hero-title h1', { autoAlpha: 0, y: 16, duration: 2 }, 0.2);
    arrival.from('.hero-description > *', { autoAlpha: 0, y: 10, duration: 1.8, stagger: 0.15 }, 0.45);
    const hero = document.querySelector('.hero');
    const circles = [...document.querySelectorAll('.hero-circles circle')];
    const orbitSvg = document.querySelector('.hero-circles');
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const svgNode = (name, attributes, parent) => {
      const node = document.createElementNS(svgNamespace, name);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      parent.appendChild(node);
      return node;
    };
    const orbitDefs = svgNode('defs', {}, orbitSvg);
    const halo = svgNode('radialGradient', { id: 'orbit-sunlight' }, orbitDefs);
    svgNode('stop', { offset: '0', 'stop-color': '#ffffff', 'stop-opacity': '.95' }, halo);
    svgNode('stop', { offset: '.24', 'stop-color': '#fffaf2', 'stop-opacity': '.7' }, halo);
    svgNode('stop', { offset: '.6', 'stop-color': '#f7efdf', 'stop-opacity': '.24' }, halo);
    svgNode('stop', { offset: '1', 'stop-color': '#f7efdf', 'stop-opacity': '0' }, halo);
    const glowFilter = svgNode('filter', { id: 'orbit-trail-glow', x: '-80%', y: '-80%', width: '260%', height: '260%' }, orbitDefs);
    svgNode('feGaussianBlur', { stdDeviation: '3' }, glowFilter);
    const orbitLayers = [];
    const circleLoops = circles.map((circle, index) => {
      const cx = Number(circle.getAttribute('cx'));
      const cy = Number(circle.getAttribute('cy'));
      const radius = Number(circle.getAttribute('r'));
      const length = circle.getTotalLength();
      const layer = svgNode('g', { class: 'orbit-light', opacity: '0', 'aria-hidden': 'true' }, orbitSvg);
      orbitLayers.push(layer);
      const diffuse = svgNode('path', { fill: 'none', stroke: '#fff8eb', 'stroke-width': '5', opacity: '.65', filter: 'url(#orbit-trail-glow)' }, layer);
      const streak = Array.from({ length: 16 }, (_, segment) => svgNode('path', {
        fill: 'none', stroke: segment < 4 ? '#ffffff' : '#faf5ea',
        'stroke-width': (1.8 - segment * 0.06).toFixed(2),
        'stroke-linecap': 'round', opacity: Math.pow(1 - segment / 16, 2).toFixed(3)
      }, layer));
      const light = svgNode('g', { class: 'orbit-light-head' }, layer);
      svgNode('circle', { r: '28', fill: 'url(#orbit-sunlight)' }, light);
      svgNode('circle', { r: '6', fill: '#fff8eb', opacity: '.75', filter: 'url(#orbit-trail-glow)' }, light);
      svgNode('circle', { r: index ? '2.7' : '3.4', fill: '#ffffff' }, light);
      const point = phase => {
        const angle = (phase + 0.32 + index * 0.2) * Math.PI * 2;
        return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
      };
      const arc = (start, end) => {
        const from = point(start), to = point(end);
        return `M${from.x.toFixed(3)},${from.y.toFixed(3)} A${radius},${radius} 0 0 1 ${to.x.toFixed(3)},${to.y.toFixed(3)}`;
      };
      const state = { phase: 0 };
      const drawOrbit = () => {
        const head = point(state.phase);
        light.setAttribute('transform', `translate(${head.x.toFixed(3)} ${head.y.toFixed(3)})`);
        streak.forEach((segment, position) => segment.setAttribute('d', arc(state.phase - 0.06 * (position + 1) / 16, state.phase - 0.06 * position / 16)));
        diffuse.setAttribute('d', arc(state.phase - 0.06, state.phase));
      };
      drawOrbit();
      // One sunrise pass on arrival, then another at each ten-second mark.
      const loop = gsap.timeline({ repeat: -1 });
      const delay = index * 0.45;
      loop.set(circle, { strokeDasharray: length + 2, strokeDashoffset: length * 0.68, autoRound: false }, 0);
      loop.set(layer, { opacity: 0 }, 0);
      loop.to(layer, { opacity: index ? 0.8 : 1, duration: 0.9, ease: 'sine.out' }, delay);
      loop.to(state, { phase: 1, duration: 5.2, ease: 'sine.inOut', onUpdate: drawOrbit }, delay);
      loop.to(circle, { strokeDashoffset: 0, duration: 5.2, ease: 'sine.inOut', autoRound: false }, delay);
      loop.to(layer, { opacity: 0, duration: 0.9, ease: 'sine.in' }, delay + 4.3);
      loop.to(circle, { strokeDashoffset: length * 0.68, duration: 2, ease: 'sine.inOut', autoRound: false }, 7);
      loop.to({}, { duration: 0.01 }, 9.99);
      return loop;
    });
    const syncHeroLoops = () => {
      const bounds = hero.getBoundingClientRect();
      const visible = bounds.bottom > 0 && bounds.top < innerHeight && !document.hidden;
      circleLoops.forEach(loop => visible ? loop.play() : loop.pause());
    };
    document.addEventListener('visibilitychange', syncHeroLoops);
    syncHeroLoops();
    gsap.fromTo('.dots-left', { y: -44 }, { y: 44, ease: 'none', scrollTrigger: { trigger: '.breathing', start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    gsap.fromTo('.dots-right', { y: 44 }, { y: -44, ease: 'none', scrollTrigger: { trigger: '.breathing', start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    gsap.fromTo('.forest-image', { y: -10 }, { y: -100, ease: 'none', scrollTrigger: { trigger: '.retreats', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    gsap.fromTo('.hand-image', { y: -50, x: 10 }, { y: 50, x: -10, ease: 'none', scrollTrigger: { trigger: '.benefits-section', start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    gsap.to('.hero-dots', { y: 65, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });

    const quotes = [...document.querySelectorAll('.testimonials blockquote')];
    const quoteUpdates = [];
    quotes.forEach(quote => {
      const text = quote.textContent;
      quote.setAttribute('aria-label', text);
      const original = document.createElement('span');
      original.className = 'quote-original'; original.textContent = text; original.setAttribute('aria-hidden', 'true');
      const typed = document.createElement('span');
      typed.className = 'quote-typed'; typed.setAttribute('aria-hidden', 'true');
      quote.replaceChildren(original, typed); quote.classList.add('typing-ready');
      const state = { characters: 0 };
      const setCharacters = gsap.quickTo(state, 'characters', { duration: 0.7, ease: 'sine.out',
        onUpdate: () => { typed.textContent = text.slice(0, Math.round(state.characters)); }
      });
      quoteUpdates.push(() => {
        const progress = Math.max(0, Math.min(1, (innerHeight * 0.88 - quote.getBoundingClientRect().top) / (innerHeight * 0.3)));
        setCharacters(progress * text.length);
      });
    });
    const updateQuotes = () => { quoteUpdates.forEach(update => update()); };
    window.addEventListener('scroll', updateQuotes, { passive: true });
    window.addEventListener('resize', updateQuotes, { passive: true });
    updateQuotes();

    const logo = document.querySelector('.footer-logo');
    const logoGroup = logo.querySelector('g');
    const logoPaths = [...logo.querySelectorAll('path')];
    // Stems draw from their base, then leaves and arches open upward.
    const order = [logoPaths[2], logoPaths[3], logoPaths[0], logoPaths[1], ...logoPaths.slice(4)];
    const bloom = gsap.timeline({ repeat: -1, repeatDelay: 1.5, paused: true });
    bloom.set(logoGroup, { svgOrigin: '93.94 196.84', scale: 0.82, opacity: 0 });
    bloom.set(order, { strokeDasharray: (_, el) => el.getTotalLength() + 2, strokeDashoffset: (_, el) => -(el.getTotalLength() + 2), autoRound: false });
    bloom.to(logoGroup, { opacity: 1, scale: 1, duration: 2.4, ease: 'sine.out' }, 0);
    bloom.to(order, { strokeDashoffset: 0, duration: 2.5, stagger: 0.22, ease: 'sine.inOut' }, 0);
    // Remove the dash seam while fully open so closed leaf corners join cleanly.
    bloom.set(order, { strokeDasharray: 'none' });
    bloom.set(order, { strokeDasharray: (_, el) => el.getTotalLength() + 2, autoRound: false }, '+=4');
    bloom.to(order, { strokeDashoffset: (_, el) => -(el.getTotalLength() + 2), duration: 1.8, stagger: 0.1, ease: 'sine.inOut', autoRound: false });
    bloom.to(logoGroup, { opacity: 0, scale: 0.82, duration: 1.8, ease: 'sine.in' }, '<');
    let logoVisible = false;
    const syncLogo = () => { if (logoVisible && !document.hidden) bloom.play(); else bloom.pause(); };
    const logoObserver = new IntersectionObserver(entries => { logoVisible = entries[0].isIntersecting; syncLogo(); });
    logoObserver.observe(logo);
    document.addEventListener('visibilitychange', syncLogo);

    const dotSvg = document.querySelector('svg.hero-dots');
    const dots = [...dotSvg.querySelectorAll('circle')].map(el => ({ el, x: Number(el.getAttribute('cx')), y: Number(el.getAttribute('cy')), dx: 0, dy: 0 }));
    let pointer = { x: 225, y: 144, active: false };
    let dotFrame = 0, lastDotPaint = 0, heroVisible = true;
    function moveDots(now) {
      dotFrame = 0;
      if (!heroVisible || document.hidden) return;
      if (now - lastDotPaint < 1000 / 30) { dotFrame = requestAnimationFrame(moveDots); return; }
      lastDotPaint = now;
      let unsettled = false;
      dots.forEach(dot => {
        const vx = pointer.x - dot.x, vy = pointer.y - dot.y;
        const distance = Math.hypot(vx, vy);
        const attraction = pointer.active ? 0.36 / (1 + distance / 300) : 0;
        const tx = Math.max(-85, Math.min(85, vx * attraction));
        const ty = Math.max(-85, Math.min(85, vy * attraction));
        dot.dx += (tx - dot.dx) * 0.12; dot.dy += (ty - dot.dy) * 0.12;
        if (Math.abs(tx - dot.dx) + Math.abs(ty - dot.dy) > 0.08) unsettled = true;
        dot.el.setAttribute('transform', `translate(${dot.dx.toFixed(2)} ${dot.dy.toFixed(2)})`);
      });
      if (unsettled || pointer.active) dotFrame = requestAnimationFrame(moveDots);
    }
    const startDots = () => { if (!dotFrame && heroVisible && !document.hidden) dotFrame = requestAnimationFrame(moveDots); };
    const followPointer = event => {
      const bounds = dotSvg.getBoundingClientRect();
      pointer = { x: (event.clientX - bounds.left) * 450 / bounds.width, y: (event.clientY - bounds.top) * 289 / bounds.height, active: true };
      startDots();
    };
    const releasePointer = () => { pointer.active = false; startDots(); };
    hero.addEventListener('pointermove', followPointer, { passive: true });
    hero.addEventListener('pointerdown', followPointer, { passive: true });
    hero.addEventListener('pointerleave', releasePointer);
    hero.addEventListener('pointerup', releasePointer);
    hero.addEventListener('pointercancel', releasePointer);
    const heroObserver = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      syncHeroLoops();
      if (!heroVisible) pointer.active = false;
      else startDots();
    });
    heroObserver.observe(hero);
    document.addEventListener('visibilitychange', startDots);
    return () => {
      logoObserver.disconnect(); heroObserver.disconnect();
      orbitLayers.forEach(layer => layer.remove()); orbitDefs.remove();
      window.removeEventListener('scroll', updateQuotes); window.removeEventListener('resize', updateQuotes);
      document.removeEventListener('visibilitychange', syncLogo);
      document.removeEventListener('visibilitychange', syncHeroLoops);
      document.removeEventListener('visibilitychange', startDots);
      hero.removeEventListener('pointermove', followPointer); hero.removeEventListener('pointerdown', followPointer);
      hero.removeEventListener('pointerleave', releasePointer); hero.removeEventListener('pointerup', releasePointer); hero.removeEventListener('pointercancel', releasePointer);
      cancelAnimationFrame(dotFrame);
      dots.forEach(dot => dot.el.removeAttribute('transform'));
      quotes.forEach(quote => { quote.classList.remove('typing-ready'); quote.textContent = quote.getAttribute('aria-label'); quote.removeAttribute('aria-label'); });
    };
  });
}

// Five fine ribbons flow through a slow, continuous breathing cycle.
const wave = document.querySelector('.breathing-wave');
if (wave) {
  const strands = [...wave.querySelectorAll('[data-wave-strand]')];
  const TAU = Math.PI * 2;
  let waveFrame = 0;
  let waveVisible = false;
  let waveTime = 0;
  let lastFrame = 0;
  let lastPaint = 0;
  function drawWave(time) {
    const breath = 0.88 + 0.12 * Math.sin(TAU * time / 9);
    strands.forEach((strand, index) => {
      const phase = TAU * time / 18 + index * 0.68;
      const amplitude = (60 - index * 3) * breath;
      let path = '';
      for (let point = 0; point <= 96; point++) {
        const x = point / 96;
        const envelope = Math.pow(Math.sin(Math.PI * x), 1.25);
        const ripple = Math.sin(TAU * x + phase) + 0.16 * Math.sin(2 * TAU * x - phase * 0.5);
        const y = 105 + envelope * amplitude * ripple;
        path += `${point ? 'L' : 'M'}${(x * 506).toFixed(2)},${y.toFixed(2)} `;
      }
      strand.setAttribute('d', path);
    });
  }
  function animateWave(now) {
    waveTime += Math.min((now - lastFrame) / 1000, 0.08);
    lastFrame = now;
    if (now - lastPaint >= 1000 / 30) {
      drawWave(waveTime);
      lastPaint = now;
    }
    waveFrame = requestAnimationFrame(animateWave);
  }
  function syncWave() {
    const shouldPlay = waveVisible && !document.hidden && !reduceMotion.matches;
    if (shouldPlay && !waveFrame) {
      lastFrame = performance.now();
      waveFrame = requestAnimationFrame(animateWave);
    } else if (!shouldPlay && waveFrame) {
      cancelAnimationFrame(waveFrame);
      waveFrame = 0;
    }
  }
  drawWave(0);
  new IntersectionObserver(entries => {
    waveVisible = entries[0].isIntersecting;
    syncWave();
  }, { threshold: 0 }).observe(wave);
  reduceMotion.addEventListener('change', syncWave);
  document.addEventListener('visibilitychange', syncWave);
}
