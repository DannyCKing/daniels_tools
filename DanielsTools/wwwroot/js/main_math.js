
var currentAnswer = 0;
var firstNumber = 0;
var secondNumber = 0;
var operation = "+";

function addCorrectCountToUserInfo(correctCount) {
    loadCurrentUserInfoFromCookies();
    currentUser.UserInfo.Money = currentUser.UserInfo.Money + correctCount;
    saveCurrentUserInfoIntoCookies();

}
function setAllAnswers(currentValue) {
    $("#answerLabelMed").text(currentValue);
    $("#answerLabelSmall").text(currentValue);
}
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
        createProblem();
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
        setAllAnswers(newAnswer);
        $("#answerTextBox").val(newAnswer);
        $("#answerTextBoxSmallScreenPotrait").val(newAnswer);
    }
}

function clearAnswerBox() {
    $("#answerTextBox").val("");
    setAllAnswers("");

    makeAllAnswerBoxesHaveColor("white");
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

    saveUserListInMemoryToCookie();

    var cookieName = getCurrentUserSettingsCookieName();
    deleteCookie(cookieName);
    setCookie(CURRENT_USER_ID_COOKIE_NAME, "");
}

function getRandomValueFromList(possibleNumbers) {
    if (possibleNumbers.length == 0) {
        // if there are no numbers selected, we will just return the number one
        return 1;
    }
    else {
        var idx = Math.floor(Math.random() * possibleNumbers.length);
        return possibleNumbers[idx];
    }
}

function getListOfPossibleFirstNumbers() {
    var possibleNumbers = [];

    for (var i = 0; i <= 12; i++) {
        if (currentUser.Settings.FirstNumber[i]) {
            possibleNumbers.push(i);
        }
    }

    return possibleNumbers;
}

function getListOfPossibleSecondNumbers() {
    var possibleNumbers = [];

    for (var i = 0; i <= 12; i++) {
        if (currentUser.Settings.SecondNumber[i]) {
            possibleNumbers.push(i);
        }
    }

    return possibleNumbers;
}

function getFirstNumber() {
    var possibleNumbers = getListOfPossibleFirstNumbers();

    return getRandomValueFromList(possibleNumbers); 
}

function getSecondNumber() {
    var possibleNumbers = getListOfPossibleSecondNumbers();

    return getRandomValueFromList(possibleNumbers); 
}

function getListOfOperations() {
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

    return operations;
}

