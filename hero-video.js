(() => {
 const video = document.querySelector('#hero-film');
 const button = document.querySelector('.hero-film-toggle');
 if (!video || !button) return;
 const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
 const container = video.closest('.landing-film');
 const formats = {
  square: ['assets/video/presstora-v1-square.mp4', 'assets/video/presstora-v1-square.jpg'],
  landscape: ['assets/video/presstora-v1-720.mp4', 'assets/video/presstora-v1-poster.jpg'],
  portrait: ['assets/video/presstora-v1-portrait.mp4', 'assets/video/presstora-v1-portrait.jpg']
 };
 let selectedFormat;
 let resizeTimer;
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
 const selectFormat = () => {
  const {width, height} = container.getBoundingClientRect();
  if (!width || !height) return;
  const ratio = width / height;
  const format = ratio < .75 ? 'portrait' : ratio > 1.5 ? 'landscape' : 'square';
  if (format === selectedFormat) return;
  selectedFormat = format;
  const [src, poster] = formats[format];
  video.dataset.format = format;
  video.dataset.src = src;
  video.poster = poster;
  if (video.getAttribute('src')) {
   const time = video.currentTime;
   video.preload = 'metadata';
   video.src = src;
   video.addEventListener('loadedmetadata', () => {
    if (selectedFormat !== format) return;
    video.currentTime = Math.min(time, video.duration || time);
    sync();
   }, {once:true});
  }
  sync();
 };
 selectFormat();
 if ('ResizeObserver' in window) {
  new ResizeObserver(() => {
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout(selectFormat, 160);
  }).observe(container);
 } else window.addEventListener('resize', selectFormat);
 updateButton();
})();
