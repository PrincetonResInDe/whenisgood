var uri = "http://localhost:5000/api";
//var uri = "YApi.aspx";
function exec_action(method, record) {
    $.ajax({
        type: method,
        data: JSON.stringify(record),
        url: uri,
        contentType: "application/json",
        headers: { "accept": "application/json;odata=verbose", },
        withCredentials: true,
        success: function (data, status, jqXHR) {
            $("P").text(JSON.stringify(data));
            $("P").css('color', 'black');

        },
        error: function (jqXHR, status, message) {
            $("P").text(">>>>>ERROR:" + JSON.stringify(jqXHR));
            $("P").css('color', 'red');

        }
    });

}

function test() {
    // var request = { sp_name: "MDG_Project_Info", action: "list", par1: "", par2: "" };
    var str_command_line = $('#command_line').val();
    try {
        var request = JSON.parse(str_command_line);
    }
    catch (err) {
        $("P").text(err.message);
        $("P").css('color', 'red');
        return;
    }
    exec_action("POST", request);
}

/*
function JSONize(str) {
    return str
      // wrap keys without quote with valid double quote
      .replace(/([\$\w]+)\s*:/g, function (_, $1) { return '"' + $1 + '":' })
      // replacing single quote wrapped ones to double quote 
      .replace(/'([^']+)'/g, function (_, $1) { return '"' + $1 + '"' })
}
*/