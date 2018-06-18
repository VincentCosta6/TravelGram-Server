$(document).ready(function() { 
    $("#addf").on("submit", (function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Image",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                console.log(data);
            },
            error: function(data) {
              console.log(data.reason);
            }
          });
    }));
    GET("/userInfo", {}, (data) => {
        $("#username").html(data.user.username + "");
        $("#email").html(data.user.email + "");
    });
    $("#logout").click( ()=> {
        POST("/logout", {}, (data) => {
            if(data.passed == false) {
                alert(data.reason);
            }
            if(data.redirect) window.location = data.redirect;

        });
    });
    $("#search").click( () => {
        $("#arr1").empty();
        GET("/findUser", {username: $("#find").val()}, (data) => {
            for(let i in data.users)
            {
                let a = `<li>${data.users[i]}</li>`;
                $("#arr1").append(a);
            }
        });
    });
});