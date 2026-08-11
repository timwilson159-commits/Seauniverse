/* ============================================================
   SEA UNIVERSE: END OF GAME REPORT + CERTIFICATE

   Follows the Master Ranger pattern from the user's other classroom
   game: a scored summary the student can compare with the person
   sitting next to them, and a certificate they can print.

   WHAT IT DELIBERATELY DOES NOT DO
   It does not grade the ENDING, because there is only one ending and
   every student reaches it. It grades the CASE: how much of the park
   you actually looked at, and how much of it you could still produce
   when a man was sitting opposite you saying true things. That is
   where the variation between two students lives, and it is the only
   place this game ever wanted it to live.

   Opened by the `openReport` effect, so content decides when. Can be
   reopened afterwards from the Journal's Summary tab, because a
   student who wants to show somebody their certificate on Friday
   should not have to replay the finale to do it.
   ============================================================ */
window.SU = window.SU || {};

SU.Report = (function () {
  let el, box;

  function init() {
    el = document.getElementById('report');
    box = document.getElementById('reportBody');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Every number on the card, gathered in one place so the certificate
     and the stat rows can never disagree with each other. */
  function figures() {
    const d = SU.State.data, D = SU.data;

    const speciesAll = Object.keys(D.species);
    const speciesGot = speciesAll.filter(id => SU.State.sp(id).discovered);

    const evidenceAll = Object.keys(D.evidence);
    const achAll = Object.keys(D.achievements);

    let hazardTotal = 0;
    for (const z in D.zones) {
      (D.zones[z].objects || []).forEach(o => { if (o.kind === 'hazard') hazardTotal++; });
    }

    const questAll = Object.keys(D.quests);
    const questDone = questAll.filter(q => (d.quests[q] || {}).status === 'completed');

    const hearingRounds = (function () {
      for (const z in D.zones) {
        const o = (D.zones[z].objects || []).find(x => x.kind === 'hearing');
        if (o) return (o.rounds || []).length;
      }
      return 0;
    })();

    /* One overall figure, weighted towards the things the game is
       actually about: what you found and what you could prove. */
    const pct = (a, b) => (b ? a / b : 0);
    const completion = Math.round(100 * (
      0.25 * pct(d.evidence.length, evidenceAll.length) +
      0.20 * pct(speciesGot.length, speciesAll.length) +
      0.20 * pct(SU.State.hearingWon(), hearingRounds) +
      0.15 * pct(SU.State.hazardCount(), hazardTotal) +
      0.10 * pct(questDone.length, questAll.length) +
      0.10 * pct(d.achievements.length, achAll.length)
    ));

    return {
      name: d.player.name, rank: SU.State.rank(), level: d.level, days: d.day,
      species: [speciesGot.length, speciesAll.length],
      evidence: [d.evidence.length, evidenceAll.length],
      hazards: [SU.State.hazardCount(), hazardTotal],
      repaired: SU.State.hazardRepairedCount(),
      hearingFirst: SU.State.hearingWon(),
      hearingAnswered: SU.State.hearingAnswered(),
      hearingTotal: hearingRounds,
      quests: [questDone.length, questAll.length],
      achievements: [d.achievements.length, achAll.length],
      suspicion: d.suspicion,
      completion: completion
    };
  }

  /* The line under the name on the certificate. Deliberately about the
     case rather than about the player being clever. */
  function commendation(f) {
    if (f.completion >= 90) return 'for a case so complete that none of it could be argued with';
    if (f.completion >= 75) return 'for a case built carefully enough to survive being read by a lawyer';
    if (f.completion >= 55) return 'for evidence gathered patiently, and for knowing what it was for';
    if (f.completion >= 35) return 'for seeing what everybody else had stopped seeing';
    return 'for going down there at all, and for writing it down';
  }

  function bar(a, b) {
    const p = b ? Math.round(100 * a / b) : 0;
    return '<div class="rep-bar"><i style="width:' + p + '%"></i></div>';
  }

  function row(label, a, b, note) {
    return '<div class="rep-row"><span class="rep-label">' + esc(label) + '</span>' +
           bar(a, b) +
           '<span class="rep-num">' + a + ' / ' + b + '</span>' +
           (note ? '<span class="rep-note">' + esc(note) + '</span>' : '') + '</div>';
  }

  function open() {
    const f = figures();
    const d = SU.State.data;

    let h = '';
    h += '<div class="rep-head"><h2>Sea Universe: Final Report</h2>' +
         '<button class="care-close" id="repClose">✕</button></div>';

    /* --- the certificate --- */
    h += '<div class="cert" id="cert">';
    h += '  <div class="cert-rule"></div>';
    h += '  <div class="cert-kicker">This is to record that</div>';
    h += '  <div class="cert-name">' + esc(f.name) + '</div>';
    h += '  <div class="cert-role">' + esc(f.rank) + ' · Sea Universe</div>';
    h += '  <div class="cert-body">' + esc(commendation(f)) + '.</div>';
    h += '  <div class="cert-figs">' +
         '<span><b>' + f.completion + '%</b>case complete</span>' +
         '<span><b>' + f.evidence[0] + '</b>documents</span>' +
         '<span><b>' + f.species[0] + '</b>species logged</span>' +
         '<span><b>' + f.hearingFirst + '/' + f.hearingTotal + '</b>points answered</span>' +
         '</div>';
    h += '  <div class="cert-rule"></div>';
    h += '</div>';

    /* --- the numbers --- */
    h += '<div class="rep-grid">';
    h += row('Evidence found', f.evidence[0], f.evidence[1]);
    h += row('Species logged', f.species[0], f.species[1]);
    h += row('The hearing', f.hearingFirst, f.hearingTotal,
             f.hearingAnswered > f.hearingFirst
               ? 'answered first time (' + f.hearingAnswered + ' answered in total)'
               : 'answered first time');
    h += row('Safety Register', f.hazards[0], f.hazards[1],
             f.repaired ? f.repaired + ' of them actually repaired' : '');
    h += row('Missions completed', f.quests[0], f.quests[1]);
    h += row('Achievements', f.achievements[0], f.achievements[1]);
    h += '</div>';

    h += '<div class="rep-meta">Level ' + f.level + ' · ' + esc(f.rank) +
         ' · finished on day ' + f.days +
         ' · suspicion ended at ' + f.suspicion + '</div>';

    /* Honest about what is left, so nobody thinks the game is over. */
    const left = [];
    if (f.evidence[0] < f.evidence[1]) left.push((f.evidence[1] - f.evidence[0]) + ' documents');
    if (f.species[0] < f.species[1]) left.push((f.species[1] - f.species[0]) + ' species');
    if (f.hazards[0] < f.hazards[1]) left.push((f.hazards[1] - f.hazards[0]) + ' defects');
    if (f.quests[0] < f.quests[1]) left.push((f.quests[1] - f.quests[0]) + ' missions');
    h += '<p class="rep-left">' + (left.length
      ? 'Still out there: ' + left.join(', ') + '. The park stays open, and the transfer takes months.'
      : 'There is nothing left in the park you have not found. Genuinely well done.') + '</p>';

    h += '<div class="rep-actions">' +
         '<button id="repPrint" class="primary">Print the certificate</button>' +
         '<button id="repBack">Back to the park</button></div>';

    box.innerHTML = h;
    el.classList.remove('hidden');
    SU.Audio && SU.Audio.play('report');
    document.getElementById('repClose').onclick = close;
    document.getElementById('repBack').onclick = close;
    document.getElementById('repPrint').onclick = () => window.print();
  }

  function close() { el.classList.add('hidden'); }

  return { init, open, close, figures, get isOpen() { return el && !el.classList.contains('hidden'); } };
})();
