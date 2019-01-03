
function closeWebview() {
    MessengerExtensions.requestCloseBrowser(function success() {
        // webview closed
    }, function error(err) {
        // an error occurred
        Materialize.toast('Your request has been processed.<br />Please close this page to see the result.', 3000);
    });
}

function getBookInfoFromUI() {
    return {
        date: $('#book-date').val(),
        time: $('#book-time').val(),
        size: $('#book-size').val(),
        note: $('#book-note').val(),
    }
}

var requiredFields = ["#book-date", "#book-time", "#book-size"];

function validateInputForm() {
    for (var field of requiredFields) {
        if ($(field).val() === "") {
            var error = $(field).data("error");
            $(field).addClass("required-field");
            Materialize.toast(error, 3000);
            validationResult = false;
            return false;
        }
    };

    return true;
}

$(function () {
    $("input").focus(function () {
        $(this).removeClass("required-field");
    });

    $('#book-date').pickadate({
        format: 'dd/mm/yyyy',
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'OK',
        closeOnSelect: true // Close upon selecting a date,
    });

    $('#book-time').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: true, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function () { } //Function for after opening timepicker
    });

    $('.btn-cancel').off('click');
    $('.btn-cancel').click(function () {
        window.history.go(-1);
    });

    $(".btn-book").off('click');
    $(".btn-book").click(function () {
        if (!validateInputForm()) {
            return;
        }

        var actionToken = localStorage.providerActionToken;
        var submitBookUrl = "/book/submit?token=" + actionToken;

        var bookInfo = getBookInfoFromUI();

        $.post(submitBookUrl, bookInfo)
            .done(function (success) {
                if (success) {
                    closeWebview();
                }
            })
            .fail(function () {
                Materialize.toast("Có sự cố xảy ra. Vui lòng thử lại.", 3000)
            });
    });
});