#!/usr/bin/env node
// Renders content.json into index.html, so the page has its text before any script runs.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const content = JSON.parse(read('content.json'));

const escape = text => String(text ?? '').replace(/[&<>"']/g, char => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
));
// The only formatting content.json supports: **bold**.
const rich = text => escape(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const period = item => [item.start, item.end].filter(Boolean).join(' – ');
const list = (items, render) => (items ?? []).map(render).join('');

const now = content.current;
const links = [...(content.links ?? []), content.cv && { label: 'CV (PDF)', url: content.cv }].filter(Boolean);

const values = {
  name: escape(content.name),
  title: escape(content.title),
  location: escape(content.location),
  tagline: escape(content.tagline),
  contact: escape(content.contact),
  email: escape(content.email),
  cv: escape(content.cv),
  now: now ? `
      <p class="now-label">Currently</p>
      ${now.logo ? `<img class="logo logo-light" src="${escape(now.logo.light)}" alt="${escape(now.company)}">
      <img class="logo logo-dark" src="${escape(now.logo.dark)}" alt="" aria-hidden="true">` : `<h3>${escape(now.company)}</h3>`}
      <p class="now-role">${escape(now.role)}</p>
      <p class="now-since">Since ${escape(now.since)}</p>
      <p class="now-text">${escape(now.summary)}</p>
    ` : '',
  about: list(content.about, paragraph => `<p>${rich(paragraph)}</p>`),
  skills: list(content.skills, skill => `<span>${escape(skill)}</span>`),
  jobs: list(content.experience, job => `
      <li class="reveal">
        <p class="when">${escape(period(job))}</p>
        <div>
          <h3>${escape(job.company)}</h3>
          <p class="sub">${escape(job.role)}</p>
          ${job.summary ? `<p class="job-summary">${rich(job.summary)}</p>` : ''}
          <ul>${list(job.points, point => `<li>${rich(point)}</li>`)}</ul>
        </div>
      </li>`),
  schools: list(content.education, school => `
      <li class="reveal">
        <p class="when">${escape(period(school))}</p>
        <div>
          <h3>${escape(school.degree)}</h3>
          <p class="sub">${escape(school.school)}${school.location ? `, ${escape(school.location)}` : ''}</p>
          ${school.grade ? `<p class="grade">Grade ${escape(school.grade)}</p>` : ''}
          ${school.thesis ? `<p class="thesis">Thesis: <a href="${escape(school.thesis.url)}">${escape(school.thesis.title)}</a></p>` : ''}
        </div>
      </li>`),
  links: list(links, link =>
    `<a href="${escape(link.url)}"><span>${escape(link.label)}</span><span class="arrow" aria-hidden="true">↗</span></a>`
  ),
};

const page = read('tools/index.template.html').replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!(key in values)) throw new Error(`index.template.html: unknown placeholder {{${key}}}`);
  return values[key];
});
writeFileSync(new URL('index.html', root), page);
console.log('Wrote index.html');
