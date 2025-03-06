

const USER_LIST_COOKIE_NAME = "users_list";

const USER_REPLACEMENT = "<<user_id>>";

const USERS_SETTINGS_COOKIE_NAME = "user_" + USER_REPLACEMENT + "_settings";

var localUsers = {};

var currentUser = {};
currentUser.UserId = 0;
currentUser.Settings = {};

var currentAnswer = 0;

var newUser = {};
newUser.Username = "";
newUser.AvatarId = 0;

var timerEnd = Date.now();

var correctCount = 0;
var stopTimerStatus = false;

function getCookieName(username, firstOrSecond, number) {
    var partOne = "";
    if (firstOrSecond == 1) {
        partOne = "First";
    }
    else {
        partOne = "Second";
    }

    var partTwo = number;

    return username + "_" + partOne + "_" + partTwo;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadUserCookies() {
    localUsers = {};
    localUsers.users = [];

    var userCookieString = getCookie(USER_LIST_COOKIE_NAME);

    if (userCookieString) {
        try {
            localUsers = JSON.parse(userCookieString);
        }
        catch (e) {
            // error parsing, clear out list
            localUsers = {};
            localUsers.users = [];
        }
    }

    reloadUserListFromMemory();
}

function reloadUserListFromMemory() {
    var usersHTML = "";
    $("#userListErrorSpan").html("");

    if (localUsers.users.length == 0) {
        usersHTML = "";
        $("#userListErrorSpan").html(usersHTML);
    }
    else {
        for (var i = 0; i < localUsers.users.length; i++) {
            var user = localUsers.users[i];
            var avatar = EMOJI_DICTIONARY[user.AvatarId];
            usersHTML += "<div class='col-xxl-4 col-xl-4 col-lg-4 col-md-5 col-sm-12 user_button_div'><button style='width: 80%; background-color: " + user.Color + "'  onclick = 'selectUser(" + user.UserId + ")' ><div class='user_emoji_font'>" + avatar + "</div><div><p class='user_label_font'>" + user.Username + "</p></div></button ></div> ";
        }
    }
    usersHTML += "<div class='col-xxl-4 col-xl-4 col-lg-4 col-md-5 col-sm-12 user_button_div'><button style='width: 80%;background-color: blue;' data-bs-toggle='modal' data-bs-target='#chooseNameModal' ><div class='user_emoji_font'><i class='bi bi-plus-lg'></i></div><div><p class='user_label_font'>Add</p></div></button ></div> ";

    $("#userList").html(usersHTML);
}


function setCookie(cookieName, cookieValue) {
    const d = new Date();
    var lifeTimeInDays = 360;
    d.setTime(d.getTime() + (lifeTimeInDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getElementName(firstOrSecond, number) {

}


function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};

function setNewUserUsername() {
    var newusername = $("#newUsernameTextBox").val();
    var errorString = "";

    if (newusername == "") {
        errorString = "Name cannot be blank!";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    if (!isAlphaNumeric(newusername)) {
        errorString = "Name can only contains letters and numbers";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    // clear name error if it exists
    $("#nameErrorSpan").html("");

    newUser.Username = newusername;

    // clear out current emoji
    newUser.AvatarId = 0;
    $('.emoji_button').each(function (i, obj) {
        $(this).css('background-color', 'transparent');
    });

    // username is good, continue on
    $('#chooseNameModal').modal('hide');

    $('#chooseAvatarModal').modal('show');
}

function setNewAvatar() {
    if (newUser.AvatarId === 0) {
        $("#avatarErrorSpan").html("Choose An Avatar");
        return;
    }
    //clear avatar error if exists
    $("#avatarErrorSpan").html("");

    // avatar is good, move on to color
    $('#chooseAvatarModal').modal('hide');
    $('#chooseColorModal').modal('show');
}

function pad2(n) { return n < 10 ? '0' + n : n }

function getTimeStamp() {
    var date = new Date();

    var returnValue = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

    return returnValue;
}

function saveCurrentUserSettingsIntoCookies() {
    var userCookieName = USERS_SETTINGS_COOKIE_NAME.replace(USER_REPLACEMENT, currentUser.UserId);
    var settingsString = JSON.stringify(currentUser.Settings);
    setCookie(userCookieName, settingsString);
}

function loadCurrentUsersSettingsFromCookies() {
    var userCookieName = USERS_SETTINGS_COOKIE_NAME.replace(USER_REPLACEMENT, currentUser.UserId);
    var userSettingsString = getCookie(userCookieName);

    if (userSettingsString == "") {
        // load default
        currentUser.Settings = getDefaultSettings();
        saveCurrentUserSettingsIntoCookies();
    }
    else {
        try {
            currentUser.Settings = JSON.parse(userSettingsString);
        }
        catch (e) {
            currentUser.Settings = getDefaultSettings();
            saveCurrentUserSettingsIntoCookies();
        }
    }
}

function getDefaultSettings() {
    var result = {};

    result.FirstNumber = [];
    result.SecondNumber = [];

    for (var i = 0; i <= 12; i++) {
        result.FirstNumber[i] = true;
        result.SecondNumber[i] = true;
    }

    result.Operations = {};
    result.Operations.Add = false;
    result.Operations.Subtract = false;
    result.Operations.Multiply = true;
    result.Operations.Divide = false;

    result.PasswordProtected = false;
    result.Password = "";

    result.FlipNumbers = true;

    return result;
}

function turnOnOffNumberButtonsBasedOnSettings() {
    // turn off on correct number buttons
    for (var i = 0; i <= 12; i++) {

        var firstNumberButtonId = "buttonnumber_1_" + i.toString();
        $("#" + firstNumberButtonId).removeClass("number_button_on");
        $("#" + firstNumberButtonId).removeClass("number_button_off");


        var onOffLabel1Id = "onoffnumber_1_" + i.toString();
        if (currentUser.Settings.FirstNumber[i]) {
            $("#" + firstNumberButtonId).addClass("number_button_on");
            $("#" + onOffLabel1Id).html("ON");
        }
        else {
            $("#" + firstNumberButtonId).addClass("number_button_off");
            $("#" + onOffLabel1Id).html("OFF");
        }

        var secondNumberButtonId = "buttonnumber_2_" + i.toString();
        var onOffLabel2Id = "onoffnumber_2_" + i.toString();

        $("#" + secondNumberButtonId).removeClass("number_button_on");
        $("#" + secondNumberButtonId).removeClass("number_button_off");

        if (currentUser.Settings.SecondNumber[i]) {
            $("#" + secondNumberButtonId).addClass("number_button_on");
            $("#" + onOffLabel2Id).html("ON");
        }
        else {
            $("#" + secondNumberButtonId).addClass("number_button_off");
            $("#" + onOffLabel2Id).html("OFF");
        }
    }
}

function turnOnOffOperationButtonsBasedOnSettings() {
    $("#add_operation_button").removeClass("operation_button_on");
    $("#add_operation_button").removeClass("operation_button_off");

    if (currentUser.Settings.Operations.Add) {
        $("#add_operation_button").addClass("operation_button_on");
        $("#onoff_add").html("ON");
    }
    else {
        $("#add_operation_button").addClass("operation_button_off");
        $("#onoff_add").html("OFF");
    }

    $("#subtract_operation_button").removeClass("operation_button_on");
    $("#subtract_operation_button").removeClass("operation_button_off");

    if (currentUser.Settings.Operations.Subtract) {
        $("#subtract_operation_button").addClass("operation_button_on");
        $("#onoff_sub").html("ON");
    }
    else {
        $("#subtract_operation_button").addClass("operation_button_off");
        $("#onoff_sub").html("OFF");
    }

    $("#multiply_operation_button").removeClass("operation_button_on");
    $("#multiply_operation_button").removeClass("operation_button_off");

    if (currentUser.Settings.Operations.Multiply) {
        $("#multiply_operation_button").addClass("operation_button_on");
        $("#onoff_multiply").html("ON");
    }
    else {
        $("#multiply_operation_button").addClass("operation_button_off");
        $("#onoff_multiply").html("OFF");
    }

    $("#divide_operation_button").removeClass("operation_button_on");
    $("#divide_operation_button").removeClass("operation_button_off");

    if (currentUser.Settings.Operations.Divide) {
        $("#divide_operation_button").addClass("operation_button_on");
        $("#onoff_divide").html("ON");
    }
    else {
        $("#divide_operation_button").addClass("operation_button_off");
        $("#onoff_divide").html("OFF");
    }
}

function selectUser(userId) {
    currentUser = {};
    currentUser.UserId = 0;

    for (var i = 0; i < localUsers.users.length; i++) {
        var currentUserInList = localUsers.users[i];
        if (currentUserInList.UserId == userId) {
            currentUser = currentUserInList;
            break;
        }
    }

    loadCurrentUsersSettingsFromCookies(currentUser.UserId);

    turnOnOffNumberButtonsBasedOnSettings();

    turnOnOffOperationButtonsBasedOnSettings();
    
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

function saveUserListToCookie() {
    var localUsersString = JSON.stringify(localUsers);
    setCookie(USER_LIST_COOKIE_NAME, localUsersString);
}

function saveNewUserToMemory() {
    if (newUser.UserId != "") {
        // we already have a user id, update the user
        for (var i = 0; i < localUsers.users.length; i++) {
            if (localUsers.users[i].UserId == newUser.UserId) {
                localUsers.users[i] = newUser;
                selectUser(newUser.UserId);
            }
        }
    }
    else{
        // set id of new user to timestamp
        newUser.UserId = getTimeStamp();

        localUsers.users.push(newUser);
    }
    saveUserListToCookie();

    reloadUserListFromMemory();

    newUser = {};

    $('#chooseColorModal').modal('hide');
}

function showMessageModal(isError, messageTitle, messageBody) {
    $("#MessageModalBodyText").removeClass("error_text");
    $("#MessageModalBodyText").removeClass("normal_text");

    if (isError) {
        $("#MessageModalBodyText").addClass("error_text");
    } else {
        $("#MessageModalBodyText").addClass("normal_text");
    }

    $("#MessageModalTitle").html(messageTitle);
    $("#MessageModalBodyText").html(messageBody);

    $('#messageModal').modal('show');
}

function turnNumberOnOff(buttonId) {

    const items = buttonId.split("_");

    //we set the id of the number button to numberbutton_1_5
    // we the one represents is the first number of the two operations
    // and the 5 represents the number we are operating against
    var isFirstNumber = items[1] == 1;
    var numberToSet = items[2];


    if (isFirstNumber) {
        currentUser.Settings.FirstNumber[numberToSet] = !currentUser.Settings.FirstNumber[numberToSet];
    }
    else {
        currentUser.Settings.SecondNumber[numberToSet] = !currentUser.Settings.SecondNumber[numberToSet];
    }

    saveCurrentUserSettingsIntoCookies();

    turnOnOffNumberButtonsBasedOnSettings();
}


function turnOperationOnOff(buttonId) {
    const items = buttonId.split("_");

    var operationType = items[0];
    if (operationType == "add") {
        currentUser.Settings.Operations.Add = !currentUser.Settings.Operations.Add;
    }
    else if (operationType == "subtract") {
        currentUser.Settings.Operations.Subtract = !currentUser.Settings.Operations.Subtract;
    }
    else if (operationType == "multiply") {
        currentUser.Settings.Operations.Multiply = !currentUser.Settings.Operations.Multiply;
    }
    else if (operationType == "divide") {
        currentUser.Settings.Operations.Divide = !currentUser.Settings.Operations.Divide;
    }

    saveCurrentUserSettingsIntoCookies();

    turnOnOffOperationButtonsBasedOnSettings();
}

function searchEmojis() {
    var emojiSearchTerm = $("#emojiSearchBox").val().toUpperCase();
    $('.emoji_button').each(function (i, obj) {
        var currentDesc = $(this).attr('name')
        if (currentDesc.toUpperCase().indexOf(emojiSearchTerm) === -1) {
            // search term, not found, hide
            $(this).hide();
        }
        else {
            $(this).show();
        }
    });
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

function showNumbersForProblem() {
    var firstNumber = getFirstNumber();
    var secondNumber = getSecondNumber();
    var operation = getOperation();

    var shouldWeFlip = currentUser.Settings.FlipNumbers;

    var flip = Math.floor(Math.random() * 2) == 1;
    if (shouldWeFlip && flip) {
        var temp = firstNumber;
        firstNumber = secondNumber;
        secondNumber = temp;
    }

    currentAnswer = getAnswer(firstNumber, secondNumber, operation);

    $("#firstNumberDiv").html(firstNumber);
    $("#secondNumberDiv").html(secondNumber);
    $("#operationDiv").html(operation);
    $("#answerTextBox").trigger('focus');
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

function beep() {
    var snd = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAO1RYWFgAAAAPAAADVFhYWABpc29tbXA0MgBUU1NFAAAADgAAA0xhdmY2MS4xLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAFwAAB1AAJycnJzExMTE7Ozs7O0REREROTk5OWFhYWFhiYmJibGxsbHZ2dnZ2gICAgImJiYmTk5OTk52dnZ2np6ensbGxsbG7u7u7xMTExM7Ozs7O2NjY2OLi4uLs7Ozs7Pb29vb/////AAAAAExhdmM2MS4zLgAAAAAAAAAAAAAAACQCpQAAAAAAAAdQo3EaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAOAQAADAAAB5AqK4gD//+oEDn//+iBAxg+CDv/gM+c///8Hw+XD/B9/g+fxOH6ggQP9Tu3+eOE/2EBxf/6ZvNzA0//+MYxDoJUAVEUUAQAP/LhpNDM3IOf///0E3qNGJxE3////NB1jJk2OekHTjkEQVT////9EvuT5gy1IKJg0DlAEjf/////wFB/+MYxE8YK6KAEYKgAOANDAAEBsAGKACEIX3GuGqy3QBgMBgMBsNtASB//cx/8pSgv9GfMnR//osieMlF7//9SaR1pdOK7+///+MYxCkXc4rSWYJoALE0mGpkUhxH0VN/X1f+rWg6T7JpUR/I3/61//zogADMJEomJIlRdUf/xlAM1D//jCgCsfahCYH//////+MYxAYOY0qcMcCgAudb////U/qSRRQdF0dbLU///////q1mLEGIIGBAMIvA9yAW0lSGki5kxxakUGMjInkDzJUAxIB/4T///+MYxAcMUz6sWACpL//qRUIqMruRTu5GOrkO5A5if/////9a5cJ8rAOAABSRwEwTDJJLV6E6xdUAbb0Of8/Z/5/n/Zb42Ofl/+MYxBAOmwLgeAGVDk1Ttu5nf1LZU4z5pdjSU5RajjuicXJI2EauSX////T//+7jICNh/cRCUqoMP/X///////////iCEmEv/+MYxBAK+yaMEABrLP95sfM3IuJ9D6AmIQNMjALqzii6cLbLKiQKNyP/zb//////////////qqWXzhkT46gt5AOEoGHj6Bso/+MYxB8LIzJ4AAVHMIwWmjuGNIgYmB4+ypglAK6g/+v/8/1HA4AR4GACNyAICj8H0+bP////poEuTQxwGoCoFeIRr07/kSQX/+MYxC0KswacWABpLSEzCshMwhhQheLxeQhELD3R/1P10bTpPEGBqAAHFh0xjPGz4dDqpFX/1/////////////D///mhNFgm/+MYxD0KUxKMEABpZsNBC00A1qB/awY3HcQEmCmXjadTMUr/lv////////////4v/9uZzpwsjUFCiUQECUDWQAC9osREC82e/+MYxE4KKypsAAgpSCQv3f/D////////////////12rha/Vn61PelWnDLxBRAF7LWGnPnLa1z7VWpfBXDrn9J1/v/////////+MYxGAJ+x5sAAgrSP//8X//3QTYxSGuGqBxA2fA2KMgtbMCsVUDRGCVHDvlXWMV9dnfr//////////h/1////pUkKaZiRgZ/+MYxHMLcypoAAB1LBQupAQLwNDCgLqRzhzThVBIIKr+AjRqc////////////7//6DIMZnzzHRDxcQbMBmoIw1EQIanEsT8q/+MYxIAKgxpcAAgrSfVkYghRoL6H//l//9v//f/////q//2UqjpJP//PHC8fPF0ixZEEByAb+BokZBcONEunzh4vnb0Mhqpj/+MYxJELWxJYAAgrZc9xcASCQFyg1EY+XDioThOVAwgNl//6In/+2fvXf7a9f+oyn8l///////b//yUJUcwLqQsdAx8UwPIG/+MYxJ4J0w5cAAgpSSAkUQseFKiliVkuSk+cPz+07lS4EpUCZkfZM4156OUl52s5/d//////9SkkF/q//////////1///8ly/+MYxLEOUyJQAAgqyFCXHOAwaDAJBoAwxAYpW4NnQtSKXFKktJYlJ3nV9XDQPxIB4GxoTIqQHDCJY////////////Wv/Pfu//+MYxLIS+zYsADgrYP///////////5eLguABAADABAMqVA9PoEhAXIHMJYlCGnuNqtKNDCEiEtTDwUYgvQQVmMTju////////+MYxKER4zYsAGAqaP///9Wq7f////ZFJaKlrUn/+dLnbau7pHloJpnjc2NT5PEVLwywzoAIwDiIwvL//gUIgdEILhnv/4IR/+MYxJQQqx44AUegAcBhh4gIMeOkihFyyThF6i//L///////////VVq///9Squuv///9GYmKiiYqI0xMiNLxO////+DdILpC/+MYxIwX06JEAYWgAOMcgmTx0mUCNkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq/+MYxGcNMxIQAYGAAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    snd.play();
}

function showTimer() {
    $('#secondsSpan').show();
}
function hideTimer() {
    secondsSpan
}

function startTimer() {
    stopTimerStatus = false;
    timerEnd = new Date();
    timerEnd.setSeconds(timerEnd.getSeconds() + 60);
    tickTimer();
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

function stopTimer() {
    stopTimerStatus = true;
}

function makeAnswerTextGreenForShortTime() {
    //$("#answerTextBox").css("border", "5px solid green");//more efficient
    $("#answerTextBox").css("background-color", "green");

    //$('#answerTextBox').addClass('green_box');
    //$('#answerTextBox').animate({ backgroundColor: '#008000' }, 500);
    setTimeout(function () {
        clearAnswerBox();
    }, 500)
}

function clearAnswerBox() {
    $("#answerTextBox").val("");
    //$("#answerTextBox").css("border-color", "black");
    $("#answerTextBox").css("background-color", "white");
    //$('#answerTextBox').removeClass('green_box');
}


// document.ready
$(function () {

    loadUserCookies();

    hideProblems(true);
    $('.show_after_timed_test').each(function (i, obj) {
        $(this).hide();
    });

    $('#usersModal').modal('show');

    $("#setNewUsernameButton").on('click', function () {
        setNewUserUsername();
    });

    $("#backAvatarButton").on('click', function () {
        $('#chooseAvatarModal').modal('hide');
        $('#chooseNameModal').modal('show');
    });

    $("#setAvatarButton").on('click', function () {
        setNewAvatar();
    });

    $("#backColorButton").on('click', function () {
        $('#chooseColorModal').modal('hide');
        $('#chooseAvatarModal').modal('show');
    });

    $("#setColorButton").on('click', function () {
        // show chose color modal
        $('#chooseColorModal').modal('hide');

        $('#chooseColorModal').modal('show');
    });

    // on emoji button clicked
    $(".emoji_button").on('click', function (event) {

        $('.emoji_button').each(function (i, obj) {
            $(this).css('background-color', 'transparent');
        });

        $(this).css('background-color', 'blue');

        // get the id of the clicked element
        var idString = $(this).attr('id')

        // get just the number in the string
        idString = idString.replace(/\D/g, '');
        newUser.AvatarId = idString;

        event.stopPropagation();
        event.stopImmediatePropagation();
    });

    // on color button clicked
    $(".color_button").on('click', function (event) {

        $('.color_button').each(function (i, obj) {
            $(this).removeClass("chosen_color_border");
            $(this).addClass("not_chosen_color_border");
        });

        $(this).removeClass("not_chosen_color_border");
        $(this).addClass("chosen_color_border");

        // get the name of the clicked element
        // which contains the color
        newUser.Color = $(this).attr('name');

        saveNewUserToMemory();
    });

    // on number button clicked
    $(".number_button").on('click', function (event) {
        var buttonId = $(this).attr('id');
        turnNumberOnOff(buttonId)
    });

    // on operation button clicked
    $(".operation_button").on('click', function (event) {
        var buttonId = $(this).attr('id');
        turnOperationOnOff(buttonId)
    });

    // on emoji search
    $('#emojiSearchBox').on('input', function (e) {
        searchEmojis();
    });

    $('#usersModal').on('hidden.bs.modal', function (e) {
        if (currentUser.UserId == 0) {
            var messageTitle = "No Users Selected";
            var messageBody = "No user was selected. Select the user icon to select a user";

            showMessageModal(true, messageTitle, messageBody);
        }
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
        hideProblems(true);
        hideTimer();
        stopTimer();
    })

    $("#onChooseNameButton").on('click', function (event) {
        // update name field with the existing fields
        var usernameTextBox = $("#newUsernameTextBox");
        //usernameTextBox.attr("placeholder", "");
        usernameTextBox.val(currentUser.Username);

        newUser = {};
        newUser.UserId = currentUser.UserId;
    })

    $('#answerTextBox').on('input', function (e) {
        var myanswer = $("#answerTextBox").val();
        if (myanswer == currentAnswer.toString()) {
            //makeTextGreenForShortTime();
            correctCount++;
            updateCorrectCount();
            beep();
            showNumbersForProblem();
            makeAnswerTextGreenForShortTime();
            
            $("#answerTextBox").trigger('focus');
        }

        // clear out on a space bar
        else if (myanswer.includes(" ")) {
            $("#answerTextBox").val("");
        }
    });


});