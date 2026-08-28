# Event Management System (Static Website on Amazon S3)

A very simple, beginner-friendly **Event Management System** built using
only **HTML, CSS, and JavaScript**, designed to be deployed as a **static
website using Amazon S3**. This project was built as a student/fresher
project to demonstrate frontend web development skills and AWS S3 static
website hosting.

---

## 1. Project Overview

This web application allows users to:
- Create an account and log in.
- View a list of upcoming technical events.
- Search and filter events by name or category.
- View full details of a specific event.
- Register for an event using a simple form (while logged in).
- View a personal "My Registrations" page listing events they signed up for.

There is **no backend, no real database, and no API**. Event data is
stored in a JavaScript array, and both accounts and registrations are
stored in the browser's `localStorage`. This keeps the project small
enough to fully understand and explain, while still demonstrating a
complete, working workflow — including a login flow, which is a common
interview topic.

---

## 2. Features

1. **Home Page** – Navigation bar, title, short introduction, and a button
   to view events.
2. **Events Page** – Displays 6 sample events as cards, each with a "View
   Details" and "Register" button.
3. **Event Details Page** – Shows full details of a selected event (name,
   date, time, location, description, organizer, available seats).
4. **Login / Sign Up Page** – Create an account or log in. The nav bar
   updates to show "Logout (name)" once logged in.
5. **Registration Page** – A form (name, email, phone, event) with
   JavaScript validation and an on-page confirmation message. Requires
   being logged in; name and email are pre-filled from the account.
6. **My Registrations Page** – Lists every event the logged-in user has
   registered for, on this browser.
7. **Search & Filter** – A search box (by event name) and a category
   dropdown filter (Workshop / Seminar / Hackathon / Career).
8. **Responsive Design** – Clean card-based layout that adjusts to mobile
   and desktop screens using CSS Flexbox/Grid and a media query.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| JavaScript (Vanilla, ES6) | Data handling, DOM rendering, form validation |
| Amazon S3 | Static website hosting |

No frameworks, libraries, databases, or backend servers are used.

---

## 4. Project Structure

```
event-management-system/
│
├── index.html              # Home page
├── events.html              # Events listing page (search + filter)
├── event-details.html       # Event details page
├── login.html                # Login / Sign Up page
├── register.html            # Registration form + confirmation (requires login)
├── my-registrations.html    # Logged-in user's registered events
│
├── css/
│   └── style.css            # All styling for the site
│
├── images/
│   ├── hero.svg              # Home page banner
│   ├── workshop.svg          # Icon for Workshop category events
│   ├── seminar.svg           # Icon for Seminar category events
│   ├── hackathon.svg         # Icon for Hackathon category events
│   └── career.svg            # Icon for Career category events
│
├── js/
│   ├── events.js             # Event data (acts as a simple "database")
│   └── app.js                # All page logic (rendering, filtering, validation)
│
└── README.md                 # Project documentation
```

### How the pages connect
- `events.js` defines a JavaScript array called `events`, where each event
  is an object with fields like `id`, `name`, `date`, `time`, and `image`
  (a path to a category icon in the `images/` folder).
- All images are simple **SVG graphics** (not photos) drawn with basic
  shapes — this keeps the whole project lightweight, avoids any image
  licensing concerns, and scales cleanly on any screen size.
- `app.js` checks which page has loaded (by checking for an element ID
  that only exists on that page) and runs the matching function:
  - `initEventsPage()` → renders event cards + handles search/filter
  - `initEventDetailsPage()` → reads `?id=` from the URL and shows that event
  - `initRegisterPage()` → fills the event dropdown, validates the form, and
    shows a confirmation message
  - `initLoginPage()` → handles the Login form and the Sign Up form
  - `initMyRegistrationsPage()` → lists the current user's registrations
- Every page loads `events.js` **before** `app.js`, so the `events` array is
  available as shared data.
- Navigation between pages (e.g. clicking "View Details" or "Register") is
  done using plain HTML links with a query string, e.g.
  `event-details.html?id=3`. JavaScript's `URLSearchParams` is used to read
  that `id` from the URL.

### How login and registrations work (no backend)
- **Accounts**: `localStorage["users"]` holds an array of every account
  created via the Sign Up form (`name`, `email`, `password`).
- **Session**: `localStorage["currentUser"]` holds whichever account is
  currently logged in. `updateAuthNav()` runs on every page load and
  checks this to decide whether the nav bar shows "Login" or "Logout
  (name)", and whether "My Registrations" is visible.
- **Registrations**: when a logged-in user submits the registration form,
  the event is appended to `localStorage["registrations_<their email>"]`.
  The "My Registrations" page reads this same key to display their list.
- Logging out simply removes `currentUser` from `localStorage` — the
  account and its past registrations are kept, so logging back in shows
  the same data.

---

## 5. How to Run Locally

Since this is a static website (no server-side code), you can run it in
two simple ways:

**Option A – Open directly in a browser**
1. Download/unzip the project folder.
2. Double-click `index.html` to open it in your browser.

**Option B – Use a simple local server (recommended)**
Some browsers restrict certain JavaScript features when opening files
directly (`file://`). To avoid this, serve the folder locally:

