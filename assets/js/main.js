const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("siteHeader");
const scrollProgress = document.getElementById("scrollProgress");
const typedRole = document.getElementById("typedRole");
const navItems = document.querySelectorAll(".nav-links a[href^='#']");
const sections = document.querySelectorAll("main section[id]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const updateScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
};

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveNav();
  updateScrollProgress();
}, { passive: true });

window.addEventListener("resize", updateScrollProgress);

updateHeader();
updateActiveNav();
updateScrollProgress();

const startTypingRoles = () => {
  if (!typedRole) {
    return;
  }

  const roles = typedRole.dataset.roles
    ? typedRole.dataset.roles.split("|").filter(Boolean)
    : [];

  if (!roles.length) {
    return;
  }

  if (prefersReducedMotion) {
    typedRole.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeNext = () => {
    const currentRole = roles[roleIndex];
    const visibleText = currentRole.slice(0, charIndex);

    typedRole.textContent = visibleText;

    if (!isDeleting && charIndex < currentRole.length) {
      charIndex += 1;
      window.setTimeout(typeNext, 74);
      return;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      window.setTimeout(typeNext, 1450);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(typeNext, 38);
      return;
    }

    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    window.setTimeout(typeNext, 260);
  };

  typeNext();
};

startTypingRoles();

const revealItems = document.querySelectorAll(
  ".section-title, .about-content, .highlight-card, .skill-card, .certification-card, .project-card, .service-card, .contact-card"
);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");

    if (item.classList.contains("about-content") || item.classList.contains("contact-card")) {
      item.classList.add("reveal-left");
    } else if (item.classList.contains("highlight-card")) {
      item.classList.add("reveal-right");
    } else if (
      item.classList.contains("skill-card") ||
      item.classList.contains("certification-card") ||
      item.classList.contains("project-card") ||
      item.classList.contains("service-card")
    ) {
      item.classList.add(index % 2 === 0 ? "reveal-zoom" : "reveal-right");
    }
  });

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
