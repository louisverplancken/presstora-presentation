// Navigation partagée : ouverture mobile, fermeture au choix d’un lien ou avec Échap.
(() => {
 const header = document.querySelector('header.header-column-grid');
 const button = header?.querySelector('.header-menu-toggle');
 const nav = header?.querySelector('#primary-navigation');
 if (!button || !nav) return;
 const compact = window.matchMedia('(max-width:1100px)');
 let open = false;
 function setOpen(value, restoreFocus = false) {
  open = compact.matches && value;
  nav.hidden = compact.matches && !open;
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  if (restoreFocus && compact.matches) button.focus({preventScroll:true});
 }
 button.hidden = false;
 header.dataset.menuReady = '';
 setOpen(false);
 button.addEventListener('click', () => setOpen(!open));
 header.addEventListener('keydown', event => {
  if (event.key === 'Escape' && open) {
   event.preventDefault();
   setOpen(false, true);
  }
 });
 nav.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || !compact.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  setOpen(false);
  const url = new URL(link.href, location.href);
  if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
   const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
   if (target) setTimeout(() => {
    const hadTabIndex = target.hasAttribute('tabindex');
    if (!hadTabIndex) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
    if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once:true});
   }, 0);
  }
 });
 document.addEventListener('click', event => {
  if (open && !header.contains(event.target)) setOpen(false);
 });
 compact.addEventListener('change', () => {
  const focusInNav = nav.contains(document.activeElement);
  const focusOnButton = document.activeElement === button;
  setOpen(false, compact.matches && focusInNav);
  if (!compact.matches && focusOnButton) nav.querySelector('a')?.focus({preventScroll:true});
 });
})();
