(() => {
  "use strict";
  const billing = window.BPC_CONFIG?.billing || {};
  const buttons = [...document.querySelectorAll("[data-billing-link]")];
  const status = document.querySelector("#billing-status");

  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  }

  let activeLinks = 0;
  buttons.forEach(button => {
    const key = button.dataset.billingLink;
    const url = safeUrl(billing[key]);
    if (!url) {
      button.disabled = true;
      button.title = "Secure checkout will activate after the payment account is connected.";
      return;
    }
    activeLinks += 1;
    button.addEventListener("click", () => window.location.assign(url));
  });

  if (status) {
    status.textContent = activeLinks === buttons.length ? "Secure billing connected" : "Awaiting payment links";
    status.classList.toggle("connected", activeLinks === buttons.length);
  }
})();