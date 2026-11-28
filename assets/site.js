document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('theme').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark'
    || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

// Fades each block in as it scrolls into view.
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in');
  reveal.unobserve(entry.target);
}), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));

// Local time in Porto, so visitors know when a reply is likely.
const clock = document.getElementById('clock');
const portoTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = portoTime.format(new Date()); };
tick();
setInterval(tick, 15000);
