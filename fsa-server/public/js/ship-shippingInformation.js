let getShipInfo = function () {
    let address = $("#input-field-to").val();
    let phone = $("#input-field-phone").val();
    let note = $("#input-field-note").val();

    return { address: address, phone: phone, note: note };
}

let storeShippingInformation = function (callback) {
    let updateShipInfoUrl = '/ship/updateShipInfo?token=' + localStorage.shipAccessToken;
    let shipInfo = getShipInfo();
    $.post(updateShipInfoUrl, { shipInfo: shipInfo })
        .done(function (success) {
            if (success) {
                Materialize.toast('Thông tin giao hàng của bạn đã được cập nhật.', 3000);
                if (callback !== undefined) {
                    callback();
                }
            }
        })
        .fail(function () {
            Materialize.toast("Có sự cố xảy ra. Vui lòng thử lại.", 3000)
        });
}

let validateInput = function () {
    if ($("#input-field-to").val().trim() === "") {
        $("#input-field-to").focus();
        Materialize.toast("Vui lòng nhập địa chỉ giao đến", 3000);
        return false;
    }

    if ($("#input-field-phone").val().trim() === "") {
        $("#input-field-phone").focus();
        Materialize.toast("Vui lòng nhập số điện thoại", 3000);
        return false;
    }

    return true;
}

$(function () {
    $(".btn-back").click(function () {
        showLoadingModal();
        storeShippingInformation(function () {
            window.location = "/ship?token=" + localStorage.shipAccessToken;
        });
    });

    $(".btn-continue").click(function () {
        if (validateInput()) {
            showLoadingModal();
            storeShippingInformation(function () {
                window.location = "/ship/receipt?token=" + localStorage.shipAccessToken;
            });
        }
    });

    $(".btn-cancel").click(function () {
        closeWebview();
    });
});