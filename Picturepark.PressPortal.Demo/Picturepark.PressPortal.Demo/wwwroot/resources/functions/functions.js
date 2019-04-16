//make header white if scroll position is not top
$(window).scroll(function () {
    var ScrollTop = parseInt($(window).scrollTop());

    if (ScrollTop > 150) {
        $("#main-header").addClass("scrollHeader", 500);
    }
    else {
        $("#main-header").removeClass("scrollHeader", 500);
    }
});

$(document).ready(function () {
    $("#et_search_icon").click(function () {
        $(".et_search_outer").addClass("searchActive");

        $(".et_close_search_field").click(function () {
            $(".et_search_outer").removeClass("searchActive");
        });
    });

    $(".entry-title").click(function () {
        $(".et_search_outer").removeClass("searchActive");
    });

});

$(document).ready(function () {
    $("#et_search_icon").click(function () { //move elements when opening search
        $(".et-search-form").fadeIn(500); //delay in opening search field

        if ($(window).width() > 1085) {
            $("#main-header").addClass("externalSearchActive", 500);
        }
        $(".et-search-field").focus();
        
        $(document).click(function (e) { //move elements when closing search
            if ($(e.target).closest("#main-header").length === 0) {
                $(".et_close_search_field").click();
                $("#main-header").removeClass("externalSearchActive", 500);
            }
            else if (e.target === $(".et_close_search_field")[0]) {
                $("#main-header").removeClass("externalSearchActive", 500);
            }
        });
    });
});


function hideDownloads() { //show donwloads only if any are available
    if ($("#downloadWrapper").children(".thumb").length === 0) {
        $("#downloadWrapper").hide();
    }
}


//mobile nav toggle function
function activateMobileNav() {
    if ($(window).width() < 1085) {
        //fill mobile nav with nav items
        $("#et_top_search").appendTo("#mobileNavItems").addClass("mobileNavActiveItems");
        $(".et_search_outer").appendTo("#et_top_search").addClass("mobileNavActiveItems");
        $("#top-menu-nav").appendTo("#mobileNavItems").addClass("mobileNavActiveItems");
        $("#moreInfo").appendTo("#mobileNavItems").addClass("mobileNavActiveItems");


        $(".mobile_menu_bar_toggle").click(function () {
            //mobile nav icon
            $(".mobile_nav").toggleClass("closed");
            $(".mobile_nav").toggleClass("opened");

            //display mobile nav and its components
            $("#mobileNavItems").toggleClass("mobileNavSleeping");
            $("#mobileNavItems").toggleClass("mobileNavActive");
            $(".logo_container").toggleClass("mobileNavActiveItems");
            $(".a2a_kit ").toggleClass("mobileNavActiveItems"); //hide social sharing links
        });
    }
    else {
        $("#moreInfo").appendTo("#et-top-navigation").removeClass("mobileNavActiveItems");
        $("#et_top_search").appendTo("#et-top-navigation").removeClass("mobileNavActiveItems");
        $(".et_search_outer").appendTo("#main-header").removeClass("mobileNavActiveItems");
        $("#top-menu-nav").appendTo("#et-top-navigation").removeClass("mobileNavActiveItems");
    }
}
$(document).ready(function () {
    activateMobileNav();
});
$(window).resize(function () {
    activateMobileNav();
});

function moreInfoOpen() {
    $("#moreInfoTooltip").toggleClass("moreInfoActive");

    $(window).scroll(function () { //close tooltip on scroll
        var ScrollTop = parseInt($(window).scrollTop());

        if (ScrollTop > 350) {
            $("#moreInfoTooltip").removeClass("moreInfoActive");
        }
    });

    $(document).click(function (e) { //close tooltip on click anywhere
        if ($(e.target).closest("#moreInfo").length === 0) {
            $("#moreInfoTooltip").removeClass("moreInfoActive");
        }
    });
}

/*--------ARTICLE OVERFLOW HANDLER START-----------*/
//define global vars
var pageCount = {};
var page = {};
var divInnerText = {};
var pageCreator = {};
var targetPage = {};
var getNumber = {};

$(document).ready(function () {
    var articleCount = $(".articlePreview").length;

    if (articleCount > 9) {
        $(".articlePreview:gt(8)").hide(); //hide overflow articles
        $("#nextPage").addClass("multiPageActive");
        $("#pageCount").addClass("multiPageActive");

        var divideByNine = Math.ceil(articleCount / 9);
        var para1 = 0;
        var para2 = 9;
        pageCreator.global = 1;

        for (pageCreator.global; pageCreator.global < divideByNine + 1; ++pageCreator.global) { //create html elements for every page
            page[pageCreator.global] = $(".articlePreview").slice(para1, para2);  //create a new var for every page
            para1 = para1 + 9;
            para2 = para2 + 9;
            $("#pageCount").append("<div id='pageNr" + pageCreator.global + "' class='pageNr'>" + pageCreator.global + "</div>");
        }

        pageCount.global = $(".pageNr");
        if (pageCount.global.length > 4) {
            var pageOverflow = pageCount.global.toArray().length - 3; //list overflow pages in an array
            pageOverflow = pageCount.global.slice(pageOverflow);
            pageOverflow.hide();
            $("#pageCount").append("<div id='pageOverflow'> ...</div>"); //add "..." instead of overflow articles
        }

        $("#pageNr1").addClass("pageActive"); //default active page is 1
    }
}); 

$(document).ready(function () {
    $(".pageNr").click(function () {
        divInnerText.global = $(this).text(); //get inner text of clicked page

        targetPage.global = $(this);
        universalPaging(); //execute paging function
    });
});

function showNextPage() {
    getPageNumber();
    getNumber.global = getNumber.global + 1;
    targetPage.global = "#pageNr" + getNumber.global.toString();
    targetPage.global = $(targetPage.global);
    universalPaging();
    getNumber.global = null; //exit function and remove value from getnumber
}
function showLastPage() {
    getPageNumber();
    getNumber.global = getNumber.global -1;
    targetPage.global = "#pageNr" + getNumber.global.toString();
    targetPage.global = $(targetPage.global);
    universalPaging();
    getNumber.global = null; //exit function and remove value from getnumber
}

function getPageNumber() {
    getNumber.global = $(".pageActive").attr("id");
    getNumber.global = getNumber.global[getNumber.global.length - 1];
    getNumber.global = parseInt(getNumber.global);
}

function universalPaging() {
    $(".pageNr").removeClass("pageActive");
    targetPage.global.addClass("pageActive");

    if (getNumber.global) { //show and hide articles
        $(".articlePreview").hide();
        page[getNumber.global].show();
    }
    else {
        $(".articlePreview").hide();
        page[divInnerText.global].show();
    }
    
    $("html, body").animate({ scrollTop: 0 }, "slow");

    if ($("#pageNr1").hasClass("pageActive")) {
        $("#nextPage").addClass("multiPageActive");
        $("#lastPage").removeClass("multiPageActive");
    }
    else if (!$("#pageNr1").hasClass("pageActive") && !$(".pageNr:last").hasClass("pageActive")) {
        $("#nextPage").addClass("multiPageActive");
        $("#lastPage").addClass("multiPageActive");
    }
    else {
        $("#nextPage").removeClass("multiPageActive");
        $("#lastPage").addClass("multiPageActive");
    }
}
/*--------ARTICLE OVERFLOW HANDLER END-----------*/