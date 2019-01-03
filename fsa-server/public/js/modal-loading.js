function showLoadingModal(){
    $('.loading-modal').show();
    $('body').addClass('no-scroll');
}

function hideLoadingModal(){
    $('.loading-modal').hide();
    $('body').removeClass('no-scroll');
}