

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

window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

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
            usersHTML += "<div class='col-xxl-3 col-xl-3 col-lg-3 col-md-5 col-sm-12 user_button_div'><button style='width: 80%; background-color: " + user.Color + "'  onclick = 'selectUser(" + user.UserId + ")' ><div class='user_emoji_font'>" + avatar + "</div><div><p class='user_label_font'>" + user.Username + "</p></div></button ></div> ";
        }
    }
    usersHTML += "<div class='col-xxl-3 col-xl-3 col-lg-3 col-md-5 col-sm-12 user_button_div'><button style='width: 80%;background-color: blue;' data-bs-toggle='modal' data-bs-target='#chooseNameModal' ><div class='user_emoji_font'><i class='bi bi-plus-lg'></i></div><div><p class='user_label_font'>Add</p></div></button ></div> ";

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

    result.Operations.SwapNumbers = true;

    result.PasswordProtected = false;
    result.Password = "";

    return result;
}

function turnOnOffNumberButtonsBasedOnSettings() {
    // turn off on correct number buttons
    for (var i = 0; i <= 12; i++) {

        // handle first number section
        var firstNumberButtonId = "buttonnumber_1_" + i.toString();
        $("#" + firstNumberButtonId).removeClass("number_button_on");
        $("#" + firstNumberButtonId).removeClass("number_button_off");

        var onOffLabel1Id = "onoffnumber_1_" + i.toString();
        var radioButton1Id = "firstNumber_1_" + i.toString();
        var parentOfRadioButton1Id = "parentFirstNumber_1_" + i.toString();

        $("#" + radioButton1Id).removeClass("bi-toggle-on");
        $("#" + radioButton1Id).removeClass("bi-toggle-off");
        $("#" + radioButton1Id).removeClass("green_font");
        $("#" + radioButton1Id).removeClass("red_font");

        if (currentUser.Settings.FirstNumber[i]) {
            $("#" + firstNumberButtonId).addClass("number_button_on");
            $("#" + radioButton1Id).addClass("bi-toggle-on");
            $("#" + radioButton1Id).addClass("green_font");

            $("#" + onOffLabel1Id).html("ON");

        }
        else {
            $("#" + firstNumberButtonId).addClass("number_button_off");
            $("#" + radioButton1Id).addClass("bi-toggle-off");
            $("#" + radioButton1Id).addClass("red_font");
            //$("#" + parentOfRadioButton1Id).addClass("toggle_rotate_90");

            $("#" + onOffLabel1Id).html("OFF");
        }

        // handle second number section
        var firstNumberButtonId = "buttonnumber_2_" + i.toString();
        $("#" + firstNumberButtonId).removeClass("number_button_on");
        $("#" + firstNumberButtonId).removeClass("number_button_off");

        var onOffLabel1Id = "onoffnumber_2_" + i.toString();
        var radioButton1Id = "firstNumber_2_" + i.toString();
        var parentOfRadioButton1Id = "parentFirstNumber_1_" + i.toString();

        $("#" + radioButton1Id).removeClass("bi-toggle-on");
        $("#" + radioButton1Id).removeClass("bi-toggle-off");
        $("#" + radioButton1Id).removeClass("green_font");
        $("#" + radioButton1Id).removeClass("red_font");

        if (currentUser.Settings.SecondNumber[i]) {
            $("#" + firstNumberButtonId).addClass("number_button_on");
            $("#" + radioButton1Id).addClass("bi-toggle-on");
            $("#" + radioButton1Id).addClass("green_font");

            $("#" + onOffLabel1Id).html("ON");

        }
        else {
            $("#" + firstNumberButtonId).addClass("number_button_off");
            $("#" + radioButton1Id).addClass("bi-toggle-off");
            $("#" + radioButton1Id).addClass("red_font");
            //$("#" + parentOfRadioButton1Id).addClass("toggle_rotate_90");

            $("#" + onOffLabel1Id).html("OFF");
        }
    }
}

