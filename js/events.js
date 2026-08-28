/*
  events.js
  ----------
  This file holds all event data as a simple JavaScript array of objects.

  In a real-world system, this data would come from a database through an
  API. Since this is a beginner, frontend-only project (hosted as a static
  website on S3), we simply store the data directly in JavaScript.

  Every page (events.html, event-details.html, register.html) includes this
  file with <script src="js/events.js"></script> BEFORE app.js, so the
  "events" array below is available to app.js as a global variable.
*/

const events = [
  {
    id: 1,
    name: "Coding Workshop",
    category: "Workshop",
    date: "2026-09-10",
    time: "10:00 AM - 1:00 PM",
    location: "Computer Lab 1, Main Building",
    description: "A hands-on workshop covering programming fundamentals and problem solving.",
    organizer: "Computer Science Department",
    seats: 40,
    image: "images/workshop.jpg"
  },
  {
    id: 2,
    name: "Web Development Seminar",
    category: "Seminar",
    date: "2026-09-15",
    time: "2:00 PM - 4:00 PM",
    location: "Seminar Hall B",
    description: "Learn the basics of HTML, CSS and JavaScript from industry speakers.",
    organizer: "IT Club",
    seats: 60,
    image: "images/seminar.jpg"
  },
  {
    id: 3,
    name: "Cloud Computing Workshop",
    category: "Workshop",
    date: "2026-09-20",
    time: "11:00 AM - 2:00 PM",
    location: "Computer Lab 2, Main Building",
    description: "An introductory session on cloud concepts, including AWS S3 static hosting.",
    organizer: "Cloud Computing Club",
    seats: 35,
    image: "images/workshop.jpg"
  },
  {
    id: 4,
    name: "Technical Hackathon",
    category: "Hackathon",
    date: "2026-09-27",
    time: "9:00 AM - 9:00 PM",
    location: "Innovation Center",
    description: "A 12-hour hackathon where teams build small projects and present them for judging.",
    organizer: "Developer Student Club",
    seats: 80,
    image: "images/hackathon.jpg"
  },
  {
    id: 5,
    name: "Career Development Session",
    category: "Career",
    date: "2026-10-02",
    time: "3:00 PM - 5:00 PM",
    location: "Auditorium",
    description: "Guidance on resume building, interviews, and career planning for students.",
    organizer: "Training & Placement Cell",
    seats: 100,
    image: "images/career.jpg"
  },
  {
    id: 6,
    name: "AI & Machine Learning Talk",
    category: "Seminar",
    date: "2026-10-08",
    time: "1:00 PM - 3:00 PM",
    location: "Seminar Hall A",
    description: "An overview talk on AI and machine learning concepts and real-world applications.",
    organizer: "AI Research Club",
    seats: 70,
    image: "images/hero.jpg"
  }
];
