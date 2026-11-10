/*
  About page behaviour: durations, the "Career at a glance" grid, the proportional timeline
  and the detail popup. The markup and all text come from _includes/cv.html (fed by _data/cv.yml);
  this script only reads the data-* attributes on each .cv-entry.
*/
(function () {
  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  function parseMonth(text) {
    if (/present|now|current/i.test(text)) {
      var now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    var match = /([a-z]+)\.?\s+(\d{4})/i.exec(text || '');
    if (!match) return null;
    var month = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
    return month === -1 ? null : Number(match[2]) * 12 + month;
  }

  function formatDuration(from, to) {
    var start = parseMonth(from);
    var end = parseMonth(to);
    if (start === null || end === null || end < start) return '';
    var total = end - start + 1;
    var years = Math.floor(total / 12);
    var months = total % 12;
    var out = [];
    if (years) out.push(years + (years === 1 ? ' yr' : ' yrs'));
    if (months) out.push(months + (months === 1 ? ' mo' : ' mos'));
    return out.join(' ');
  }

  var cv = document.querySelector('.cv');
  if (!cv) return;

  cv.querySelectorAll('.cv-entry').forEach(function (entry) {
    var duration = formatDuration(entry.getAttribute('data-from'), entry.getAttribute('data-to'));
    if (!duration) return;
    var small = document.createElement('small');
    small.textContent = duration;
    entry.querySelector('.cv-entry__when').appendChild(small);
  });

  buildJourney(cv);

  function buildJourney(cv) {
    var section = cv.querySelector('.journey');
    if (!section || typeof window.HTMLDialogElement !== 'function') return;

    var labels = JSON.parse(section.getAttribute('data-labels') || '{}');
    var ICONS = { job: 'fa-briefcase', student: 'fa-laptop', education: 'fa-graduation-cap' };

    var stops = Array.prototype.map.call(cv.querySelectorAll('.cv-section[data-journey] > .cv-entry'), function (entry) {
      var data = function (name) { return entry.getAttribute('data-' + name) || ''; };
      var place = data('location');
      var duration = entry.querySelector('.cv-entry__when small');
      return {
        entry: entry,
        kind: data('kind'),
        label: data('type'),
        title: data('title'),
        org: data('org'),
        from: data('from'),
        to: data('to'),
        duration: duration ? duration.textContent : '',
        domain: data('domain'),
        logo: data('logo') ? { src: data('logo'), fit: data('logo-fit'), size: data('tile') } : null,
        city: place.split(',')[0].trim(),
        country: place.split(',').pop().trim(),
        start: parseMonth(data('from')),
        end: parseMonth(data('to'))
      };
    });
    if (stops.length < 2) return;

    stops.sort(function (a, b) { return (a.start || 0) - (b.start || 0); });

    stops.forEach(function (stop) {
      if (stop.kind !== 'student' || stop.start === null) return;
      stop.during = stops.filter(function (other) {
        return other.kind === 'education' && other.start !== null && other.end !== null &&
          other.start <= stop.start && stop.start <= other.end;
      })[0] || null;
    });

    var order = stops.slice().reverse();
    order.forEach(function (stop, i) { stop.index = i; });

    section.hidden = false;
    cv.querySelectorAll('.cv-section[data-journey]').forEach(function (s) { s.style.display = 'none'; });
    var grid = section.querySelector('.bento');

    function degree(edu) {
      return edu.title.split(' ')[0] + "'s";
    }

    function shortDate(text) {
      if (/present/i.test(text)) return 'Present';
      var match = /([a-z]+)\.?\s+(\d{4})/i.exec(text);
      return match ? match[1].slice(0, 3) + ' ' + match[2] : text;
    }

    function highlights(stop, count) {
      var items = Array.prototype.filter.call(stop.entry.querySelectorAll('li'), function (li) {
        return !li.querySelector('ul');
      });
      if (!items.length) {
        var paragraphs = Array.prototype.slice.call(stop.entry.querySelectorAll(':scope > p'));
        items = paragraphs.filter(function (p) { return p.querySelector('strong + strong'); });
        if (!items.length) items = paragraphs;
      }
      return items.slice(0, count).map(function (item) { return item.innerHTML; });
    }

    function stopTile(stop, forcedSize) {
      var size = forcedSize || (stop.logo && stop.logo.size ? stop.logo.size : stop.index === 0 ? 'xl' : 's');
      var picks = size === 'xl' ? highlights(stop, 3) : size === 'wide' || size === 'main' ? highlights(stop, 1) : [];
      var tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'bento__tile bento__tile--' + stop.kind + ' bento__tile--' + size;
      tile.setAttribute('aria-label', stop.title + (stop.org ? ' at ' + stop.org : '') + ', ' + stop.from + ' to ' + stop.to);
      tile.innerHTML =
        '<span class="bento__top">' +
          (stop.logo ?
            '<img class="bento__logo' + (stop.logo.fit === 'cover' ? ' bento__logo--cover' : '') + '" src="' + stop.logo.src + '" alt="">' :
            '<span class="bento__logo bento__logo--icon"><i class="fa ' + ICONS[stop.kind] + '" aria-hidden="true"></i></span>') +
          '<span class="bento__kind">' + stop.label + '</span>' +
          (/present/i.test(stop.to) ? '<span class="bento__now">' + labels.now + '</span>' : '') +
        '</span>' +
        '<span class="bento__title">' + stop.title + '</span>' +
        '<span class="bento__org">' + stop.org + (stop.domain ? '<span class="bento__domain"> · ' + stop.domain + '</span>' : '') + '</span>' +
        (picks.length ? '<span class="bento__highlights">' + picks.map(function (html) {
          return '<span class="bento__highlight">' + html + '</span>';
        }).join('') + '</span>' : '') +
        '<span class="bento__foot">' +
          '<span class="bento__when">' + shortDate(stop.from) + ' – ' + shortDate(stop.to) + (stop.city ? ' · ' + stop.city : '') + '</span>' +
          (stop.duration ? '<span class="bento__duration"><i class="fa fa-hourglass-half" aria-hidden="true"></i> ' + stop.duration + '</span>' : '') +
        '</span>';
      tile.addEventListener('click', function () { open(stop); });
      return tile;
    }

    function groupTile(edu, members) {
      var group = document.createElement('div');
      group.className = 'bento__tile bento__tile--education bento__group';
      var main = stopTile(edu, 'main');
      main.className = 'bento__group-main';
      group.appendChild(main);
      var subs = document.createElement('div');
      subs.className = 'bento__subs';
      subs.innerHTML = '<span class="bento__subs-label"><i class="fa ' + ICONS.student + '" aria-hidden="true"></i> ' +
        labels.student_group.replace('%degree%', degree(edu)) + '</span>';
      members.forEach(function (member) { subs.appendChild(stopTile(member, 's')); });
      group.appendChild(subs);
      return group;
    }

    function moveTile(from, to) {
      var route = 'M6 44 Q70 -6 134 44';
      var tile = document.createElement('div');
      tile.className = 'bento__tile bento__tile--move';
      tile.innerHTML =
        '<span class="bento__kind"><i class="fa fa-plane" aria-hidden="true"></i> ' + labels.relocated + '</span>' +
        '<span class="bento__route">' +
          '<svg viewBox="0 0 140 50" aria-hidden="true"><path d="' + route + '"/></svg>' +
          '<span class="bento__plane" style="offset-path: path(\'' + route + '\')">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" transform="rotate(90 12 12)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>' +
          '</span>' +
        '</span>' +
        '<span class="bento__cities"><span>' + from.city + '</span><span>' + to.city + '</span></span>' +
        '<span class="bento__when">' + to.from + '</span>';
      return tile;
    }

    var stats = section.querySelector('.journey__stats');
    order.forEach(function (stop, i) {
      var newer = order[i - 1];
      if (newer && newer.country && stop.country && newer.country !== stop.country) grid.appendChild(moveTile(stop, newer));
      if (stop.during) return;
      var members = order.filter(function (other) { return other.during === stop; });
      grid.appendChild(members.length ? groupTile(stop, members) : stopTile(stop));
      if (i === 0 && stats) {
        while (stats.firstElementChild) grid.appendChild(stats.firstElementChild);
      }
    });
    if (stats) stats.remove();

    section.parentNode.insertBefore(timeline(), section);

    function shortName(stop) {
      if (/university/i.test(stop.org)) return stop.org.replace(/\(.*\)/, '').match(/\b[A-Z]/g).join('');
      return stop.org.split(' ')[0];
    }

    function timeline() {
      var dated = stops.filter(function (stop) { return stop.start !== null && stop.end !== null; });
      var min = Math.min.apply(null, dated.map(function (stop) { return stop.start; }));
      var max = Math.max.apply(null, dated.map(function (stop) { return stop.end; })) + 1;
      var pct = function (month) { return ((month - min) / (max - min) * 100).toFixed(2) + '%'; };

      var strip = document.createElement('div');
      strip.className = 'timeline';
      strip.setAttribute('aria-label', 'Career timeline');
      var lanes = { main: document.createElement('div'), student: document.createElement('div') };
      lanes.student.className = 'timeline__lane timeline__lane--student';
      lanes.main.className = 'timeline__lane';

      var shades = {};
      dated.forEach(function (stop, i) {
        var shade = shades[stop.kind] = (shades[stop.kind] === undefined ? 0 : shades[stop.kind] + 1);
        var seg = document.createElement('button');
        seg.type = 'button';
        seg.className = 'timeline__seg timeline__seg--' + stop.kind + ' timeline__seg--shade-' + (shade % 4) +
          (i % 2 ? ' timeline__seg--alt' : '');
        seg.style.left = pct(stop.start);
        seg.style.width = pct(min + stop.end + 1 - stop.start);
        seg.title = stop.title + (stop.org ? ' · ' + stop.org : '') + ' · ' + shortDate(stop.from) + ' – ' + shortDate(stop.to) +
          (stop.duration ? ' (' + stop.duration + ')' : '');
        seg.setAttribute('aria-label', seg.title);
        seg.innerHTML = '<span class="timeline__label">' + shortName(stop) + '</span>';
        seg.addEventListener('click', function () { open(stop); });
        lanes[stop.kind === 'student' ? 'student' : 'main'].appendChild(seg);
      });

      var axis = document.createElement('div');
      axis.className = 'timeline__axis';
      for (var year = Math.ceil(min / 12); year * 12 < max; year++) {
        if (year % 2) continue;
        var tick = document.createElement('span');
        tick.style.left = pct(year * 12);
        tick.textContent = year;
        axis.appendChild(tick);
      }

      strip.appendChild(lanes.student);
      strip.appendChild(lanes.main);
      strip.appendChild(axis);
      return strip;
    }

    var modal = document.createElement('dialog');
    modal.className = 'journey-modal';
    modal.innerHTML =
      '<div class="journey-modal__card">' +
        '<button type="button" class="journey-modal__close" aria-label="Close">&times;</button>' +
        '<div class="journey-modal__meta"></div>' +
        '<div class="journey-modal__body"></div>' +
        '<div class="journey-modal__nav">' +
          '<button type="button" data-step="-1"><i class="fa fa-arrow-left" aria-hidden="true"></i> ' + labels.newer + '</button>' +
          '<button type="button" data-step="1">' + labels.older + ' <i class="fa fa-arrow-right" aria-hidden="true"></i></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var current = null;

    function open(stop) {
      current = stop;
      var meta = modal.querySelector('.journey-modal__meta');
      meta.innerHTML =
        '<span class="journey-modal__kind"><i class="fa ' + ICONS[stop.kind] + '" aria-hidden="true"></i> ' + stop.label + '</span>' +
        (stop.during ? '<span class="journey-modal__kind">' + labels.during.replace('%degree%', degree(stop.during)) + '</span>' : '') +
        '<span class="journey-modal__when"><i class="fa fa-calendar" aria-hidden="true"></i> ' + stop.from + ' – ' + stop.to +
          (stop.duration ? ' · ' + stop.duration : '') + '</span>';
      var body = modal.querySelector('.journey-modal__body');
      body.innerHTML = '';
      Array.prototype.forEach.call(stop.entry.children, function (child) {
        if (!child.classList.contains('cv-entry__when')) body.appendChild(child.cloneNode(true));
      });
      modal.querySelector('.journey-modal__card').className = 'journey-modal__card journey-modal__card--' + stop.kind;
      modal.querySelector('[data-step="-1"]').disabled = stop.index === 0;
      modal.querySelector('[data-step="1"]').disabled = stop.index === order.length - 1;
      if (!modal.open) modal.showModal();
      modal.querySelector('.journey-modal__card').scrollTop = 0;
    }

    function step(delta) {
      if (!current) return;
      var next = order[current.index + delta];
      if (next) open(next);
    }

    modal.addEventListener('click', function (event) {
      if (event.target === modal) modal.close();
      var nav = event.target.closest('[data-step]');
      if (nav) step(Number(nav.getAttribute('data-step')));
      if (event.target.closest('.journey-modal__close')) modal.close();
    });
    modal.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    });
  }
})();
