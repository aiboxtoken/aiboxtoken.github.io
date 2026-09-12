(function () {
  if (document.querySelector(".line-contact-float")) return;

  const style = document.createElement("style");
  style.textContent = `
    .line-contact-float{position:fixed;right:20px;bottom:20px;z-index:999;display:inline-flex;align-items:center;gap:9px;min-height:52px;padding:0 18px;border:1px solid rgba(255,255,255,.3);border-radius:999px;background:#06c755;color:#fff;font:800 14px/1 Inter,sans-serif;text-decoration:none;box-shadow:0 14px 34px rgba(6,199,85,.32);transition:transform .2s ease,box-shadow .2s ease}
    .line-contact-float:hover{transform:translateY(-3px);box-shadow:0 18px 42px rgba(6,199,85,.42)}
    .line-contact-float svg{width:25px;height:25px;flex:0 0 auto}
    @media(max-width:560px){.line-contact-float{right:14px;bottom:14px;min-height:48px;padding:0 15px}}
  `;
  document.head.appendChild(style);

  const button = document.createElement("a");
  button.className = "line-contact-float";
  button.href = "https://line.me/R/ti/p/%40544tyfsq";
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.setAttribute("aria-label", "Chat with AiBox Tech Solutions on LINE");
  button.innerHTML =
    '<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="#fff"/><path fill="#06c755" d="M29.8 16.8c0-5.3-5.3-9.6-11.8-9.6S6.2 11.5 6.2 16.8c0 4.8 4.3 8.8 10.1 9.5.4.1.9.3 1 .7.1.4.1.9 0 1.3l-.2 1.2c-.1.4-.3 1.5 1.3.8 1.6-.7 8.7-5.1 11.8-8.8 2.1-2.3 3-4.7 3-4.7h-3.4Z"/><text x="18" y="20.7" text-anchor="middle" font-family="Arial,sans-serif" font-size="6.4" font-weight="700" fill="#fff">LINE</text></svg><span>Chat on LINE</span>';
  document.body.appendChild(button);
})();