function turnOnOffOperationButtonsBasedOnSettings() {
    $("#add_operation_button").removeClass("operation_button_on");
    $("#add_operation_button").removeClass("operation_button_off");
    $("#add_current_toggle").removeClass("bi-toggle-on");
    $("#add_current_toggle").removeClass("bi-toggle-off");

    if (currentUser.Settings.Operations.Add) {
        $("#add_operation_button").addClass("operation_button_on");
        $("#add_current_toggle").addClass("bi-toggle-on");
        $("#onoff_add").text("ON");

    }
    else {
        $("#add_operation_button").addClass("operation_button_off");
        $("#add_current_toggle").addClass("bi-toggle-off");
        $("#onoff_add").text("OFF");
    }

    $("#subtract_operation_button").removeClass("operation_button_on");
    $("#subtract_operation_button").removeClass("operation_button_off");
    $("#subtract_current_toggle").removeClass("bi-toggle-on");
    $("#subtract_current_toggle").removeClass("bi-toggle-off");

    if (currentUser.Settings.Operations.Subtract) {
        $("#subtract_operation_button").addClass("operation_button_on");
        $("#subtract_current_toggle").addClass("bi-toggle-on");
        $("#onoff_sub").text("ON");

    }
    else {
        $("#subtract_operation_button").addClass("operation_button_off");
        $("#subtract_current_toggle").addClass("bi-toggle-off");
        $("#onoff_sub").text("OFF");
    }

    $("#multiply_operation_button").removeClass("operation_button_on");
    $("#multiply_operation_button").removeClass("operation_button_off");
    $("#multiply_current_toggle").removeClass("bi-toggle-on");
    $("#multiply_current_toggle").removeClass("bi-toggle-off");

    if (currentUser.Settings.Operations.Multiply) {
        $("#multiply_operation_button").addClass("operation_button_on");
        $("#multiply_current_toggle").addClass("bi-toggle-on");
        $("#onoff_mult").text("ON");

    }
    else {
        $("#multiply_operation_button").addClass("operation_button_off");
        $("#multiply_current_toggle").addClass("bi-toggle-off");
        $("#onoff_mult").text("OFF");

    }

    $("#divide_operation_button").removeClass("operation_button_on");
    $("#divide_operation_button").removeClass("operation_button_off");
    $("#divide_current_toggle").removeClass("bi-toggle-on");
    $("#divide_current_toggle").removeClass("bi-toggle-off");

    if (currentUser.Settings.Operations.Divide) {
        $("#divide_operation_button").addClass("operation_button_on");
        $("#divide_current_toggle").addClass("bi-toggle-on");
        $("#onoff_divide").text("ON");

    }
    else {
        $("#divide_operation_button").addClass("operation_button_off");
        $("#divide_current_toggle").addClass("bi-toggle-off");
        $("#onoff_divide").text("OFF");

    }

    $("#swap_operation_button").removeClass("operation_button_on");
    $("#swap_operation_button").removeClass("operation_button_off");

    $("#swap_current_toggle").removeClass("bi-toggle-on");
    $("#swap_current_toggle").removeClass("bi-toggle-off");


    if (currentUser.Settings.Operations.SwapNumbers) {
        $("#swap_operation_button").addClass("operation_button_on");
        $("#swap_current_toggle").addClass("bi-toggle-on");
        $("#onoff_swap").text("ON");


    }
    else {
        $("#swap_operation_button").addClass("operation_button_off");
        $("#swap_current_toggle").addClass("bi-toggle-off");
        $("#onoff_swap").text("OFF");
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
    if (newUser.UserId && newUser.UserId != "") {
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

    if (items.length < 2) {
        //not valid
        return;
    }
    else if (items.length == 2) {
        //specific number portion not found, this is the all on button
        var isFirst = items[1] == 1;
        if (isFirst) {
            for (var i = 0; i <= 12; i++) {
                currentUser.Settings.FirstNumber[i] = true;
            }
        }
        else {
            for (var i = 0; i <= 12; i++) {
                currentUser.Settings.SecondNumber[i] = true;
            }
        }
    }
    else {
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
    else if (operationType == "swap") {
        currentUser.Settings.Operations.SwapNumbers = !currentUser.Settings.Operations.SwapNumbers;
        showMessageModal(false, "Swap Setting", "This setting will sometimes swap the first and second numbers in addition and multiplication facts.")
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

function stopTimer() {
    stopTimerStatus = true;
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

function clearAnswerBox() {
    $("#answerTextBox").val("");
    $("#answerTextBoxSmallScreenPotrait").val("");
    $("#answerTextBox").css("background-color", "white");
    $("#answerTextBoxSmallScreenPotrait").css("background-color", "white");
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
        makeAnswerRed();
    }
    else if (myanswer.length > 3) {
        // ignore any input longer than length
        var newAnswer = myAnswer.substring(0, 3);
        $("#answerTextBox").val(newAnswer);
        $("#answerTextBoxSmallScreenPotrait").val(newAnswer);
    }
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
        stopTiming();
    })

    $("#stop_timing_button_small").on('click', function (event) {
        stopTiming();
    })

    function stopTiming() {
        hideProblems(true);
        hideTimer();
        stopTimer();
    }

    $("#onChooseNameButton").on('click', function (event) {
        // update name field with the existing fields
        var usernameTextBox = $("#newUsernameTextBox");
        //usernameTextBox.attr("placeholder", "");
        usernameTextBox.val(currentUser.Username);

        newUser = {};
        newUser.UserId = currentUser.UserId;
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

    $('#answerTextBox').on('input', function (e) {
        var myAnswer = $("#answerTextBox").val();

        checkMyAnswer(myAnswer);




    })


});