```bash
# If you have Python installed:
cd event-management-system
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## 6. How to Deploy to Amazon S3 (Step-by-Step)

### Step 1: Create an S3 Bucket
1. Log in to the **AWS Management Console**.
2. Go to the **S3** service.
3. Click **Create bucket**.
4. Enter a **globally unique bucket name** (e.g. `my-event-management-app`).
   - Tip: For website hosting, it's common (but not required) to name the
     bucket the same as your domain, if you have one.
5. Select your preferred **AWS Region**.
6. Under **Block Public Access settings**, **uncheck** "Block all public
   access" (since this is a public static website), and acknowledge the
   warning.
7. Leave other settings as default and click **Create bucket**.

### Step 2: Upload the Website Files
1. Open the newly created bucket.
2. Click **Upload**.
3. Upload the following files/folders, keeping the same structure:
   - `index.html`
   - `events.html`
   - `event-details.html`
   - `login.html`
   - `register.html`
   - `my-registrations.html`
   - `css/style.css`
   - `js/events.js`
   - `js/app.js`
   - `images/` folder (all `.svg` files inside it: `hero.svg`, `workshop.svg`,
     `seminar.svg`, `hackathon.svg`, `career.svg`)
4. Click **Upload** to confirm.

   > Tip: In the S3 console, you can drag and drop the entire project
   > folder (including subfolders like `css/`, `js/`, and `images/`) and
   > S3 will preserve the folder structure automatically.

### Step 3: Enable Static Website Hosting
1. In your bucket, go to the **Properties** tab.
2. Scroll down to **Static website hosting** and click **Edit**.
3. Select **Enable**.
4. Set:
   - **Index document**: `index.html`
   - **Error document**: `index.html` (or leave blank for a beginner setup)
5. Click **Save changes**.
6. AWS will now show a **Bucket website endpoint URL** — note this down.

### Step 4: Set Bucket Permissions (Bucket Policy)
To allow public read access to your website files, add a bucket policy:

1. Go to the **Permissions** tab of your bucket.
2. Scroll to **Bucket policy** and click **Edit**.
3. Paste the following policy (replace `YOUR-BUCKET-NAME` with your actual
   bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. Click **Save changes**.

This policy allows anyone on the internet to **read (GET)** the files in
the bucket — which is required for a public static website — but does
**not** allow anyone to modify or delete files.

### Step 5: Access the Deployed Website
1. Go back to **Properties → Static website hosting**.
2. Copy the **Bucket website endpoint**, which looks like:
   ```
   http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
   ```
3. Open this URL in your browser — your Event Management System is now
   live on the internet.

### Step 6: Updating the Website After Changes
Whenever you make changes to any file locally:
1. Go to your S3 bucket in the AWS Console.
2. Upload the updated file(s), overwriting the existing ones (S3 will ask
   for confirmation to replace).
3. Refresh the website URL in your browser to see the changes.

(Optional, more advanced: you could use the AWS CLI command
`aws s3 sync . s3://YOUR-BUCKET-NAME` to upload all changed files at once,
but manual upload through the console is enough for this beginner project.)

---

## 7. How Amazon S3 Is Being Used in This Project

- **S3 as a static file host**: All project files (HTML, CSS, JS) are
  simply objects stored inside an S3 bucket. S3 serves them directly to
  browsers over HTTP(S), with no server-side processing needed — which is
  exactly what a static website requires.
- **Static website hosting feature**: S3's built-in "Static website
  hosting" setting turns the bucket into a basic web server, defining
  `index.html` as the default page that loads when someone visits the
  root URL.
- **Bucket policy for public access**: Since website visitors are
  anonymous (unauthenticated) users, the bucket policy grants public
  `s3:GetObject` (read-only) permission, allowing anyone to view the site
  without needing AWS credentials.
- **No servers to manage**: Because the entire application runs in the
  browser (HTML/CSS/JS only), there is no backend server, no EC2 instance,
  and no database to maintain — S3 alone is sufficient to host the whole
  application.

---

## 8. Limitations of This Beginner Version

Since this project is intentionally kept simple for learning purposes, it
has the following limitations:

- **No real database** – Event data is hardcoded in `js/events.js`. Adding
  or editing events requires editing the code directly.
- **Login is simulated, not secure** – Accounts and passwords are stored
  in **plain text** in the browser's `localStorage`, with no encryption,
  hashing, or server-side verification. Anyone with access to the same
  browser (e.g. via DevTools) can read them. **Never do this in a real
  application** — a real system would use a proper backend with hashed
  passwords, or a managed service like **AWS Cognito**. This project only
  demonstrates the login/registration *flow*, not real security.
- **Data is local to one browser** – Accounts and registrations are saved
  in that specific browser's `localStorage`. They will not appear if the
  same user opens the site in a different browser, a different device, or
  incognito/private mode, and they are lost if the user clears their
  browser data.
- **No real seat tracking** – The "Available Seats" number is static and
  does not decrease when someone registers.
- **No HTTPS by default** – The plain S3 website endpoint uses HTTP. For
  HTTPS, you would need to add Amazon CloudFront (a CDN) in front of the
  bucket, which is beyond the scope of this beginner project.
- **No form data emailing/notification** – No emails or notifications are
  sent on registration.

These limitations are intentional, keeping the project simple enough to
fully understand and explain in an interview, while still demonstrating a
complete, working frontend application and real AWS S3 deployment.
