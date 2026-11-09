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
})();
