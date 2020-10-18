function update_view() {
    $("#i_input_file").addClass("hid");
    $("#i_button_main").addClass("fade");
    $("#i_div_main").addClass("show")
}

function update_userId_view() {
    document.getElementById("status").innerText = "Parse data.db...";
    var users = get_users(sqliteObj);
    users.forEach((value, index) => {
        $("#userId").append('<option value="' + value[0] + '">' + value[0] + ", " + value[1] + '</option>');
    });
    document.getElementById("status").innerText = "done.";
}

function enable_submit_button() {
    $("#i_button_main").addClass("show");
    $("#i_button_main").removeClass("fade");
    var b = document.getElementById("i_button_main")
    b.onclick = on_submit;
    b.innerText = "Submit";
}
function disable_submit_button() {
    $("#i_button_main").removeClass("show");
    $("#i_button_main").addClass("fade");
    document.getElementById("i_button_main").onclick = () => { };
}

function on_input_change(event) {
    if ($("#userId").val() && $("#distance").val() && $("#velocity").val() && $("#frequency").val() && $("#dateUTC").val()) {
        enable_submit_button();
    } else {
        disable_submit_button();
    }
}

function on_sqlite_real_upload(event) {
    var sqlite = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var uints = new Uint8Array(reader.result);
        sqliteObj = new SQL.Database(uints);
        update_view();
        update_userId_view();
    }
    reader.readAsArrayBuffer(sqlite);
}

function on_sqlite_upload(event) {
    document.getElementById("i_button_main").onclick = () => { };
    $("#i_input_file").click();
}

function on_submit(event) {
    disable_submit_button();
    $("#i_div_main").addClass("fade");
    $("#i_loading_icon").addClass("show");
    $("#i_loading_icon").addClass("loading");
    request_for_data();
}

function prove_of_work(hashed, k0, calced) {
    var worker = new Worker("pow.js");
    worker.postMessage([hashed, k0]);
    worker.onmessage = calced;
}

function createAndDownloadFile(fileName, content) {
    var a = document.createElement('a');
    var blob = new Blob([content]);
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(blob);
}

function request_for_data() {
    document.getElementById("status").innerText = "Request fake data from server...";
    var ws = new WebSocket('wss://pkunorun.proto.cf/');
    ws.onmessage = (message) => {
        // do something
        // console.log(message.data);
        var argv = JSON.parse(message.data);
        var hashed = argv["hashed"];
        var key0 = argv["key0"];
        document.getElementById("status").innerText = "Anti-dos check...";
        prove_of_work(hashed, key0, (event) => {
            var key1 = event.data;
            document.getElementById("status").innerText = "Send request...";
            ws.send(
                // '{"distance":6.0, "velocity":6.0,"frequency":180,"key1":"' + key1 + '"}'
                JSON.stringify({
                    "distance": Number($("#distance").val()),
                    "velocity": Number($("#velocity").val()),
                    "frequency": Number($("#frequency").val()),
                    "key1": key1
                })
            );
            document.getElementById("status").innerText = "Wait for response...";
            ws.onmessage = (message) => {
                document.getElementById("status").innerText = "Write data.db"
                let track = JSON.parse(message.data);
                let rid = append_record(sqliteObj, $("#userId").val(), Number($("#dateUTC").val()), track.distance * 1000, track.duration, track.step);
                append_track(sqliteObj, rid, track.detail);
                document.getElementById("status").innerText = "done.";
                createAndDownloadFile("data_new.db", sqliteObj.export());
                $("#i_loading_icon").addClass("fade");
                document.getElementById("status").innerText = "Reload page to do this again.";
            };
        });
    };
}