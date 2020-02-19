function init(cursor) {
    init_commands = {
        "android_metadata": 'CREATE TABLE android_metadata (locale TEXT)',
        "partial_record": 'CREATE TABLE "partial_record" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "date" INTEGER ,"distance" INTEGER ,"duration" INTEGER ,"step" INTEGER )',
        "partial_track": 'CREATE TABLE "partial_track" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "latitude" REAL ,"longitude" REAL ,"recordDbId" INTEGER ,"sequence" INTEGER ,"status" INTEGER )',
        "record": 'CREATE TABLE "record" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "date" INTEGER ,"detailed" INTEGER ,"distance" INTEGER ,"duration" INTEGER ,"invalidReason" INTEGER ,"photoName" TEXT ,"photoRemotePath" TEXT ,"placeHint" TEXT ,"recordId" INTEGER ,"step" INTEGER ,"uploaded" INTEGER ,"userId" TEXT ,"verified" INTEGER )',
        "track": 'CREATE TABLE "track" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "latitude" REAL ,"longitude" REAL ,"recordDbId" INTEGER ,"sequence" INTEGER ,"status" INTEGER )',
        "user": 'CREATE TABLE "user" ( "id"TEXT PRIMARY KEY, "PESpecialty" INTEGER ,"department" TEXT ,"gender" INTEGER ,"name" TEXT ,"offline" INTEGER ,"token" TEXT )',
    };
    tables = cursor.exec("SELECT tbl_name FROM sqlite_master WHERE type='table' ").forEach((value, index) => {
        return value[0];
    });
    init_commands.forEach((value, index) => {
        if (!tables[index]) {
            cursor.exec(value);
        }
    });
}

function get_users(cursor) {
    return cursor.exec("SELECT id, name, department FROM user")[0]["values"];
}

function insert_record(cursor, userId, date, distance, duration, step) {
    return cursor.exec("INSERT INTO 'record' (userId, date, distance, duration, step, detailed, invalidReason, recordId, uploaded, verified) VALUES ({userId}, {date}, {distance}, {duration}, {step}, {detailed}, {invalidReason}, {recordId}, {uploaded}, {verified})".format({
        "userId": userId,
        "date": date,
        "distance": distance,
        "duration": duration,
        "step": step,
        "detailed": 1,
        "invalidReason": 0,
        "recordId": -1,
        "uploaded": 0,
        "verified": 1
    }))
}

function append_record(cursor, userId, dateUTC, distance, duration, step) {
    return insert_record(cursor, userId, dateUTC, distance, duration, step);
}

function insert_track(cursor, latitude, longitude, recordDbId, status, sequence) {
    cursor.exec("INSERT INTO 'track' (latitude, longitude, recordDbId, status, sequence) VALUES ({latitude}, {longitude}, {recordDbId}, {status}, {sequence})".format({
        "latitude": latitude,
        "longitude": longitude,
        "recordDbId": recordDbId,
        "status": status,
        "sequence": sequence
    }));
}

function append_track(cursor, recordDbId, lat_lon_list) {
    lat_lon_list.forEach((value, index) => {
        insert_track(cursor, value[1], value[0], recordDbId, 0, index);
    });
}