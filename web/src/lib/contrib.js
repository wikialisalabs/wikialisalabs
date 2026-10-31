/**
 * contrib.js — Community Contribution Components
 * Wikialisalabs Design System
 *
 * Components:
 *   ContributorBadge(opts)   → HTML string
 *   VoteBar(opts)            → HTML string  (needs mountVoteBars() after DOM insert)
 *   ContribCard(opts)        → HTML string
 *   CommentThread(opts)      → HTML string  (needs mountCommentThreads() after DOM insert)
 *   SubmitForm(opts)         → HTML string  (needs mountSubmitForm() after DOM insert)
 *   StatusBoard(opts)        → HTML string  (needs mountStatusBoard() after DOM insert)
 *   mountAll(container)      → wires all interactive components in a container
 *   injectContribStyles()    → injects stylesheet once
 */

// ── Shared state (in-memory, resets on page navigation) ───────────────────────
const _votes    = {};   // { [id]: { up: n, down: n, voted: null|'up'|'down' } }
const _comments = {};   // { [threadId]: [{ author, text, time }] }
const _board    = {};   // { [cardId]: status }

// ── Helpers ───────────────────────────────────────────────────────────────────

function _esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _initials(name) {
  return name.split(/\s+/).map(w => w[0]||'').join('').slice(0,2).toUpperCase();
}

const LEVEL_MAP = {
  Newcomer:   { color: '#EFEFEF', text: '#000', min: 0 },
  Member:     { color: '#BEFF6C', text: '#000', min: 3 },
  Contributor:{ color: '#49DBC8', text: '#000', min: 10 },
  Maintainer: { color: '#AF96FB', text: '#000', min: 25 },
};

function _level(count) {
  if (count >= 25) return 'Maintainer';
  if (count >= 10) return 'Contributor';
  if (count >= 3)  return 'Member';
  return 'Newcomer';
}

const STATUS_COLORS = {
  'Proposed':   '#FFF172',
  'In Review':  '#FC7339',
  'Approved':   '#49DBC8',
  'Merged':     '#BEFF6C',
  'Rejected':   '#FF3D71',
};

const TYPE_COLORS = {
  component: '#AF96FB',
  icon:      '#49DBC8',
  token:     '#FFF172',
  doc:       '#BEFF6C',
  fix:       '#FD9FDD',
};

// ── ContributorBadge ──────────────────────────────────────────────────────────

/**
 * Renders a contributor profile badge.
 * @param {{ name: string, count?: number, avatar?: string }} opts
 */
export function ContributorBadge({ name, count = 0, avatar = '' }) {
  const lvl     = _level(count);
  const lv      = LEVEL_MAP[lvl];
  const initials = _initials(name);
  return `
<div class="cb-badge">
  ${avatar
    ? `<img class="cb-avatar cb-avatar-img" src="${_esc(avatar)}" alt="${_esc(name)}">`
    : `<div class="cb-avatar" style="background:${lv.color};color:${lv.text}">${initials}</div>`
  }
  <div class="cb-info">
    <div class="cb-name">${_esc(name)}</div>
    <div class="cb-meta">
      <span class="cb-level" style="background:${lv.color};color:${lv.text}">${lvl}</span>
      <span class="cb-count">${count} contribution${count !== 1 ? 's' : ''}</span>
    </div>
  </div>
</div>`;
}

// ── VoteBar ───────────────────────────────────────────────────────────────────

/**
 * Renders a vote bar (upvote / downvote).
 * @param {{ id: string, up?: number, down?: number }} opts
 */
export function VoteBar({ id, up = 0, down = 0 }) {
  if (!_votes[id]) _votes[id] = { up, down, voted: null };
  const v = _votes[id];
  return `
<div class="vb-bar" data-vote-id="${_esc(id)}">
  <button class="vb-btn vb-up${v.voted==='up'?' vb-active':''}" data-vote="up" title="Upvote">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5l0 14M5 12l7-7 7 7"/>
    </svg>
    <span class="vb-count">${v.up}</span>
  </button>
  <div class="vb-sep"></div>
  <button class="vb-btn vb-dn${v.voted==='down'?' vb-active-dn':''}" data-vote="down" title="Downvote">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19l0-14M5 12l7 7 7-7"/>
    </svg>
    <span class="vb-count">${v.down}</span>
  </button>
</div>`;
}

