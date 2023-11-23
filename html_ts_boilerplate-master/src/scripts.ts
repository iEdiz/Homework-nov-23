import axios, { Axios } from 'axios';

const songWrapper = document.querySelector<HTMLDivElement>('.js-song-wrapper');

// Toastify function

const toastifyPopUp = (message: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #42275a, #734b6d)',
    },
  }).showToast();
};

// Declare new type, give type to each parameter.

type Song = {
    id: number;
    name: string;
    performer: string;
    description: string;
    releaseYear: number;
    createdAt: string;
    image: string;
}

// Get random image for song card

function getRandomImage() {
  const randomImage = [];

  // insert the URL of images in array
  randomImage[0] = 'assets/images/andrew-slifkin-Ye1Aw2cBBBI-unsplash.jpg';
  randomImage[1] = 'assets/images/gary-ellis-s0_B1to21_k-unsplash.jpg';
  randomImage[2] = 'assets/images/jonathan-kemper-zE612_hD6GI-unsplash.jpg';
  randomImage[3] = 'assets/images/kian-lem-pH_1KmQJ140-unsplash.jpg';
  randomImage[4] = 'assets/images/luca-calderone-3eQw8AmZJAo-unsplash.jpg';
  randomImage[5] = 'assets/images/martin-bekerman-lqrXJ4VWraw-unsplash.jpg';
  randomImage[6] = 'assets/images/mathias-konrath-Y7BG6yO9Q9o-unsplash.jpg';
  randomImage[7] = 'assets/images/szymon-fischer-vyNBFUbSsbs-unsplash.jpg';
  randomImage[8] = 'assets/images/tim-rebkavets-B5PNmw5XSpk-unsplash.jpg';
  randomImage[9] = 'assets/images/willian-justen-de-vasconcellos-Cdb3-cWZBeo-unsplash.jpg';

  // generate a random number
  const number = Math.floor(Math.random() * randomImage.length);

  // return the images generated by number
  return randomImage[number];
}

// Timer that display how long ago the card was made

const timerBetweenCreaton = (time: Date) => {
  const currentTime = new Date();
  const timeCreated = new Date(time);

  // calculate the difference between current time and time created
  const timeDifference = Number(currentTime) - Number(timeCreated);

  const seconds = Math.floor(timeDifference / 1000); // get seconds displayed
  const minutes = Math.floor(seconds / 60); // get minutes displayed
  const hours = Math.floor(minutes / 60); // get hours displayed
  const days = Math.floor(hours / 24); // get days displayed

  let timeAgoPublished = '';

  // Display either days, hours, minutes or seconds, depending on how much time has passed
  if (days === 1) {
    timeAgoPublished = `Created ${days} day ago`;
  } else if (days > 0) {
    timeAgoPublished = `Created ${days} days ago`;
  } else if (hours === 1) {
    timeAgoPublished = `Created ${hours} hour ago`;
  } else if (hours > 0) {
    timeAgoPublished = `Created ${hours} hours ago`;
  } else if (minutes === 1) {
    timeAgoPublished = `Created ${minutes} minute ago`;
  } else if (minutes > 0) {
    timeAgoPublished = `Created ${minutes} minutes ago`;
  } else {
    timeAgoPublished = `Created ${seconds} seconds ago`;
  }
  return timeAgoPublished;
};

