import { loadContent, escape, rich, period, fillFields } from './content.js';

const content = await loadContent();
fillFields(content);
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('theme').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark'
    || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

if (content.cv) document.getElementById('cv-top').href = content.cv;

const now = content.current;
document.getElementById('now').innerHTML = now ? `
  <p class="label">Currently</p>
  ${now.logo ? `
  <img class="logo logo-light" src="${escape(now.logo.light)}" alt="${escape(now.company)}">
  <img class="logo logo-dark" src="${escape(now.logo.dark)}" alt="" aria-hidden="true">` : `<h3>${escape(now.company)}</h3>`}
  <p class="when">${escape(now.role)} · since ${escape(now.since)}</p>
  <p class="now-text">${escape(now.summary)}</p>` : '';

document.getElementById('highlights').innerHTML = (content.highlights ?? []).map(item =>
  `<div><dt>${escape(item.value)}</dt><dd>${escape(item.label)}</dd></div>`
).join('');

// Rendered twice so the strip can loop without a gap.
const skills = (content.skills ?? []).map(skill => `<li>${escape(skill)}</li>`).join('');
document.getElementById('ticker').innerHTML = skills + skills.replaceAll('<li>', '<li aria-hidden="true">');

document.getElementById('about-text').innerHTML = (content.about ?? []).map(paragraph =>
  `<p>${rich(paragraph)}</p>`
).join('');

document.getElementById('timeline').innerHTML = (content.experience ?? []).map(job => `
  <li class="${job.end === 'Present' ? 'current' : ''}">
    <p class="when">${escape(period(job))}</p>
    <h3>${escape(job.role)} <span>· ${escape(job.company)}</span></h3>
    ${job.summary ? `<p class="job-summary">${rich(job.summary)}</p>` : ''}
    <ul>${(job.points ?? []).map(point => `<li>${rich(point)}</li>`).join('')}</ul>
  </li>`
).join('');

document.getElementById('schools').innerHTML = (content.education ?? []).map(school => `
  <article class="school">
    <div class="school-head">
      <div>
        <p class="when">${escape(period(school))}${school.location ? ` · ${escape(school.location)}` : ''}</p>
        <h3>${escape(school.degree)}</h3>
        <p>${escape(school.school)}</p>
      </div>
      ${school.grade ? `<p class="grade">${escape(school.grade)}</p>` : ''}
    </div>
    ${school.thesis ? `
    <a class="thesis" href="${escape(school.thesis.url)}">
      <span class="label">Thesis</span>
      <i>${escape(school.thesis.title)}</i>
      <span class="read">Read the thesis ↗</span>
    </a>` : ''}
  </article>`
).join('');

const email = document.getElementById('email');
email.textContent = content.email ?? '';
email.href = content.email ? `mailto:${content.email}` : '#';

// Fades sections in as they scroll into view; content stays visible if this never runs.
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in');
  reveal.unobserve(entry.target);
}), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.section h2, .prose, .timeline > li, .school, .contact').forEach(element => {
  element.classList.add('reveal');
  reveal.observe(element);
});

// Local time in Porto, so visitors know when a reply is likely.
const clock = document.getElementById('clock');
const portoTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = portoTime.format(new Date()); };
tick();
setInterval(tick, 15000);

// Highlights the nav link of the section on screen.
const navLinks = new Map([...document.querySelectorAll('nav a')].map(link => [link.getAttribute('href').slice(1), link]));
const spy = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.remove('active'));
  navLinks.get(entry.target.id)?.classList.add('active');
}), { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((_, id) => { const section = document.getElementById(id); if (section) spy.observe(section); });

document.getElementById('contact-links').innerHTML = (content.links ?? []).map(link =>
  `<a class="pill" href="${escape(link.url)}">${escape(link.label)}</a>`
).join('');
