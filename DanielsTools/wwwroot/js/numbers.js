
function turnNumberOnOff(buttonId) {

    const items = buttonId.split("_");

    if (items.length < 2) {
        //not valid button that was pressed
        return;
    }
    else {
        //we set the id of the number button to numberbutton_1_5
        // we the one represents is the first number of the two operations
        // and the 5 represents the number we are operating against
        var isFirstNumber = items[1] == 1;
        var numberToSet = items[2];

        if (isFirstNumber) {
            modifyUser.Settings.FirstNumber[numberToSet] = !modifyUser.Settings.FirstNumber[numberToSet];
        }
        else {
            modifyUser.Settings.SecondNumber[numberToSet] = !modifyUser.Settings.SecondNumber[numberToSet];
        }
    }

    saveCurrentUserSettingsIntoCookies();

    turnOnOffNumberButtonsBasedOnSettings();
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

        if (modifyUser.Settings.FirstNumber[i]) {
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

        if (modifyUser.Settings.SecondNumber[i]) {
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

function onRefresh() {
    loadCurrentUserIntoMemoryFromCookies();
    loadCurrentUsersSettingsFromCookies();
    modifyUser = currentUser;
    turnOnOffNumberButtonsBasedOnSettings();

}

function saveUpdatedNumbersToMemory() {
    // we already have a user id, update the user
    for (var i = 0; i < localUsers.users.length; i++) {
        if (localUsers.users[i].UserId == modifyUser.UserId) {
            localUsers.users[i] = modifyUser;
        }
    }

    setCookie(CURRENT_USER_ID_COOKIE_NAME, modifyUser.UserId);

    saveUserListInMemoryToCookie();
}

// document.ready
$(function () {
    onRefresh();

    // on number button clicked
    $(".number_button").on('click', function (event) {
        var buttonId = $(this).attr('id');
        turnNumberOnOff(buttonId)
    });

    $("#saveNumberChangesButton").on('click', function () {
        saveUpdatedNumbersToMemory();

        // go back to main page
        location.href = 'Main';
    });

    $("#cancelNumberChangesButton").on('click', function () {
        modifyUser = {};

        // go back to main page
        location.href = 'Main';
    });
});