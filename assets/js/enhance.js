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

  var content = document.querySelector('.page__content');
  if (!content || !content.querySelector(':scope > h1')) return;

  var nodes = Array.prototype.slice.call(content.children);
  var section = null;
  var entry = null;
  var tone = 0;

  nodes.forEach(function (node) {
    var tag = node.tagName;

    if (tag === 'H1') {
      section = document.createElement('section');
      section.className = 'cv-section tone-' + (tone++ % 5);
      content.insertBefore(section, node);
      section.appendChild(node);
      entry = null;
      return;
    }

    if (!section) {
      if (tag === 'P') node.classList.add('cv-lead');
      return;
    }

    if (tag === 'H2') {
      entry = document.createElement('div');
      entry.className = 'cv-entry';
      section.appendChild(entry);
    }

    (entry || section).appendChild(node);
  });

  content.querySelectorAll('.cv-entry li').forEach(function (li) {
    var first = li.firstElementChild;
    if (first && first.tagName === 'STRONG' && li.querySelector(':scope > ul') &&
        li.firstChild.textContent.trim() === first.textContent.trim()) {
      li.classList.add('cv-group');
    }
  });

  content.querySelectorAll('.cv-entry > h6').forEach(function (h6) {
    var entry = h6.parentNode;
    if (/work(ing)?\s+student/i.test(h6.textContent)) entry.classList.add('cv-entry--student');
    var parts = h6.innerHTML
      .split('|')
      .map(function (part) { return part.trim(); })
      .filter(Boolean);

    var dateIndex = parts.findIndex(function (part) { return part.indexOf('calendar-icon') !== -1; });
    if (dateIndex !== -1) {
      var holder = document.createElement('div');
      holder.innerHTML = parts.splice(dateIndex, 1)[0];
      var range = holder.textContent.trim().split(/\s*[–—]\s*|\s+-+\s+/);

      var when = document.createElement('div');
      when.className = 'cv-entry__when';
      range.forEach(function (text) {
        var span = document.createElement('span');
        span.textContent = text;
        when.appendChild(span);
      });
      var duration = formatDuration(range[0], range[1]);
      if (duration) {
        var small = document.createElement('small');
        small.textContent = duration;
        when.appendChild(small);
      }
      entry.insertBefore(when, entry.firstChild);
    }

    h6.innerHTML = parts
      .map(function (part) { return '<span class="cv-chip">' + part + '</span>'; })
      .join('');
  });

  buildJourney(content);

  function buildJourney(content) {
    if (typeof window.HTMLDialogElement !== 'function') return;

    var sections = Array.prototype.slice.call(content.querySelectorAll('.cv-section')).filter(function (section) {
      var h1 = section.querySelector(':scope > h1');
      return h1 && /experience|education/i.test(h1.textContent);
    });
    if (!sections.length) return;

    var KIND = {
      job: { icon: 'fa-briefcase', label: 'Full-time role' },
      student: { icon: 'fa-laptop', label: 'Working student' },
      education: { icon: 'fa-graduation-cap', label: 'Education' }
    };
    var STEP_MS = 650;
    var FLIGHT_MS = 2600;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var stops = [];
    sections.forEach(function (section) {
      var isEducation = /education/i.test(section.querySelector(':scope > h1').textContent);
      section.querySelectorAll(':scope > .cv-entry').forEach(function (entry) {
        var h2 = entry.querySelector(':scope > h2');
        if (!h2) return;
        var when = entry.querySelector('.cv-entry__when');
        var spans = when ? when.querySelectorAll('span') : [];
        var chips = Array.prototype.slice.call(entry.querySelectorAll('.cv-chip'));
        var chipWith = function (icon) {
          return chips.filter(function (chip) { return chip.querySelector('img[src*="' + icon + '"]'); })[0];
        };
        var placeChip = chipWith('location-icon');
        var orgChip = chipWith('university-icon');
        var em = h2.querySelector('em');
        stops.push({
          entry: entry,
          kind: isEducation ? 'education' : entry.classList.contains('cv-entry--student') ? 'student' : 'job',
          title: h2.textContent.split('@')[0].trim(),
          org: em ? em.textContent.trim() : orgChip ? orgChip.textContent.trim() : '',
          from: spans[0] ? spans[0].textContent.trim() : '',
          to: spans[1] ? spans[1].textContent.trim() : '',
          duration: when && when.querySelector('small') ? when.querySelector('small').textContent : '',
          place: placeChip ? placeChip.textContent.trim() : '',
          start: spans[0] ? parseMonth(spans[0].textContent) : null,
          end: spans[1] ? parseMonth(spans[1].textContent) : null
        });
      });
    });
    if (stops.length < 2) return;

    var places = stops.map(function (stop) { return stop.place; }).filter(function (place, i, all) {
      return place && all.indexOf(place) === i;
    });
    stops.forEach(function (stop) {
      if (stop.place) return;
      var text = stop.entry.textContent;
      stop.place = places.filter(function (place) {
        return place.split(/[\s,]+/).some(function (word) { return word.length > 3 && text.indexOf(word) !== -1; });
      })[0] || '';
    });

    stops.sort(function (a, b) { return (a.start || 0) - (b.start || 0); });

    stops.forEach(function (stop) {
      if (stop.kind !== 'student' || stop.start === null) return;
      stop.during = stops.filter(function (other) {
        return other.kind === 'education' && other.start !== null && other.end !== null &&
          other.start <= stop.start && stop.start <= other.end;
      })[0] || null;
    });

    var groups = [];
    stops.forEach(function (stop, i) {
      var country = stop.place.split(',').pop().trim();
      var group = groups[groups.length - 1];
      if (!group || group.country !== country) {
        group = { country: country, city: stop.place.split(',')[0].trim(), stops: [] };
        groups.push(group);
      }
      stop.index = i;
      stop.group = groups.length - 1;
      group.stops.push(stop);
    });

    var section = document.createElement('section');
    section.className = 'journey';
    section.innerHTML =
      '<div class="journey__head">' +
        '<h1><span class="journey__head-icon"><i class="fa fa-map-o" aria-hidden="true"></i></span>Journey</h1>' +
        '<button type="button" class="journey__replay"><i class="fa fa-repeat" aria-hidden="true"></i> Replay</button>' +
      '</div>' +
      '<p class="journey__hint">Click any spot on the board to open the details.</p>' +
      '<div class="journey__board"></div>';
    sections[0].parentNode.insertBefore(section, sections[0]);
    sections.forEach(function (s) { s.style.display = 'none'; });

    var board = section.querySelector('.journey__board');
    var config = window.JOURNEY || {};
    stops.forEach(function (stop) {
      var text = stop.org + ' ' + stop.title;
      stop.logo = (config.logos || []).filter(function (logo) { return text.indexOf(logo.match) !== -1; })[0] || null;
    });

    var modal = document.createElement('dialog');
    modal.className = 'journey-modal';
    modal.innerHTML =
      '<div class="journey-modal__card">' +
        '<button type="button" class="journey-modal__close" aria-label="Close">&times;</button>' +
        '<div class="journey-modal__meta"></div>' +
        '<div class="journey-modal__body"></div>' +
        '<div class="journey-modal__nav">' +
          '<button type="button" data-step="-1"><i class="fa fa-arrow-left" aria-hidden="true"></i> Previous</button>' +
          '<button type="button" data-step="1">Next <i class="fa fa-arrow-right" aria-hidden="true"></i></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var current = null;
    var timers = [];
    var state = 'idle';
    var flights = [];
    var lastWidth = 0;

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function render() {
      var W = board.clientWidth;
      lastWidth = W;
      var cols = W >= 760 ? 4 : W >= 520 ? 3 : 2;
      var padX = 12;
      var colW = (W - padX * 2) / cols;
      var R = 30;
      var rowH = 196;
      var head = 100;
      var flightH = 180;
      var y = 0;

      board.innerHTML = '';
      var regions = [];
      groups.forEach(function (group, gi) {
        if (gi > 0) y += flightH;
        var rows = Math.ceil(group.stops.length / cols);
        group.top = y;
        group.stops.forEach(function (stop, i) {
          var r = Math.floor(i / cols);
          var c = i % cols;
          if (r % 2 === 1) c = cols - 1 - c;
          stop.x = padX + colW * (c + 0.5);
          stop.y = y + head + R + r * rowH;
        });
        group.height = head + rows * rowH;
        y += group.height;
        regions.push(group);
      });
      board.style.height = y + 'px';

      regions.forEach(function (group, gi) {
        var region = document.createElement('div');
        region.className = 'journey__region journey__region--' + (gi % 2 ? 'b' : 'a');
        region.style.top = group.top + 'px';
        region.style.height = group.height + 'px';
        region.innerHTML = '<span class="journey__region-label"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
          group.country + (group.city && group.city !== group.country ? ' · ' + group.city : '') + '</span>';
        board.appendChild(region);
      });

      stops.filter(function (stop) { return stop.kind === 'education'; }).forEach(function (edu) {
        var members = [edu].concat(stops.filter(function (stop) { return stop.during === edu; }));
        if (members.length < 2) return;
        var rows = {};
        members.forEach(function (stop) { (rows[stop.y] = rows[stop.y] || []).push(stop); });
        Object.keys(rows).forEach(function (rowY, k) {
          var xs = rows[rowY].map(function (stop) { return stop.x; });
          var zone = document.createElement('div');
          zone.className = 'journey__zone';
          zone.style.left = (Math.min.apply(null, xs) - colW * 0.47) + 'px';
          zone.style.width = (Math.max.apply(null, xs) - Math.min.apply(null, xs) + colW * 0.94) + 'px';
          zone.style.top = (Number(rowY) - R - 44) + 'px';
          zone.style.height = (R * 2 + 172) + 'px';
          if (k === 0) {
            zone.innerHTML = '<span class="journey__zone-label"><i class="fa fa-graduation-cap" aria-hidden="true"></i> ' +
              'Working student · during the ' + edu.title.split(' ')[0] + "'s</span>";
          }
          board.appendChild(zone);
        });
      });

      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'journey__svg');
      svg.setAttribute('width', W);
      svg.setAttribute('height', y);
      board.appendChild(svg);

      function addPath(d, cls) {
        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', cls);
        svg.appendChild(path);
        return path;
      }

      groups.forEach(function (group) {
        group.paths = [];
        var pts = group.stops;
        var d = 'M' + pts[0].x + ' ' + pts[0].y;
        for (var i = 1; i < pts.length; i++) {
          var a = pts[i - 1];
          var b = pts[i];
          if (Math.abs(a.y - b.y) < 1) {
            d += ' L' + b.x + ' ' + b.y;
          } else {
            var bulge = (a.x > W / 2 ? 1 : -1) * Math.min(colW * 0.45, 80);
            d += ' C' + (a.x + bulge) + ' ' + a.y + ' ' + (b.x + bulge) + ' ' + b.y + ' ' + b.x + ' ' + b.y;
          }
        }
        ['journey__road-edge', 'journey__road', 'journey__road-line'].forEach(function (cls) {
          var path = addPath(d, cls);
          path.style.setProperty('--len', Math.ceil(path.getTotalLength()));
          group.paths.push(path);
        });
      });

      flights = [];
      for (var gi = 1; gi < groups.length; gi++) {
        var from = groups[gi - 1].stops[groups[gi - 1].stops.length - 1];
        var to = groups[gi].stops[0];
        var midY = groups[gi].top - flightH / 2;
        var mx = W / 2;
        var out = from.x + colW < W ? 1 : -1;
        var dir = to.x < mx ? -1 : 1;
        var d = 'M' + from.x + ' ' + from.y +
          ' C' + (from.x + out * colW * 0.8) + ' ' + from.y + ' ' + (mx - dir * W * 0.22) + ' ' + midY + ' ' + mx + ' ' + midY +
          ' C' + (mx + dir * W * 0.22) + ' ' + midY + ' ' + to.x + ' ' + (to.y - 110) + ' ' + to.x + ' ' + to.y;
        addPath(d, 'journey__flight-path');

        [0.16, 0.78, 0.32].forEach(function (fx, k) {
          var cloud = document.createElement('i');
          cloud.className = 'fa fa-cloud journey__cloud';
          cloud.setAttribute('aria-hidden', 'true');
          cloud.style.left = (W * fx) + 'px';
          cloud.style.top = (groups[gi].top - flightH + 24 + k * 40) + 'px';
          cloud.style.animationDelay = (-k * 4) + 's';
          board.appendChild(cloud);
        });

        var label = document.createElement('div');
        label.className = 'journey__flight-label';
        label.style.top = (midY + 22) + 'px';
        label.innerHTML = '<i class="fa fa-plane" aria-hidden="true"></i> ' + from.place.split(',')[0] + ' → ' + to.place.split(',')[0] +
          (to.from ? ' · ' + to.from : '');
        board.appendChild(label);

        var plane = document.createElement('div');
        plane.className = 'journey__plane';
        plane.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" transform="rotate(90 12 12)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';
        plane.style.offsetPath = "path('" + d + "')";
        board.appendChild(plane);
        flights.push(plane);
      }

      stops.forEach(function (stop, i) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'journey__spot journey__spot--' + stop.kind;
        button.style.left = (stop.x - colW / 2) + 'px';
        button.style.top = (stop.y - R) + 'px';
        button.style.width = colW + 'px';
        button.style.setProperty('--i', groups[stop.group].stops.indexOf(stop));
        button.setAttribute('aria-label', stop.title + (stop.org ? ' at ' + stop.org : '') + ', ' + stop.from + ' to ' + stop.to);
        var flag = i === 0 ? '<span class="journey__flag">Start</span>' :
          /present/i.test(stop.to) ? '<span class="journey__flag journey__flag--now">Now</span>' : '';
        button.innerHTML =
          '<span class="journey__disc' + (stop.logo ? ' has-logo' : '') + '">' + flag +
            (stop.logo ?
              '<img class="journey__logo' + (stop.logo.fit === 'cover' ? ' journey__logo--cover' : '') + '" src="' +
                (config.base || '') + '/images/orgs/' + stop.logo.file + '" alt="' + stop.org + ' logo">' +
              '<span class="journey__badge"><i class="fa ' + KIND[stop.kind].icon + '" aria-hidden="true"></i></span>' :
              '<i class="fa ' + KIND[stop.kind].icon + '" aria-hidden="true"></i>') +
          '</span>' +
          '<span class="journey__label">' +
            '<span class="journey__years">' + yearRange(stop) + '</span>' +
            '<span class="journey__name">' + stop.title + '</span>' +
            (stop.org ? '<span class="journey__org">' + stop.org + '</span>' : '') +
            (stop.kind === 'student' ? '<span class="journey__tag">Part-time</span>' : '') +
          '</span>';
        button.addEventListener('click', function () { open(stop); });
        board.appendChild(button);
        stop.button = button;
      });
    }

    function yearRange(stop) {
      var a = (stop.from.match(/\d{4}/) || [stop.from])[0];
      var b = /present/i.test(stop.to) ? 'Present' : (stop.to.match(/\d{4}/) || [stop.to])[0];
      return a === b ? a : a + ' – ' + b;
    }

    function arrive(stop) {
      stop.button.classList.add('is-visited');
    }

    function reveal(group) {
      group.paths.forEach(function (path) { path.classList.add('is-drawn'); });
      group.stops.forEach(function (stop) { stop.button.classList.add('is-shown'); });
    }

    function finish() {
      state = 'done';
      board.classList.add('is-done');
      stops.forEach(arrive);
      stops[stops.length - 1].button.classList.add('is-current');
      flights.forEach(function (plane) {
        plane.classList.remove('is-flying');
        plane.classList.add('is-looping');
      });
    }

    function play() {
      timers.forEach(clearTimeout);
      timers = [];
      render();
      if (reduceMotion) return finish();

      state = 'playing';
      board.classList.remove('is-done');
      reveal(groups[0]);

      var t = 900 + groups[0].stops.length * 90;
      stops.forEach(function (stop, i) {
        var prev = stops[i - 1];
        if (prev && prev.group !== stop.group) {
          later(function () {
            flights[stop.group - 1].classList.add('is-flying');
            reveal(groups[stop.group]);
          }, t);
          t += FLIGHT_MS;
        }
        later(function () { arrive(stop); }, t);
        t += STEP_MS;
      });
      later(finish, t);
    }

    function open(stop) {
      current = stop;
      var meta = modal.querySelector('.journey-modal__meta');
      meta.innerHTML =
        '<span class="journey-modal__kind"><i class="fa ' + KIND[stop.kind].icon + '" aria-hidden="true"></i> ' + KIND[stop.kind].label + '</span>' +
        (stop.during ? '<span class="journey-modal__kind">Part-time during the ' + stop.during.title.split(' ')[0] + "'s</span>" : '') +
        '<span class="journey-modal__when"><i class="fa fa-calendar" aria-hidden="true"></i> ' + stop.from + ' – ' + stop.to +
          (stop.duration ? ' · ' + stop.duration : '') + '</span>';
      var body = modal.querySelector('.journey-modal__body');
      body.innerHTML = '';
      Array.prototype.forEach.call(stop.entry.children, function (child) {
        if (!child.classList.contains('cv-entry__when')) body.appendChild(child.cloneNode(true));
      });
      modal.querySelector('.journey-modal__card').className = 'journey-modal__card journey-modal__card--' + stop.kind;
      modal.querySelector('[data-step="-1"]').disabled = stop.index === 0;
      modal.querySelector('[data-step="1"]').disabled = stop.index === stops.length - 1;
      if (!modal.open) modal.showModal();
      modal.querySelector('.journey-modal__card').scrollTop = 0;
    }

    function step(delta) {
      if (!current) return;
      var next = stops[current.index + delta];
      if (!next) return;
      open(next);
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

    section.querySelector('.journey__replay').addEventListener('click', play);

    render();

    if ('IntersectionObserver' in window && !reduceMotion) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          play();
        }
      }, { threshold: 0.25 });
      observer.observe(board);
    } else {
      finish();
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (board.clientWidth === lastWidth) return;
        if (state === 'playing') return play();
        timers.forEach(clearTimeout);
        timers = [];
        render();
        if (state === 'done') finish();
      }, 150);
    });
  }
})();
