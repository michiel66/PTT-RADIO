/* PTT-RADIO: vier seizoensskins bovenop de bewezen PTT Direct-interface.
   Geen wijziging van connector, audiostreams of TeamSpeak/WebSpeak3 React-state. */
(() => {
  'use strict';
  if (window.__pttRadioThemesInstalled) return;
  window.__pttRadioThemesInstalled = true;

  const options = [
    {id: 'kerst',  name: 'Kerst Thema',  icon: '🎄', label: 'Kerst',  about: 'Warme kerstlichten · sneeuw · rood en groen'},
    {id: 'winter', name: 'Winter Thema', icon: '❄️', label: 'Winter', about: 'Besneeuwde bergen · ijsblauw neon'},
    {id: 'zomer',  name: 'Zomer Thema',  icon: '☀️', label: 'Zomer',  about: 'Palmbomen · zonsondergang · goud'},
    {id: 'space',  name: 'Space Thema',  icon: '🚀', label: 'Space',  about: 'Planeten · sterren · kosmisch blauw'}
  ];
  const key = 'ptt-radio:skin:v1';
  const valid = id => options.some(item => item.id === id);
  const get = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = id => { try { localStorage.setItem(key, id); } catch { /* settings not writable */ } };
  const img = name => `/ptt-radio-assets/${name}.jpg`;
  let selected = valid(get()) ? get() : 'kerst';
  let active = selected;
  let paneOpen = true;

  function mount() {
    if (!document.body || !document.getElementById('root')) return;
    if (document.getElementById('ptt-radio-header')) return;

    document.body.classList.add('ptt-radio-theme-enabled');
    const header = document.createElement('header');
    header.id = 'ptt-radio-header';
    header.setAttribute('aria-label', 'PTT-RADIO thema en bediening');
    header.innerHTML = `
      <div class="ptt-radio-scene" aria-hidden="true"></div>
      <div class="ptt-radio-brand"><div class="ptt-radio-brand-small">📻 PTT COMMUNICATIE</div>
        <div class="ptt-radio-brand-title">PTT <em>RADIO</em></div>
        <div class="ptt-radio-brand-note" id="ptt-radio-subtitle">Vier seizoenen, één werkende radio</div>
      </div>
      <div class="ptt-radio-chrome" aria-hidden="true">
        <span class="ptt-radio-led"></span><span>CB · PTT</span>
        <div class="ptt-radio-meter"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <button type="button" id="ptt-radio-toggle" aria-expanded="true" aria-controls="ptt-radio-panel">🎨 Thema kiezen</button>`;

    const panel = document.createElement('aside');
    panel.id = 'ptt-radio-panel';
    panel.setAttribute('aria-label', 'Thema kiezen');
    panel.innerHTML = `
      <div class="ptt-radio-panel-head"><span>🎨 Thema Kiezen</span>
        <button type="button" id="ptt-radio-close" aria-label="Themakiezer sluiten">✕</button></div>
      <div id="ptt-radio-options" role="radiogroup" aria-label="Radiothema"></div>
      <button type="button" id="ptt-radio-apply">✓ Thema Toepassen</button>
      <div class="ptt-radio-panel-hint" id="ptt-radio-status" role="status" aria-live="polite">Thema veranderen zonder opnieuw te verbinden.</div>`;

    document.body.insertBefore(header, document.getElementById('root'));
    document.body.appendChild(panel);

    const list = document.getElementById('ptt-radio-options');
    options.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ptt-radio-choice';
      button.dataset.skin = item.id;
      button.setAttribute('role', 'radio');
      button.innerHTML = `<img alt="" src="${img(item.id)}" loading="lazy" />
        <span class="ptt-radio-choice-text"><strong>${item.icon} ${item.name}</strong><small>${item.about}</small></span>
        <span class="ptt-radio-ring" aria-hidden="true"></span>`;
      button.addEventListener('click', () => {
        selected = item.id;
        draw();
      });
      list.appendChild(button);
    });

    document.getElementById('ptt-radio-toggle').addEventListener('click', () => {
      paneOpen = !paneOpen;
      draw();
    });
    document.getElementById('ptt-radio-close').addEventListener('click', () => {
      paneOpen = false;
      draw();
    });
    document.getElementById('ptt-radio-apply').addEventListener('click', () => {
      active = selected;
      save(active);
      document.getElementById('ptt-radio-status').textContent =
        `${options.find(t => t.id === active).name} actief. De radioverbinding is behouden.`;
      paneOpen = false;
      draw();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && paneOpen) {
        paneOpen = false;
        draw();
      }
    });
    draw();
  }

  function draw() {
    if (!document.getElementById('ptt-radio-panel')) return;
    document.body.dataset.pttRadioTheme = active;
    document.body.classList.toggle('ptt-radio-picker-open', paneOpen);
    const toggle = document.getElementById('ptt-radio-toggle');
    toggle.setAttribute('aria-expanded', String(paneOpen));
    toggle.textContent = paneOpen ? '🎨 Thema kiezen ▲' : '🎨 Thema kiezen ▼';
    const panel = document.getElementById('ptt-radio-panel');
    panel.hidden = !paneOpen;
    document.getElementById('ptt-radio-subtitle').textContent =
      `${options.find(t => t.id === active).icon} ${options.find(t => t.id === active).label} · Verbinding en bediening blijven actief`;
    document.querySelectorAll('.ptt-radio-choice').forEach(btn => {
      const picked = btn.dataset.skin === selected;
      btn.setAttribute('aria-checked', String(picked));
      btn.classList.toggle('is-selected', picked);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once: true});
  else mount();
})();
