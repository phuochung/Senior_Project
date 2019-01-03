var shipItems = [];

let getQuantityInput = function (sender) {
    var quantityInput = sender.closest(".row.menu-item").find("input.quantity-value");
    return $(quantityInput[0]);
}

let saveAllItems = function () {
    let updateShipUrl = "ship/updateShipItems?token=" + localStorage.shipAccessToken;
    $.post(updateShipUrl, { shipItems: shipItems })
        .done(function (success) {
            if (success) {
                Materialize.toast('Giỏ hàng của bạn đã được cập nhật', 3000);
            }
        })
        .fail(function () {
            Materialize.toast("Có sự cố xảy ra. Vui lòng thử lại.", 3000)
        });
}

let updateAllItems = function () {
    shipItems = [];
    $(".row.menu-item").each(function (index) {
        let itemId = $(this).data("item-id");
        let quantityInput = $(this).find("input.quantity-value")[0];
        if (quantityInput === undefined) {
            return true;
        }

        let itemQuantity = parseInt($(quantityInput).val());
        if (itemQuantity === 0) {
            return true;
        }

        let itemName = $(this).find(".menu-item-name")[0].innerText;
        let shipItem = {
            name: itemName,
            numberDishs: itemQuantity,
            id: itemId
        }

        shipItems.push(shipItem);
    });
}

let updateCart = function (sender) {
    updateAllItems();
    saveAllItems();
};

$(function () {
    $(".btn-decrease").click(function () {
        var quantityInput = getQuantityInput($(this));
        var value = parseInt(quantityInput.val());
        if (value > 0) {
            quantityInput.val(value - 1);
        }
    });

    $(".btn-increase").click(function () {
        var quantityInput = getQuantityInput($(this));
        var value = parseInt(quantityInput.val());
        quantityInput.val(value + 1);
    });

    $(".btn-checkout").click(function () {
        updateAllItems();
        if (shipItems.length < 1) {
            Materialize.toast("Bạn vui lòng chọn món trước khi tiếp tục.", 3000)
        } else {
            showLoadingModal();
            saveAllItems();
            window.location = "/ship/shippingInformation?token=" + localStorage.shipAccessToken;
        }
    });

    $(".btn-cancel").click(function () {
        window.history.go(-1);
    });
});