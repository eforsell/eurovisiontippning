var tag = document.createElement('script');

tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
   player = new YT.Player('player', {
     height: '390',
     width: '640',
     videoId: 'M7lc1UVf-VE',
     events: {
       'onReady': onPlayerReady,
       'onStateChange': onStateChange
     }
   });
 }

function onPlayerReady(){
    $('.music-control').prop("disabled", false);
    $('.music-control').removeClass("inactive");
};

function onStateChange(event){
    var current_id = player.getVideoData()['video_id'];
    if(event.data==1 || event.data==3){ // Playing or buffering
        if(!$('#video-id-'+current_id).hasClass('playing')){ // New song
            $('.music-control').removeClass('playing');
            $('#music-expand>button').css('visibility','hidden');
            $('#video-id-'+current_id).addClass('playing');
            $('#expand-video-id-'+current_id).css('visibility','visible');
        }
    }else if(event.data==0 || event.data==2){ // Ended or paused
            $('.music-control').removeClass('playing');
            $('#music-expand>button').css('visibility','hidden');
    }
};

$('.music-control').click(function(){
    $(this).blur();
    var target_id = $(this).data("video-id");
    var current_id = player.getVideoData()['video_id'];

    // Remove playing from everything but this one
    $('.music-control').not(this).removeClass('playing');

    // Comparison as not to restart song from 0
    var c = player.getPlaylistIndex();
    var v = $(this).data('video-index');
    $('#music-expand>button').not('#expand-video-id-'+target_id).css('visibility','hidden');
    if(!$(this).hasClass('playing')){
        if(target_id==current_id){
            player.playVideo();
        }else{
            player.loadVideoById(target_id);
        }
        $(this).addClass('playing');
        $('#expand-video-id-'+target_id).css('visibility','visible');
    }else{
        player.pauseVideo();
        $(this).removeClass('playing');
        $('#expand-video-id-'+target_id).css('visibility','hidden');
    }
});

$('#music-expand>button>.fa-youtube-play').click(function(){
    $(this).blur
});
