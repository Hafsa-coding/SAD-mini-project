// ════════════════════════════════ DATA ════════════════════════════════

let clubs = [
  { id:1, name:'Football', desc:'Competitive and recreational football for all skill levels.' },
  { id:2, name:'Basketball', desc:'Train, scrimmage, and compete in inter-university tournaments.' },
  { id:3, name:'Badminton', desc:'Singles and doubles training with weekly friendly matches.' },
  { id:4, name:'Swimming', desc:'Pool training sessions focused on technique and endurance.' },
  { id:5, name:'Volleyball', desc:'Indoor and beach volleyball with regular team practice.' },
];

let members = [
  { id:1, sid:'S10001', name:'Ahmad Rizal', email:'ahmad@unimy.edu.my', phone:'+60-12-3456789', club:'Football', status:'Active', password:'student123' },
  { id:2, sid:'S10002', name:'Siti Nabilah', email:'siti@unimy.edu.my', phone:'+60-11-2345678', club:'Badminton', status:'Active', password:'student123' },
  { id:3, sid:'S10003', name:'Lim Wei Jian', email:'lim@unimy.edu.my', phone:'+60-16-8765432', club:'Basketball', status:'Pending', password:'student123' },
  { id:4, sid:'S10004', name:'Priya Nair', email:'priya@unimy.edu.my', phone:'+60-14-5678901', club:'Swimming', status:'Active', password:'student123' },
  { id:5, sid:'S10005', name:'Hafiz Harun', email:'hafiz@unimy.edu.my', phone:'+60-17-1234567', club:'Football', status:'Active', password:'student123' },
  { id:6, sid:'S10006', name:'Mei Ling Tan', email:'mei@unimy.edu.my', phone:'+60-19-9876543', club:'Volleyball', status:'Inactive', password:'student123' },
];

let events = [
  { id:1, name:'Inter-Club Football Match', date:'2025-07-15', venue:'Field A', club:'Football', slots:40, registered:[1,5] },
  { id:2, name:'Badminton Tournament', date:'2025-07-22', venue:'Sports Hall B', club:'Badminton', slots:24, registered:[2] },
  { id:3, name:'Basketball Friendly', date:'2025-08-05', venue:'Court 1', club:'Basketball', slots:20, registered:[] },
  { id:4, name:'Swimming Gala', date:'2025-08-12', venue:'Olympic Pool', club:'Swimming', slots:30, registered:[4] },
];

let attendance = {
  1: { 1:'Present', 5:'Present', 2:'Absent', 3:'Present' },
  2: { 2:'Present', 6:'Absent' },
};

let announcements = [
  { id:1, title:'Club Registration Now Open', body:'All students are invited to register for sports clubs for Semester 2, 2025. Registration closes on 30 July 2025.', club:'All Clubs', date:'2025-06-20' },
  { id:2, title:'Football Match Cancelled', body:'The friendly football match scheduled for 10 July has been postponed due to field maintenance. New date will be announced.', club:'Football', date:'2025-06-25' },
  { id:3, title:'Swimming Gala Practice Schedule', body:'Mandatory practice sessions for all Swimming Club members will be held every Tuesday and Thursday at 7am starting July 1.', club:'Swimming', date:'2025-06-28' },
];

let schedule = [
  { id:1, day:'Monday', time:'7:00 AM - 9:00 AM', club:'Football' },
  { id:2, day:'Tuesday', time:'5:00 PM - 7:00 PM', club:'Basketball' },
  { id:3, day:'Wednesday', time:'7:00 AM - 8:30 AM', club:'Swimming' },
  { id:4, day:'Thursday', time:'6:00 PM - 8:00 PM', club:'Badminton' },
  { id:5, day:'Friday', time:'4:00 PM - 6:00 PM', club:'Volleyball' },
];

// ── ACCOUNTS (per-role login credentials) ──────────────────────────────
let accounts = {
  admin:      [{ username:'admin', password:'admin123', name:'Admin User' }],
  coach:      [{ username:'coach', password:'coach123', name:'Coach Zulkifli' }],
  management: [{ username:'mgmt', password:'mgmt123', name:'Dr. Hamdan' }],
  // student logs in with Student ID + password, matched against `members`
};

let editingMember=null, editingEvent=null, editingClub=null;
let nextMId=7, nextEId=5, nextAId=4, nextCId=6, nextSchedId=6;

let session = null; // { role, name, memberId (for students) }
let loginRole = 'admin';

