import React from "react";
import { createRoot } from "react-dom/client";
import ContentApp from "./ContentApp";
import cssText from "./index.css?inline";

// Inject a flag into the DOM so the website knows the extension is installed
document.documentElement.setAttribute('data-leetmentor-installed', 'true');
const manifest = chrome.runtime.getManifest();
document.documentElement.setAttribute('data-leetmentor-version', manifest.version);

// Listen for messages from the Web App and forward to background
window.addEventListener("message", (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;

  if (event.data && event.data.type === 'LEETMENTOR_SETTINGS_UPDATE') {
    chrome.runtime.sendMessage({
      type: "SYNC_SETTINGS",
      payload: event.data.payload
    });
  }
});

// Create a host element
const host = document.createElement("div");
host.id = "leetmentor-extension-root";
// Ensure host itself takes up the screen so fixed children work
host.style.position = "fixed";
host.style.top = "0";
host.style.left = "0";
host.style.width = "100%";
host.style.height = "100%";
host.style.zIndex = "9999999";
host.style.pointerEvents = "none";
document.body.appendChild(host);

// Create Shadow DOM
const shadowRoot = host.attachShadow({ mode: "open" });

// Inject Tailwind CSS into Shadow DOM
const style = document.createElement("style");
style.textContent = cssText;
shadowRoot.appendChild(style);

// Render the React app directly into the shadow root
const root = createRoot(shadowRoot);
root.render(
  <React.StrictMode>
    <ContentApp />
  </React.StrictMode>
);
