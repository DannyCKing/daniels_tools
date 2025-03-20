﻿
function checkMyAnswer(myAnswer) {

    // we only allow numbers or space to by typed
    myAnswer = myAnswer.replace(/[^\d ]+/g, '');

    if (myAnswer.includes(" ")) {
        // clear out on a space bar
        myAnswer = "";
    }

    // update text box with properly formatted answer

    $("#answerTextBox").val(myAnswer);
    $("#answerTextBoxSmallScreenPotrait").val(myAnswer);

    if (myAnswer == currentAnswer.toString() &&
        myAnswer.length == currentAnswer.toString().length) {
        //makeTextGreenForShortTime();
        correctCount++;
        updateCorrectCount();
        beep();
        showNumbersForProblem();
        makeAnswerTextGreenForShortTime();

        if (mobileAndTabletCheck() == false) {
            $("#answerTextBox").trigger('focus');
        }
    }
    else if (myAnswer.length < currentAnswer.toString().length) {
        // my answer length is less than actual answer length
        makeAnswerClear();
    }
    else if (myAnswer.length == currentAnswer.toString().length) {
        // if we got here, the answer is wrong
        makeAnswerRed();
    }
    else if (myAnswer.length > 3) {
        // ignore any input longer than length
        var newAnswer = myAnswer.substring(0, 3);
        $("#answerTextBox").val(newAnswer);
        $("#answerTextBoxSmallScreenPotrait").val(newAnswer);
    }
}

function clearAnswerBox() {
    $("#answerTextBox").val("");
    $("#answerTextBoxSmallScreenPotrait").val("");
    $("#answerTextBox").css("background-color", "white");
    $("#answerTextBoxSmallScreenPotrait").css("background-color", "white");
}

function deleteCurrentUser() {
    loadCurrentUsersSettingsFromCookies();

    var indexToRemove = -1;

    for (var i = 0; i < localUsers.users.length; i++) {
        if (currentUser.UserId == localUsers.users[i].UserId) {
            indexToRemove = i;
            break;
        }
    }

    if (indexToRemove != -1) {
        localUsers.users.splice(indexToRemove, 1);
    }

    saveUserListToCookie();

    var cookieName = getCurrentUserCookieName();
    deleteCookie(cookieName);
}


function getFirstNumber() {
    var numbers = [];

    for (var i = 0; i <= 12; i++) {
        if (currentUser.Settings.FirstNumber[i]) {
            numbers.push(i);
        }
    }

    if (numbers.length == 0) {
        return 1;
    }
    else {
        var idx = Math.floor(Math.random() * numbers.length);
        return numbers[idx];
    }
}

function getSecondNumber() {
    var numbers = [];

    for (var i = 0; i <= 12; i++) {
        if (currentUser.Settings.SecondNumber[i]) {
            numbers.push(i);
        }
    }

    if (numbers.length == 0) {
        return 1;
    }
    else {
        var idx = Math.floor(Math.random() * numbers.length);
        return numbers[idx];
    }
}

function getOperation() {
    var operations = [];

    if (currentUser.Settings.Operations.Add) {
        operations.push("+");
    }
    if (currentUser.Settings.Operations.Subtract) {
        operations.push("-");
    }
    if (currentUser.Settings.Operations.Multiply) {
        operations.push("x");
    }
    if (currentUser.Settings.Operations.Divide) {
        operations.push("÷");
    }

    if (operations.length == 0) {
        return "+";
    }
    else {
        var idx = Math.floor(Math.random() * operations.length);
        return operations[idx];
    }

    return "x";
}

function getAnswer(num1, num2, operation) {
    if (operation == "+") {
        return num1 + num2;
    }
    else if (operation == "-") {
        return num1 - num2;
    }
    else if (operation == "x") {
        return num1 * num2;
    }
    else if (operation == "÷") {
        return num1 / num2;
    }
}

function hideProblems(isTimed) {
    $('.show_during_test').each(function (i, obj) {
        $(this).hide();
    });

    $('.show_during_timed_test').each(function (i, obj) {
        $(this).hide();
    });

    $('.hide_during_test').each(function (i, obj) {
        $(this).show();
    });

    if (isTimed) {
        $('.show_after_timed_test').each(function (i, obj) {
            $(this).show();
        });
    }
}