const ROLE_META = {
  admin:      { label:'Club Administrator', avatar:'AD' },
  coach:      { label:'Coach',               avatar:'CO' },
  management: { label:'Management',          avatar:'MG' },
  student:    { label:'Student',             avatar:'ST' },
};

const NAV = {
  admin: [
    ['dashboard','','Dashboard'],
    ['members','','Members'],
    ['clubs','','Manage Clubs'],
    ['events','','Events'],
    ['attendance','','Attendance'],
    ['schedule','','Training Schedule'],
    ['announcements','','Announcements'],
    ['reports','','Reports'],
  ],
  coach: [
    ['coach-members','','View Members'],
    ['attendance','','Record Attendance'],
    ['schedule','','Training Schedules'],
    ['announcements-view','','Announcements'],
  ],
  management: [
    ['mgmt-stats','','View Statistics'],
    ['mgmt-reports','','Performance Reports'],
    ['announcements-view','','Announcements'],
  ],
  student: [
    ['profile','','My Profile'],
    ['register','','Register Membership'],
    ['club-info','','Club Information'],
    ['student-events','','Register for Events'],
    ['student-attendance','','My Attendance'],
    ['announcements-view','','Announcements'],
  ],
};

const PAGE_TITLES = {
  dashboard:'Dashboard', members:'Members', clubs:'Manage Clubs', events:'Events',
  attendance:'Attendance', schedule:'Training Schedule', announcements:'Announcements', reports:'Reports',
  'coach-members':'View Members', 'announcements-view':'Announcements',
  'mgmt-stats':'Statistics', 'mgmt-reports':'Performance Reports',
  profile:'My Profile', register:'Register Membership', 'club-info':'Club Information',
  'student-events':'Register for Events', 'student-attendance':'My Attendance',
};

// ════════════════════════════════ LOGIN ════════════════════════════════

const LOGIN_LABELS = {
  admin:      { idLabel:'Username', idPh:'e.g. admin', hint:'Try: admin / admin123' },
  coach:      { idLabel:'Username', idPh:'e.g. coach', hint:'Try: coach / coach123' },
  management: { idLabel:'Username', idPh:'e.g. mgmt',  hint:'Try: mgmt / mgmt123' },
  student:    { idLabel:'Student ID', idPh:'e.g. S10001', hint:'Try: S10001 / student123' },
};

function selectLoginRole(role) {
  loginRole = role;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.toggle('active', t.dataset.role === role));
  const l = LOGIN_LABELS[role];
  document.getElementById('login-id-label').textContent = l.idLabel;
  document.getElementById('login-id').placeholder = l.idPh;
  document.getElementById('login-hint').textContent = l.hint;
  document.getElementById('login-id').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').classList.remove('show');
}

function attemptLogin() {
  const idv = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');

  if (loginRole === 'student') {
    const m = members.find(x => x.sid.toLowerCase() === idv.toLowerCase() && x.password === pass);
    if (!m) { errEl.textContent = 'Incorrect Student ID or password.'; errEl.classList.add('show'); return; }
    if (m.status === 'Inactive') { errEl.textContent = 'Your membership is inactive. Contact an administrator.'; errEl.classList.add('show'); return; }
    session = { role:'student', name:m.name, memberId:m.id };
  } else {
    const acct = (accounts[loginRole]||[]).find(a => a.username.toLowerCase() === idv.toLowerCase() && a.password === pass);
    if (!acct) { errEl.textContent = 'Incorrect username or password.'; errEl.classList.add('show'); return; }
    session = { role:loginRole, name:acct.name };
  }
  errEl.classList.remove('show');
  enterApp();
}

function enterApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';

  const meta = ROLE_META[session.role];
  document.getElementById('user-avatar').textContent = meta.avatar;
  document.getElementById('user-name').textContent = session.name;
  document.getElementById('user-role-label').textContent = meta.label;

  buildNav();
  const firstPage = NAV[session.role][0][0];
  go(firstPage);
}

function logout() {
  session = null;
  document.getElementById('app-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-id').value = '';
  document.getElementById('login-pass').value = '';
}

function buildNav() {
  const nav = document.getElementById('nav-menu');
  nav.innerHTML = NAV[session.role].map(([key,icon,label]) =>
    `<div class="nav-item" data-page="${key}" onclick="go('${key}')"><span class="nav-icon">${icon}</span> ${label}</div>`
  ).join('');
}

// ════════════════════════════════ NAVIGATION ════════════════════════════════

