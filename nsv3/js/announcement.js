
(function () {
  "use strict";

  // ==========================================
  // NS TOOLKITS ANNOUNCEMENT SETTINGS
  // ==========================================

  const STORAGE_KEY = "nsAnnouncementLastShown";
  const TEN_HOURS = 10 * 60 * 60 * 1000;

  const scriptElement = document.currentScript;
  const scriptURL = scriptElement
    ? scriptElement.src
    : window.location.href;

  const POPUP_URL = new URL(
    "../announcement.html",
    scriptURL
  ).href;

  let initialized = false;
  let loadingPromise = null;
  let forceAfterLoad = false;

  function getOverlay() {
    return document.getElementById("nsAnnouncementOverlay");
  }

  function isVisible() {
    const overlay = getOverlay();
    return !!overlay && !overlay.classList.contains("ns-hidden");
  }

  function closeAnnouncement() {
    const overlay = getOverlay();

    if (overlay) {
      overlay.classList.add("ns-hidden");
    }
  }

  function showAnnouncement(force) {
    const overlay = getOverlay();

    // If the popup HTML has not loaded yet, queue the request.
    if (!overlay) {
      if (force) {
        forceAfterLoad = true;
        loadAnnouncement();
      }
      return;
    }

    if (isVisible()) return;

    let lastShown = 0;

    try {
      lastShown =
        Number(localStorage.getItem(STORAGE_KEY)) || 0;
    } catch (error) {
      console.warn("Announcement storage unavailable:", error);
    }

    const now = Date.now();

    if (
      force ||
      !lastShown ||
      now - lastShown >= TEN_HOURS
    ) {
      overlay.classList.remove("ns-hidden");

      try {
        localStorage.setItem(STORAGE_KEY, String(now));
      } catch (error) {
        console.warn("Could not save announcement time:", error);
      }
    }
  }

  function initializeAnnouncement() {
    if (initialized) return;

    const overlay = getOverlay();
    const closeButton = document.getElementById(
      "nsAnnouncementClose"
    );
    const okButton = document.getElementById(
      "nsAnnouncementOk"
    );

    if (!overlay || !closeButton || !okButton) {
      console.error(
        "Announcement initialization failed: required popup elements are missing."
      );
      return;
    }

    initialized = true;

    closeButton.addEventListener("click", closeAnnouncement);
    okButton.addEventListener("click", closeAnnouncement);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeAnnouncement();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isVisible()) {
        closeAnnouncement();
      }
    });

    // A login request takes priority over the 10-hour timer.
    if (forceAfterLoad) {
      forceAfterLoad = false;
      showAnnouncement(true);
    } else {
      showAnnouncement(false);
    }
  }

  // ==========================================
  // PUBLIC FUNCTION: CALL AFTER SUCCESSFUL LOGIN
  // ==========================================

  window.nsShowAnnouncement = function () {
    // ==========================================
// SHOW ANNOUNCEMENT AFTER SUCCESSFUL LOGIN
// ==========================================

function handleNSLoginSuccess() {
  console.log("[NS Announcement] Login success detected.");

  // Wait until the popup HTML is available.
  if (typeof window.nsShowAnnouncement === "function") {
    window.nsShowAnnouncement();
  }
}

// Support the login event whether it is dispatched on
// window or document.
window.addEventListener(
  "nsLoginSuccess",
  handleNSLoginSuccess
);

document.addEventListener(
  "nsLoginSuccess",
  handleNSLoginSuccess
);
    console.log("[NS Announcement] Login display requested.");

    const overlay = getOverlay();

    if (overlay) {
      showAnnouncement(true);
    } else {
      forceAfterLoad = true;

      loadAnnouncement().then(function () {
        if (forceAfterLoad && getOverlay()) {
          forceAfterLoad = false;
          showAnnouncement(true);
        }
      });
    }
  };

  // ==========================================
  // LOAD ANNOUNCEMENT HTML AND CSS
  // ==========================================

  function loadAnnouncement() {
    if (getOverlay()) {
      initializeAnnouncement();
      return Promise.resolve();
    }

    // Prevent multiple simultaneous fetches.
    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = fetch(POPUP_URL, {
      cache: "no-cache"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "Could not load announcement.html: HTTP " +
            response.status
          );
        }

        return response.text();
      })
      .then(function (html) {
        const template = document.createElement("template");
        template.innerHTML = html;

        // Insert popup CSS into the current page.
        template.content.querySelectorAll("style").forEach(
          function (style) {
            document.head.appendChild(style.cloneNode(true));
          }
        );

        const overlay = template.content.querySelector(
          "#nsAnnouncementOverlay"
        );

        if (!overlay) {
          throw new Error(
            "Could not find #nsAnnouncementOverlay in announcement.html"
          );
        }

        document.body.appendChild(overlay);

        initializeAnnouncement();

        // Display if a login request arrived during loading.
        if (forceAfterLoad) {
          forceAfterLoad = false;
          showAnnouncement(true);
        }
      })
      .catch(function (error) {
        console.error(
          "[NS Announcement] Failed to load:",
          error
        );

        // Allow another attempt later.
        loadingPromise = null;
      });

    return loadingPromise;
  }

  // Load after the page DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      loadAnnouncement,
      { once: true }
    );
  } else {
    loadAnnouncement();
  }
})();
