var modifyUser = {};
function initializeModifyUser() {
    modifyUser = {};
    modifyUser.AvatarId = 0;
    var studentName = "";
    modifyUser.OriginalUsername = studentName;
    modifyUser.Username = studentName;
    modifyUser.Color = "";
    modifyUser.IsNewUser = true;
    modifyUser.Settings = new Settings();
}

function loadCurrentUserIntoUpdateFields() {

    // load current username
    $("#newUsernameTextBox").val(modifyUser.Username);
    $("#currentUserProfileNameSpan").html(modifyUser.Username);

    // load current avatar
    var avatar = EMOJI_DICTIONARY[modifyUser.AvatarId];
    if (!avatar) {
        avatar = "";
    }

    var avatarHTML = "<div class='current_user_avatar'>" + avatar + "</div>";
    $("#currentUserProfileAvatarDiv").html(avatarHTML);

    // load current color
    $("#currentUserProfileColor").css('background-color', modifyUser.Color);
}

function onRefresh() {
    initializeModifyUser();
    loadUsersIntoMemoryFromCookies();
    var currentUserId = getCookie(CURRENT_USER_ID_COOKIE_NAME);
    if (currentUserId == "") {
        // if creating new user auto show name modal
        $('#chooseNameModal').modal('show');
        modifyUser.IsNewUser = true;
    }
    else {
        // is existing user
        for (var i = 0; i < localUsers.users.length; i++) {
            var currentUserInList = localUsers.users[i];
            if (currentUserInList.UserId == currentUserId) {
                modifyUser = currentUserInList;

                // to do - find out where this would go
                //turnOnOffNumberButtonsBasedOnSettings();
                //turnOnOffOperationButtonsBasedOnSettings();

                //setCookie(CURRENT_USER_ID_COOKIE_NAME, currentUserId);
                break;
            }
        }

        modifyUser.IsNewUser = false;

    }

    loadCurrentUserIntoUpdateFields();

}


function saveModifiedUserToMemory() {
    if (modifyUser.UserId && modifyUser.UserId != "") {
        // we already have a user id, update the user
        for (var i = 0; i < localUsers.users.length; i++) {
            if (localUsers.users[i].UserId == newUser.UserId) {
                localUsers.users[i] = newUser;
                selectUser(newUser.UserId);
            }
        }
    }
    else {
        // set id of new user to timestamp
        modifyUser.UserId = getTimeStamp();

        localUsers.users.push(modifyUser);
    }
    saveUserListToCookie();


    if (modifyUser.Settings.OperationsInitialized == false) {
        // redirect to operations page
        location.href = "Operations";
    }
    else if (modifyUser.Settings.NumbersInitialized == false) {
        // redirect to numbers page
        location.href = "Numbers";
    }
    else {
        // go back to main page on save
        location.href = 'Main';
    }
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

function setNewAvatar() {
    if (modifyUser.AvatarId === 0) {
        $("#avatarErrorSpan").html("Choose An Avatar");
        return;
    }
    loadCurrentUserIntoUpdateFields();

    //clear avatar error if exists
    $("#avatarErrorSpan").html("");

    // avatar is good, move on to color
    $('#chooseAvatarModal').modal('hide');

    if (modifyUser.Color == "") {
        // avatar is good, move on to color
        $('#chooseColorModal').modal('show');
    }
}


function setModifyUsername() {
    modifyUser.Username = $("#newUsernameTextBox").val();

    modifyUser.Username = modifyUser.Username.trim();

    if (modifyUser.Username === null || modifyUser.Username.match(/^\s*$/) !== null) {
        errorString = "Please enter a value";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    // only validation we are doing for the name
    if (modifyUser.Username.length > 20) {
        errorString = "Name is too long";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    if (!isStringAlphaNumeric(modifyUser.Username)) {
        errorString = "Only letters and numbers please";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    // clear any name error if it exists
    $("#nameErrorSpan").html("");


    if (modifyUser.OriginalUsername == "") {
        // only set the original username if this is a new user we are creating
        modifyUser.OriginalUsername = modifyUser.Username;
    }

    loadCurrentUserIntoUpdateFields();

    $('#chooseNameModal').modal('hide');

    if (modifyUser.AvatarId == 0) {
        // if they have not chosen an avatar (if it is a new user)
        // automatically show the avatar modal
        $('#chooseAvatarModal').modal('show');
    }
}

function turnNumberOnOff(buttonId) {

    const items = buttonId.split("_");

    if (items.length < 2) {
        //not valid button that was pressed
        return;
    }
    else if (items.length == 2) {
        //specific number portion not found, this is the "All On" button
        var isFirst = items[1] == 1;
        if (isFirst) {
            for (var i = 0; i <= 12; i++) {
                currentUser.Settings.FirstNumber[i] = true;
            }
        }
        else {
            for (var i = 0; i <= 12; i++) {
                currentUser.Settings.SecondNumber[i] = true;
            } W
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

    //checkIfAtLeastOneNumberIsOn();

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

function loadEventHandlers() {

    // on emoji search
    $('#emojiSearchBox').on('input', function (e) {
        searchEmojis();
    });

    $('#chooseNameModal').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
    });

    $("#closeUsernameModalButton").on('click', function (event) {
        if (modifyUser.IsNewUser) {
            // cancel the whole creation process
            // go back to main page
            location.href = 'Main';
        }
        else {
            // cancel just the name modal opening
            $('#chooseNameModal').modal('hide');
        }
    });

    $("#cancelAvatarButton").on('click', function (event) {
        if (modifyUser.IsNewUser) {
            // cancel the whole creation process
            // go back to main page
            location.href = 'Main';
        }
        else {
            // cancel just the name modal opening
            $('#chooseNameModal').modal('hide');
        }
    });

    $("#setNewUsernameButton").on('click', function (event) {
        setModifyUsername();
    });


    // on emoji button clicked
    $(".emoji_button").on('click', function (event) {

        $('.emoji_button').each(function (i, obj) {
            $(this).css('background-color', 'transparent');
        });

        $(this).css('background-color', 'lime');

        // get the id of the clicked element
        var idString = $(this).attr('id')

        // get just the number in the string
        idString = idString.replace(/\D/g, '');
        modifyUser.AvatarId = idString;

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
        modifyUser.Color = $(this).attr('name');
    });

    // on number button clicked
    $(".number_button").on('click', function (event) {
        var buttonId = $(this).attr('id');
        turnNumberOnOff(buttonId)
    });


    $("#setAvatarButton").on('click', function () {
        setNewAvatar();
    });

    $("#setColorButton").on('click', function () {
        loadCurrentUserIntoUpdateFields();
    });

    $("#updateUserProfileButton").on('click', function () {
        saveModifiedUserToMemory();
    });

    $("#cancelUserChangesButton").on('click', function () {
        modifyUser = {};

        // go back to main page
        location.href = 'Main';
    });


}// end of event handlers

// document.ready
$(function () {
    onRefresh();

    loadEventHandlers();
});