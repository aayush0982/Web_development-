console.log("hello");

const monthel = document.getElementById("months");
const daysel = document.getElementById("days");
const hoursel = document.getElementById("hours");
const minsel = document.getElementById("minutes");
const secel = document.getElementById("seconds");

const newyr = "1 Jan 2025";
function countdown() {
    const newyrdate = new Date(newyr);
    const currdate = new Date();

    const tsec = (newyrdate - currdate) / 1000;
    const months = Math.floor(tsec/3600/24/30)
    const days = Math.floor(tsec / 3600 / 24)%30;
    const hrs = Math.floor(tsec / 3600) % 24;
    const mins = Math.floor(tsec / 60) % 60;
    const secs = Math.floor(tsec) % 60;
    console.log(months)

    daysel.innerHTML = formatTime(days); 
    monthel.innerHTML = formatTime(months); 
    hoursel.innerHTML = formatTime(hrs); 
    minsel.innerHTML = formatTime(mins); 
    secel.innerHTML = formatTime(secs); 
}
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}
// Call the countdown function to see the result
setInterval(countdown, 1000);
