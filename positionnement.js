'use strict';
const chapterLinks=[...document.querySelectorAll('.chapter-nav a')];
const chapterTargets=chapterLinks.map(a=>document.querySelector(a.getAttribute('href')));
let scheduled=false;
function showChapter(){scheduled=false;let current=chapterTargets[0];for(const section of chapterTargets){if(section.getBoundingClientRect().top<=160)current=section;}for(const link of chapterLinks){if(link.hash==='#'+current.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(showChapter);}},{passive:true});
showChapter();
