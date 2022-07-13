// start of month
let nav = 0;

// whatever day is clicked
let clicked = null;

// let event equal the reminder from local Stroage or from array 
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) :
  [];

// get the calendar id
const calendar = document.getElementById('calendar');

// get the newEventTitle id
const newEventTitle = document.getElementById('newEventTitle');

// get the deleteEventTitle id
const deleteEventTitle = document.getElementById('deleteEventTitle');

// get the modalBackDrop id
const backDrop = document.getElementById('modalBackDrop');

// get the eventTitleInput id
const eventTitleInput = document.getElementById('eventTitleInput');

// Make an Array for the week days
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// make a function that allows the days to be clicked to add reminders
openModal = (date) => {
  clicked = date;

  // find what every date was clicked
  const eventForThatDay = events.find(e => e.date === clicked);

  if (eventForThatDay) {
    // getting the eventText id from the html and writing the reminder 
    document.getElementById('eventText').innerText = eventForThatDay.title;

    // setting the display to block sets the dark background
    deleteEventTitle.style.display = 'block';
  } else {
    newEventTitle.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

load = () => {
  // make a date object
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  // let day equal current day
  const day = dt.getDate();

  // let month equal current month
  const month = dt.getMonth();

  // let year equal current year
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // letting dateDtring equal the first day of the month of the US
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  // getting the monthsDisplay id from html and writing the months of the year
  document.getElementById('monthDisplay').innerText =
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  // Making the calendar blank so that the days can be placed inside it
  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    // creating a div and let it equal to daySquare
    const daySquare = document.createElement('div');
    // giving the div a class name called day
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        // Marks the current day
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {

        // make a new div
        const eventDiv = document.createElement('div');

        // add event to that div
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;

        // attach the eventDiv to the daySquare div id
        daySquare.appendChild(eventDiv);
      }
      // When a date it clicked run the function that allows reminders to be added
      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      // leave the days that not apart of that month blank
      daySquare.classList.add('padding');
    }
    // attach the days to the calendar
    calendar.appendChild(daySquare);
  }
}

closeModal = () => {

  // setting the display to none removes the dark background
  newEventTitle.style.display = 'none';
  deleteEventTitle.style.display = 'none';
  backDrop.style.display = 'none';

  // What ever is written in the event reminder will replace ''
  eventTitleInput.value = '';
  clicked = null;
  load();
}

// make a way to add reminders
saveEvent = () => {
  if (eventTitleInput.value) {

    // adds the reminder to the calendar
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    // add the reminder to the local Storage and the calendar
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  }
}
// make a way to delete the event reminder
deleteEvent = () => {
  events = events.filter(e => e.date !== clicked);
  // deletes the reminder from the local Storage and calendar
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

initButtons = () => {
  // get the left arrow from html and add event listener to it when clicked to move back a month
  document.querySelector('.next').addEventListener('click', () => {
    nav++;
    load();
  });
  // get the right arrow from html and add event listener to it when clicked to move to the next month
  document.querySelector('.prev').addEventListener('click', () => {
    nav--;
    load();
  });

  // get save button from html and add event listener to it when clicked
  document.getElementById('saveButton').addEventListener('click', saveEvent);

  //  get cancel button from html and add event listener to it when clicked
  document.getElementById('cancelButton').addEventListener('click', closeModal);

  //  get delete button from html and add event listener to it when clicked
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);

  //  get close button from html and add event listener to it when clicked
  document.getElementById('closeButton').addEventListener('click', closeModal);
}
// call the functions
initButtons();
load();