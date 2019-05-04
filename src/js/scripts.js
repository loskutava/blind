//-----blind-----
function _blindScroll($body, $winTop, $winH, $class, $blockPage, $blackout) {
    if ($winTop > $winH - 1) {
        $blockPage.css({
            'position': 'relative',
            'top': $winH
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
        $blackout.show().css({'opacity': 1 - $winTop / $winH});
    }
}

function blind() {
    var $blind = $('.blind');

    if ($blind.length) {
        var $body = $('body');
        var $winTop = $(window).scrollTop();
        var $winH = window.innerHeight;
        var $blockPage = $('.blind-static');
        var $blockPageH = $blockPage.innerHeight();
        var $blindPageClass = 'blindUnderFixed';
        var $blackout = $blind.find('.blind-blackout');

        if (!$blind.hasClass('blind_disabled')) {

            _blindScroll($body, $winTop, $winH, $blindPageClass, $blockPage, $blackout);

            $blind.css({
                'height': $blockPageH + $winH
            });

            setTimeout(function () {
                $blind.css({
                    'height': $blockPage.innerHeight() + window.innerHeight
                });
            }, 1000);

            $(window).off('scroll.blind').on('scroll.blind', function () {
                var $selfWinTop = $(window).scrollTop();
                _blindScroll($body, $selfWinTop, $winH, $blindPageClass, $blockPage, $blackout);
            });
        }
        else {
            $body.addClass('blindDisabled');
        }
    }
}

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