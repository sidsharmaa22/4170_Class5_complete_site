const events = [
  {
    id: "cafe-cursor",
    title: "Cafe Cursor New York City",
    dateLabel: "Today, 10:00 AM",
    dateLong: "Wednesday, August 12",
    time: "10:00 AM – 6:00 PM",
    location: "",
    area: "Brooklyn, New York",
    hostName: "Cursor New York, US",
    description: "A day to meet other Cursor users, work alongside the community, and ask the team questions.",
    attendeeCount: 120,
    image: "assets/images/cafe-cursor.avif",
    live: true,
  },
  {
    id: "startup-founders",
    title: "Startup founders happy hour w/ Merge & Corgi",
    dateLabel: "Today, 6:00 PM",
    dateLong: "Wednesday, August 12",
    time: "6:00 PM – 8:00 PM",
    location: "",
    area: "New York, New York",
    hostName: "Merge + Corgi",
    description: "An informal evening for startup founders to meet, compare notes, and build new connections.",
    attendeeCount: 86,
    image: "assets/images/startup-founders.avif",
  },
  {
    id: "steel-silicon",
    title: "Steel & Silicon: NYC Edition",
    dateLabel: "Today, 7:00 PM",
    dateLong: "Wednesday, August 12",
    time: "7:00 PM – 9:00 PM",
    location: "",
    area: "New York, New York",
    hostName: "Steel & Silicon",
    description: "A gathering for people building at the intersection of industry, technology, and New York's startup community.",
    attendeeCount: 74,
    image: "assets/images/steel-silicon.avif",
  },
  {
    id: "creative-edge",
    title: "The creative edge",
    dateLabel: "Tomorrow, 5:30 PM",
    dateLong: "Thursday, August 13",
    time: "5:30 PM – 7:30 PM",
    location: "",
    area: "New York, New York",
    hostName: "Contra Labs + Worklife",
    description: "A conversation about creative practice, professional judgment, and the work behind strong ideas.",
    attendeeCount: 64,
    image: "assets/images/creative-edge.avif",
  },
  {
    id: "mama-nyc",
    title: "Mama in NYC!",
    dateLabel: "Sat, Aug 15, 1:00 PM",
    dateLong: "Saturday, August 15",
    time: "1:00 PM – 4:00 PM",
    location: "Awake NY",
    area: "New York, New York",
    hostName: "Awake NY",
    description: "A community gathering in New York with music, conversation, and a relaxed afternoon atmosphere.",
    attendeeCount: 93,
    image: "assets/images/mama-nyc.avif",
  },
  {
    id: "agentics",
    title: "Agentics: Use Agents Effectively",
    dateLabel: "Wed, Aug 19, 6:00 PM",
    dateLong: "Wednesday, August 19",
    time: "6:00 PM – 8:00 PM",
    location: "",
    area: "New York, New York",
    hostName: "Agentics",
    description: "A practical session about choosing, directing, and evaluating agents effectively.",
    attendeeCount: 108,
    image: "assets/images/agentics.avif",
  },
];

const categories = [
  { name: "Tech", count: "4K Events", icon: "assets/images/tech-icon.png" },
  { name: "Food & Drink", count: "539 Events", icon: "assets/images/food-icon.png" },
  { name: "AI", count: "3K Events", icon: "assets/images/ai-icon.png" },
  { name: "Arts & Culture", count: "2K Events", icon: "assets/images/arts-icon.png" },
  { name: "Climate", count: "674 Events", icon: "assets/images/climate-icon.png" },
  { name: "Fitness", count: "2K Events", icon: "assets/images/fitness-icon.png" },
  { name: "Wellness", count: "1K Events", icon: "assets/images/wellness-icon.png" },
  { name: "Crypto", count: "613 Events", icon: "assets/images/crypto-icon.png" },
];

const state = {
  savedIds: new Set(JSON.parse(localStorage.getItem("luma-teaching-saved") || "[]")),
  rsvps: JSON.parse(localStorage.getItem("luma-teaching-rsvps") || "{}"),
};

