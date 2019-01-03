const Food = function () {
    var numOfQuestions, questions, currentAnswer = 0;
    var flashTimer, goId = 1;

    function initNextBtn() {
        $("#food-btn-next").click(function () {
            $("#game-food").hide();
            $("#game-rank").show();
        });
    }

    function getSelectedQuestions() {
        var questionIds = [];
        $("#game-food .section.selected").each(function () {
            var id = $(this).data("questionId");
            questionIds.push(id);
        });
        return questionIds;
    }

    function getSectionIdFromQuestionId(questionId) {
        var questions = Roulette.getQuestions();

        for (var i = 0; i < questions.length; i++) {
            if (questions[i].id == questionId) {
                return questions[i].sectionId;
            }
        }

        return 0;
    }

    function getSubmitData() {
        var answers = [];
        for (var i = 0; i < questions.length; i++) {
            var answer = {
                criteriaId: questions[i].id,
                name: questions[i].name,
                value: questions[i].sectionId == currentAnswer ? 1 : 0
            };

            answers.push(answer);
        }
        return {
            answers: answers
        };
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function flashGoBtn() {
        stopFlashGoBtn();
        for (var i = 1; i <= 4; i++) {
            var img = Preloader.getImage(`go-btn-${i}`);
            img.addClass("btn-go");
            img.addClass("food-go-btn");
            img.attr("id", `food-go-btn-${i}`);
            img.css("display", "none");
            $(`#food-content`).append(img);
        }
        var img = Preloader.getImage(`go-btn-5`);
        img.addClass("btn-go");
        img.attr("id", `food-go-btn-5`);
        Clicker.bind(img, onGoBtnClicked);
        $(`#food-content`).append(img);

        flashTimer = setInterval(function () {
            if (goId > 4) goId = 1;
            if (goId == 1) {
                $(".food-go-btn").hide();
            }
            $(`#food-go-btn-${goId}`).show();
            goId++;
        }, 125);
    }

    function stopFlashGoBtn() {
        clearInterval(flashTimer);
        $(".btn-go").hide();
        $("#food-go-btn").show();
        $("#rank-go-btn").show();
    }

    function onSectionClicked() {
        var id = $(this).data("id");
        if (currentAnswer != 0) {
            toggleValue(currentAnswer);
        }

        if (currentAnswer == id) {
            currentAnswer = 0;
            stopFlashGoBtn();
        } else {
            currentAnswer = id;
            toggleValue(id);
            flashGoBtn();
        }
    }

    function toggleValue(id) {
        var el = $(`#food-section-${numOfQuestions}-${id}`);
        var value = el.data("value");
        if (value == 0) {
            setSectionValue(el, 1);
        } else {
            setSectionValue(el, 0);
        }
    }

    function setSectionValue(el, value) {
        var id = el.data("id");
        el.data("value", value);
        if (value == 1) {
            el.addClass("selected");
            el.removeClass("unselected");
        } else {
            el.addClass("unselected");
            el.removeClass("selected");
        }
        el.attr("src", Preloader.getImageUrl(`section-${numOfQuestions}-${value}-${id}`));
    }

    return {
        init: function () {
            Roulette.init("food", 0, null, onGoBtnClicked);
            numOfQuestions = Roulette.getNumOfQuestions();
            questions = Roulette.getQuestions();
            initNextBtn();
            flashGoBtn();
            $(".customer-name").text(`${localStorage.name},`);
            $("#provider-name").text(localStorage.providerName);
            $("#food-err").modal();
        },

        getAnswers: function () {
            return currentAnswer;
        }
    }
}();