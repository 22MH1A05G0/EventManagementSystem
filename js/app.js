/*
  app.js
  ------
  This single file contains the JavaScript logic for the whole site.
  It checks WHICH page has loaded by looking for an element that only
  exists on that page (e.g. #eventsContainer only exists on events.html),
  and then runs the matching function. This keeps the project simple —
  only one JS file to explain in an interview, besides events.js (data).

  AUTHENTICATION NOTE (important for interviews):
  This project has NO backend and NO real database, so "login" here is
  simulated entirely in the browser using localStorage:
    - "users"        -> an array of all signed-up accounts (name/email/password)
    - "currentUser"  -> the account that is currently logged in (if any)
    - "registrations_<email>" -> the list of events that user registered for
  Passwords are stored in PLAIN TEXT in the browser's localStorage. This is
  NOT secure and would never be done in a real application — a real system
  would use a proper backend with hashed passwords (or a service like AWS
  Cognito). This is only meant to demonstrate the login/registration FLOW
  for a beginner, frontend-only project.
*/

// Run everything after the HTML has fully loaded
document.addEventListener("DOMContentLoaded", function () {
  updateAuthNav(); // keep the nav bar's Login/Logout link in sync on every page

  if (document.getElementById("eventsContainer")) {
    initEventsPage();
  }
  if (document.getElementById("eventDetailsContainer")) {
    initEventDetailsPage();
  }
  if (document.getElementById("registrationForm")) {
    initRegisterPage();
  }
  if (document.getElementById("loginForm")) {
    initLoginPage();
  }
  if (document.getElementById("myRegistrationsContainer")) {
    initMyRegistrationsPage();
  }
});

/* =========================================================
   0. AUTH HELPERS (used across multiple pages)
   ========================================================= */

// Returns the logged-in user object, or null if nobody is logged in
function getCurrentUser() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

// Returns the array of all registered accounts (empty array if none yet)
function getUsers() {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
}

// Returns this user's saved event registrations (empty array if none yet)
function getRegistrationsForUser(email) {
  const data = localStorage.getItem("registrations_" + email);
  return data ? JSON.parse(data) : [];
}

// Updates the nav bar on every page to show "Login" or "Logout (name)",
// and shows/hides the "My Registrations" link depending on login state
function updateAuthNav() {
  const authItem = document.getElementById("authNavItem");
  const myRegItem = document.getElementById("myRegistrationsNav");
  if (!authItem) return; // this page doesn't have a nav bar with auth links

  const currentUser = getCurrentUser();

  if (currentUser) {
    authItem.innerHTML = '<a href="#" id="logoutLink">Logout (' + currentUser.name + ')</a>';
    if (myRegItem) myRegItem.style.display = "inline-block";

    document.getElementById("logoutLink").addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  } else {
    authItem.innerHTML = '<a href="login.html">Login</a>';
    if (myRegItem) myRegItem.style.display = "none";
  }
}

/* =========================================================
   1. EVENTS PAGE (events.html)
   ========================================================= */
