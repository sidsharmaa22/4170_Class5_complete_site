// ===========================================================================
// DATA — every event lives here with a stable id. This id, not DOM position,
// is what identifies "which event" everywhere else in the file.
// ===========================================================================

const INITIAL_EVENTS = {
  "studio-night": {
    id: "studio-night",
    title: "Studio Night Demo Party #4",
    image: "assets/images/fractal-party.png",
    imageAlt: "Soft abstract color-field artwork for Studio Night Demo Party",
    dateMonth: "AUG",
    dateDay: "12",
    dateFull: "Wednesday, August 12",
    timeRange: "6:30 PM – 9:00 PM",
    venueName: "Design Lab",
    venueAddress: "116th Street and Broadway, New York, NY 10027",
    host: "Maya Chen",
    hostAvatar: "assets/images/fractal-party.png",
    about: [
      "Join us for pizza, conversation, and a fast showcase of the strange, useful, and delightful projects students have been making.",
      "Demos will be three minutes long. Bring something you’re proud of, something unfinished, or simply come to see what others are exploring.",
    ],
    goingCount: 42,
    goingSummary: "Jordan Lee, Priya Shah and 40 others",
    status: "invited",
  },
  "creative-ai": {
    id: "creative-ai",
    title: "Campus Creative AI Forum",
    image: "assets/images/agentics.avif",
    imageAlt: "Dark event poster with an electric abstract motif",
    dateMonth: "AUG",
    dateDay: "13",
    dateFull: "Thursday, August 13",
    timeRange: "6:00 PM – 8:00 PM",
    venueName: "Innovation Space",
    venueAddress: "550 West 120th Street, New York, NY 10027",
    host: "Jordan Lee, Priya Shah & Alex Kim",
    hostAvatar: "assets/images/cafe-cursor.avif",
    about: [
      "A working session on using AI agents effectively in creative and technical projects, led by students from the Agentics group.",
      "Expect short lightning talks, live demos, and plenty of time for questions.",
    ],
    goingCount: 318,
    goingSummary: "Startup Founders, Steel Silicon and 316 others",
    status: "going",
  },
  "friday-social": {
    id: "friday-social",
    title: "Friday Night Social",
    image: "assets/images/mama-nyc.avif",
    imageAlt: "Colorful illustrated event poster",
    dateMonth: "AUG",
    dateDay: "14",
    dateFull: "Friday, August 14",
    timeRange: "6:30 PM – 10:00 PM",
    venueName: "College Walk",
    venueAddress: "College Walk, New York, NY 10027",
    host: "Campus Neighbors",
    hostAvatar: "assets/images/mama-nyc.avif",
    about: [
      "An informal evening social for everyone living and working around campus — music, snacks, and games on College Walk.",
      "Drop in any time during the window; there's no formal program.",
    ],
    goingCount: 88,
    goingSummary: "Mama NYC, Startup Founders and 86 others",
    status: "invited",
  },
};

// ===========================================================================
// DOM REFERENCES
// ===========================================================================

const openTriggers = document.querySelectorAll('[data-action="open-invitation"]');
const closeButtons = document.querySelectorAll('[data-action="close-invitation"]');
const acceptButtons = document.querySelectorAll('[data-action="accept-invitation"]');
const declineButtons = document.querySelectorAll('[data-action="decline-invitation"]');

const panelLayer = document.querySelector("#invitation-panel");
const panel = panelLayer.querySelector(".invitation-panel");
const registration = panel.querySelector(".invitation-registration");
const announcement = panel.querySelector('[data-role="invitation-announcement"]');

const panelViews = {
  event: panel.querySelector('[data-panel-view="event"]'),
  empty: panel.querySelector('[data-panel-view="empty"]'),
  error: panel.querySelector('[data-panel-view="error"]'),
};

const stateViews = {
  invited: registration.querySelector('[data-state-view="invited"]'),
  going: registration.querySelector('[data-state-view="going"]'),
  declined: registration.querySelector('[data-state-view="declined"]'),
};

const resetButton = document.querySelector('[data-action="reset-demo-data"]');
const previewEmptyButton = document.querySelector('[data-action="preview-empty-panel"]');
const previewErrorButton = document.querySelector('[data-action="preview-error-panel"]');

// ===========================================================================
// STATE — one status value per event is the single source of truth. The
// panel's open/closed state and which event it is currently showing are
// tracked separately from that status data.
// ===========================================================================

let events = structuredClone(INITIAL_EVENTS);
let selectedEventId = null;
let isPanelOpen = false;
let lastFocusedElement = null;
let activeTrigger = null;

// ===========================================================================
// RENDER — these functions only read state and update the DOM. They never
// attach listeners and never decide *when* to run; the action functions below
// call them after state changes.
// ===========================================================================

function renderCardStatus(event) {
  const card = document.querySelector(`.timeline-event-card[data-event-id="${event.id}"]`);
  const badge = card?.querySelector('[data-role="status-badge"]');
  if (!badge) return;
  const labels = { invited: "Invited", going: "Going", declined: "Declined" };
  badge.textContent = labels[event.status];
  badge.classList.toggle("is-going", event.status === "going");
  badge.classList.toggle("is-declined", event.status === "declined");
}

function renderAllCardStatuses() {
  Object.values(events).forEach(renderCardStatus);
}

function renderRegistrationState(event) {
  registration.dataset.invitationState = event.status;
  stateViews.invited.hidden = event.status !== "invited";
  stateViews.going.hidden = event.status !== "going";
  stateViews.declined.hidden = event.status !== "declined";
}

