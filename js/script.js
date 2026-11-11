/* =========================================
   INIKORE® — MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------------
       BASIC HELPERS
    ------------------------------------- */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* -------------------------------------
       CURRENT YEAR
    ------------------------------------- */

    const currentYear = $("#currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================
       INIKORE DYNAMIC ISLAND
    ===================================== */

    const island = $("#koreIsland");
    const islandTrigger = $("#koreIslandTrigger");
    const guidePanel = $("#koreGuidePanel");
    const guideClose = $("#guideClose");

    const islandClock = $("#islandClock");
    const islandDate = $("#islandDate");

    const guideEyebrow = $("#guideEyebrow");
    const guideTitle = $("#guideTitle");
    const guideDescription = $("#guideDescription");
    const guideMessage = $("#guideMessage");
    const guideAction = $("#guideAction");

    let isIslandOpen = false;
    let thoughtIndex = 0;


    /* -------------------------------------
       LIVE CLOCK — 12 HOUR FORMAT
    ------------------------------------- */

    function updateIslandClock() {

        const now = new Date();

        if (islandClock) {

            islandClock.textContent =
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                });

        }

        if (islandDate) {

            islandDate.textContent =
                now.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short"
                }).toUpperCase();

        }

    }


    // Display immediately
    updateIslandClock();

    // Refresh the clock every second
    setInterval(updateIslandClock, 1000);


    /* -------------------------------------
       GUIDE CONTENT
    ------------------------------------- */

    const guideContent = {

        home: {
            eyebrow: "WELCOME TO INIKORE",
            title: "Ideas begin somewhere.",
            description: "An independent creative space for people who think differently and create freely.",
            message: "Start exploring.",
            action: "EXPLORE",
            link: "#about"
        },

        about: {
            eyebrow: "THE IDEA",
            title: "More than a portfolio.",
            description: "INIKORE brings together different minds, creative disciplines and perspectives.",
            message: "Understand our world.",
            action: "DISCOVER",
            link: "#discover"
        },

        work: {
            eyebrow: "SELECTED WORK",
            title: "Made with intention.",
            description: "Explore experiments, visual ideas and creative projects from the INIKORE universe.",
            message: "See what's possible.",
            action: "VIEW WORK",
            link: "#work"
        },

        discover: {
            eyebrow: "EXPLORE",
            title: "Find your direction.",
            description: "Different interests, different perspectives, one space for creative expression.",
            message: "Stay curious.",
            action: "CONNECT",
            link: "#contact"
        },

        manifesto: {
            eyebrow: "OUR PHILOSOPHY",
            title: "Create without permission.",
            description: "Think freely. Experiment endlessly. Make things that mean something.",
            message: "Think beyond limits.",
            action: "EXPLORE",
            link: "#work"
        },

        contact: {
            eyebrow: "MAKE SOMETHING",
            title: "Good ideas travel.",
            description: "Have something interesting in mind? Start a conversation with INIKORE.",
            message: "Let's connect.",
            action: "SAY HELLO",
            link: "mailto:hello@inikore.com"
        }

    };


    /* -------------------------------------
       CREATIVE THOUGHTS
    ------------------------------------- */

    const creativeThoughts = [
        "Stay curious.",
        "Make something meaningful.",
        "Think beyond the obvious.",
        "Ideas need room to grow.",
        "Create without permission.",
        "Different minds. Different directions.",
        "Keep exploring.",
        "Make your own rules."
    ];


    /* -------------------------------------
       UPDATE GUIDE CONTENT
    ------------------------------------- */

    function updateGuide(sectionName) {

        if (!island) return;

        const content =
            guideContent[sectionName] || guideContent.home;

        if (guideEyebrow) {
            guideEyebrow.textContent = content.eyebrow;
        }

        if (guideTitle) {
            guideTitle.textContent = content.title;
        }

        if (guideDescription) {
            guideDescription.textContent = content.description;
        }

        if (guideMessage) {
            guideMessage.textContent = content.message;
        }

        if (guideAction) {
            guideAction.textContent = content.action + " ↗";
            guideAction.href = content.link;
        }

    }


    /* -------------------------------------
       OPEN ISLAND
    ------------------------------------- */

    function openIsland() {

        if (!island || isIslandOpen) return;

        isIslandOpen = true;

        island.classList.add("expanded");

        if (islandTrigger) {
            islandTrigger.setAttribute("aria-expanded", "true");
        }

        if (guidePanel) {
            guidePanel.setAttribute("aria-hidden", "false");
            guidePanel.inert = false;
        }

    }


    /* -------------------------------------
       CLOSE ISLAND
    ------------------------------------- */

    function closeIsland() {

        if (!island || !isIslandOpen) return;

        isIslandOpen = false;

        island.classList.remove("expanded");

        if (islandTrigger) {
            islandTrigger.setAttribute("aria-expanded", "false");
        }

        if (guidePanel) {
            guidePanel.setAttribute("aria-hidden", "true");
            guidePanel.inert = true;
        }

    }


    /* -------------------------------------
       CLICK TO EXPAND / COLLAPSE
    ------------------------------------- */

    if (islandTrigger) {

        islandTrigger.addEventListener("click", () => {

            if (isIslandOpen) {
                closeIsland();
            } else {
                openIsland();
            }

        });

    }


    /* -------------------------------------
       CLOSE BUTTON
    ------------------------------------- */

    if (guideClose) {

        guideClose.addEventListener("click", (event) => {

            event.stopPropagation();

            closeIsland();

        });

    }


    /* -------------------------------------
       CLICK OUTSIDE TO CLOSE
    ------------------------------------- */

    document.addEventListener("click", (event) => {

        if (
            island &&
            isIslandOpen &&
            !island.contains(event.target)
        ) {

            closeIsland();

        }

    });


    /* -------------------------------------
       ESCAPE KEY TO CLOSE
    ------------------------------------- */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && isIslandOpen) {
            closeIsland();
        }

    });


    /* -------------------------------------
       GUIDE ACTION
    ------------------------------------- */

    if (guideAction) {

        guideAction.addEventListener("click", () => {

            closeIsland();

        });

    }


    /* -------------------------------------
       ROTATING CREATIVE THOUGHTS
    ------------------------------------- */

    setInterval(() => {

        thoughtIndex =
            (thoughtIndex + 1) % creativeThoughts.length;

        if (guideMessage) {

            guideMessage.style.opacity = "0";

            setTimeout(() => {

                guideMessage.textContent =
                    creativeThoughts[thoughtIndex];

                guideMessage.style.opacity = "1";

            }, 250);

        }

    }, 6500);


    /* -------------------------------------
       INITIAL GUIDE CONTENT
    ------------------------------------- */

    updateGuide("home");


    /* =====================================
       NAVIGATION
    ===================================== */

    const dockLinks = $$(".dock-link");

    const sections = dockLinks
        .map(link => $(link.getAttribute("href")))
        .filter(Boolean);


    /* -------------------------------------
       ACTIVE NAVIGATION
    ------------------------------------- */

    function setActiveLink(sectionId) {

        dockLinks.forEach(link => {

            const isActive =
                link.dataset.section === sectionId;

            link.classList.toggle("active", isActive);

        });

    }


    /* -------------------------------------
       DOCK CLICK NAVIGATION
    ------------------------------------- */

    dockLinks.forEach(link => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            const target = $(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            setActiveLink(link.dataset.section);

        });

    });


    /* =====================================
       SECTION OBSERVER
    ===================================== */

    const allGuideSections = [
        $("#home"),
        $("#about"),
        $("#work"),
        $("#discover"),
        $("#manifesto"),
        $("#contact")
    ].filter(Boolean);


    const sectionObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const sectionId = entry.target.id;

                // Update the bottom navigation only
                // when the section has a dock link.
                if (
                    dockLinks.some(
                        link => link.dataset.section === sectionId
                    )
                ) {

                    setActiveLink(sectionId);

                }

                // Update the Dynamic Island guide.
                updateGuide(sectionId);

            });

        },

        {
            root: null,
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }

    );


    allGuideSections.forEach(section => {

        sectionObserver.observe(section);

    });


    /* =====================================
       REVEAL ANIMATIONS
    ===================================== */

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================
       CONTACT FORM
    ===================================== */

    const contactForm = $("#contactForm");
    const formStatus = $("#formStatus");

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name = $("#name").value.trim();
            const email = $("#email").value.trim();
            const subject = $("#subject").value.trim();
            const message = $("#message").value.trim();


            if (!name || !email || !subject || !message) {

                if (formStatus) {

                    formStatus.textContent =
                        "Please complete all fields.";

                }

                return;

            }


            const mailSubject =
                encodeURIComponent(subject);

            const mailBody =
                encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                );


            const mailtoLink =
                `mailto:hello@inikore.com?subject=${mailSubject}&body=${mailBody}`;


            if (formStatus) {

                formStatus.textContent =
                    "Opening your email application...";

            }


            window.location.href = mailtoLink;

        });

    }


    /* =====================================
       COMING SOON LINKS
    ===================================== */

    $$('a[href="#coming-soon"]').forEach(link => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            const originalText =
                link.querySelector("h3");

            if (originalText) {

                const previousText =
                    originalText.textContent;

                originalText.textContent = "Coming Soon";

                setTimeout(() => {

                    originalText.textContent = previousText;

                }, 1800);

            }

        });

    });


});
/* =========================================
   INIKORE — INTERACTIVE DYNAMIC ISLAND
========================================= */