function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');
  document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || '';

  renderForRole(page);
}

function renderForRole(page) {
  const r = session ? session.role : null;
  const isAdmin = r === 'admin';
  const isCoach = r === 'coach';

  if (page === 'events') { document.getElementById('add-event-btn').style.display = isAdmin ? '' : 'none'; document.getElementById('event-action-head').style.display = isAdmin ? '' : 'none'; renderEvents(); }
  if (page === 'attendance') { document.getElementById('att-save-btn').style.display = (isAdmin||isCoach) ? '' : 'none'; renderAttendanceSelect(); }
  if (page === 'schedule') { document.getElementById('add-schedule-btn').style.display = (isAdmin||isCoach) ? '' : 'none'; renderSchedule(); }
  if (page === 'dashboard') renderDashboard();
  if (page === 'members') renderMembers();
  if (page === 'clubs') renderClubsAdmin();
  if (page === 'announcements') renderAnnouncements();
  if (page === 'reports') renderReports();
  if (page === 'coach-members') renderCoachMembers();
  if (page === 'announcements-view') renderAnnouncementsView();
  if (page === 'mgmt-stats') renderMgmtStats();
  if (page === 'mgmt-reports') renderMgmtReports();
  if (page === 'profile') renderProfile();
  if (page === 'register') renderRegister();
  if (page === 'club-info') renderClubInfo();
  if (page === 'student-events') renderStudentEvents();
  if (page === 'student-attendance') renderStudentAttendance();
}

// ════════════════════════════════ HELPERS ════════════════════════════════

function statusBadge(s) {
  const map = { Active:'badge-green', Pending:'badge-orange', Inactive:'badge-gray', Present:'badge-green', Absent:'badge-red', Open:'badge-green', Full:'badge-gray' };
  return `<span class="badge ${map[s]||'badge-gray'}">${s}</span>`;
}

function clubOptions(selected) {
  return clubs.map(c => `<option value="${c.name}"${c.name===selected?' selected':''}>${c.name}</option>`).join('');
}

function clubAllOptions(selected) {
  return `<option value="All Clubs"${selected==='All Clubs'?' selected':''}>All Clubs</option>` + clubOptions(selected);
}

let toastT;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

// ════════════════════════════════ ADMIN: DASHBOARD ════════════════════════════════

function renderDashboard() {
  document.getElementById('stat-members').textContent = members.length;
  const futureEvents = events.filter(e => new Date(e.date) >= new Date());
  document.getElementById('stat-events').textContent = futureEvents.length;

  let totP=0, totT=0;
  Object.values(attendance).forEach(ev => Object.values(ev).forEach(s => { totT++; if (s==='Present') totP++; }));
  document.getElementById('stat-attend').textContent = totT ? Math.round(totP/totT*100)+'%' : '–';

  const tm = members.slice(-4).reverse();
  document.getElementById('dash-members').innerHTML = tm.length
    ? tm.map(m => `<tr><td>${m.name}</td><td>${m.club}</td><td>${statusBadge(m.status)}</td></tr>`).join('')
    : '<tr><td colspan="3" class="empty">No members yet</td></tr>';

  const te = events.filter(e => new Date(e.date) >= new Date()).slice(0,4);
  document.getElementById('dash-events').innerHTML = te.length
    ? te.map(e => `<tr><td>${e.name}</td><td>${e.date}</td><td>${e.club}</td></tr>`).join('')
    : '<tr><td colspan="3" class="empty">No upcoming events</td></tr>';

  const max = Math.max(...clubs.map(c => members.filter(m=>m.club===c.name).length), 1);
  document.getElementById('club-dist').innerHTML = clubs.map(c => {
    const n = members.filter(m=>m.club===c.name).length;
    return `<div class="progress-row">
      <span class="progress-label">${c.name}</span>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${Math.round(n/max*100)}%"></div></div>
      <span class="progress-pct">${n}</span>
    </div>`;
  }).join('');
}

// ════════════════════════════════ ADMIN: MEMBERS ════════════════════════════════

