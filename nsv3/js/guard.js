(function () {

    "use strict";


    // ==========================================
    // NS TOOLKITS
    // LOGIN ACCESS GUARD
    // ==========================================


    // ==========================================
    // SESSION SETTINGS
    // ==========================================

    const SESSION_KEY =
        "nsToolkitUser";


    // 10 HOURS
    const SESSION_DURATION =
        10 * 60 * 60 * 1000;



    // ==========================================
    // LOGIN PAGE
    // ==========================================

    const LOGIN_PAGE =
        new URL(
            "/nsv3/index.html",
            window.location.href
        ).href;



    // ==========================================
    // GET SESSION
    // ==========================================

function getSavedSession() {

    /*
     * Read the persistent session created by auth.js.
     * This allows login to remain active after
     * closing and reopening the browser.
     */

    return localStorage.getItem(
        SESSION_KEY
    );

}



    // ==========================================
    // REMOVE SESSION
    // ==========================================

 function clearSession() {

    localStorage.removeItem(
        SESSION_KEY
    );

}



    // ==========================================
    // CHECK LOGIN
    // ==========================================

    function checkAuthentication() {

        const savedSession =
            getSavedSession();


        // --------------------------------------
        // NO SESSION
        // --------------------------------------

        if (!savedSession) {

            redirectToMainPage();

            return false;

        }


        let session;


        // --------------------------------------
        // READ SESSION
        // --------------------------------------

        try {

            session =
                JSON.parse(
                    savedSession
                );

        } catch (error) {

            console.error(
                "Invalid NS ToolKits session."
            );


            clearSession();

            redirectToMainPage();

            return false;

        }


        // --------------------------------------
        // BASIC SESSION VALIDATION
        // --------------------------------------

        if (
            !session ||
            typeof session !== "object" ||
            !session.username ||
            !session.loginTime ||
            !session.expirationTime
        ) {

            console.warn(
                "Incomplete NS ToolKits session."
            );


            clearSession();

            redirectToMainPage();

            return false;

        }


        // --------------------------------------
        // CONVERT VALUES TO NUMBERS
        // --------------------------------------

        const loginTime =
            Number(
                session.loginTime
            );

        const expirationTime =
            Number(
                session.expirationTime
            );


        // --------------------------------------
        // INVALID SESSION TIMES
        // --------------------------------------

        if (
            !Number.isFinite(loginTime) ||
            !Number.isFinite(expirationTime)
        ) {

            console.warn(
                "Invalid NS ToolKits session timestamps."
            );


            clearSession();

            redirectToMainPage();

            return false;

        }


        // --------------------------------------
        // MAKE SURE EXPIRATION IS AFTER LOGIN
        // --------------------------------------

        if (
            expirationTime <=
            loginTime
        ) {

            console.warn(
                "Invalid NS ToolKits expiration time."
            );


            clearSession();

            redirectToMainPage();

            return false;

        }


        // --------------------------------------
        // OPTIONAL SAFETY CHECK
        // --------------------------------------
        //
        // The session should be approximately
        // 10 hours long.
        //
        // We allow a small tolerance instead of
        // rejecting a legitimate session because
        // of a minor timestamp difference.
        //

        const sessionLength =
            expirationTime -
            loginTime;

        const tolerance =
            60 * 1000;


        if (
            sessionLength >
            SESSION_DURATION + tolerance
        ) {

            console.warn(
                "Invalid NS ToolKits session duration."
            );


            clearSession();

            redirectToMainPage();

            return false;

        }


        // --------------------------------------
        // CHECK EXPIRATION
        // --------------------------------------

        const now =
            Date.now();


        if (
            now >=
            expirationTime
        ) {

            console.log(
                "NS ToolKits session expired."
            );


            clearSession();

            redirectToMainPage();

            return false;

        }


        // --------------------------------------
        // SESSION IS VALID
        // --------------------------------------

        return true;

    }



    // ==========================================
    // REDIRECT TO LOGIN
    // ==========================================

    function redirectToMainPage() {

        const currentPath =
            window.location.pathname;


        const loginPath =
            new URL(
                "/nsv3/index.html",
                window.location.href
            ).pathname;


        // --------------------------------------
        // ALREADY ON LOGIN PAGE
        // --------------------------------------

        if (
            currentPath ===
                loginPath ||

            currentPath.endsWith(
                "/nsv3/index.html"
            )
        ) {

            return;

        }


        // --------------------------------------
        // REDIRECT
        // --------------------------------------

        window.location.replace(
            LOGIN_PAGE
        );

    }



    // ==========================================
    // CHECK IMMEDIATELY
    // ==========================================

    checkAuthentication();



    // ==========================================
    // CHECK WHEN TAB BECOMES ACTIVE
    // ==========================================

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                checkAuthentication();

            }

        }
    );



    // ==========================================
    // CHECK WHEN WINDOW GETS FOCUS
    // ==========================================

    window.addEventListener(
        "focus",
        function () {

            checkAuthentication();

        }
    );



    // ==========================================
    // PERIODIC SESSION CHECK
    // ==========================================

    const SESSION_CHECK_INTERVAL =
        60 * 1000;


    setInterval(
        function () {

            checkAuthentication();

        },
        SESSION_CHECK_INTERVAL
    );


    // ==========================================
    // 60-MINUTE INACTIVITY TIMEOUT
    // ==========================================

    const INACTIVITY_LIMIT =
        60 * 60 * 1000;

    const LAST_ACTIVITY_KEY =
        "nsToolkitLastActivity";


    // Record user activity
    function recordUserActivity() {

        if (!getSavedSession()) {
            return;
        }

        const now = Date.now();

        const lastActivity = Number(
            localStorage.getItem(LAST_ACTIVITY_KEY)
        );

        // Update at most once every 30 seconds
        // to avoid excessive localStorage writes.
        if (
            !Number.isFinite(lastActivity) ||
            now - lastActivity >= 30 * 1000
        ) {
            localStorage.setItem(
                LAST_ACTIVITY_KEY,
                String(now)
            );
        }
    }


    // Check whether the user has been inactive
    function checkInactivity() {

        if (!getSavedSession()) {
            return;
        }

        const now = Date.now();

        let lastActivity = Number(
            localStorage.getItem(LAST_ACTIVITY_KEY)
        );

        // Initialize the timer for existing sessions
        // that do not have an activity timestamp yet.
        if (
            !Number.isFinite(lastActivity) ||
            lastActivity <= 0
        ) {
            localStorage.setItem(
                LAST_ACTIVITY_KEY,
                String(now)
            );

            return;
        }

        // Log out after 60 minutes without activity.
        if (
            now - lastActivity >= INACTIVITY_LIMIT
        ) {
            clearSession();

            localStorage.removeItem(
                LAST_ACTIVITY_KEY
            );

            redirectToMainPage();
        }
    }


    // Activities that reset the inactivity timer
    [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click"
    ].forEach(function (eventName) {

        document.addEventListener(
            eventName,
            recordUserActivity,
            { passive: true }
        );

    });


    // Check inactivity periodically
    setInterval(
        checkInactivity,
        60 * 1000
    );


    // Check again when the user returns to the tab
    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState === "visible"
            ) {
                checkInactivity();
            }

        }
    );


    // Sync activity between tabs using the same origin
    window.addEventListener(
        "storage",
        function (event) {

            if (event.key === LAST_ACTIVITY_KEY) {
                checkInactivity();
            }

        }
    );


    // Initialize activity tracking for an existing session
    if (getSavedSession()) {

        const existingActivity = Number(
            localStorage.getItem(LAST_ACTIVITY_KEY)
        );

        if (
            !Number.isFinite(existingActivity) ||
            existingActivity <= 0
        ) {
            localStorage.setItem(
                LAST_ACTIVITY_KEY,
                String(Date.now())
            );
        }

    }


    // ==========================================
    // GLOBAL FUNCTION
    // ==========================================

    window.nsCheckAuthentication =
        checkAuthentication;


})();
