// ATLAS Dashboard — UI Helper Functions (Phase 1 Foundation Refactor)
// Reusable render helpers for common UI patterns

function renderHUD(data) {
  // Example: render a HUD block given telemetry or status data
  // Usage: renderHUD({ label: 'ALT', value: '142.3 m', unit: '', icon: 'navigation' })
  return `
    <div class="hud">
      <span class="hud-label">${data.label}</span>
      <span class="hud-value">${data.value}${data.unit ? ' <span class=\"hud-unit\">' + data.unit + '</span>' : ''}</span>
      ${data.icon ? `<i data-lucide="${data.icon}" class="hud-icon"></i>` : ''}
    </div>
  `;
}

function renderBadge(type, text) {
  // type: green, amber, red, cyan, gray
  return `<span class="badge badge-${type}">${text}</span>`;
}

function renderPanel(title, body, actions = '') {
  // Usage: renderPanel('Panel Title', '<div>Body</div>', '<button>Action</button>')
  return `
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">${title}</span>
        <div class="panel-actions">${actions}</div>
      </div>
      <div class="panel-body">${body}</div>
    </div>
  `;
}

// Export helpers for use in app.js
if (typeof window !== 'undefined') {
  window.renderHUD = renderHUD;
  window.renderBadge = renderBadge;
  window.renderPanel = renderPanel;
}
