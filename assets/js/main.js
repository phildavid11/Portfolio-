const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("siteHeader");
const navItems = document.querySelectorAll(".nav-links a[href^='#']");
const sections = document.querySelectorAll("main section[id]");

if (menuBtn && navLinks) {
  const syncMenuButton = () => {
    const isMobile = window.innerWidth <= 760;

    menuBtn.style.display = isMobile ? "inline-flex" : "none";
    menuBtn.style.position = isMobile ? "fixed" : "";
    menuBtn.style.top = isMobile ? "12px" : "";
    menuBtn.style.right = isMobile ? "4%" : "";
    menuBtn.style.width = isMobile ? "44px" : "";
    menuBtn.style.height = isMobile ? "44px" : "";
    menuBtn.style.zIndex = isMobile ? "1001" : "";
    menuBtn.style.background = isMobile ? "#37d5c5" : "";
    menuBtn.style.border = isMobile ? "1px solid #37d5c5" : "";
    menuBtn.style.borderRadius = isMobile ? "8px" : "";
    menuBtn.style.boxShadow = isMobile ? "0 12px 28px rgba(55, 213, 197, 0.18)" : "";

    menuBtn.querySelectorAll("span").forEach(span => {
      span.style.display = isMobile ? "block" : "";
      span.style.width = isMobile ? "22px" : "";
      span.style.height = isMobile ? "2px" : "";
      span.style.background = isMobile ? "#07100f" : "";
      span.style.borderRadius = isMobile ? "2px" : "";
    });
  };

  syncMenuButton();
  window.addEventListener("resize", syncMenuButton);

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuBtn.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  navItems.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

const updateHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 16);
};

const updateActiveNav = () => {
  let activeSection = "home";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 130;

    if (window.scrollY >= sectionTop) {
      activeSection = section.id;
    }
  });

  navItems.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${activeSection}`
    );
  });
};

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveNav();
}, { passive: true });

updateHeader();
updateActiveNav();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(
  ".section-title, .about-content, .highlight-card, .skill-card, .certification-card, .project-card, .service-card, .contact-card"
);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  revealItems.forEach(item => item.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px"
  });

  revealItems.forEach(item => revealObserver.observe(item));
}