function renderMembers() {
  const q = (document.getElementById('member-search').value||'').toLowerCase();
  const sel = document.getElementById('member-filter-club');
  const cur = sel.value;
  sel.innerHTML = '<option value="">All clubs</option>' + clubOptions(cur);
  const fc = sel.value;

  const filtered = members.filter(m =>
    (m.name.toLowerCase().includes(q) || m.sid.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) &&
    (!fc || m.club === fc)
  );
  document.getElementById('members-tbody').innerHTML = filtered.length
    ? filtered.map(m =>
      `<tr>
        <td>${m.sid}</td><td>${m.name}</td><td>${m.email}</td>
        <td>${m.club}</td><td>${m.phone}</td>
        <td>${statusBadge(m.status)}</td>
        <td>
          <div class="btn-group">
            ${m.status==='Pending' ? `<button class="btn btn-success btn-sm" onclick="approveMember(${m.id})">Approve</button>` : ''}
            <button class="btn btn-outline btn-sm" onclick="editMember(${m.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMember(${m.id})">Delete</button>
          </div>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="7"><div class="empty"><div>👥</div>No members found</div></td></tr>`;
}

function approveMember(id) {
  members = members.map(m => m.id===id ? {...m, status:'Active'} : m);
  toast('Membership approved'); renderMembers();
}

function openMemberModal(m) {
  editingMember = m || null;
  document.getElementById('member-modal-title').textContent = m ? 'Edit Member' : 'Add Member';
  document.getElementById('m-sid').value = m ? m.sid : '';
  document.getElementById('m-name').value = m ? m.name : '';
  document.getElementById('m-email').value = m ? m.email : '';
  document.getElementById('m-phone').value = m ? m.phone : '';
  document.getElementById('m-club').innerHTML = clubOptions(m ? m.club : clubs[0].name);
  document.getElementById('m-status').value = m ? m.status : 'Active';
  document.getElementById('member-modal').classList.add('show');
}
function editMember(id) { openMemberModal(members.find(m=>m.id===id)); }
function deleteMember(id) { members = members.filter(m=>m.id!==id); toast('Member removed'); renderMembers(); renderDashboard(); }
function saveMember() {
  const obj = {
    id: editingMember ? editingMember.id : nextMId++,
    sid: document.getElementById('m-sid').value.trim(),
    name: document.getElementById('m-name').value.trim(),
    email: document.getElementById('m-email').value.trim(),
    phone: document.getElementById('m-phone').value.trim(),
    club: document.getElementById('m-club').value,
    status: document.getElementById('m-status').value,
    password: editingMember ? editingMember.password : 'student123',
  };
  if (!obj.name || !obj.sid) { alert('Name and Student ID are required.'); return; }
  if (editingMember) members = members.map(m => m.id===obj.id ? obj : m);
  else members.push(obj);
  closeModal('member-modal'); toast(editingMember ? 'Member updated' : 'Member added');
  renderMembers(); renderDashboard();
}

// ════════════════════════════════ ADMIN: CLUBS ════════════════════════════════

function renderClubsAdmin() {
  document.getElementById('clubs-grid').innerHTML = clubs.map(c => {
    const n = members.filter(m=>m.club===c.name).length;
    return `<div class="club-card">
      <h4>${c.name}</h4>
      <p>${c.desc}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="badge badge-blue">${n} members</span>
        <div class="btn-group">
          <button class="btn btn-outline btn-sm" onclick="editClub(${c.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteClub(${c.id})">Delete</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function openClubModal(c) {
  editingClub = c || null;
  document.getElementById('club-modal-title').textContent = c ? 'Edit Club' : 'Add Club';
  document.getElementById('c-name').value = c ? c.name : '';
  document.getElementById('c-desc').value = c ? c.desc : '';
  document.getElementById('club-modal').classList.add('show');
}
function editClub(id) { openClubModal(clubs.find(c=>c.id===id)); }
function deleteClub(id) {
  const cl = clubs.find(c=>c.id===id);
  if (members.some(m=>m.club===cl.name)) { alert('Cannot delete a club that still has members.'); return; }
  clubs = clubs.filter(c=>c.id!==id); toast('Club deleted'); renderClubsAdmin();
}
function saveClub() {
  const obj = {
    id: editingClub ? editingClub.id : nextCId++,
    name: document.getElementById('c-name').value.trim(),
    desc: document.getElementById('c-desc').value.trim(),
  };
  if (!obj.name) { alert('Club name is required.'); return; }
  if (editingClub) clubs = clubs.map(c => c.id===obj.id ? obj : c);
  else clubs.push(obj);
  closeModal('club-modal'); toast(editingClub ? 'Club updated' : 'Club added'); renderClubsAdmin();
}

// ════════════════════════════════ EVENTS (Admin create / Student register) ════════════════════════════════

function renderEvents() {
  const q = (document.getElementById('event-search').value||'').toLowerCase();
  const isAdmin = session.role === 'admin';
  const filtered = events.filter(e => e.name.toLowerCase().includes(q) || e.club.toLowerCase().includes(q));
  document.getElementById('events-tbody').innerHTML = filtered.length
    ? filtered.map(e => `<tr>
          <td>${e.name}</td><td>${e.date}</td><td>${e.venue}</td><td>${e.club}</td>
          <td>${e.registered.length} / ${e.slots}</td>
          <td style="${isAdmin?'':'display:none'}">
            <div class="btn-group">
              <button class="btn btn-outline btn-sm" onclick="editEvent(${e.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})">Delete</button>
            </div>
          </td>
        </tr>`).join('')
    : `<tr><td colspan="6"><div class="empty"><div>📅</div>No events found</div></td></tr>`;
}
function openEventModal(e) {
  editingEvent = e || null;
  document.getElementById('event-modal-title').textContent = e ? 'Edit Event' : 'Create Event';
  document.getElementById('e-name').value = e ? e.name : '';
  document.getElementById('e-date').value = e ? e.date : '';
  document.getElementById('e-venue').value = e ? e.venue : '';
  document.getElementById('e-club').innerHTML = clubOptions(e ? e.club : clubs[0].name);
  document.getElementById('e-slots').value = e ? e.slots : 30;
  document.getElementById('event-modal').classList.add('show');
}
function editEvent(id) { openEventModal(events.find(e=>e.id===id)); }
function deleteEvent(id) { events = events.filter(e=>e.id!==id); delete attendance[id]; toast('Event deleted'); renderEvents(); }
function saveEvent() {
  const obj = {
    id: editingEvent ? editingEvent.id : nextEId++,
    name: document.getElementById('e-name').value.trim(),
    date: document.getElementById('e-date').value,
    venue: document.getElementById('e-venue').value.trim(),
    club: document.getElementById('e-club').value,
    slots: parseInt(document.getElementById('e-slots').value)||30,
    registered: editingEvent ? editingEvent.registered : [],
  };
  if (!obj.name || !obj.date) { alert('Name and Date are required.'); return; }
  if (editingEvent) events = events.map(e => e.id===obj.id ? obj : e);
  else events.push(obj);
  closeModal('event-modal'); toast(editingEvent ? 'Event updated' : 'Event created'); renderEvents();
}

// ════════════════════════════════ ATTENDANCE (Admin + Coach) ════════════════════════════════

function renderAttendanceSelect() {
  const sel = document.getElementById('att-event-select');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Select an event...</option>' +
    events.map(e => `<option value="${e.id}"${cur==e.id?' selected':''}>${e.name} (${e.date})</option>`).join('');
  renderAttendance();
}
function renderAttendance() {
  const eid = parseInt(document.getElementById('att-event-select').value);
  const canRecord = session.role === 'admin' || session.role === 'coach';
  document.getElementById('att-save-btn').style.display = (eid && canRecord) ? '' : 'none';
  if (!eid) {
    document.getElementById('att-tbody').innerHTML = `<tr><td colspan="4"><div class="empty"><div>✅</div>Select an event to manage attendance</div></td></tr>`;
    document.getElementById('att-summary').textContent = '';
    return;
  }
  const ev = attendance[eid] || {};
  const eligible = members;
  let present = 0;
  document.getElementById('att-tbody').innerHTML = eligible.map(m => {
    const st = ev[m.id] || 'Absent';
    if (st === 'Present') present++;
    return `<tr>
      <td>${m.sid}</td><td>${m.name}</td><td>${m.club}</td>
      <td>
        ${canRecord
          ? `<select onchange="setAtt(${eid},${m.id},this.value)" style="width:110px">
              <option${st==='Present'?' selected':''}>Present</option>
              <option${st==='Absent'?' selected':''}>Absent</option>
            </select>`
          : statusBadge(st)}
      </td>
    </tr>`;
  }).join('');
  document.getElementById('att-summary').textContent = `${present} / ${eligible.length} present`;
}
function setAtt(eid, mid, val) {
  if (!attendance[eid]) attendance[eid] = {};
  attendance[eid][mid] = val;
  renderAttendance();
}
function saveAttendance() { toast('Attendance saved!'); }

// ════════════════════════════════ ANNOUNCEMENTS ════════════════════════════════

function renderAnnouncements() {
  document.getElementById('ann-list').innerHTML = announcements.length
    ? [...announcements].reverse().map(a =>
      `<div class="announcement">
        <div class="a-header"><span class="a-title">${a.title}</span><span class="a-date">${a.date}</span></div>
        <div class="a-body">${a.body}</div>
        <span class="a-club">${a.club}</span>
      </div>`).join('')
    : `<div class="empty"><div>📢</div>No announcements yet</div>`;
}
function renderAnnouncementsView() {
  document.getElementById('ann-list-view').innerHTML = announcements.length
    ? [...announcements].reverse().map(a =>
      `<div class="announcement">
        <div class="a-header"><span class="a-title">${a.title}</span><span class="a-date">${a.date}</span></div>
        <div class="a-body">${a.body}</div>
        <span class="a-club">${a.club}</span>
      </div>`).join('')
    : `<div class="empty"><div>📢</div>No announcements yet</div>`;
}
function openAnnModal() {
  document.getElementById('an-title').value = '';
  document.getElementById('an-club').innerHTML = clubAllOptions('All Clubs');
  document.getElementById('an-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('an-body').value = '';
  document.getElementById('ann-modal').classList.add('show');
}
function saveAnnouncement() {
  const obj = {
    id: nextAId++,
    title: document.getElementById('an-title').value.trim(),
    club: document.getElementById('an-club').value,
    date: document.getElementById('an-date').value,
    body: document.getElementById('an-body').value.trim(),
  };
  if (!obj.title || !obj.body) { alert('Title and message are required.'); return; }
  announcements.push(obj);
  closeModal('ann-modal'); toast('Announcement posted'); renderAnnouncements();
}

// ════════════════════════════════ ADMIN: REPORTS ════════════════════════════════

function renderReports() {
  document.getElementById('report-membership').innerHTML =
    `<p style="margin-bottom:12px;font-size:13px;color:#555;">Total members: <strong>${members.length}</strong></p>` +
    clubs.map(c => {
      const n = members.filter(m=>m.club===c.name).length;
      return `<div class="progress-row">
        <span class="progress-label">${c.name}</span>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${members.length?Math.round(n/members.length*100):0}%"></div></div>
        <span class="progress-pct">${n}</span>
      </div>`;
    }).join('');

  document.getElementById('report-events').innerHTML =
    `<p style="margin-bottom:12px;font-size:13px;color:#555;">Total events: <strong>${events.length}</strong></p>` +
    clubs.map(c => {
      const n = events.filter(e=>e.club===c.name).length;
      return `<div class="progress-row">
        <span class="progress-label">${c.name}</span>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${events.length?Math.round(n/events.length*100):0}%;background:#4caf50"></div></div>
        <span class="progress-pct">${n}</span>
      </div>`;
    }).join('');

  document.getElementById('report-att-tbody').innerHTML = attendanceTableRows();
}

function attendanceTableRows() {
  return events.map(e => {
    const ev = attendance[e.id] || {};
    const total = members.length;
    const present = Object.values(ev).filter(s=>s==='Present').length;
    const absent = total - present;
    const rate = total ? Math.round(present/total*100) : 0;
    return `<tr>
      <td>${e.name}</td><td>${e.date}</td><td>${e.club}</td>
      <td>${statusBadge('Present')} ${present}</td>
      <td>${statusBadge('Absent')} ${absent}</td>
      <td><strong>${rate}%</strong></td>
    </tr>`;
  }).join('');
}

function exportCSV() {
  const rows = [['Event','Date','Club','Present','Absent','Rate']];
  events.forEach(e => {
    const ev = attendance[e.id] || {};
    const total = members.length, present = Object.values(ev).filter(s=>s==='Present').length;
    rows.push([e.name, e.date, e.club, present, total-present, total ? Math.round(present/total*100)+'%' : '0%']);
  });
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'unimy_attendance_report.csv';
  a.click();
}

// ════════════════════════════════ COACH: VIEW MEMBERS ════════════════════════════════

function renderCoachMembers() {
  const q = (document.getElementById('coach-member-search').value||'').toLowerCase();
  const sel = document.getElementById('coach-member-club');
  const cur = sel.value;
  sel.innerHTML = '<option value="">All clubs</option>' + clubOptions(cur);
  const fc = sel.value;
  const filtered = members.filter(m =>
    (m.name.toLowerCase().includes(q) || m.sid.toLowerCase().includes(q)) && (!fc || m.club === fc)
  );
  document.getElementById('coach-members-tbody').innerHTML = filtered.length
    ? filtered.map(m => `<tr><td>${m.sid}</td><td>${m.name}</td><td>${m.email}</td><td>${m.club}</td><td>${statusBadge(m.status)}</td></tr>`).join('')
    : `<tr><td colspan="5"><div class="empty"><div>👥</div>No members found</div></td></tr>`;
}

// ════════════════════════════════ TRAINING SCHEDULE (Coach + Admin) ════════════════════════════════

function renderSchedule() {
  const canEdit = session.role === 'admin' || session.role === 'coach';
  document.getElementById('schedule-list').innerHTML = schedule.length
    ? schedule.map(s => `<div class="schedule-row">
        <span><strong>${s.day}</strong></span>
        <span>${s.time}</span>
        <span>${s.club}</span>
        <span>${canEdit ? `<button class="btn btn-danger btn-sm" onclick="deleteSchedule(${s.id})">Remove</button>` : ''}</span>
      </div>`).join('')
    : `<div class="empty"><div>🗓️</div>No training sessions scheduled</div>`;
}
function openScheduleModal() {
  document.getElementById('s-day').value = 'Monday';
  document.getElementById('s-time').value = '';
  document.getElementById('s-club').innerHTML = clubOptions(clubs[0].name);
  document.getElementById('schedule-modal').classList.add('show');
}
function saveSchedule() {
  const time = document.getElementById('s-time').value.trim();
  if (!time) { alert('Please enter a time.'); return; }
  schedule.push({ id: nextSchedId++, day: document.getElementById('s-day').value, time, club: document.getElementById('s-club').value });
  closeModal('schedule-modal'); toast('Training session added'); renderSchedule();
}
function deleteSchedule(id) { schedule = schedule.filter(s=>s.id!==id); toast('Session removed'); renderSchedule(); }

// ════════════════════════════════ MANAGEMENT: STATISTICS ════════════════════════════════

function renderMgmtStats() {
  document.getElementById('mstat-members').textContent = members.length;
  document.getElementById('mstat-events').textContent = events.length;
  let totP=0, totT=0;
  Object.values(attendance).forEach(ev => Object.values(ev).forEach(s => { totT++; if (s==='Present') totP++; }));
  document.getElementById('mstat-attend').textContent = totT ? Math.round(totP/totT*100)+'%' : '–';

  const max = Math.max(...clubs.map(c => members.filter(m=>m.club===c.name).length), 1);
  document.getElementById('mgmt-membership-chart').innerHTML = clubs.map(c => {
    const n = members.filter(m=>m.club===c.name).length;
    return `<div class="progress-row">
      <span class="progress-label">${c.name}</span>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${Math.round(n/max*100)}%"></div></div>
      <span class="progress-pct">${n}</span>
    </div>`;
  }).join('');

  const statuses = ['Active','Pending','Inactive'];
  document.getElementById('mgmt-status-chart').innerHTML = statuses.map(s => {
    const n = members.filter(m=>m.status===s).length;
    const color = s==='Active'?'#4caf50':s==='Pending'?'#ff9800':'#9e9e9e';
    return `<div class="progress-row">
      <span class="progress-label">${s}</span>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${members.length?Math.round(n/members.length*100):0}%;background:${color}"></div></div>
      <span class="progress-pct">${n}</span>
    </div>`;
  }).join('');
}

// ════════════════════════════════ MANAGEMENT: PERFORMANCE REPORTS ════════════════════════════════

function renderMgmtReports() {
  document.getElementById('mgmt-perf-tbody').innerHTML = clubs.map(c => {
    const mCount = members.filter(m=>m.club===c.name).length;
    const clubEvents = events.filter(e=>e.club===c.name);
    let totP=0, totT=0;
    clubEvents.forEach(e => { const ev=attendance[e.id]||{}; Object.values(ev).forEach(s=>{ totT++; if(s==='Present') totP++; }); });
    const rate = totT ? Math.round(totP/totT*100) : 0;
    const engagement = rate>=70?'High':rate>=40?'Medium':'Low';
    const badgeClass = engagement==='High'?'badge-green':engagement==='Medium'?'badge-orange':'badge-red';
    return `<tr><td>${c.name}</td><td>${mCount}</td><td>${clubEvents.length}</td><td>${rate}%</td><td><span class="badge ${badgeClass}">${engagement}</span></td></tr>`;
  }).join('');
  document.getElementById('mgmt-att-tbody').innerHTML = attendanceTableRows();
}

// ════════════════════════════════ STUDENT: PROFILE ════════════════════════════════

function currentStudent() { return members.find(m => m.id === session.memberId); }

function renderProfile() {
  const m = currentStudent();
  if (!m) return;
  document.getElementById('profile-avatar').textContent = m.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  document.getElementById('p-name').value = m.name;
  document.getElementById('p-sid').value = m.sid;
  document.getElementById('p-email').value = m.email;
  document.getElementById('p-phone').value = m.phone;
  document.getElementById('p-club').value = m.club;
  document.getElementById('p-status').value = m.status;
}
function saveProfile() {
  const m = currentStudent();
  if (!m) return;
  m.name = document.getElementById('p-name').value.trim();
  m.email = document.getElementById('p-email').value.trim();
  m.phone = document.getElementById('p-phone').value.trim();
  session.name = m.name;
  document.getElementById('user-name').textContent = m.name;
  toast('Profile updated');
}

// ════════════════════════════════ STUDENT: REGISTER MEMBERSHIP ════════════════════════════════

function renderRegister() {
  document.getElementById('reg-club').innerHTML = clubOptions(clubs[0].name);
  document.getElementById('reg-status').textContent = '';
}
function registerMembership() {
  const club = document.getElementById('reg-club').value;
  const m = currentStudent();
  if (m.club === club && m.status !== 'Inactive') {
    document.getElementById('reg-status').innerHTML = `<span style="color:#c62828">You are already registered with ${club}.</span>`;
    return;
  }
  m.club = club;
  m.status = 'Pending';
  document.getElementById('reg-status').innerHTML = `<span style="color:#2e7d32">Registration submitted for ${club}. Awaiting admin approval.</span>`;
  toast('Registration submitted');
}

// ════════════════════════════════ STUDENT: CLUB INFORMATION ════════════════════════════════

function renderClubInfo() {
  document.getElementById('club-info-grid').innerHTML = clubs.map(c => {
    const n = members.filter(m=>m.club===c.name).length;
    return `<div class="club-card">
      <h4>${c.name}</h4>
      <p>${c.desc}</p>
      <span class="badge badge-blue">${n} members</span>
    </div>`;
  }).join('');
}

// ════════════════════════════════ STUDENT: EVENT REGISTRATION ════════════════════════════════

function renderStudentEvents() {
  const m = currentStudent();
  document.getElementById('student-events-tbody').innerHTML = events.length
    ? events.map(e => {
        const isRegistered = e.registered.includes(m.id);
        const full = e.registered.length >= e.slots;
        let action;
        if (isRegistered) action = `<button class="btn btn-outline btn-sm" onclick="unregisterEvent(${e.id})">Cancel</button>`;
        else if (full) action = `<span class="badge badge-gray">Full</span>`;
        else action = `<button class="btn btn-primary btn-sm" onclick="registerEvent(${e.id})">Register</button>`;
        return `<tr>
          <td>${e.name}</td><td>${e.date}</td><td>${e.venue}</td><td>${e.club}</td>
          <td>${e.registered.length} / ${e.slots}</td>
          <td>${action}</td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="6"><div class="empty"><div>📅</div>No events available</div></td></tr>`;
}
function registerEvent(eid) {
  const m = currentStudent();
  const e = events.find(e=>e.id===eid);
  if (e.registered.length >= e.slots) { alert('This event is full.'); return; }
  if (!e.registered.includes(m.id)) e.registered.push(m.id);
  toast('Registered for event'); renderStudentEvents();
}
function unregisterEvent(eid) {
  const m = currentStudent();
  const e = events.find(e=>e.id===eid);
  e.registered = e.registered.filter(id=>id!==m.id);
  toast('Registration cancelled'); renderStudentEvents();
}

// STUDENT: MY ATTENDANCE 

function renderStudentAttendance() {
  const m = currentStudent();
  const rows = events.map(e => {
    const ev = attendance[e.id] || {};
    const st = ev[m.id];
    if (!st) return null;
    return `<tr><td>${e.name}</td><td>${e.date}</td><td>${e.club}</td><td>${statusBadge(st)}</td></tr>`;
  }).filter(Boolean);
  document.getElementById('student-att-tbody').innerHTML = rows.length
    ? rows.join('')
    : `<tr><td colspan="4"><div class="empty"><div>✅</div>No attendance records yet</div></td></tr>`;
}

// INIT 
selectLoginRole('admin');