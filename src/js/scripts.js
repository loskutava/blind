//-----blind-----
function _blindScroll($body, $winTop, $blockScrollH, $class, $blockPage, $blackout) {
    if ($winTop > $blockScrollH - 1) {
        $blockPage.css({
            'position': 'relative',
            'top': $blockScrollH
        });
        $body.removeClass($class);
        $blackout.css({'opacity': 0}).hide();
    }
    else {
        $blockPage.css({
            'position': '',
            'top': 0
        });
        $body.addClass($class);
        $blackout.show().css({'opacity': 1 - $winTop / $blockScrollH});
    }
}

function blind() {
    var $blind = $('.blind');

    if ($blind.length) {
        var $body = $('body');
        var $winTop = $(window).scrollTop();
        var $blockScrollH = $('.blind-scroll').innerHeight();
        var $blockPage = $('.blind-static');
        var $blockPageH = $blockPage.innerHeight();
        var $blindPageClass = 'blindUnderFixed';
        var $blackout = $blind.find('.blind-blackout');

        if (!$blind.hasClass('blind_disabled')) {

            _blindScroll($body, $winTop, $blockScrollH, $blindPageClass, $blockPage, $blackout);

            $blind.css({
                'height': $blockPageH + $blockScrollH
            });

            setTimeout(function () {
                $blind.css({
                    'height': $blockPage.innerHeight() + window.innerHeight
                });
            }, 1000);

            $(window).off('scroll.blind').on('scroll.blind', function () {
                var $selfWinTop = $(window).scrollTop();
                _blindScroll($body, $selfWinTop, $blockScrollH, $blindPageClass, $blockPage, $blackout);
            });
        }
        else {
            $body.addClass('blindDisabled');
        }
    }
}

//-----secondary-----
function heightBannerHead() {
    var section = $('.blind-scroll');
    if (section.length) {
        section.css({
            'height': window.innerHeight
        });
    }
}

$(function () {
    blind();
    heightBannerHead();
});

$(window).on('load', function () {
});
$(window).on('resize', function () {
    heightBannerHead();
    blind();
});