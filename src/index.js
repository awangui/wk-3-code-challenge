// The base URL
const baseURL = "http://localhost:3000/films";

//Function to display first movie's details
function displayFirstMovie(movie) {
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const id = document.getElementById('id');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('ticket-num');
    const buyButton = document.getElementById('buy-ticket');

    poster.src = movie.poster;
    title.textContent = movie.title;
    title.textContent = movie.title;
    runtime.textContent = `Runtime: ${movie.runtime} minutes`;
    showtime.textContent = `Showtime ${movie.showtime}`;

    const ticketAvailable = movie.capacity - movie.tickets_sold;
    availableTickets.textContent = `${ticketAvailable} remaining tickets`; 

    buyButton.setAttribute('data-movie-id', movie.id);
    buyButton.textContent = ticketAvailable > 0 ? "Buy Ticket" : "Sold Out"
}

//function to get the first movie
function getFirstMovie() {
    fetch(`${baseURL}/1`)
    .then(response => response.json())
    .then(movie => displayFirstMovie(movie))
    .catch(error => console.log("Error fetching movie:", error));
}

//load the first movie's details when the page loads
window.addEventListener('DOMContentLoaded', () => {
    getFirstMovie();
    displayMovieList();
});

//function to render movie list 
function renderMovieList(movies) {
    const filmList = document.getElementById('films');
    filmList.innerHTML = '';//clear any placeholder

movies.forEach(movie => {
    const filmItem= document.createElement('li');
    filmItem.textContent = movie.title;
    filmItem.classList.add('film', 'item');
    filmItem.addEventListener('click', () => displayFirstMovie(movie));
    filmList.appendChild(filmItem);
});
}

//function to fetch all movies and render the list
function displayMovieList() {
    fetch(baseURL)
    .then(response => response.json())
    .then(movies => renderMovieList(movies))
    .catch(error => console.log("Error fetching movies", error));
}

//function for ticket purchase
function buyTicket(movieId) {
    fetch(`${baseURL}/${Id}`)
     .then(response => response.json())
     .then(movie => {
        const ticketsAvailable = movie.capacity - movie.tickets_sold;

        if (ticketsAvailable > 0) {
            movie.tickets_sold += 1;
            const updatedTicketsAvailable = movie.capacity - movie.tickets_sold;

            //Updates available tickets in the UI
            document.getElementById('availableTickets').textContent = `Available Tickets: ${updatedTicketsAvailable}`;

    //update the server with the new tickets_sold
    fetch(`${baseURL}/${movie.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tickets_sold: movie.tickets_sold
        })
    })
    .then(response => response.json())
    .catch(error => console.log("Error updating tickets", error));

    //change button text if sold out
    if (updatedTicketsAvailable === 0) {
      document.getElementById('buy-ticket').textContent = "Sold Out";  
       }  
    }
}) 
.catch(error => console.log('Error fetching movie', error)); 
}

