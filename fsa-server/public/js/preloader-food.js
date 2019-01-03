const Preloader = function () {
    var version = "2.0";
    var imgs = [], paths = [], doneItems = 0, root = "/public/img/food/";

    function initPaths() {
        initMainPaths();
        initRolettePaths();
    }

    function initMainPaths() {
        addPath("background", `${root}background-${MathHelper.random(1, 3)}.png?v=${version}`);
        addPath("go-btn", `${root}go-button.png?v=${version}`);
        for (var i = 1; i <= 5; i++) {
            addPath(`go-btn-${i}`, `${root}go-button-${i}.png?v=${version}`);
        }
    }

    function initRolettePaths() {
        var i = 6; // 6 parts
        for (var j = 1; j <= i; j++) {
            for (var l = 0; l <= 1; l++) {
                var path = `${root}section/${i}/section-${i}-${l}-${j}.png?v=${version}`;
                var key = `section-${i}-${l}-${j}`;
                addPath(key, path);
            }
        }

        for (var j = 0; j <= 1; j++) {
            var path = `${root}result/${i}/result-${i}-${j}.png?v=${version}`;
            var key = `result-${i}-${j}`;
            addPath(key, path);
        }

        var questions = Roulette.getQuestions();
        for (var j = 0; j < questions.length; j++) {
            var path = `${root}item/${questions[j].foodItem}?v=${version}`;
            var key = `icon-${i}-${j + 1}`;
            addPath(key, path);
        }
    }

    function addPath(key, path) {
        paths.push({
            key: key,
            value: path
        });
    }

    function onItemLoaded() {
        doneItems++;
        var percent = parseInt(doneItems * 100 / (paths.length + 1));
        $("#loader").width(percent + "%");
        $("#load-percent").text(percent);
        if (percent == 100) {
            onAllItemsLoaded();
        }
    }

    function onAllItemsLoaded() {
        showBackground();
        $("#loader-container").hide();
        $("#game-container").show();

        Food.init();

        $("#body-background").width($(window).width());
        $("#body-background").height($(window).height());
    }

    function showBackground() {
        var img = getImageByKey("background");
        img.className = "body-background";
        img.id = "body-background";
        $("body").append(img);
    }

    function getDataUrl(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL("image/png");
    }

    function getImageByKey(key) {
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].key === key) {
                return imgs[i].value;
            }
        }
        return null;
    }

    function loadGame() {
        var url = `/foodgame?token=${localStorage.token}&lang=${getLanguage()}`;
        Http.get(url, null, function (rs) {
            $(`#game-food`).html(rs);
            onItemLoaded();
        });
    }

    function loadQuestions(callback) {
        questions = JSON.parse(localStorage.food_menu);
        Roulette.setQuestions(questions);
        callback();
    }

    function getLanguage() {
        var url = new URL(location.href);

        var lang = "en";
        var params = url.search.replace("?","").split("&");
        for(var i =0; i< params.length;i++){
            if(params[i].startsWith("lang=")){
                lang = params[i].substring(5);
                break;
            }
        }

        return lang;
    }

    return {
        getImageUrl: function (key) {
            var img = getImageByKey(key);
            return getDataUrl(img);
        },

        getImage: function (key) {
            var img = getImageByKey(key);
            return $(img).clone();
        },

        load: function () {
            loadQuestions(function () {
                initPaths();

                for (var i = 0; i < paths.length; i++) {
                    var img = new Image();
                    img.onload = onItemLoaded;
                    img.src = paths[i].value;
                    imgs.push({
                        key: paths[i].key,
                        value: img
                    });
                }
                loadGame();
            });
        }
    }
}();