// ── ContribCard ───────────────────────────────────────────────────────────────

/**
 * Renders a contribution card.
 * @param {{
 *   id: string, title: string, author: string, type?: string,
 *   status?: string, description?: string,
 *   prUrl?: string, votes?: { up: number, down: number },
 *   tags?: string[], authorCount?: number
 * }} opts
 */
export function ContribCard({
  id, title, author, type = 'component',
  status = 'Proposed', description = '',
  prUrl = '', votes = { up: 0, down: 0 },
  tags = [], authorCount = 0,
}) {
  const sc = STATUS_COLORS[status]  || '#EFEFEF';
  const tc = TYPE_COLORS[type]      || '#EFEFEF';
  return `
<div class="cc-card" data-contrib-id="${_esc(id)}" data-status="${_esc(status)}">
  <div class="cc-header">
    <span class="cc-type-badge" style="background:${tc}">${_esc(type)}</span>
    <span class="cc-status-badge" style="background:${sc}">${_esc(status)}</span>
  </div>
  <h3 class="cc-title">${_esc(title)}</h3>
  ${description ? `<p class="cc-desc">${_esc(description)}</p>` : ''}
  ${tags.length ? `<div class="cc-tags">${tags.map(t=>`<span class="cc-tag">#${_esc(t)}</span>`).join('')}</div>` : ''}
  <div class="cc-footer">
    ${ContributorBadge({ name: author, count: authorCount })}
    <div class="cc-actions">
      ${VoteBar({ id, up: votes.up, down: votes.down })}
      ${prUrl ? `<a class="cc-pr-link" href="${_esc(prUrl)}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5-.08-1.25-.27-2.48-3-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5C3.27 6.47 3.08 7.7 3 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
        PR
      </a>` : ''}
      <button class="cc-comment-toggle" data-comment-target="thread-${_esc(id)}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Discuss
      </button>
    </div>
  </div>
  <div class="cc-thread-wrap hidden" id="thread-${_esc(id)}">
    ${CommentThread({ id })}
  </div>
</div>`;
}

// ── CommentThread ─────────────────────────────────────────────────────────────

/**
 * Renders a comment thread (list + reply form).
 * @param {{ id: string }} opts
 */
export function CommentThread({ id }) {
  if (!_comments[id]) _comments[id] = [];
  const comments = _comments[id];
  return `
<div class="ct-thread" data-thread-id="${_esc(id)}">
  <div class="ct-list" id="ct-list-${_esc(id)}">
    ${comments.length
      ? comments.map(c => _renderComment(c)).join('')
      : '<p class="ct-empty">No comments yet — be the first to discuss!</p>'
    }
  </div>
  <form class="ct-form" data-thread-form="${_esc(id)}">
    <input class="ct-input ct-author" type="text" placeholder="Your name (optional)" maxlength="40" autocomplete="off">
    <textarea class="ct-input ct-body" placeholder="Share your thoughts, feedback, or implementation notes…" rows="3" maxlength="500"></textarea>
    <div class="ct-form-actions">
      <span class="ct-char-count" data-for="${_esc(id)}">0 / 500</span>
      <button type="submit" class="ct-submit">Post comment</button>
    </div>
  </form>
</div>`;
}

function _renderComment({ author, text, time }) {
  return `
<div class="ct-comment">
  <div class="ct-comment-header">
    <div class="ct-avatar">${_initials(author || 'A')}</div>
    <strong class="ct-comment-author">${_esc(author || 'Anonymous')}</strong>
    <time class="ct-time">${_esc(time)}</time>
  </div>
  <p class="ct-comment-text">${_esc(text)}</p>
</div>`;
}

// ── SubmitForm ────────────────────────────────────────────────────────────────

/**
 * Renders a component submission form.
 * @param {{ onSubmit?: (data) => void }} opts
 */
