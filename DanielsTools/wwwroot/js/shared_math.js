

const USER_LIST_COOKIE_NAME = "mathamamania_users_list";

const USER_REPLACEMENT = "<<user_id>>";

const USERS_SETTINGS_COOKIE_NAME = "mathamamania_user_" + USER_REPLACEMENT + "_settings";

const CURRENT_USER_ID_COOKIE_NAME = "mathamamania_current_user_id";

var localUsers = {};

class Operations {
    constructor() {
        this.Add = false;
        this.Subtract = false;
        this.Multiply = true;
        this.Divide = false;
        this.SwapNumbers = true;
    }
}

class Settings {

    constructor() {
        this.FirstNumber = [];
        this.SecondNumber = [];
        this.NumbersInitialized = false;
        this.OperationsInitialized = false;

        for (var i = 0; i <= 12; i++) {
            this.FirstNumber[i] = true;
            this.SecondNumber[i] = true;
        }

        this.Operations = new Operations();

        this.PasswordProtected = false;
        this.Password = "";
    }
}


class MathUser {
    constructor() {
        this.UserId = 0;
        this.Settings = {};
        this.OriginalUsername = "";
        this.Username = "";
        this.Settings = new Settings();
    }
}


var currentUser = new MathUser();

var currentAnswer = 0;

var newUser = new MathUser();

var timerEnd = Date.now();

var correctCount = 0;
var stopTimerStatus = false;

window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


function checkIfAtLeastOneNumberIsOn() {
    var doesFirstOneHaveOneOn = false;
    for (var i = 0; i <= 12; i++) {
        if (currentUser.Settings.FirstNumber[i]) {
            doesFirstOneHaveOneOn = true;
            break;
        }
    }

    if (doesFirstOneHaveOneOn == false) {
        //none of the first numbers are on, turn on 1
        currentUser.Settings.FirstNumber[1] = true;
    }

    var doesSecondOneHaveOneOn = false;
    for (var i = 0; i <= 12; i++) {
        if (currentUser.Settings.SecondNumber[i]) {
            doesSecondOneHaveOneOn = true;
        }
    }

    if (doesSecondOneHaveOneOn == false) {
        //none of the first numbers are on, turn on 1
        currentUser.Settings.SecondNumber[1] = true;
    }
}

function isStringAlphaNumeric(str) {
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code => 48 && code <= 57) {
            //if character is 0-9
            continue;
        }
        else if (code => 65 && code <= 90) {
            // if character is A-Z (uppercase)
            continue;
        }
        else if (code >= 97 && code <= 122) {
            // if character is a-z (lower)
            continue;
        }
        else if (code == 32) {
            // if character is a space
            continue;
        }
        else if (code == 32) {
            // if character is a space
            continue;
        }
        else {
            // we don't know what it is
            return false;
        }
    }
    return true;
};


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

function deleteCookie(name) {
    var domain = window.location.hostname;

    if (getCookie(name)) {
        document.cookie = name + "=;path=/;domain=" + domain + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}


function loadUserCookies() {
    localUsers = {};
    localUsers.users = [];

    loadUsersIntoMemoryFromCookies();

    reloadUserListFromMemory();
}

function loadUsersIntoMemoryFromCookies() {
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
}

function setCookie(cookieName, cookieValue) {
    const d = new Date();
    var lifeTimeInDays = 360;
    d.setTime(d.getTime() + (lifeTimeInDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
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
            usersHTML += "<div class='col-12 col-sm-12 col-md-5 col-lg-5 col-xl-3 col-xxl-3  unselectable user_button_div'><button style='width: 100%; background-color: " + user.Color + "'  onclick = 'selectUser(" + user.UserId + ")' ><div class='user_emoji_font'>" + avatar + "</div><div><p class='user_label_font'>" + user.Username + "</p></div></button ></div> ";
        }
    }
    usersHTML += "<div class='col-12 col-sm-12 col-md-5 col-lg-5 col-xl-3 col-xxl-3  user_button_div unselectable '><button id='createNewUserButton' class='btn-success' style='width: 100%; '><div class='user_emoji_font'><i class='bi bi-plus-lg'></i></div><div><p class='user_label_font'>Add User</p></div></button ></div> ";

    $("#userList").html(usersHTML);
}

function createNewUser() {
    initializeModifyUser();
    loadCurrentUserIntoUpdateFields();
    $("#usersModal").modal('hide');
    $("#currentUserProfileModal").modal('show');
}


function onAvatarScreenVisible() {
    $('.emoji_button').each(function (i, obj) {
        $(this).css('background-color', 'transparent');
    });

    if (newUser.AvatarId != 0) {
        $('.emoji_button').each(function (i, obj) {
            $(this).css('background-color', 'transparent');
            var buttonId = $(this).attr('id');
            var avatarId = buttonId.replace(/\D/g, '');
            if (avatarId == newUser.AvatarId) {
                $(this).css('background-color', 'lime');
            }
        });
    }
}



function pad2(n) { return n < 10 ? '0' + n : n }

function getTimeStamp() {
    var date = new Date();

    var returnValue = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

    return returnValue;
}

function getCurrentUserCookieName() {
    var friendlyUserName = currentUser.OriginalUsername.toLowerCase().replace(/\W/g, '');
    var userCookieName = USERS_SETTINGS_COOKIE_NAME.replace(USER_REPLACEMENT, currentUser.UserId + "_" + friendlyUserName);
    return userCookieName;
}

function loadCurrentUsersSettingsFromCookies() {
    var userCookieName = getCurrentUserCookieName()
    var userSettingsString = getCookie(userCookieName);

    if (userSettingsString == "") {
        // load default
        currentUser.Settings = new Settings();
        saveCurrentUserSettingsIntoCookies();
    }
    else {
        try {
            currentUser.Settings = JSON.parse(userSettingsString);
        }
        catch (e) {
            currentUser.Settings = new Settings();
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

function saveCurrentUserSettingsIntoCookies() {
    var userCookieName = getCurrentUserCookieName()
    var settingsString = JSON.stringify(currentUser.Settings);
    setCookie(userCookieName, settingsString);
}

function saveUserListToCookie() {
    var localUsersString = JSON.stringify(localUsers);
    setCookie(USER_LIST_COOKIE_NAME, localUsersString);
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






