"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Scrolling

btnScrollTo.addEventListener("click", function (e) {
  const s1__coordinates = section1.getBoundingClientRect();
  console.log(s1__coordinates);

  console.log(e.target.getBoundingClientRect());

  console.log("Current scroll (X/Y)", window.scrollX, window.scrollY);

  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1__coordinates.left + window.pageXOffset,
  //   s1__coordinates.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1__coordinates.left + window.pageXOffset,
  //   top: s1__coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// }); this is WRONG, we could have 100 elements with 100 event listeners and that will affect the performance
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach(function (tab) {
    tab.classList.remove("operations__tab--active");
  });
  clicked.classList.add("operations__tab--active");

  // remove active contents
  console.log(clicked.dataset.tab);
  tabsContent.forEach(function (tabContent) {
    tabContent.classList.remove("operations__content--active");
  });
  // activate clicked tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// }); we can do this with bind

// passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation

// const initStickyNavCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > initStickyNavCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// }); WRONG WAY, BAD PERFORMANCE CAUSE SCROLL LISTENER

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => console.log(entry));
// };

// const obsOptions = {
//   root: null, // null because we are observing in the viewport
//   threshold: [0, 0.2], // when intersection (when we can see) 10% of the element for example
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting) {
    nav.classList.remove("sticky");
  } else {
    nav.classList.add("sticky");
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // execute function 90 px before the threshold is reached.
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target); // remove observer for every section after reaching the threshold
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");
const loadImage = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  // replace src with data-src of the <img>
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = (function () {
  const slides = document.querySelectorAll(".slide");

  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let currentSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector(".slider");
  // slider.style.transform = "scale(0.4) translateX(-800px)";
  // slider.style.overflow = "visible";

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`) // 0%, 100%, 200%...
    );
    activateDot(slide);
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };
  init();

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      currentSlide = +e.target.dataset.slide; //extracted from dot button property
      goToSlide(currentSlide);
    }
  });
})();
