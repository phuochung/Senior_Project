$(function(){
    $(".menu-item").click(function(){
        let detailsLink = $(this).data("details-link");
        window.location.href = detailsLink;
    })
});