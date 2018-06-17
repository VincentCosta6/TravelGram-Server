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
    GET("/userInfo", (data) => {
        $("username").html(data.user.username);
        $("email").html(data.user.email);
    });
    
});