export function SubmitForm({ onSubmit } = {}) {
  return `
<div class="sf-wrap">
  <form class="sf-form" id="contrib-submit-form">
    <div class="sf-row sf-row-2">
      <div class="sf-field">
        <label class="sf-label">Component / Contribution Name <span class="sf-req">*</span></label>
        <input class="sf-input" name="title" type="text" placeholder="e.g. CryptoAddressInput, DeFi Chart, ZK Badge" required maxlength="80">
      </div>
      <div class="sf-field">
        <label class="sf-label">Contribution Type <span class="sf-req">*</span></label>
        <select class="sf-input sf-select" name="type" required>
          <option value="">— Select type —</option>
          <option value="component">Component (UI element)</option>
          <option value="icon">Icon (SVG)</option>
          <option value="token">Token (design variable)</option>
          <option value="doc">Documentation</option>
          <option value="fix">Bug fix / improvement</option>
        </select>
      </div>
    </div>

    <div class="sf-row sf-row-2">
      <div class="sf-field">
        <label class="sf-label">Category</label>
        <select class="sf-input sf-select" name="category">
          <option value="">— Select category —</option>
          <option value="atoms">Atoms</option>
          <option value="molecules">Molecules</option>
          <option value="organisms">Organisms</option>
          <option value="templates">Templates</option>
          <option value="kits">UI Kits</option>
          <option value="crypto">Crypto / Web3</option>
          <option value="defi">DeFi</option>
          <option value="wallet">Wallet</option>
          <option value="auth">Auth / Identity</option>
        </select>
      </div>
      <div class="sf-field">
        <label class="sf-label">Your GitHub username</label>
        <div class="sf-input-prefix">
          <span class="sf-prefix">github.com/</span>
          <input class="sf-input sf-input-no-l" name="github" type="text" placeholder="username" maxlength="39">
        </div>
      </div>
    </div>

    <div class="sf-field">
      <label class="sf-label">Description <span class="sf-req">*</span></label>
      <textarea class="sf-input sf-textarea" name="description" rows="3"
        placeholder="What does this component do? What problem does it solve for the ecosystem?" required maxlength="400"></textarea>
      <div class="sf-field-hint">Max 400 characters</div>
    </div>

    <div class="sf-field">
      <label class="sf-label">Code Preview <small class="sf-hint-inline">(Markdown / HTML snippet)</small></label>
      <textarea class="sf-input sf-textarea sf-code" name="code" rows="6"
        placeholder="&lt;!-- Paste your HTML/JSX snippet or Markdown code block --&gt;&#10;&#10;&lt;div class=&quot;axq-crypto-address&quot;&gt;&#10;  &lt;span class=&quot;addr-prefix&quot;&gt;0x&lt;/span&gt;&#10;  &lt;span class=&quot;addr-body&quot;&gt;1a2b3c…&lt;/span&gt;&#10;&lt;/div&gt;"></textarea>
    </div>

    <div class="sf-field">
      <label class="sf-label">GitHub Pull Request URL</label>
      <input class="sf-input" name="prUrl" type="url" placeholder="https://github.com/Wikialisalabslabs/…/pull/42">
    </div>

    <div class="sf-field">
      <label class="sf-label">Tags <small class="sf-hint-inline">(comma-separated)</small></label>
      <input class="sf-input" name="tags" type="text" placeholder="wallet, zk, address, defi, accessibility">
    </div>

    <div class="sf-actions">
      <button type="reset" class="sf-btn sf-btn-ghost">Clear form</button>
      <button type="submit" class="sf-btn sf-btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7-7 7 7"/>
        </svg>
        Submit Contribution
      </button>
    </div>

    <div class="sf-success hidden" id="sf-success-msg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <div>
        <strong>Contribution submitted!</strong>
        <span>Thank you! Our maintainers will review and respond on the PR within 3–5 days.</span>
      </div>
    </div>
  </form>
</div>`;
}

// ── StatusBoard ───────────────────────────────────────────────────────────────

/**
 * Renders a Kanban-style status board.
 * @param {{ columns?: Array<{ status: string, items: Array<ContribCard opts> }> }} opts
 */
