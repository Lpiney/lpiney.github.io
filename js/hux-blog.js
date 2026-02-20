// Hux Blog Core Functions

// Archive functionality
$(document).ready(function() {
    var $articleList = $('.article-list');
    var $categoryLinks = $('.panel-category a');
    var $tagLinks = $('.tagCloud a');

    // Category filtering
    $categoryLinks.on('click', function(e) {
        e.preventDefault();
        var category = $(this).data('category');
        filterArticles('.' + category);
        setActiveLink($categoryLinks, this);
    });

    // Tag filtering
    $tagLinks.on('click', function(e) {
        e.preventDefault();
        var tag = $(this).data('tag');
        filterArticles('.' + tag);
        setActiveLink($tagLinks, this);
    });

    function filterArticles(selector) {
        $articleList.children('article').hide();
        $articleList.children('article' + selector).fadeIn();
    }

    function setActiveLink($links, activeElement) {
        $links.removeClass('active');
        $(activeElement).addClass('active');
    }
});

// Navigation highlight
$(document).ready(function() {
    var $sections = $('section');
    var $navigation = $('nav ul li a');

    $(window).on('scroll', function() {
        var currentScroll = $(this).scrollTop();
        var $currentSection;

        $sections.each(function() {
            var $this = $(this);
            var top = $this.offset().top - 60;
            var bottom = top + $this.outerHeight();

            if (currentScroll >= top && currentScroll < bottom) {
                $currentSection = $this;
            }
        });

        if ($currentSection) {
            $navigation.removeClass('active');
            $($navigation[$currentSection.index()]).addClass('active');
        }
    });
});