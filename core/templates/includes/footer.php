<footer class="footer">
    <div class="container">
        <p class="pull-left">
            <a href="#" onClick="facebookShare()" class="navbar-link"><i class="fa fa-facebook fa-2x"></i></a>
        </p>
        <p class="pull-left">
            <a href="#" onClick="twitterShare()" class="navbar-link"><i class="fa fa-twitter fa-2x"></i></a>
        </p>
        <p class="pull-right">
            <a href="mailto:info@eurovisiontippning.se" target="_blank" class="navbar-link pull-right"><i class="fa fa-envelope fa-lg"></i></a>
        </p>
    </div>
</footer>
<!-- script references -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="/js/countdown.js"></script>
<script>
    function facebookShare(){
        window.open('http://www.facebook.com/sharer/sharer.php?u=eurovisiontippning.se&t=Eurovisiontippning', 'facebook_share', 'height=320, width=550, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
    }

    function twitterShare(){
        window.open('http://www.twitter.com/intent/tweet?text=Har%20du%20b%C3%A4st%20fingertoppsk%C3%A4nsla%20i%20Sverige%3F%0A&url=http%3A%2F%2Feurovisiontippning.se&hashtags=eurovisiontippning', 'tweet', 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
    }
</script>
<?php include $root.'/js/delning.php';?>