function getOperation() {
    var operations = getListOfOperations();

    if (operations.length == 0) {
        return "+";
    }
    else {
        var idx = Math.floor(Math.random() * operations.length);
        return operations[idx];
    }

    return "+";
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

function hideProblems(initialLoad, isTimed) {
    $('.show_during_test').each(function (i, obj) {
        $(this).hide();
    });

    $('.show_during_timed_test').each(function (i, obj) {
        $(this).hide();
    });

    $('.hide_during_test').each(function (i, obj) {
        $(this).show();
    });

    var practiceType = "Practice";

    if (isTimed) {
        //$('.show_after_timed_test').each(function (i, obj) {
        //    $(this).show();
        //});
        practiceType = "Timed test"
    }

    if (initialLoad == false) {
        showMessageModal(false, practiceType, "You got " + correctCount + " answers right during your " + practiceType.toLowerCase());

        addCorrectCountToUserInfo(correctCount);

        

        correctCount = 0;
    }
}

function hideTimer() {
    $('#secondsSpan').hide();
}


function makeAnswerTextGreenForShortTime() {
    makeAllAnswerBoxesHaveColor("green");

    setTimeout(function () {
        clearAnswerBox();
    }, 600)
}

function makeAllAnswerBoxesHaveColor(colorToUse){
    $("#answerTextBox").css("background-color", colorToUse);
    $("#answerLabelMed").css("background-color", colorToUse);
    $("#answerLabelSmall").css("background-color", colorToUse);
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

    for (var i = 0; i < localUsers.users.length; i++) {
        var currentUserInList = localUsers.users[i];
        if (currentUserInList.UserId == userId) {
            currentUser = currentUserInList;
            setCookie(CURRENT_USER_ID_COOKIE_NAME, userId);
            break;
        }
    }

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

function createProblem() {
    /// variable to indicate if this problem is an exact repeat of the previous problem
    var isRepeat = true;

    // variable to indicate if more than one problem is possible
    var multipleProblemsPossible = true;

    var firstTime = true;

    var previousFirstNumber = firstNumber;
    var previousSecondNumber = secondNumber;
    var previousOperation = operation;

    var possibleFirstNumbers = getListOfPossibleFirstNumbers();
    var possibleSecondNumbers = getListOfPossibleSecondNumbers();
    var possibleOperations = getListOfOperations();
    if (possibleFirstNumbers.length > 1 || possibleSecondNumbers.length > 1 || possibleOperations.length > 1 || currentUser.Settings.Operations.SwapNumbers) {
        multipleProblemsPossible = true;
    }
    else {
        multipleProblemsPossible = false;
    }


    ///  We want to avoid showing the same problem twice in a row
    ///  Therefore, if more than one problem is possible based on the settings
    ///  we will generate the problem until we get a new one
    ///  If the settings are set in such a way only one math problem is problem
    ///  we will obviously get repeats
    while (isRepeat && (firstTime || multipleProblemsPossible)) {
        firstTime = false;

        firstNumber = getFirstNumber();
        secondNumber = getSecondNumber();
        operation = getOperation();

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

        
        if (operation == "÷" && secondNumber == "0") {
            // don't divide by 0
            secondNumber = 1;
        }

        // for division generate the problem
        if (operation == "÷") {
            firstNumber = firstNumber * secondNumber;
        }

        if (previousFirstNumber == firstNumber && previousSecondNumber == secondNumber && previousOperation == operation) {
            isRepeat = true;
        }
        else {
            isRepeat = false;
        }
    }

    currentAnswer = getAnswer(firstNumber, secondNumber, operation);

    $("#firstNumberDiv").html(firstNumber);
    $("#firstNumberDivMed").html(firstNumber);
    $("#firstNumberDivSmall").html(firstNumber);

    $("#secondNumberDiv").html(secondNumber);
    $("#secondNumberDivMed").html(secondNumber);
    $("#secondNumberDivSmall").html(secondNumber);

    $("#operationDiv").html(operation);
    $("#operationDivMed").html(operation);
    $("#operationDivSmall").html(operation);

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

    createProblem();
}

function stopTiming() {
    hideProblems(false, false);
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
    $('#secondsSpanMedScreen').html("00:" + pad2(wholeSeconds));

    $('#secondsSpanSmallScreen').html("00:" + pad2(wholeSeconds));


    if (wholeSeconds <= 0) {
        wholeSeconds = 0;
        hideProblems(false, true);
        hideTimer();
        return;
    }

    setTimeout(function () {
        tickTimer();
    }, 100)
}

function updateCorrectCount() {
    $('#correctCountSpan').html(correctCount);
}

function loadCurrentUserIfSelected() {
    var currentUserId = getCookie(CURRENT_USER_ID_COOKIE_NAME);

    if (currentUserId != "") {
        selectUser(currentUserId);
    }
    else {
        $('#usersModal').modal('show');
    }
}


// document.ready
$(function () {

    loadUserCookies();

    loadCurrentUserIfSelected();

    hideProblems(true, true);
    $('.show_after_timed_test').each(function (i, obj) {
        $(this).hide();
    });


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

    $('#currentMoneyModal').on('show.bs.modal', function (e) {
        loadCurrentUserInfoFromCookies();
        $('#MoneyModalText').html("Current Balance: " + currentUser.UserInfo.Money + " coins");
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



    $("#deleteUserButton").on('click', function (event) {
        var warningMessage = "Are you sure you want to delete the user " + currentUser.Username + "?";
        $("#deleteUserModalBodyText").html(warningMessage);
        $('#deleteUserModal').modal('show');
    })

    $("#deleteConfirmationButton").on('click', function (event) {
        deleteCurrentUser();
        location.reload();
    })

    $(".stop_timing_button").on('click', function (event) {
        stopTiming();
    })

    $("#onChooseNameButton").on('click', function (event) {
        window.location.href = "ModifyUser";
    })

    $("#chooseOperationsButton").on('click', function (event) {
        window.location.href = "Operations";
    })


    $(".current_problem_small").on('click', function (event) {
        var buttonId = $(this).attr('id');
        var buttonValue = buttonId.replace(/\D/g, '');
        if (buttonValue == "") {
            buttonValue = " "
        }
        var currentText = $("#answerTextBox").val();
        var newAnswer = currentText + buttonValue;
        setAllAnswers(newAnswer);
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

    $('#chooseGradeButton').on('click', function (event) {
        // go to the new user page
        location.href = 'ChooseGrade';
    });

    // Every time a modal is shown, if it has an autofocus element, focus on it.
    $('.modal').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
    });


});