const app = document.querySelector("#app");
const statusMessage = document.querySelector("#status-message");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function announce(message) {
  statusMessage.textContent = "";
  window.setTimeout(() => { statusMessage.textContent = message; }, 20);
}

function saveState() {
  localStorage.setItem("luma-teaching-saved", JSON.stringify([...state.savedIds]));
  localStorage.setItem("luma-teaching-rsvps", JSON.stringify(state.rsvps));
}

function updateClock() {
  document.querySelector("#current-time").textContent = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(new Date());
}

function eventCard(event) {
  return `
    <article class="event-card">
      <a class="event-link" href="#event/${event.id}" aria-label="View ${escapeHtml(event.title)}"></a>
      <img class="event-cover" src="${event.image}" alt="Cover image for ${escapeHtml(event.title)}" width="80" height="80" />
      <div class="event-copy">
        <p class="event-time">${escapeHtml(event.dateLabel)}</p>
        <h3 class="event-title">${escapeHtml(event.title)}</h3>
        ${event.location ? `<p class="event-location">${escapeHtml(event.location)}</p>` : ""}
      </div>
      ${event.live ? `<span class="event-live">LIVE</span>` : ""}
    </article>`;
}

function categoryCard(category) {
  return `<a class="category-card" href="#discover">
    <img src="${category.icon}" alt="" width="24" height="24" />
    <span><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(category.count)}</small></span>
  </a>`;
}

function setCurrentNav(view) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === view) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderDiscover() {
  setCurrentNav("discover");
  app.innerHTML = `
    <section aria-labelledby="discover-title">
      <div class="discover-header"><h1 class="page-heading" id="discover-title" tabindex="-1">Discover Events</h1></div>
      <div class="discover-description"><p>Explore popular events near you, browse by category, or check out some of the great community calendars.</p></div>
      <div class="discover-content">
        <div class="section-heading-row">
          <div><h2>Popular Events</h2><p>New York</p></div>
          <a class="view-all" href="#discover">View All
            <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
        <div class="event-scroll"><div class="event-grid">${events.map(eventCard).join("")}</div></div>
        <section class="category-section" aria-labelledby="category-title">
          <h2 id="category-title">Browse by Category</h2>
          <div class="category-grid">${categories.map(categoryCard).join("")}</div>
        </section>
      </div>
    </section>`;
}

function renderMyEvents() {
  setCurrentNav("");
  const selected = events.filter((event) => state.savedIds.has(event.id) || state.rsvps[event.id]);
  app.innerHTML = `
    <section class="standard-page" aria-labelledby="my-events-title">
      <h1 class="page-heading" id="my-events-title" tabindex="-1">My Events</h1>
      <p class="page-intro">Events you saved or registered for appear here.</p>
      ${selected.length
        ? `<div class="event-grid">${selected.map(eventCard).join("")}</div>`
        : `<div class="empty-state"><h2>Nothing saved yet</h2><p>Complete an RSVP and it will appear here.</p><a class="secondary-button" href="#discover">Discover events</a></div>`}
    </section>`;
}

function rsvpMarkup(event) {
  const existing = state.rsvps[event.id];
  if (existing) {
    return `<div class="confirmation" role="status"><strong>You're registered.</strong><p>${escapeHtml(existing.name)}, we saved ${existing.guests} ${existing.guests === 1 ? "place" : "places"}.</p><button class="secondary-button" type="button" data-cancel-rsvp="${event.id}">Cancel RSVP</button></div>`;
  }
  return `
    <p>Reserve a free place. Use fictional information in this teaching build.</p>
    <form class="rsvp-form" data-rsvp-form="${event.id}" novalidate>
      <div class="form-row">
        <div class="field"><label for="rsvp-name">Name</label><input id="rsvp-name" name="name" autocomplete="name" required aria-describedby="rsvp-error" /></div>
        <div class="field"><label for="rsvp-guests">Places</label><select id="rsvp-guests" name="guests"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>
      </div>
      <p class="form-error" id="rsvp-error" role="alert" hidden>Please enter your name.</p>
      <button class="primary-button" type="submit">Confirm RSVP</button>
    </form>`;
}