// Create new function, that will create song cards
const createSongCard = async () => {
  try {
    const { data } = await axios.get<Song[]>('http://localhost:3004/songs'); // Get data from server

    songWrapper.innerHTML = ''; // Makes it so on reload the HTML of songWrapper is blank, doesn't save

    data.forEach((song) => {
      const timeAgo = timerBetweenCreaton(new Date(song.createdAt)); // Add the timer function

      // Create new innerHTML for songWrapper adding main div, image, headers, buttons.
      songWrapper.innerHTML += `
        <div class="song">
          <img src="${song.image}" alt="Song Image" class="images"/>
          <h1 class="title">${song.name}</h1>
          <h3 class="performer">${song.performer}</h3>
          <h5 class="description">${song.description}</h5>
          <h6 class="releaseYear">${song.releaseYear}</h6>
          <div class="song__buttons">
            <button class="js-song-delete song__delete" data-song-id="${song.id}">Delete</button>
            <button class="js-song-edit song__edit" data-song-id="${song.id}">Edit</button>
          </div>
          <h6 class="createdAt">${timeAgo}</h6>
        </div>
      `;
    });

    // Adding Edit buttons for song cards
    const songEditButton = document.querySelectorAll<HTMLButtonElement>('.js-song-edit'); // call the edit button
    const editForm = document.querySelector<HTMLFormElement>('.js-song-edit-form'); // call edit form where edits will be made

    // Call and asign each form input element
    const songEditInput = editForm.querySelector<HTMLInputElement>('input[name="song__edit"]');
    const performerEditInput = editForm.querySelector<HTMLInputElement>('input[name="performer__edit"]');
    const descriptionEditInput = editForm.querySelector<HTMLInputElement>('input[name="description__edit"]');
    const releaseYearEditInput = editForm.querySelector<HTMLInputElement>('input[name="releaseYear__edit"]');

    editForm.classList.add('hidden'); // Add hidden classs to form, so it doesn't always show

    // Add new eventListener on click for each edit button
    songEditButton.forEach((editButton) => {
      editButton.addEventListener('click', () => {
        const { songId } = editButton.dataset; // get ID of the current song card

        editForm.classList.remove('hidden'); // remove hidden class, so the form shows up

        // Add new eventListener to edit form for submit
        editForm.addEventListener('submit', (event) => {
          event.preventDefault();

          // Get the value that was inserted into input for every input element
          const songEditInputValue = songEditInput.value;
          const performerEdiInputValue = performerEditInput.value;
          const descriptionEditInputValue = descriptionEditInput.value;
          const releaseYearEditInputValue = releaseYearEditInput.value;

          // Use axios PUT to replace current songID values with edited ones
          axios.put(`http://localhost:3004/songs/${songId}`, {
            name: songEditInputValue,
            performer: performerEdiInputValue,
            description: descriptionEditInputValue,
            releaseYear: releaseYearEditInputValue,
            image: getRandomImage(),
            createdAt: new Date().toISOString(),
          }).then(() => {
            editForm.classList.add('hidden'); // Add the hidden class back, so the edit form disappears

            // Call the cards again, so no reload is needed
            toastifyPopUp('Song card edited succesfully');
            createSongCard();

            // But every value to blank, so that the values inserted don't save
            songEditInput.value = '';
            performerEditInput.value = '';
            descriptionEditInput.value = '';
            releaseYearEditInput.value = '';
          });
        });
      });
    });

    // Add Delete buttons for song cards
    const songDeleteButtons = document.querySelectorAll<HTMLButtonElement>('.js-song-delete'); // call the delete button

    // Iterate through every delete button, to add eventListener on click
    songDeleteButtons.forEach((songButton) => {
      songButton.addEventListener('click', () => {
        const { songId } = songButton.dataset; // get ID of current song card

        // Use axios DELETE to delete the current card
        axios.delete(`http://localhost:3004/songs/${songId}`).then(() => {
          createSongCard(); // Call song cards, so reload isn't needed
          toastifyPopUp('Song card was deleted');
        });
      });
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
};

// Add form that will add NEW song card
const songForm = document.querySelector('.js-song-form');

// Add eventListener SUBMIT to new song form
songForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get every input that is needed for new card
  const songInput = songForm.querySelector<HTMLInputElement>('input[name="song"]');
  const songInputValue = songInput.value;

  const performerInput = songForm.querySelector<HTMLInputElement>('input[name="performer"]');
  const performerInputValue = performerInput.value;

  const descriptionInput = songForm.querySelector<HTMLInputElement>('input[name="description"]');
  const descriptionInputValue = descriptionInput.value;

  const releaseYearInput = songForm.querySelector<HTMLInputElement>('input[name="releaseYear"]');
  const releaseYearInputValue = releaseYearInput.value;

  // Using axios POST add new cards
  axios.post('http://localhost:3004/songs', {
    // Use the inputs that were inserted into songForm inputs
    name: songInputValue,
    performer: performerInputValue,
    description: descriptionInputValue,
    releaseYear: releaseYearInputValue,
    image: getRandomImage(), // Call randomImage function to get random image on new card
    createdAt: new Date().toISOString(), // Call newDate and toISOString (for date formatting)
  }).then(() => {
    // Reset the values on reload, so the inputs of songForm get cleared after creation
    songInput.value = '';
    performerInput.value = '';
    descriptionInput.value = '';
    releaseYearInput.value = '';

    // Call all song cards, so reload isn't needed
    createSongCard();
    toastifyPopUp('Song card has been created');
  });
});

createSongCard();
