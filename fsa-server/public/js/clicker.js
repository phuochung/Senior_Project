const Clicker = function () {
    var ua = navigator.userAgent;
    // var clickEvent = (ua.match(/iPad/i) || ua.match(/iPhone/)) ? "touchstart" : "click";
    var clickEvent = "click";
    var customClickEvent = "onclick";
    var clientX, clientY, pageX, pageY, isClicking = false;

    function calculateOffset(el) {
        var top = 0, left = 0;
        do {
            top += el.offsetTop || 0;
            left += el.offsetLeft || 0;
            el = el.offsetParent;
        } while (el);

        return {
            top: top,
            left: left
        };
    };

    function onElementClicked(e) {
        if (!isClicking) {
            pageX = e.pageX;
            pageY = e.pageY;
            clientX = e.clientX;
            clientY = e.clientY;
            isClicking = true;
        }

        var offset = calculateOffset(this);
        var x = pageX - offset.left;
        var y = pageY - offset.top;

        var w = this.width;
        var h = this.height;

        var ctx = document.createElement("canvas").getContext("2d");

        ctx.canvas.width = w;
        ctx.canvas.height = h;

        ctx.drawImage(this, 0, 0, w, h);

        var alpha = ctx.getImageData(x, y, 1, 1).data[3];
        if (alpha === 0) {
            $(this).hide();
            $(document.elementFromPoint(clientX, clientY)).trigger(clickEvent);
            isClicking = false;
            $(this).show();
        } else {
            $(this).trigger(customClickEvent, this);
            isClicking = false;
        }
    }

    return {
        getClickEvent: function () {
            return customClickEvent;
        },

        bind: function (element, onClicked) {
            element.click(onElementClicked);
            element.bind(customClickEvent, onClicked);
        }
    }
}();