const API_BASE = "https://leetmentor-ltjj.onrender.com/api";

chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetMentor Extension Installed");
});

async function getAuthToken() {
  return new Promise((resolve) => {
    // 1. Check extension storage first (Native Login)
    chrome.storage.local.get(['leetai_token'], (result) => {
      if (result.leetai_token) {
        return resolve(result.leetai_token);
      }
      // 2. Fallback to cookies (Website Login sync)
      chrome.cookies.getAll({ name: "leetai_token" }, (cookies: any) => {
        const token = cookies.find((c: any) => c.domain.includes("localhost") || c.domain === "127.0.0.1");
        resolve(token ? token.value : null);
      });
    });
  });
}

// Listener to handle messages from the content script
chrome.runtime.onMessage.addListener((request: any, _sender: any, sendResponse: any) => {
  if (request.type === "FETCH_API") {
    handleApiRequest(request).then(sendResponse).catch(err => {
      sendResponse({ success: false, error: err.message });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.type === "SYNC_SETTINGS") {
    chrome.storage.local.set({ leetmentor_settings: request.payload }, () => {
      console.log("LeetMentor settings synchronized with Web App:", request.payload);
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.type === "LAUNCH_WEB_AUTH_FLOW") {
    chrome.identity.launchWebAuthFlow(
      { url: request.url, interactive: true },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true, redirectUrl });
        }
      }
    );
    return true; // Keep channel open for async response
  }
});

async function handleApiRequest(request: any) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated. Please log into the LeetAI website.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const options: RequestInit = {
    method: request.method || "GET",
    headers
  };

  if (request.body) {
    options.body = JSON.stringify(request.body);
  }

  try {
    const response = await fetch(`${API_BASE}${request.endpoint}`, options);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
