
(function () {
  "use strict";

  // ==========================================
  // NS TOOLKITS ANNOUNCEMENT SETTINGS
  // ==========================================

  const STORAGE_KEY = "nsAnnouncementLastShown";
  const TEN_HOURS = 10 * 60 * 60 * 1000;

  const POPUP_URL = new URL(
    "../announcement.html",
    document.currentScript.src
  ).href;

  let initialized = false;

  function getOverlay() {
    return document.getElementById("nsAnnouncementOverlay");
  }

  function isVisible() {
    const overlay = getOverlay();
    return overlay && !overlay.classList.contains("ns-hidden");
  }

  function closeAnnouncement() {
    const overlay = getOverlay();

    if (overlay) {
      overlay.classList.add("ns-hidden");
    }
  }

  function showAnnouncement(force) {
    const overlay = getOverlay();

    if (!overlay || isVisible()) return;

    let lastShown = 0;

    try {
      lastShown = Number(
        localStorage.getItem(STORAGE_KEY)
      ) || 0;
    } catch (error) {
      console.warn("Announcement storage unavailable:", error);
    }

    const now = Date.now();

    // Force display after every successful login.
    // Otherwise, show on first visit or after 10 hours.
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
    const closeButton = document.getElementById("nsAnnouncementClose");
    const okButton = document.getElementById("nsAnnouncementOk");

    if (!overlay || !closeButton || !okButton) return;

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

    // Automatic display for first visit or when 10 hours have elapsed.
    showAnnouncement(false);
  }

  // ==========================================
  // SHOW AFTER EVERY SUCCESSFUL LOGIN
  // ==========================================

  window.nsShowAnnouncement = function () {
    showAnnouncement(true);
  };

  async function loadAnnouncement() {
    if (getOverlay()) {
      initializeAnnouncement();
      return;
    }

    try {
      const response = await fetch(POPUP_URL, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(
          "Could not load announcement.html: " + response.status
        );
      }

      const html = await response.text();
      const template = document.createElement("template");

      template.innerHTML = html;

      // Add popup CSS to the page.
      template.content.querySelectorAll("style").forEach(function (style) {
        document.head.appendChild(style.cloneNode(true));
      });

      // Add the popup HTML to the page.
      const overlay = template.content.querySelector(
        "#nsAnnouncementOverlay"
      );

      if (!overlay) {
        throw new Error(
          "Announcement overlay was not found in announcement.html"
        );
      }

      document.body.appendChild(overlay);

      initializeAnnouncement();

    } catch (error) {
      console.error("NS Toolkits announcement failed to load:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAnnouncement, {
      once: true
    });
  } else {
    loadAnnouncement();
  }
})();
