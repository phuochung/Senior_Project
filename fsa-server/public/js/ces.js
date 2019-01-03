const Ces = function () {
    var numOfQuestions, questions, numOfAnswers = 3, currentAnswers = [];
    var flashTimer, goId = 1;
    // function initCloseBtn() {
    //     var url = Preloader.getImageUrl('close');
    //     $("#ces-btn-close").attr('src', url);
    //     $("#ces-btn-close").click(function () {
    //         $("#ces-popup-err").hide();
    //     });
    // }

    function initNextBtn() {
        $("#ces-btn-next").click(function () {
            $("#game-ces").hide();
            $("#game-rank").show();
        });
    }

    function getSelectedQuestions() {
        var questionIds = [];
        $("#game-ces .section.selected").each(function () {
            var id = $(this).data("questionId");
            questionIds.push(id);
        });
        return questionIds;
    }

    function getSectionIdsFromQuestionIds(questionIds) {
        var sectionIds = [];

        var questions = Roulette.getQuestions();

        for (var i = 0; i < questions.length; i++) {
            for (var j = 0; j < questionIds.length; j++) {
                if (questions[i].id == questionIds[j]) {
                    sectionIds.push(questions[i].sectionId);
                }
            }
        }

        return sectionIds;
    }

    function getSubmitData() {
        var answers = [];
        for (var i = 0; i < questions.length; i++) {
            var answer = {
                criteriaId: questions[i].id,
                value: 0
            };

            for (var j = 0; j < currentAnswers.length; j++) {
                if (questions[i].sectionId == currentAnswers[j]) {
                    answer.value = 1;
                }
            }

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
            img.addClass("ces-go-btn");
            img.attr("id", `ces-go-btn-${i}`);
            img.css("display", "none");
            $(`#ces-content`).append(img);
        }
        var img = Preloader.getImage(`go-btn-5`);
        img.addClass("btn-go");
        img.attr("id", `ces-go-btn-5`);
        Clicker.bind(img, onGoBtnClicked);
        $(`#ces-content`).append(img);

        flashTimer = setInterval(function () {
            if (goId > 4) goId = 1;
            if (goId == 1) {
                $(".ces-go-btn").hide();
            }
            $(`#ces-go-btn-${goId}`).show();
            goId++;
        }, 125);
    }

    function stopFlashGoBtn() {
        clearInterval(flashTimer);
        $(".btn-go").hide();
        $("#ces-go-btn").show();
        $("#rank-go-btn").show();
    }

    function onSectionClicked() {
        var id = $(this).data("id");

        var index = currentAnswers.indexOf(id);

        if (index > -1) {
            currentAnswers.splice(index, 1);
            toggleValue(id);
        } else {
            if (currentAnswers.length === numOfAnswers) {
                toggleValue(currentAnswers[0]);
                currentAnswers.splice(0, 1);
            }
            currentAnswers.push(id);
            toggleValue(id);
        }
        if (currentAnswers.length == 3) {
            flashGoBtn();
        } else {
            stopFlashGoBtn();
        }
    }

    function toggleValue(id) {
        var el = $(`#ces-section-${numOfQuestions}-${id}`);
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
            Roulette.init("ces", 0, onSectionClicked, onGoBtnClicked);
            numOfQuestions = Roulette.getNumOfQuestions();
            questions = Roulette.getQuestions();
            // initCloseBtn();
            initNextBtn();
            $(".customer-name").text(`${localStorage.name},`);
            $("#provider-name").text(localStorage.providerName);
            $("#ces-err").modal();
        },

        getAnswers: function () {
            return currentAnswers;
        }
    }
}();