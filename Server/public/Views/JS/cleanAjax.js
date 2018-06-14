function cleanAjax(URL, TYPE, DATA, successFunction, dType)
{
    $.ajax({
        url: URL, //The URL to send to
        type: TYPE, //GET POST PUT DELETE
        data: DATA, //JSON data to pass to server
        success: successFunction, //Function that is executed once the request completes
        dataType: dType //The format of data to receive/send ex: 'json'
    });
}
function GET(url, data, success)
{
    cleanAjax(url, "GET", data, success, "json");
}
function POST(url, data, success)
{
    cleanAjax(url, "POST", data, success, "json");
}
function PUT(url, data, success)
{
    cleanAjax(url, "PUT", data, success, "json");
}
function DELETE(url, data, success)
{
    cleanAjax(url, "DELETE", data, success, "json");
}