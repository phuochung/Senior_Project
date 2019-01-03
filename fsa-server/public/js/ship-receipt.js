$(function () {
    $(".btn-back").click(function(){  
        showLoadingModal();      
        window.location = "/ship/shippingInformation?token=" + localStorage.shipAccessToken;
    });

    $(".btn-continue").click(function(){
        showLoadingModal();
        window.location = "/ship/complete?token=" + localStorage.shipAccessToken;
    });
    
    $(".btn-cancel").click(function(){
        closeWebview();
    });
});