export function StatusBoard({ columns = [] }) {
  if (!columns.length) return '<p class="ct-empty">No contributions yet.</p>';
  return `
<div class="sb-board" id="sb-board">
  ${columns.map(col => `
    <div class="sb-col" data-status="${_esc(col.status)}">
      <div class="sb-col-header" style="background:${STATUS_COLORS[col.status]||'#eee'}">
        <span class="sb-col-title">${_esc(col.status)}</span>
        <span class="sb-col-count">${col.items.length}</span>
      </div>
      <div class="sb-col-body">
        ${col.items.map(item => `
          <div class="sb-item" draggable="true" data-card-id="${_esc(item.id)}" data-status="${_esc(col.status)}">
            <div class="sb-item-top">
              <span class="sb-item-type" style="background:${TYPE_COLORS[item.type]||'#eee'}">${_esc(item.type||'component')}</span>
              <span class="sb-item-title">${_esc(item.title)}</span>
            </div>
            <div class="sb-item-bottom">
              <span class="sb-item-author">by ${_esc(item.author)}</span>
              ${VoteBar({ id: item.id + '-sb', up: item.votes?.up||0, down: item.votes?.down||0 })}
            </div>
          </div>
        `).join('')}
        <button class="sb-add-btn" data-status="${_esc(col.status)}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add
        </button>
      </div>
    </div>
  `).join('')}
</div>`;
}

// ── Mount functions (wire interactivity after DOM insert) ─────────────────────

/**
 * Wire all vote bars in a container.
 */
export function mountVoteBars(container) {
  container.querySelectorAll('[data-vote-id]').forEach(bar => {
    bar.addEventListener('click', e => {
      const btn  = e.target.closest('[data-vote]');
      if (!btn) return;
      const id   = bar.dataset.voteId;
      const dir  = btn.dataset.vote;
      const v    = _votes[id] || { up: 0, down: 0, voted: null };

      if (v.voted === dir) {
        // un-vote
        v[dir]--;
        v.voted = null;
      } else {
        if (v.voted) v[v.voted]--; // undo previous
        v[dir]++;
        v.voted = dir;
      }
      _votes[id] = v;

      // Re-render this bar in place
      bar.outerHTML = VoteBar({ id, up: v.up, down: v.down });
      // Remount (outerHTML replacement removes listeners — need to re-find)
      // Find new bar and re-mount
      const newBar = container.querySelector(`[data-vote-id="${id}"]`);
      if (newBar) mountVoteBars(newBar.closest('[data-vote-id]')?.parentElement || container);
    });
  });
}

/**
 * Wire comment threads in a container.
 */
export function mountCommentThreads(container) {
  // Toggle thread visibility
  container.querySelectorAll('.cc-comment-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = container.querySelector('#' + btn.dataset.commentTarget);
      if (!target) return;
      target.classList.toggle('hidden');
    });
  });

  // Comment form submit
  container.querySelectorAll('[data-thread-form]').forEach(form => {
    const id     = form.dataset.threadForm;
    const body   = form.querySelector('.ct-body');
    const count  = container.querySelector(`.ct-char-count[data-for="${id}"]`);

    if (body && count) {
      body.addEventListener('input', () => {
        count.textContent = `${body.value.length} / 500`;
      });
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const author = form.querySelector('.ct-author')?.value.trim() || 'Anonymous';
      const text   = body?.value.trim();
      if (!text) return;

      if (!_comments[id]) _comments[id] = [];
      const entry = {
        author,
        text,
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
      };
      _comments[id].push(entry);

      const list = container.querySelector(`#ct-list-${id}`);
      if (list) {
        list.querySelector('.ct-empty')?.remove();
        list.insertAdjacentHTML('beforeend', _renderComment(entry));
        list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
      if (count) count.textContent = '0 / 500';
    });
  });
}

/**
 * Wire the contribution submit form.
 * onSubmit(data) is called with form data object.
 */
export function mountSubmitForm(container, onSubmit) {
  const form = container.querySelector('#contrib-submit-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd  = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    data.id   = `contrib-${Date.now()}`;

    const success = form.querySelector('#sf-success-msg');
    if (success) {
      success.classList.remove('hidden');
      form.querySelectorAll('input,textarea,select,button[type="submit"]').forEach(el => (el.disabled = true));
    }

    if (typeof onSubmit === 'function') onSubmit(data);
  });
}

/**
 * Wire status board drag-and-drop + add buttons.
 */
