
(function () {
  "use strict";

  // ==========================================
  // NS TOOLKITS ANNOUNCEMENT SETTINGS
  // ==========================================

  const STORAGE_KEY = "nsAnnouncementLastShown";
  const TEN_HOURS = 10 * 60 * 60 * 1000;

  // Resolve announcement.html relative to this JS file.
  const currentScript =
    document.currentScript ||
    document.querySelector('script[src*="announcement.js"]');

  if (!currentScript) {
    console.error("[NS Announcement] announcement.js script tag not found.");
    return;
  }

  const POPUP_URL = new URL(
    "../announcement.html",
    currentScript.src
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
      lastShown = Number(
        localStorage.getItem(STORAGE_KEY)
      ) || 0;
    } catch (error) {
      console.warn("[NS Announcement] Storage unavailable:", error);
    }

    const now = Date.now();

    if (force || !lastShown || now - lastShown >= TEN_HOURS) {
      overlay.classList.remove("ns-hidden");

      try {
        localStorage.setItem(STORAGE_KEY, String(now));
      } catch (error) {
        console.warn("[NS Announcement] Could not save display time:", error);
      }
    }
  }

  function initializeAnnouncement() {
    if (initialized) return;

    const overlay = getOverlay();
    const closeButton = document.getElementById("nsAnnouncementClose");
    const okButton = document.getElementById("nsAnnouncementOk");

    if (!overlay || !closeButton || !okButton) {
      console.error("[NS Announcement] Popup elements are missing.");
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

    // Login-triggered display takes priority.
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
    console.log("[NS Announcement] Display requested.");

    if (getOverlay()) {
      showAnnouncement(true);
      return;
    }

    forceAfterLoad = true;

    loadAnnouncement();
  };

  // ==========================================
  // LOGIN SUCCESS EVENT LISTENERS
  // These must be OUTSIDE nsShowAnnouncement().
  // ==========================================

  function handleLoginSuccess() {
    console.log("[NS Announcement] Login success event received.");
    window.nsShowAnnouncement();
  }

  window.addEventListener("nsLoginSuccess", handleLoginSuccess);
  document.addEventListener("nsLoginSuccess", handleLoginSuccess);

  // ==========================================
  // LOAD ANNOUNCEMENT HTML AND CSS
  // ==========================================

  function loadAnnouncement() {
    if (getOverlay()) {
      initializeAnnouncement();
      return Promise.resolve();
    }

    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = fetch(POPUP_URL, {
      cache: "no-cache"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "announcement.html returned HTTP " + response.status +
            ". URL: " + POPUP_URL
          );
        }

        return response.text();
      })
      .then(function (html) {
        const template = document.createElement("template");
        template.innerHTML = html;

        // Add popup styles to the document.
        template.content.querySelectorAll("style").forEach(function (style) {
          document.head.appendChild(style.cloneNode(true));
        });

        const overlay = template.content.querySelector(
          "#nsAnnouncementOverlay"
        );

        if (!overlay) {
          throw new Error(
            "Could not find #nsAnnouncementOverlay in " + POPUP_URL
          );
        }

        document.body.appendChild(overlay);

        initializeAnnouncement();

        // Show if login was requested while loading.
        if (forceAfterLoad) {
          forceAfterLoad = false;
          showAnnouncement(true);
        }
      })
      .catch(function (error) {
        console.error("[NS Announcement] Failed to load:", error);
        loadingPromise = null;
      });

    return loadingPromise;
  }

  // Load the popup when the page is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAnnouncement, {
      once: true
    });
  } else {
    loadAnnouncement();
  }
})();
