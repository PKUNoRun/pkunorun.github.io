function update_view() {
    $("#i_input_file").addClass("hid");
    $("#i_button_main").addClass("fade");
    $("#i_div_main").addClass("show")
}

function update_userId_view() {
    var users = get_users(sqliteObj);
    users.forEach((value, index) => {
        $("#userId").append('<option value="' + value[0] + '">' + value[0] + ", " + value[1] + '</option>');
    });
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

function prove_of_work(hashed, k0, calced){
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
    var ws = new WebSocket('wss://hamiltonhuaji.ml/wss/');
    // var ws = new WebSocket('ws://127.0.0.1:3000/');
    ws.onmessage = (message) => {
        // do something
        // console.log(message.data);
        var argv = JSON.parse(message.data);
        var hashed = argv["hashed"];
        var key0 = argv["key0"];
        prove_of_work(hashed, key0, (event)=>{
            var key1 = event.data;
            ws.send('{"distance":6.0, "velocity":6.0,"frequency":180,"key1":"'+key1+'"}');
            ws.onmessage = (message)=>{
                console.log(message.data);
                let rid = append_record(sqliteObj, $("#userId").val(), 1598918400000, 6.0, 2400, 114514);
                append_track(sqliteObj, rid, JSON.parse(message.data));
                createAndDownloadFile("data_new.db", sqliteObj.export());
                $("#i_loading_icon").addClass("fade");
            };
        });
        // TODO
        // alert("Not Finished Yet.");
    };
    // ws.onopen = (evnet) => {
    //     ws.send('{"distance":6.0, "velocity":6.0,"frequency":180}');
    // };
}