$(document).ready(function(){
    $("#enter").click( () => {
        POST("/login", {username: $("#username").val(), password: $("#password").val()}, (data) => {
            if(data.passed == false) {
                alert(data.reason);
            }
            if(data.redirect) window.location = data.redirect;

        });
    });
});