function renderEventDetails(event) {
  const view = panelViews.event;
  view.querySelector('[data-role="hero-image"]').src = event.image;
  view.querySelector('[data-role="hero-image"]').alt = event.imageAlt;
  view.querySelector('[data-role="title"]').textContent = event.title;
  view.querySelector('[data-role="host-name-inline"]').textContent = event.host;
  view.querySelector('[data-role="host-avatar-small"]').src = event.hostAvatar;
  view.querySelector('[data-role="date-month"]').textContent = event.dateMonth;
  view.querySelector('[data-role="date-day"]').textContent = event.dateDay;
  view.querySelector('[data-role="date-full"]').textContent = event.dateFull;
  view.querySelector('[data-role="time-range"]').textContent = event.timeRange;
  view.querySelector('[data-role="venue-name"]').textContent = event.venueName;
  view.querySelector('[data-role="venue-address"]').textContent = event.venueAddress;
  view.querySelector('[data-role="host-name-invite"]').textContent = event.host;
  view.querySelector('[data-role="host-avatar-invite"]').src = event.hostAvatar;
  view.querySelector('[data-role="host-name-section"]').textContent = event.host;
  view.querySelector('[data-role="host-avatar-large"]').src = event.hostAvatar;
  view.querySelector('[data-role="location-name"]').textContent = event.venueName;
  view.querySelector('[data-role="location-address"]').textContent = event.venueAddress;
  view.querySelector('[data-role="going-heading"]').textContent = `${event.goingCount} Going`;
  view.querySelector('[data-role="going-summary"]').textContent = event.goingSummary;

  const aboutContainer = view.querySelector('[data-role="about-paragraphs"]');
  aboutContainer.replaceChildren(
    ...event.about.map((paragraph) => {
      const p = document.createElement("p");
      p.className = "type-body";
      p.textContent = paragraph;
      return p;
    }),
  );

  renderRegistrationState(event);
}

function showPanelView(viewName) {
  Object.entries(panelViews).forEach(([name, element]) => {
    element.hidden = name !== viewName;
  });
}

function renderPanel() {
  if (selectedEventId === null) {
    showPanelView("empty");
    return;
  }
  const event = events[selectedEventId];
  if (!event) {
    showPanelView("error");
    return;
  }
  showPanelView("event");
  renderEventDetails(event);
}

function announce(message) {
  announcement.textContent = message;
}

// ===========================================================================
// ACTIONS — these are the only functions that change state. Each one updates
// `events` / `selectedEventId` / `isPanelOpen`, then calls the render
// functions above. Trace any UI change back to its cause by starting here.
// ===========================================================================

function openInvitation(eventId, triggerElement) {
  lastFocusedElement = document.activeElement;
  activeTrigger?.setAttribute("aria-expanded", "false");
  activeTrigger = triggerElement ?? null;
  activeTrigger?.setAttribute("aria-expanded", "true");

  selectedEventId = eventId;
  isPanelOpen = true;

  renderPanel();

  panelLayer.classList.add("is-open");
  panelLayer.removeAttribute("inert");
  panelLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-dialog-open");
  panel.querySelector(".panel-close").focus();
}

function closeInvitation() {
  if (!isPanelOpen) return;
  isPanelOpen = false;
  panelLayer.classList.remove("is-open");
  panelLayer.setAttribute("inert", "");
  panelLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-dialog-open");
  activeTrigger?.setAttribute("aria-expanded", "false");
  lastFocusedElement?.focus();
}

function setInvitationStatus(status) {
  const event = events[selectedEventId];
  if (!event) return; // Only the selected event ever changes.

  event.status = status;
  renderRegistrationState(event);
  renderCardStatus(event);

  const messages = {
    going: `You're in. You're going to ${event.title}.`,
    declined: `Invitation declined for ${event.title}.`,
    invited: `Invitation restored for ${event.title}.`,
  };
  announce(messages[status]);

  if (status === "going") {
    stateViews.going.querySelector("h4").focus({ preventScroll: true });
  }
}

function acceptInvitation() {
  setInvitationStatus("going");
}

function declineInvitation() {
  setInvitationStatus("declined");
}

function resetDemoData() {
  events = structuredClone(INITIAL_EVENTS);
  renderAllCardStatuses();
  closeInvitation();
  selectedEventId = null;
  announce("Demo data reset to its starting values.");
}

function previewEmptyPanel() {
  selectedEventId = null;
  isPanelOpen = true;
  lastFocusedElement = document.activeElement;
  activeTrigger = null;
  renderPanel();
  panelLayer.classList.add("is-open");
  panelLayer.removeAttribute("inert");
  panelLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-dialog-open");
  panel.querySelector(".panel-close").focus();
}

function previewErrorPanel() {
  openInvitation("expired-event-id-does-not-exist", null);
}

// ===========================================================================
// FOCUS MANAGEMENT
// ===========================================================================

function keepFocusInsidePanel(event) {
  if (!isPanelOpen || event.key !== "Tab") return;
  const controls = [
    ...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ].filter((element) => !element.closest("[hidden]"));
  const first = controls[0];
  const last = controls.at(-1);
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// ===========================================================================
// EVENT WIRING — native addEventListener only, no inline handlers. This
// section only connects DOM events to the action functions above; it
// contains no rendering logic of its own.
// ===========================================================================

openTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openInvitation(trigger.dataset.eventId, trigger);
  });
});

closeButtons.forEach((button) => button.addEventListener("click", closeInvitation));
acceptButtons.forEach((button) => button.addEventListener("click", acceptInvitation));
declineButtons.forEach((button) => button.addEventListener("click", declineInvitation));

resetButton.addEventListener("click", resetDemoData);
previewEmptyButton.addEventListener("click", previewEmptyPanel);
previewErrorButton.addEventListener("click", previewErrorPanel);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeInvitation();
  keepFocusInsidePanel(event);
});

// Initial paint: make card badges match the starting data.
renderAllCardStatuses();
