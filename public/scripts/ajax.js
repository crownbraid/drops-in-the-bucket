var roomInfo, userInfo, recordingLength, users, finishedUsers,
    ajax = {
        registerAccount: function() {
            var account = {
                username: $('#username').val(),
                password: $('#password').val(),
                email: $('#email').val()
            };
            $.ajax('/accounts/register', {
                type: 'POST',
                data: JSON.stringify(account),
                contentType: 'application/json',
                statusCode: {
                    201: function() {
                        console.log('logged in');
                    },
                    500: function() {
                        console.log('could not login');
                    }
                }
            }).done(function(res) {
                console.log(res);
                userInfo = res;
                load_userInfo(userInfo.username);
                div_hide('login'); 
                div_show('user-manager'); 
            }).fail(function(res) {

            });
        },
        getAccount: function() {
            var account = {
                username: $('#username').val(),
                password: $('#password').val()
            };
            $.ajax('/accounts/login', {
                type: 'POST',
                data: JSON.stringify(account),
                contentType: 'application/json',
                statusCode: {
                    201: function() {
                        console.log('logged in');
                    },
                    500: function() {
                        console.log('could not login');
                    }
                }
            }).done(function(res) {
                console.log(res);
                userInfo = res;
                load_userInfo(userInfo.username);
                div_hide('login'); 
                div_show('user-manager'); 
                // load_userInfo("real_Cool_Alan");
            }).fail(function(res) {
                console.log("login failed");
            });
        },
        refreshAccount: function() {
            $.ajax('/accounts/refresh', {
                type: 'GET',
                statusCode: {
                    201: function() {
                        console.log('logged in');
                    },
                    500: function() {
                        console.log('could not login');
                    }
                }
            }).done(function(res) {
                console.log(res);
                userInfo = res;
                load_userInfo(userInfo.username);
                div_hide('login'); 
                div_show('user-manager'); 
                // load_userInfo("real_Cool_Alan");
            }).fail(function(res) {
                console.log("login failed");
            });
        },
        getRoom: function(roomID) {
            var ajax = $.ajax('/rooms/' + roomID, {
                type: 'GET',
                contentType: 'application/json',
                statusCode: {
                    201: function() {
                        console.log('retrieved successfully');
                    },
                    500: function() {
                        console.log('could not retrieve');
                    }
                }
            }).done(function(res) {
                console.log(res);
                roomInfo = res; 
                openRoom();
            }).fail(function(res) {

            });
        },
        createRoom: function() {
            var room = {
                    name: $('#reg-roomname').val(),
                    rules: $('#reg-roomrules').val(),
                    timelimit: $('#reg-timelimit').val(),
                    invited: [$('#reg-invitedUsers').val()],
                    public: false
            };
            var ajax = $.ajax('/rooms', {
                type: 'POST',
                data: JSON.stringify(room),
                contentType: 'application/json',
                statusCode: {
                    201: function() {
                        console.log('submitted successfully');
                    },
                    500: function() {
                        console.log('error submitting');
                    }
                }
            }).done(function(res) {
                roomInfo = res.room;
                openRoom();
            }).fail(function(res) {

            });
        },
        deleteRoom: function(id) {
            var ajax = $.ajax('/rooms/' + id, {
                type: 'DELETE',
                dataType: 'json'
            });
            ajax.done(this.getItems.bind(this));
        },
        editRoom: function(id, name) {
            var item = {'name': name, 'id': id};
            var ajax = $.ajax('/rooms/' + id, {
                type: 'PUT',
                data: JSON.stringify(item),
                dataType: 'json',
                contentType: 'application/json'
            });
            ajax.done(this.getItems.bind(this));
        }
    };
/*
function errorReact(errList) {
    switch (errList[0]) {
        case 'No request body':
            text = "No request body";
            break; 
        case 'Missing field: username':
            text = "Today is Sunday";
            break; 
        case 'Incorrect field type: username':

        case 'Incorrect field length: username':

        case 'Missing field: password':

        case 'Incorrect field type: password':

        case 'Incorrect field type: password':

        default: 
            text = "Unexpected Error"
    }
}
*/