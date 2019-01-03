const Roulette = function () {
    var numOfQuestions;
    var questions;

    function initResults(game) {
        $(`#${game}-results`).html("");
        var img = Preloader.getImage(`result-${numOfQuestions}-0`);
        img.addClass("result");
        img.addClass("default");
        img.attr("id", `${game}-result-${numOfQuestions}-0`);
        $(`#${game}-results`).append(img);
    }

    function initIcons(game) {
        $(`#${game}-icons`).html("");
        for (var i = 1; i <= numOfQuestions; i++) {
            var img = Preloader.getImage(`icon-${numOfQuestions}-${i}`);
            img.addClass("icon");
            img.addClass(`icon-${numOfQuestions}-${i}`);
            Clicker.bind(img, function () {
                $(`#${game}-section-${numOfQuestions}-${i}`).trigger(Clicker.getClickEvent());
            });
            $(`#${game}-icons`).append(img);
        }
    }

    function initSections(game, defaultColor, onSectionClicked) {
        $(`#${game}-sections`).html("");
        for (var i = 1; i <= numOfQuestions; i++) {
            var img = Preloader.getImage(`section-${numOfQuestions}-${defaultColor}-${i}`);
            img.addClass("section");
            img.attr("id", `${game}-section-${numOfQuestions}-${i}`);
            img.data("id", i);
            img.data("questionId", questions[i - 1].id);
            img.data("value", 0);
            Clicker.bind(img, onSectionClicked);
            questions[i - 1].sectionId = i;
            $(`#${game}-sections`).append(img);
        }
    }

    function initGoBtn(game, onGoBtnClicked) {
        var img = Preloader.getImage('go-btn');
        img.addClass("btn-go");
        img.attr("id", `${game}-go-btn`);
        Clicker.bind(img, onGoBtnClicked);

        $(`#${game}-content`).append(img);
    }

    return {
        getNumOfQuestions: function () {
            return numOfQuestions;
        },

        setNumOfQuestions: function (value) {
            numOfQuestions = value;
        },

        getQuestions: function () {
            return questions;
        },

        setQuestions: function (value) {
            questions = value;
            numOfQuestions = questions.length;
        },

        getQuestionBySectionId: function (sectionId) {
            return questions[sectionId - 1];
        },

        getQuestionById: function (id) {
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].id == id) {
                    return questions[i];
                }
            }
            return null;
        },

        init: function (game, defaultColor, onSectionClicked, onGoBtnClicked) {
            initResults(game);
            initSections(game, defaultColor, onSectionClicked);
            initIcons(game);
            initGoBtn(game, onGoBtnClicked);
        }
    }
}();