function renderDetail(id) {
  setCurrentNav("");
  const event = events.find((item) => item.id === id);
  if (!event) {
    app.innerHTML = `<div class="standard-page empty-state"><h1 tabindex="-1">Event not found</h1><p>The event may have moved or the link may be incomplete.</p><a class="secondary-button" href="#discover">Return to Discover</a></div>`;
    return;
  }
  const saved = state.savedIds.has(event.id);
  app.innerHTML = `
    <div class="detail-layout">
      <aside class="detail-aside">
        <img class="hero-cover" src="${event.image}" alt="Cover image for ${escapeHtml(event.title)}" />
        <div class="host-card"><p class="eyebrow">Presented by</p><p class="host-name">${escapeHtml(event.hostName)}</p></div>
      </aside>
      <section aria-labelledby="event-title">
        <a class="back-link" href="#discover">Discover Events</a>
        <h1 class="detail-title" id="event-title" tabindex="-1">${escapeHtml(event.title)}</h1>
        <div class="fact-list">
          <div class="fact"><strong>${escapeHtml(event.dateLong)}</strong><span>${escapeHtml(event.time)}</span></div>
          <div class="fact"><strong>${escapeHtml(event.location || "Register to see address")}</strong><span>${escapeHtml(event.area)}</span></div>
        </div>
        <section class="registration-card" aria-labelledby="registration-title">
          <h2 id="registration-title">Registration</h2>
          <div class="registration-body">${rsvpMarkup(event)}</div>
        </section>
        <div class="registration-actions">
          ${state.rsvps[event.id]
            ? `<a class="primary-button" href="#my-events">View My Events</a>`
            : `<button class="primary-button" type="button" data-rsvp-focus>RSVP</button>`}
          <button class="secondary-button" type="button" data-save="${event.id}" aria-pressed="${saved}">${saved ? "Saved" : "Save event"}</button>
        </div>
        <section class="about-section" aria-labelledby="about-title"><h2 id="about-title">About Event</h2><p>${escapeHtml(event.description)}</p><p>${event.attendeeCount} people are interested.</p></section>
      </section>
    </div>`;
}

function render({ manageFocus = false } = {}) {
  const hash = location.hash.slice(1) || "discover";
  if (hash === "my-events") renderMyEvents();
  else if (hash.startsWith("event/")) renderDetail(hash.split("/")[1]);
  else renderDiscover();
  saveState();
  if (manageFocus) document.querySelector("h1")?.focus({ preventScroll: true });
}

document.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const id = saveButton.dataset.save;
    const item = events.find((candidate) => candidate.id === id);
    if (state.savedIds.has(id)) {
      state.savedIds.delete(id);
      announce(`${item.title} removed from My Events.`);
    } else {
      state.savedIds.add(id);
      announce(`${item.title} saved to My Events.`);
    }
    renderDetail(id);
    return;
  }

  const cancelButton = event.target.closest("[data-cancel-rsvp]");
  if (cancelButton) {
    const id = cancelButton.dataset.cancelRsvp;
    delete state.rsvps[id];
    saveState();
    renderDetail(id);
    announce(`RSVP canceled for ${events.find((candidate) => candidate.id === id).title}.`);
    return;
  }

  if (event.target.closest("[data-rsvp-focus]")) document.querySelector("#rsvp-name")?.focus();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-rsvp-form]");
  if (!form) return;
  event.preventDefault();
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const error = form.querySelector("#rsvp-error");
  if (!name) {
    error.hidden = false;
    form.elements.name.setAttribute("aria-invalid", "true");
    form.elements.name.focus();
    announce("Please enter your name before confirming the RSVP.");
    return;
  }
  const id = form.dataset.rsvpForm;
  state.rsvps[id] = { name, guests: Number(formData.get("guests")) };
  saveState();
  renderDetail(id);
  announce(`RSVP confirmed for ${events.find((item) => item.id === id).title}.`);
});

window.addEventListener("hashchange", () => render({ manageFocus: true }));

updateClock();
window.setInterval(updateClock, 60_000);
saveState();
render();
