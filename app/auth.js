(() => {
  "use strict";

  const config = window.BPC_CONFIG || {};
  const endpoint = String(config.pocketBaseUrl || "").replace(/\/$/, "");
  const state = { token: sessionStorage.getItem("bpc_auth_token") || "", user: null, memberships: [], activeMembership: null };

  const $ = (selector) => document.querySelector(selector);
  const accountButton = $("#account-button");
  const dialog = $("#auth-dialog");
  const form = $("#auth-form");
  const message = $("#auth-message");
  const panel = $("#account-panel");

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[character]));
  }

  async function api(path, options = {}) {
    if (!endpoint) throw new Error("Account services are not configured yet.");
    const headers = {"Content-Type":"application/json", ...(options.headers || {})};
    if (state.token) headers.Authorization = state.token;
    const response = await fetch(endpoint + path, {...options, headers});
    const data = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.message || "The request could not be completed.");
    return data;
  }

  function setMessage(text, type = "") {
    message.textContent = text;
    message.dataset.type = type;
  }

  function contextualRoles(membership) {
    const roles = Array.isArray(membership?.roles) ? membership.roles : [];
    return roles.length ? roles : [membership?.role].filter(Boolean);
  }

  function renderAccount() {
    const signedIn = Boolean(state.user);
    accountButton.textContent = signedIn ? (state.user.name || state.user.email || "Account") : "Sign in";
    accountButton.setAttribute("aria-expanded", signedIn ? "true" : "false");

    if (!signedIn) {
      panel.hidden = true;
      return;
    }

    const membershipOptions = state.memberships.map((membership, index) => {
      const organization = membership.expand?.organization || {};
      const label = organization.name || membership.organization_name || "Organization";
      return `<option value="${index}">${escapeHtml(label)}</option>`;
    }).join("");

    const active = state.activeMembership;
    const roles = contextualRoles(active);
    const permissions = Array.isArray(active?.permissions) ? active.permissions : [];

    panel.innerHTML = `
      <div class="account-panel-head">
        <div><small>Signed in as</small><strong>${escapeHtml(state.user.name || state.user.email)}</strong></div>
        <button type="button" id="account-close" aria-label="Close account panel">×</button>
      </div>
      ${state.memberships.length ? `
        <label class="context-label">Organization or project context
          <select id="membership-select">${membershipOptions}</select>
        </label>
        <div class="context-block"><small>Roles in this context</small><div class="role-chips">${roles.map(role => `<span>${escapeHtml(role)}</span>`).join("") || "<span>Participant</span>"}</div></div>
        <div class="context-block"><small>Available access</small><ul>${permissions.map(permission => `<li>${escapeHtml(permission)}</li>`).join("") || "<li>Assigned activities only</li>"}</ul></div>
      ` : `<p class="account-empty">Your account is active, but no organization or project has been assigned yet.</p>`}
      <button type="button" class="sign-out" id="sign-out">Sign out</button>`;
    panel.hidden = false;

    $("#account-close")?.addEventListener("click", () => { panel.hidden = true; accountButton.setAttribute("aria-expanded", "false"); });
    $("#sign-out")?.addEventListener("click", signOut);
    $("#membership-select")?.addEventListener("change", event => {
      state.activeMembership = state.memberships[Number(event.target.value)] || null;
      renderAccount();
    });
  }

  async function loadMemberships() {
    if (!state.user) return;
    const filter = encodeURIComponent(`user="${state.user.id}" && status="active"`);
    const result = await api(`/api/collections/memberships/records?filter=${filter}&expand=organization&perPage=100`);
    state.memberships = result?.items || [];
    state.activeMembership = state.memberships[0] || null;
  }

  async function restoreSession() {
    if (!state.token || !endpoint) return;
    try {
      const result = await api("/api/collections/users/auth-refresh", {method:"POST"});
      state.token = result.token;
      state.user = result.record;
      sessionStorage.setItem("bpc_auth_token", state.token);
      await loadMemberships();
      renderAccount();
    } catch {
      signOut();
    }
  }

  function signOut() {
    state.token = "";
    state.user = null;
    state.memberships = [];
    state.activeMembership = null;
    sessionStorage.removeItem("bpc_auth_token");
    panel.hidden = true;
    renderAccount();
  }

  accountButton?.addEventListener("click", () => {
    if (state.user) {
      panel.hidden = !panel.hidden;
      accountButton.setAttribute("aria-expanded", String(!panel.hidden));
      return;
    }
    dialog.showModal();
    setMessage(endpoint ? "" : "Secure account services are being configured. The login form will activate when the private backend is connected.");
    form.querySelector("button[type=submit]").disabled = !endpoint;
  });

  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  $("#auth-close")?.addEventListener("click", () => dialog.close());

  form?.addEventListener("submit", async event => {
    event.preventDefault();
    setMessage("Signing in…");
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    const values = new FormData(form);
    try {
      const result = await api("/api/collections/users/auth-with-password", {
        method:"POST",
        body:JSON.stringify({identity:values.get("email"), password:values.get("password")})
      });
      state.token = result.token;
      state.user = result.record;
      sessionStorage.setItem("bpc_auth_token", state.token);
      await loadMemberships();
      dialog.close();
      form.reset();
      renderAccount();
    } catch (error) {
      setMessage(error.message, "error");
    } finally {
      submit.disabled = !endpoint;
    }
  });

  restoreSession();
})();