function hideTimer() {
    $('#secondsSpan').hide();
}


function makeAnswerTextGreenForShortTime() {
    $("#answerTextBox").css("background-color", "green");
    $("#answerTextBoxSmallScreenPotrait").css("background-color", "green");

    setTimeout(function () {
        clearAnswerBox();
    }, 500)
}

function makeAnswerRed() {
    $("#answerTextBox").css("background-color", "red");
    $("#answerTextBoxSmallScreenPotrait").css("background-color", "red");
}

function makeAnswerClear() {
    $("#answerTextBox").css("background-color", "white");
    $("#answerTextBoxSmallScreenPotrait").css("background-color", "white");

}

function selectUser(userId) {
    currentUser = {};
    currentUser.UserId = 0;

    for (var i = 0; i < localUsers.users.length; i++) {
        var currentUserInList = localUsers.users[i];
        if (currentUserInList.UserId == userId) {
            currentUser = currentUserInList;
            setCookie(CURRENT_USER_ID_COOKIE_NAME, userId);
            break;
        }
    }

    // set current user to new user in case we update
    newUser = currentUser;

    loadCurrentUsersSettingsFromCookies(currentUser.UserId);



    if (currentUser.UserId != 0) {
        $('#usersModal').modal('hide');
    }

    $("#smallUserDiv").html("");
    $("#smallUserDiv").html(currentUser.Username);

    $("#currentUserDiv").html("");

    var avatar = EMOJI_DICTIONARY[currentUser.AvatarId];
    var userDivHTML = "<div class='current_user_label'>" + currentUser.Username + "</div><div class='current_user_avatar'>" + avatar + "</div>";

    $("#currentUserDiv").html(userDivHTML);
}

function showNumbersForProblem() {
    var firstNumber = getFirstNumber();
    var secondNumber = getSecondNumber();
    var operation = getOperation();

    var shouldWeFlip = currentUser.Settings.Operations.SwapNumbers;

    var flip = Math.floor(Math.random() * 2) == 1;
    if (shouldWeFlip && flip && (operation == "+" || operation == "x")) {
        var temp = firstNumber;
        firstNumber = secondNumber;
        secondNumber = temp;
    }

    // to check numbers for subtraction so we can't get negative numbers
    if (operation == "-" && firstNumber < secondNumber) {
        // swap the numbers back, we don't want the
        // answer to be negative
        var temp = firstNumber;
        firstNumber = secondNumber;
        secondNumber = temp;
    }

    // to do: for division, generate first number and second number
    if (operation == "÷") {
        firstNumber = firstNumber * secondNumber;
    }

    currentAnswer = getAnswer(firstNumber, secondNumber, operation);

    $("#firstNumberDiv").html(firstNumber);
    $("#firstNumberDivSmallScreen").html(firstNumber);

    $("#secondNumberDiv").html(secondNumber);
    $("#secondNumberDivSmallScreen").html(secondNumber);

    $("#operationDiv").html(operation);
    $("#operationDivSmallScreen").html(operation);

    if (mobileAndTabletCheck() == false) {
        $("#answerTextBox").trigger('focus');
    }
}

function showProblems(isTimed) {
    $('.show_after_timed_test').each(function (i, obj) {
        $(this).hide();
    });

    $('.hide_during_test').each(function (i, obj) {
        $(this).hide();
    });

    $('.show_during_test').each(function (i, obj) {
        $(this).show();
    });

    if (isTimed) {
        $('.show_during_timed_test').each(function (i, obj) {
            $(this).show();
        });
    }

    showNumbersForProblem();
}

function stopTiming() {
    hideProblems(true);
    hideTimer();
    stopTimer();
}


function showTimer() {
    $('#secondsSpan').show();
}

function startTimer() {
    stopTimerStatus = false;
    timerEnd = new Date();
    timerEnd.setSeconds(timerEnd.getSeconds() + 60);
    tickTimer();
}

function stopTimer() {
    stopTimerStatus = true;
}


