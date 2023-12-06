var ApiLocal = "http://localhost:5022/";
function btnSubmit() {
    var txtUsername = $('#txtUsername').val();
    var txtPassword = $('#txtPassword').val();

    if (txtUsername != "" && txtPassword != "") {
        var jsonData =
        {
            username: txtUsername,
            password: txtPassword
        }

        $.ajax({
            type: "POST",
            url: ApiLocal + "login",
            data: JSON.stringify(jsonData),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                var isAdm = response.isAdmin;
                window.location.href = "/Order/Index?key=" + encodeURIComponent(isAdm);

             },
            error: function (e) {
                console.log(e)
            }
        });
    }

}