(() => {
    const island = document.getElementById("koreIsland");
    const trigger = document.getElementById("koreIslandTrigger");

    if (!island || !trigger) return;

    // Create message inside the pill
    const liveMessage = document.createElement("span");

    liveMessage.className = "island-live-message";
    liveMessage.setAttribute("aria-live", "polite");
    liveMessage.setAttribute("role", "status");

    trigger.appendChild(liveMessage);

    let messageTimer;

    function showMessage(text, duration = 3000) {
        clearTimeout(messageTimer);

        liveMessage.textContent = text;

        island.classList.add("message-active");

        messageTimer = setTimeout(() => {
            island.classList.remove("message-active");
        }, duration);
    }

    // Welcome message
    window.addEventListener("load", () => {
        setTimeout(() => {
            showMessage(
                "Welcome to INIKORE. Find an idea worth creating.",
                4000
            );
        }, 1200);
    });

    // Contextual messages
    const sectionMessages = {
        home: "Welcome back. Start exploring.",
        about: "Curious about us? Here's our story.",
        work: "Explore our creations. Find your inspiration.",
        discover: "Discover something new. Follow your curiosity.",
        contact: "Have an idea? Let's make it happen."
    };

    // Suggestions for other interactions
    const suggestions = [
        "Take a look at our creative work.",
        "Got an idea? We'd love to hear it.",
        "Explore. Experiment. Create something different.",
        "Your next inspiration might be one click away."
    ];

    let suggestionIndex = 0;

    document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const link = target.closest("a");
        const button = target.closest("button");

        // Island guide
        if (target.closest("#koreIslandTrigger")) {
            showMessage("Your little guide to the INIKORE universe.");
            return;
        }

        if (target.closest("#guideClose")) {
            showMessage("Keep exploring. Stay curious.");
            return;
        }

        // Navigation links
        if (link) {
            const href = link.getAttribute("href") || "";

            if (href.startsWith("#")) {
                const section = href.substring(1);

                if (sectionMessages[section]) {
                    showMessage(sectionMessages[section]);
                    return;
                }

                if (section === "coming-soon") {
                    showMessage("Something interesting is taking shape.");
                    return;
                }
            }

            // Creative projects
            if (
                link.closest(".work-card, .project-card, .project-item")
            ) {
                showMessage("Every creation has a story. Explore it.");
                return;
            }

            if (href.startsWith("mailto:")) {
                showMessage("Let's start a conversation.");
                return;
            }

            if (href && href !== "#") {
                showMessage("Opening something interesting...");
                return;
            }
        }

        // Buttons
        if (button) {
            if (button.type === "submit") {
                showMessage("Your idea is on its way.");
                return;
            }

            showMessage(suggestions[suggestionIndex]);

            suggestionIndex =
                (suggestionIndex + 1) % suggestions.length;

            return;
        }

        // Other interactive elements
        const interactive = target.closest(
            ".discipline-item, [role='button']"
        );

        if (interactive) {
            showMessage("Follow that curiosity. See where it leads.");
        }

    }, true);

    // Contact form feedback
    document.addEventListener("submit", (event) => {
        if (event.target.matches("form")) {
            showMessage("Thanks for sharing your idea with us.");
        }
    }, true);

})();