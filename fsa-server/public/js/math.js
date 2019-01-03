const MathHelper = function() {
    return {
        random: function (min, max) {
            return Math.floor((Math.random() * (max - min + 1))) + min;
        }
    };
}();