export function mountStatusBoard(container) {
  const board = container.querySelector('#sb-board');
  if (!board) return;

  let dragId    = null;
  let dragStatus = null;

  board.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      dragId     = item.dataset.cardId;
      dragStatus = item.dataset.status;
      item.classList.add('sb-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('sb-dragging');
    });
  });

  board.querySelectorAll('.sb-col').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('sb-col-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('sb-col-over'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('sb-col-over');
      if (!dragId) return;
      const newStatus = col.dataset.status;
      if (newStatus === dragStatus) return;

      _board[dragId] = newStatus;
      const item = board.querySelector(`[data-card-id="${dragId}"]`);
      if (!item) return;
      const body = col.querySelector('.sb-col-body');
      if (!body) return;
      item.dataset.status = newStatus;
      const addBtn = body.querySelector('.sb-add-btn');
      body.insertBefore(item, addBtn || null);

      // Update counter badges
      board.querySelectorAll('.sb-col').forEach(c => {
        const cnt = c.querySelectorAll('.sb-item').length;
        const badge = c.querySelector('.sb-col-count');
        if (badge) badge.textContent = cnt;
      });
    });
  });

  // Add button opens a mini form
  board.querySelectorAll('.sb-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.dataset.status;
      const title  = prompt(`New contribution title for "${status}":`);
      if (!title) return;
      const author = prompt('Contributor name:') || 'Anonymous';
      const id     = `quick-${Date.now()}`;
      const item   = document.createElement('div');
      item.className  = 'sb-item';
      item.draggable  = true;
      item.dataset.cardId = id;
      item.dataset.status = status;
      item.innerHTML = `
        <div class="sb-item-top">
          <span class="sb-item-type" style="background:#EFEFEF">component</span>
          <span class="sb-item-title">${_esc(title)}</span>
        </div>
        <div class="sb-item-bottom">
          <span class="sb-item-author">by ${_esc(author)}</span>
          ${VoteBar({ id, up: 0, down: 0 })}
        </div>`;
      btn.parentElement.insertBefore(item, btn);
      mountVoteBars(item);
      // Wire drag on new item
      item.addEventListener('dragstart', e => {
        dragId = id; dragStatus = status;
        item.classList.add('sb-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => item.classList.remove('sb-dragging'));
      // Update count
      const badge = btn.closest('.sb-col')?.querySelector('.sb-col-count');
      if (badge) badge.textContent = parseInt(badge.textContent||0)+1;
    });
  });
}

/**
 * Mount all interactive contrib components in a container.
 */
export function mountAll(container, { onSubmit } = {}) {
  mountVoteBars(container);
  mountCommentThreads(container);
  mountSubmitForm(container, onSubmit);
  mountStatusBoard(container);
}

// ── Stylesheet ────────────────────────────────────────────────────────────────

