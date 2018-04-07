//Apr, 15, 2015 20:00:00
function countDown(date,id){
    // set the date we're counting down to
    var target_date = new Date(date*1000).getTime();
    // variables for time units
    var days, hours, minutes, seconds;

    // get tag element
    var countdown = document.getElementById(id);

    // update the tag with id "countdown" every 1 second
    function updateTimer(){

        // find the amount of "seconds" between now and target
        var current_date = new Date().getTime();
        var seconds_left = (target_date - current_date) / 1000;
        
        if(seconds_left<0){
            location.reload();
        }
        // do some time calculations
        days = parseInt(seconds_left / 86400);
        seconds_left = seconds_left % 86400;

        hours = parseInt(seconds_left / 3600);
        seconds_left = seconds_left % 3600;

        minutes = parseInt(seconds_left / 60);
        seconds = parseInt(seconds_left % 60);

        // format countdown string + set tag value
        countdown.innerHTML = '<span class="days">' + days +  ' <b>d</b></span> <span class="hours">' + hours + ' <b>h</b></span> <span class="minutes">' + minutes + ' <b>m</b></span> <span class="seconds">' + seconds + ' <b>s</b></span>';  
        //countdown.innerHTML = '<span class="days">' + days +  ' <b>d</b></span> <span class="hours">' + hours + ' <b>h</b></span> <span class="minutes">' + minutes + ' <b>m</b></span>';  
    }

    function startTimer(){
        updateTimer();
        setInterval(updateTimer, 1000);

    }
    
    startTimer();
    
    $('#countdown-label').show();
}