function update_view(){
    $("#i_input_file").addClass("hid");
    $("#i_button_main").addClass("fade");
    $("#i_div_main").addClass("show")
}

function update_userId_view(){
    var users = get_users(sqliteObj);
    users.forEach((value, index) => {
        $("#userId").append('<option value="'+value[0]+'">'+value[0]+", "+value[1]+'</option>');
    });
}

function enable_submit_button(){
    $("#i_button_main").addClass("show");
    $("#i_button_main").removeClass("fade");
    var b = document.getElementById("i_button_main")
    b.onclick=on_submit;
    b.innerText = "Submit";
}
function disable_submit_button(){
    $("#i_button_main").removeClass("show");
    $("#i_button_main").addClass("fade");
    document.getElementById("i_button_main").onclick=()=>{};
}

function on_input_change(event){
    if($("#userId").val() && $("#distance").val() && $("#velocity").val() && $("#frequency").val() && $("#dateUTC").val()){
        enable_submit_button();
    }else{
        disable_submit_button();
    }
}

function on_sqlite_real_upload(event){
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
    document.getElementById("i_button_main").onclick=()=>{};
    $("#i_input_file").click();
}

function on_submit(event){
    // TODO
    alert("Not Finished Yet.");
}