const CONTRIB_CSS = `
/* ── ContributorBadge ── */
.cb-badge {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
}
.cb-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid #000;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  flex-shrink: 0; object-fit: cover;
  box-shadow: 2px 2px 0 #000;
}
.cb-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cb-name { font-size: 13px; font-weight: 700; color: #000; white-space: nowrap; }
.cb-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.cb-level {
  font-size: 10px; font-weight: 700; padding: 1px 7px;
  border-radius: 9999px; border: 1.5px solid rgba(0,0,0,0.15);
}
.cb-count { font-size: 10px; color: #57606a; }

/* ── VoteBar ── */
.vb-bar {
  display: inline-flex; align-items: center;
  border: 1.5px solid #000; border-radius: 9999px;
  overflow: hidden; background: #fff;
  box-shadow: 2px 2px 0 #000;
}
.vb-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; font-size: 12px; font-weight: 600;
  background: none; border: none; cursor: pointer;
  transition: background .12s; color: #000;
}
.vb-btn:hover { background: #f0f0f0; }
.vb-up.vb-active  { background: #BEFF6C; }
.vb-dn.vb-active-dn { background: #FFD6D9; }
.vb-sep { width: 1.5px; background: #000; align-self: stretch; }
.vb-count { min-width: 16px; text-align: center; }

/* ── ContribCard ── */
.cc-card {
  background: #fff; border: 2px solid #000;
  border-radius: 12px; padding: 20px;
  box-shadow: 4px 4px 0 #000;
  transition: transform .15s, box-shadow .15s;
  display: flex; flex-direction: column; gap: 10px;
}
.cc-card:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
.cc-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cc-type-badge, .cc-status-badge {
  font-size: 10px; font-weight: 700; padding: 2px 9px;
  border-radius: 9999px; border: 1.5px solid rgba(0,0,0,0.12);
  text-transform: uppercase; letter-spacing: .3px;
}
.cc-title { font-size: 16px; font-weight: 700; color: #000; }
.cc-desc  { font-size: 13px; color: #57606a; line-height: 1.5; }
.cc-tags  { display: flex; flex-wrap: wrap; gap: 6px; }
.cc-tag {
  font-size: 11px; font-weight: 600; color: #7C5CF6;
  background: #f3f0ff; padding: 2px 8px; border-radius: 9999px;
}
.cc-footer {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  padding-top: 10px; border-top: 1px solid #e5e7eb;
}
.cc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cc-pr-link {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #000;
  border: 1.5px solid #000; padding: 4px 10px;
  border-radius: 9999px; text-decoration: none;
  box-shadow: 2px 2px 0 #000;
  transition: transform .12s; background: #fff;
}
.cc-pr-link:hover { transform: translate(-1px,-1px); }
.cc-comment-toggle {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #000;
  border: 1.5px solid #000; padding: 4px 10px;
  border-radius: 9999px; cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: background .12s, transform .12s; background: #fff;
}
.cc-comment-toggle:hover { background: #49DBC8; transform: translate(-1px,-1px); }
.cc-thread-wrap { padding-top: 10px; border-top: 1px solid #e5e7eb; }
.cc-thread-wrap.hidden { display: none; }

/* ── CommentThread ── */
.ct-thread { background: #f7f8fa; border-radius: 8px; padding: 14px; }
.ct-list   { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.ct-empty  { font-size: 13px; color: #57606a; margin: 4px 0 12px; }
.ct-comment {
  background: #fff; border: 1.5px solid #e5e7eb;
  border-radius: 8px; padding: 10px 12px;
}
.ct-comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.ct-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: #49DBC8; border: 1.5px solid #000;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; flex-shrink: 0; color: #000;
}
.ct-comment-author { font-size: 12px; font-weight: 700; }
.ct-time { font-size: 11px; color: #57606a; margin-left: auto; }
.ct-comment-text { font-size: 13px; color: #333; line-height: 1.5; white-space: pre-wrap; }
.ct-form { display: flex; flex-direction: column; gap: 8px; }
.ct-input {
  width: 100%; border: 1.5px solid #000; border-radius: 8px;
  padding: 8px 12px; font-size: 13px; font-family: inherit;
  background: #fff; color: #000; resize: vertical;
  outline: none; transition: border-color .15s, box-shadow .15s;
}
.ct-input:focus { border-color: #7C5CF6; box-shadow: 0 0 0 3px rgba(124,92,246,.12); }
.ct-form-actions {
  display: flex; justify-content: space-between; align-items: center;
}
.ct-char-count { font-size: 11px; color: #57606a; }
.ct-submit {
  background: #000; color: #fff; font-size: 13px; font-weight: 600;
  padding: 7px 18px; border-radius: 9999px; border: 2px solid #000;
  cursor: pointer; transition: background .12s;
}
.ct-submit:hover { background: #7C5CF6; border-color: #7C5CF6; }

/* ── SubmitForm ── */
.sf-wrap { background: #fff; border: 2px solid #000; border-radius: 12px; padding: 28px; box-shadow: 5px 5px 0 #000; }
.sf-form { display: flex; flex-direction: column; gap: 18px; }
.sf-row { display: flex; gap: 16px; flex-wrap: wrap; }
.sf-row-2 > .sf-field { flex: 1 1 200px; }
.sf-field { display: flex; flex-direction: column; gap: 5px; }
.sf-label { font-size: 13px; font-weight: 700; color: #000; }
.sf-req   { color: #FF3D71; }
.sf-hint-inline { font-size: 11px; font-weight: 400; color: #57606a; }
.sf-field-hint  { font-size: 11px; color: #57606a; }
.sf-input {
  border: 1.5px solid #000; border-radius: 8px;
  padding: 10px 12px; font-size: 14px; font-family: inherit;
  background: #fff; color: #000; width: 100%; outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.sf-input:focus { border-color: #7C5CF6; box-shadow: 0 0 0 3px rgba(124,92,246,.12); }
.sf-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }
.sf-textarea { resize: vertical; line-height: 1.6; min-height: 80px; }
.sf-code { font-family: monospace; font-size: 12px; }
.sf-input-prefix { display: flex; border: 1.5px solid #000; border-radius: 8px; overflow: hidden; }
.sf-prefix { background: #f0f0f0; padding: 10px 10px; font-size: 13px; font-weight: 600; color: #57606a; border-right: 1.5px solid #000; white-space: nowrap; }
.sf-input-no-l { border: none; border-radius: 0; flex: 1; }
.sf-input-no-l:focus { box-shadow: none; }
.sf-actions { display: flex; gap: 12px; flex-wrap: wrap; padding-top: 4px; }
.sf-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 700; padding: 10px 24px;
  border-radius: 9999px; cursor: pointer; border: 2px solid #000;
  transition: transform .12s, box-shadow .12s; font-family: inherit;
}
.sf-btn-primary { background: #000; color: #fff; box-shadow: 4px 4px 0 #49DBC8; }
.sf-btn-primary:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #49DBC8; }
.sf-btn-ghost { background: #fff; color: #000; box-shadow: 3px 3px 0 #000; }
.sf-btn-ghost:hover { background: #EFEFEF; }
.sf-success {
  display: flex; align-items: flex-start; gap: 12px;
  background: #F0FFF5; border: 2px solid #00D68F; border-radius: 10px;
  padding: 14px 16px; font-size: 13px; color: #00997A;
}
.sf-success svg { flex-shrink: 0; color: #00D68F; margin-top: 1px; }
.sf-success strong { display: block; font-weight: 700; margin-bottom: 2px; color: #007D6C; }
.sf-success.hidden { display: none; }

/* ── StatusBoard ── */
.sb-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px; align-items: start;
}
.sb-col {
  border: 2px solid #000; border-radius: 10px; overflow: hidden;
  box-shadow: 4px 4px 0 #000;
  transition: box-shadow .15s;
}
.sb-col.sb-col-over { box-shadow: 0 0 0 3px #7C5CF6, 4px 4px 0 #000; }
.sb-col-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 2px solid #000; font-weight: 700;
}
.sb-col-title { font-size: 13px; }
.sb-col-count {
  font-size: 11px; background: rgba(0,0,0,0.12);
  padding: 1px 7px; border-radius: 9999px; font-weight: 700;
}
.sb-col-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; background: #f7f8fa; }
.sb-item {
  background: #fff; border: 1.5px solid #000; border-radius: 8px; padding: 10px;
  cursor: grab; box-shadow: 2px 2px 0 #000;
  transition: opacity .15s, transform .15s;
}
.sb-item.sb-dragging { opacity: .4; transform: scale(.97); }
.sb-item-top { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.sb-item-type {
  font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 9999px;
  border: 1px solid rgba(0,0,0,.12); width: fit-content; text-transform: uppercase;
}
.sb-item-title { font-size: 12px; font-weight: 700; color: #000; line-height: 1.3; }
.sb-item-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
.sb-item-author { font-size: 10px; color: #57606a; }
.sb-add-btn {
  display: flex; align-items: center; gap: 4px; width: 100%;
  padding: 7px 10px; font-size: 12px; font-weight: 600; color: #57606a;
  background: transparent; border: 1.5px dashed #C5CEE0; border-radius: 8px;
  cursor: pointer; justify-content: center;
  transition: background .12s, border-color .12s, color .12s;
}
.sb-add-btn:hover { background: #fff; border-color: #000; color: #000; }

/* General hidden utility */
.contrib-hidden, .hidden { display: none !important; }
`;

let _cssInjected = false;

export function injectContribStyles() {
  if (_cssInjected) return;
  _cssInjected = true;
  const style = document.createElement('style');
  style.id    = 'contrib-styles';
  style.textContent = CONTRIB_CSS;
  document.head.appendChild(style);
}
