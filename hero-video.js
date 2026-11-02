(() => {
 const video = document.querySelector('#hero-film');
 const button = document.querySelector('.hero-film-toggle');
 if (!video || !button) return;
 const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
 let inView = true;
 let userPaused = reduceMotion.matches;
 video.controls = false;
 button.hidden = false;
 const updateButton = () => {
  const playing = !video.paused;
  const label = playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo';
  button.dataset.playing = String(playing);
  button.setAttribute('aria-label', label);
  button.title = label;
 };
 const play = () => {
  if (!video.getAttribute('src')) video.src = video.dataset.src;
  video.muted = true;
  video.play().catch(updateButton);
 };
 const sync = () => {
  if (document.hidden || !inView || userPaused) video.pause();
  else play();
 };
 button.addEventListener('click', () => {
  userPaused = !video.paused;
  if (userPaused) video.pause(); else play();
 });
 video.addEventListener('play', updateButton);
 video.addEventListener('pause', updateButton);
 video.addEventListener('error', () => {
  video.controls = true;
  button.hidden = true;
 });
 document.addEventListener('visibilitychange', sync);
 reduceMotion.addEventListener('change', () => { userPaused = reduceMotion.matches; sync(); });
 if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, {threshold:0.05}).observe(video);
 }
 updateButton();
 sync();
})();