function initEventsPage() {
  const container = document.getElementById("eventsContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const noResults = document.getElementById("noResults");

  // Renders a list of event objects as cards inside the container
  function renderEvents(eventList) {
    container.innerHTML = ""; // clear previous content

    if (eventList.length === 0) {
      noResults.style.display = "block";
      return;
    }
    noResults.style.display = "none";

    eventList.forEach(function (event) {
      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <img src="${event.image}" alt="${event.category} icon" class="event-image">
        <span class="event-category">${event.category}</span>
        <h3>${event.name}</h3>
        <div class="event-meta">
          ${event.date} | ${event.time}<br>
          ${event.location}
        </div>
        <p class="description">${event.description}</p>
        <div class="card-buttons">
          <a href="event-details.html?id=${event.id}" class="btn btn-primary">View Details</a>
          <a href="register.html?event=${event.id}" class="btn btn-secondary">Register</a>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Applies both the search text and category filter together
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filtered = events.filter(function (event) {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    renderEvents(filtered);
  }

  // Re-apply filters whenever the user types or changes the dropdown
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);

  // Initial render: show all events
  renderEvents(events);
}

/* =========================================================
   2. EVENT DETAILS PAGE (event-details.html)
   ========================================================= */
function initEventDetailsPage() {
  const container = document.getElementById("eventDetailsContainer");

  // Read the "id" value from the URL, e.g. event-details.html?id=3
  const params = new URLSearchParams(window.location.search);
  const eventId = parseInt(params.get("id"));

  // Find the matching event in our events array
  const event = events.find(function (e) {
    return e.id === eventId;
  });

  if (!event) {
    container.innerHTML = "<p>Event not found. Please go back and select a valid event.</p>";
    return;
  }

  container.innerHTML = `
    <img src="${event.image}" alt="${event.category} icon" class="details-image">
    <h2>${event.name}</h2>
    <div class="detail-row"><strong>Date:</strong> ${event.date}</div>
    <div class="detail-row"><strong>Time:</strong> ${event.time}</div>
    <div class="detail-row"><strong>Location:</strong> ${event.location}</div>
    <div class="detail-row"><strong>Organizer:</strong> ${event.organizer}</div>
    <div class="detail-row"><strong>Available Seats:</strong> ${event.seats}</div>
    <div class="detail-row"><strong>Description:</strong> ${event.description}</div>
    <a href="register.html?event=${event.id}" class="btn btn-primary">Register for this Event</a>
  `;
}

/* =========================================================
   3. REGISTRATION PAGE (register.html)
   ========================================================= */
function initRegisterPage() {
  const form = document.getElementById("registrationForm");
  const eventSelect = document.getElementById("eventSelect");
  const confirmationBox = document.getElementById("confirmationMessage");
  const confirmationText = document.getElementById("confirmationText");
  const loginPrompt = document.getElementById("loginPrompt");

  // Registration requires being logged in, since registrations are saved
  // against the logged-in user's account (in localStorage).
  const currentUser = getCurrentUser();
  if (!currentUser) {
    form.style.display = "none";
    loginPrompt.style.display = "block";
    return;
  }

  // Step 1: Fill the event dropdown with all events from events.js
  events.forEach(function (event) {
    const option = document.createElement("option");
    option.value = event.id;
    option.textContent = event.name;
    eventSelect.appendChild(option);
  });

  // Step 2: If the user arrived from a "Register" button (?event=3),
  // pre-select that event in the dropdown
  const params = new URLSearchParams(window.location.search);
  const preselectedId = params.get("event");
  if (preselectedId) {
    eventSelect.value = preselectedId;
  }

  // Step 3: Pre-fill name and email from the logged-in account
  document.getElementById("fullName").value = currentUser.name;
  document.getElementById("email").value = currentUser.email;

  // Step 4: Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop the page from reloading

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const selectedEventId = eventSelect.value;

    let isValid = true;

    // Clear old error messages first
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("eventError").textContent = "";

    // --- Validate Full Name ---
    if (fullName === "") {
      document.getElementById("nameError").textContent = "Full name is required.";
      isValid = false;
    }

    // --- Validate Email (simple pattern check) ---
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      document.getElementById("emailError").textContent = "Email is required.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // --- Validate Phone (simple 10-digit check) ---
    const phonePattern = /^[0-9]{10}$/;
    if (phone === "") {
      document.getElementById("phoneError").textContent = "Phone number is required.";
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      document.getElementById("phoneError").textContent = "Enter a valid 10-digit phone number.";
      isValid = false;
    }

    // --- Validate Event Selection ---
    if (selectedEventId === "") {
      document.getElementById("eventError").textContent = "Please select an event.";
      isValid = false;
    }

    // Stop here if any validation failed
    if (!isValid) {
      return;
    }

    // Step 5: Find the selected event's full details
    const selectedEvent = events.find(function (event) {
      return event.id === parseInt(selectedEventId);
    });

    // Step 6: Save this registration under the current user's account,
    // so it can be shown later on the "My Registrations" page.
    // (This is browser-only storage — see the AUTHENTICATION NOTE above.)
    const myRegistrations = getRegistrationsForUser(currentUser.email);

    const alreadyRegistered = myRegistrations.some(function (reg) {
      return reg.eventId === selectedEvent.id;
    });

    if (!alreadyRegistered) {
      myRegistrations.push({
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        time: selectedEvent.time,
        location: selectedEvent.location,
        fullName: fullName,
        phone: phone,
        registeredAt: new Date().toISOString()
      });
      localStorage.setItem(
        "registrations_" + currentUser.email,
        JSON.stringify(myRegistrations)
      );
    }

    // Step 7: Show confirmation message and hide the form
    confirmationText.textContent =
      (alreadyRegistered
        ? "You were already registered for \"" + selectedEvent.name + "\". "
        : "Thank you, " + fullName + "! You have successfully registered for \"" +
          selectedEvent.name + "\". ") +
      "A confirmation has been noted for " + email + ".";

    form.style.display = "none";
    confirmationBox.style.display = "block";
  });
}

/* =========================================================
   4. LOGIN / SIGN UP PAGE (login.html)
   ========================================================= */
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginWrapper = document.getElementById("loginForm-wrapper");
  const signupWrapper = document.getElementById("signupForm-wrapper");
  const showSignupLink = document.getElementById("showSignupLink");
  const showLoginLink = document.getElementById("showLoginLink");
  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");

  // Toggle between the Login form and the Sign Up form
  showSignupLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginWrapper.style.display = "none";
    signupWrapper.style.display = "block";
  });

  showLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    signupWrapper.style.display = "none";
    loginWrapper.style.display = "block";
  });

  // --- LOGIN ---
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginError.textContent = "";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const matchedUser = users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!matchedUser) {
      loginError.textContent = "Incorrect email or password.";
      return;
    }

    // Save the logged-in user (without password) as the current session
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name: matchedUser.name, email: matchedUser.email })
    );

    window.location.href = "events.html";
  });

  // --- SIGN UP ---
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    signupError.textContent = "";

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "" || password === "") {
      signupError.textContent = "All fields are required.";
      return;
    }
    if (!emailPattern.test(email)) {
      signupError.textContent = "Please enter a valid email address.";
      return;
    }
    if (password.length < 4) {
      signupError.textContent = "Password must be at least 4 characters.";
      return;
    }

    const users = getUsers();
    const emailTaken = users.some(function (user) {
      return user.email === email;
    });

    if (emailTaken) {
      signupError.textContent = "An account with this email already exists. Please log in instead.";
      return;
    }

    // Save the new account
    users.push({ name: name, email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    // Log the new user in immediately
    localStorage.setItem("currentUser", JSON.stringify({ name: name, email: email }));

    window.location.href = "events.html";
  });
}

/* =========================================================
   5. MY REGISTRATIONS PAGE (my-registrations.html)
   ========================================================= */
function initMyRegistrationsPage() {
  const container = document.getElementById("myRegistrationsContainer");
  const loginPrompt = document.getElementById("myRegLoginPrompt");
  const currentUser = getCurrentUser();

  if (!currentUser) {
    container.style.display = "none";
    loginPrompt.style.display = "block";
    return;
  }

  const myRegistrations = getRegistrationsForUser(currentUser.email);

  if (myRegistrations.length === 0) {
    container.innerHTML = "<p>You haven't registered for any events yet. <a href=\"events.html\">Browse events</a>.</p>";
    return;
  }

  container.innerHTML = ""; // clear "Loading..." placeholder

  myRegistrations.forEach(function (reg) {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${reg.eventName}</h3>
      <div class="event-meta">
        ${reg.date} | ${reg.time}<br>
        ${reg.location}
      </div>
      <p class="description">Registered under: ${reg.fullName} (${currentUser.email})</p>
      <div class="card-buttons">
        <a href="event-details.html?id=${reg.eventId}" class="btn btn-primary">View Details</a>
      </div>
    `;
    container.appendChild(card);
  });
}
