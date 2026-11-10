/* Pieslēgšanās bez servera: db.js + sessionStorage + js-sha256.
 *
 * Vietne ir atvērta visiem. Galvenē pa kreisi ir poga "Pieslēgties" (pēc pieslēgšanās - "Iziet"),
 * pa labi - nolaižamā izvēlne, kuras saturs atkarīgs no tā, vai lietotājs ir pieslēdzies (menu.js).
 *
 * <head> secība: js-sha256 → db.js → menu.js → auth.js
 *   <script src="https://cdn.jsdelivr.net/npm/js-sha256@0.11.0/build/sha256.min.js" async></script>
 *   <script src="db.js"></script>
 *   <script src="menu.js"></script>
 *   <script src="auth.js"></script>
 *
 * Lapa, kas pieejama tikai pēc pieslēgšanās: <html lang="lv" data-auth="required">
 */
(function () {
  var KEY = 'kvs_user';
  var root = document.documentElement;
  var page = location.pathname.split('/').pop() || 'index.html';
  var needsAuth = root.getAttribute('data-auth') === 'required';
  var MENU = window.KVS_MENU || {};

  function get() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch (e) {} }

  function check(name, pass) {
    name = (name || '').trim().toLowerCase();
    var users = window.KVS_USERS || [];
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      if (u.name.toLowerCase() === name && sha256(u.salt + ':' + pass) === u.hash) return u.name;
    }
    return null;
  }

  var user = get();

  // html.authed = ir pieslēdzies. Slēgta lapa bez pieslēgšanās → sākumlapa ar atvērtu login logu.
  function guard() {
    root.classList.toggle('authed', !!user);
    if (needsAuth && !user) {
      location.replace('index.html?login=' + encodeURIComponent(page));
      return false;
    }
    return true;
  }
  if (!guard()) return;

  function svg(d, cls) {
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var ICON = {
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    out: svg('<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m16 16 4-4-4-4"/><path d="M20 12H9"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>', 'more-burger'),
    down: svg('<path d="m6 9 6 6 6-6"/>', 'more-chev'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>')
  };

  var authBtn, more, moreBtn, moreList, dlg;
  var next = null;        // lapa, uz kuru doties pēc pieslēgšanās

  /* ---------- Poga "Pieslēgties" / "Iziet" ---------- */

  function renderAuth() {
    if (!authBtn) return;
    authBtn.innerHTML = (user ? ICON.out : ICON.user) + '<span>' + (user ? 'Iziet' : 'Pieslēgties') + '</span>';
    if (user) authBtn.title = 'Lietotājs: ' + user;
    else authBtn.removeAttribute('title');
  }

  function logout() {
    set(null);
    user = null;
    if (needsAuth) { location.replace('index.html'); return; }
    guard(); renderAuth(); renderMenu();
  }

  /* ---------- Nolaižamā izvēlne ---------- */

  function slug(s) { return s.replace(/\.html$/, '') || 'index'; }

  function renderMenu() {
    if (!more) return;
    var items = (user ? MENU.user : MENU.guest) || [];
    var current = false;
    moreList.textContent = '';
    for (var i = 0; i < items.length; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      li.style.setProperty('--i', i);
      a.href = items[i].href;
      a.textContent = items[i].title;
      if (slug(items[i].href) === slug(page)) { a.setAttribute('aria-current', 'page'); current = true; }
      li.appendChild(a);
      moreList.appendChild(li);
    }
    more.classList.toggle('is-current', current);
    more.hidden = !items.length;
  }

  function setOpen(open) {
    more.classList.toggle('is-open', open);
    moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function buildMenu(inner) {
    more = document.createElement('nav');
    more.className = 'more';
    more.setAttribute('aria-label', 'Papildu sadaļas');
    more.innerHTML =
      '<button class="more-toggle" type="button" aria-expanded="false" aria-controls="more-list">' +
        ICON.menu + '<span></span>' + ICON.down +
      '</button>' +
      '<div class="more-panel"><ul class="more-list" id="more-list"></ul></div>';
    moreBtn = more.querySelector('.more-toggle');
    moreList = more.querySelector('.more-list');
    moreBtn.querySelector('span').textContent = MENU.label || 'Vairāk';

    var timer, pointer = '';

    // Pele: atveras, uzvirzot kursoru; aizveras īsu brīdi pēc tam, kad kursors aizgājis.
    more.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(timer); setOpen(true);
    });
    more.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(timer);
      timer = setTimeout(function () { setOpen(false); }, 140);
    });

    // Pieskāriens un tastatūra: poga pārslēdz. Pele izvēlni jau atvēra ar kursoru, tāpēc klikšķis to neaizver.
    moreBtn.addEventListener('pointerdown', function (e) { pointer = e.pointerType; });
    moreBtn.addEventListener('click', function (e) {
      var mouse = e.detail > 0 && pointer === 'mouse';
      clearTimeout(timer);
      setOpen(mouse ? true : !more.classList.contains('is-open'));
    });

    more.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && more.classList.contains('is-open')) { setOpen(false); moreBtn.focus(); }
    });
    more.addEventListener('focusout', function (e) {
      if (!more.contains(e.relatedTarget) && !more.matches(':hover')) setOpen(false);
    });
    document.addEventListener('pointerdown', function (e) {
      if (!more.contains(e.target)) setOpen(false);
    });

    inner.appendChild(more);
    renderMenu();
  }

  /* ---------- Pieslēgšanās logs ---------- */

  function buildDialog() {
    dlg = document.createElement('dialog');
    dlg.className = 'login-dialog';
    dlg.setAttribute('aria-labelledby', 'login-title');
    dlg.innerHTML =
      '<form class="login-card" id="login-form" autocomplete="on">' +
        '<h2 id="login-title">Pieslēgties</h2>' +
        '<p class="login-sub">Lai atvērtu papildu sadaļas, ievadiet savu lietotājvārdu un paroli.</p>' +
        '<div class="login-error" id="login-error" role="alert" hidden></div>' +
        '<label class="field">' +
          '<span>Lietotājvārds</span>' +
          '<input type="text" name="username" autocomplete="username" autocapitalize="off" spellcheck="false" required autofocus>' +
        '</label>' +
        '<label class="field">' +
          '<span>Parole</span>' +
          '<span class="pw">' +
            '<input type="password" name="password" id="pw" autocomplete="current-password" required>' +
            '<button type="button" class="pw-toggle" id="pw-toggle" aria-label="Parādīt paroli" aria-pressed="false">' + ICON.eye + '</button>' +
          '</span>' +
        '</label>' +
        '<button class="btn btn-primary login-submit" type="submit">Ieiet</button>' +
        '<button type="button" class="login-close" aria-label="Aizvērt">' + ICON.close + '</button>' +
      '</form>';
    document.body.appendChild(dlg);

    var form = dlg.querySelector('form');
    var err = dlg.querySelector('#login-error');
    var pw = dlg.querySelector('#pw'), tg = dlg.querySelector('#pw-toggle');
    var fails = 0, lockUntil = 0, downOnBackdrop = false;

    function fail(text) { err.textContent = text; err.hidden = false; }

    tg.addEventListener('click', function () {
      var show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      tg.setAttribute('aria-pressed', show);
      tg.setAttribute('aria-label', show ? 'Paslēpt paroli' : 'Parādīt paroli');
    });

    dlg.querySelector('.login-close').addEventListener('click', function () { dlg.close(); });

    // Klikšķis ārpus kartītes aizver logu (tikai ja arī nospiests tika ārpus tās).
    dlg.addEventListener('pointerdown', function (e) { downOnBackdrop = e.target === dlg; });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg && downOnBackdrop) dlg.close();
    });

    dlg.addEventListener('close', function () {
      pw.value = ''; pw.type = 'password';
      tg.setAttribute('aria-pressed', 'false');
      tg.setAttribute('aria-label', 'Parādīt paroli');
      err.hidden = true;
      next = null;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var now = Date.now();
      if (now < lockUntil) {
        fail('Pārāk daudz mēģinājumu. Mēģiniet vēlreiz pēc ' + Math.ceil((lockUntil - now) / 1000) + ' s.');
        return;
      }
      if (typeof sha256 !== 'function') {
        fail('Neizdevās ielādēt pieslēgšanās moduli. Pārbaudiet interneta savienojumu un mēģiniet vēlreiz.');
        return;
      }
      var name = check(form.username.value, pw.value);
      if (name) {
        var go = next;
        fails = 0;
        user = name; set(name);
        guard(); renderAuth(); renderMenu();
        dlg.close();
        if (go) location.href = go;
      } else {
        if (++fails >= 5) { fails = 0; lockUntil = now + 30000; }
        fail('Nepareizs lietotājvārds vai parole.');
        pw.value = ''; pw.focus();
      }
    });
  }

  function openLogin() {
    if (!dlg) buildDialog();
    if (dlg.open) return;
    if (more) setOpen(false);
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }

  /* ---------- Starts ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    var inner = document.querySelector('.site-header .header-inner');
    if (inner) {
      authBtn = document.createElement('button');
      authBtn.type = 'button';
      authBtn.className = 'auth-btn';
      authBtn.addEventListener('click', function () { user ? logout() : openLogin(); });
      var brand = inner.querySelector('.brand');
      inner.insertBefore(authBtn, brand ? brand.nextSibling : inner.firstChild);
      renderAuth();
      buildMenu(inner);
    }

    // "Iziet" kājenē
    var out = document.querySelectorAll('[data-logout]');
    for (var i = 0; i < out.length; i++) out[i].addEventListener('click', logout);

    // index.html?login=lapa.html - atnācis no slēgtas lapas: atver login logu, pēc tam ved atpakaļ.
    var m = /[?&]login=([^&#]*)/.exec(location.search);
    if (m) {
      var target = '';
      try { target = decodeURIComponent(m[1]); } catch (e) {}
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
      if (!/^[\w-]+\.html$/.test(target)) target = null;
      if (user) { if (target) location.replace(target); }
      else { openLogin(); next = target; }
    }
  });

  // Atgriežoties ar pārlūka "Atpakaļ", lapa var nākt no kešatmiņas ar vecu stāvokli.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    user = get();
    if (guard()) { renderAuth(); renderMenu(); }
  });
})();