function tickTimer() {
    if (stopTimerStatus) {
        return;
    }

    var now = new Date();
    var seconds = (timerEnd.getTime() - now.getTime()) / 1000;
    var wholeSeconds = Math.floor(seconds);
    var interval = 300;

    $('#secondsSpan').html("00:" + pad2(wholeSeconds));
    $('#secondsSpanSmallScreen').html("00:" + pad2(wholeSeconds));


    if (wholeSeconds < 0) {
        wholeSeconds = 0;
        hideProblems(true);
        hideTimer();
        return;
    }

    setTimeout(function () {
        tickTimer();
    }, 1000)
}

function updateCorrectCount() {
    $('#correctCountSpan').html(correctCount);
}


// document.ready
$(function () {

    loadUserCookies();

    hideProblems(true);
    $('.show_after_timed_test').each(function (i, obj) {
        $(this).hide();
    });

    $('#usersModal').modal('show');




    $('#usersModal').on('hidden.bs.modal', function (e) {
        return;
        if (currentUser.UserId == 0) {
            var messageTitle = "No Users Selected";
            var messageBody = "No user was selected. Select the user icon to select a user";

            showMessageModal(true, messageTitle, messageBody);
        }
    });

    $('#currentUserProfileModal').on('shown.bs.modal', function (e) {
        // load current user into fields
        loadNewUserIntoUpdateFields();

        setTimeout(function () {
            //$("#updateProfileTextBox").trigger("focus");
        }, 2000);


        // is new user, show name entry
        if (newUser.Username == "") {
            //$('#chooseNameModal').modal('show');
        }
    });


    $('#chooseAvatarModal').on('show.bs.modal', function (e) {
        onAvatarScreenVisible();
    });

    // hide the math problems on page load
    $('.show_during_test').each(function (i, obj) {
        $(this).hide();
    });

    // show the start buttons on page load
    $('.hide_during_test').each(function (i, obj) {
        $(this).show();
    });

    $("#start_practice_button").on('click', function (event) {
        correctCount = 0;
        showProblems(false);
        hideTimer();
    })

    $("#start_timing_button").on('click', function (event) {
        correctCount = 0;
        showProblems(true);
        showTimer();
        startTimer();
    })

    $("#stop_timing_button").on('click', function (event) {
        stopTiming();
    })

    $("#deleteUserButton").on('click', function (event) {
        var warningMessage = "Are you sure you want to delete the user " + currentUser.Username + "?";
        $("#deleteUserModalBodyText").html(warningMessage);
        $('#deleteUserModal').modal('show');
    })

    $("#deleteConfirmationButton").on('click', function (event) {
        deleteCurrentUser();
        location.reload();
    })

    $("#stop_timing_button_small").on('click', function (event) {
        stopTiming();
    })

    $("#onChooseNameButton").on('click', function (event) {
        window.location.href = "ModifyUser";
    })


    $(".current_problem_small").on('click', function (event) {
        var buttonId = $(this).attr('id');
        var buttonValue = buttonId.replace(/\D/g, '');
        if (buttonValue == "") {
            buttonValue = " "
        }
        var currentText = $("#answerTextBoxSmallScreenPotrait").val();
        var newAnswer = currentText + buttonValue;
        var currentText = $("#answerTextBoxSmallScreenPotrait").val(newAnswer);
        checkMyAnswer(newAnswer);
    });

    $('#answerTextBoxSmallScreenPotrait').on('input', function (e) {
        var myAnswer = $("#answerTextBoxSmallScreenPotrait").val();
        checkMyAnswer(myAnswer);
    })


    $('#updateProfileTextBox').on('input', function (e) {
        var currentName = $("#updateProfileTextBox").val();
        $("#currentUserProfileNameSpan").text(currentName);
    })

    $('#answerTextBox').on('input', function (e) {
        var myAnswer = $("#answerTextBox").val();

        checkMyAnswer(myAnswer);
    })

    $('#createNewUserButton').on('click', function (event) {
        // go to the new user page
        setCookie(CURRENT_USER_ID_COOKIE_NAME, "");
        location.href = 'ModifyUser';
    });

    // Every time a modal is shown, if it has an autofocus element, focus on it.
    $('.modal').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
    });


});