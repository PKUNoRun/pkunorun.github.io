onmessage = (event) => {
    var hashed = event.data[0];
    var key0 = event.data[1];
    var key1 = '';
    for (var i = 48; i <= 57; i++) {
        for (var j = 48; j <= 57; j++) {
            for (var k = 48; k <= 57; k++) {
                for (var l = 48; l <= 57; l++) {
                    for (var m = 48; m <= 57; m++) {
                        for (var n = 48; n <= 57; n++) {
                            // 遍历key1
                            if (sha512(key0 + String.fromCharCode(i) + String.fromCharCode(j) + String.fromCharCode(k) + String.fromCharCode(l) + String.fromCharCode(m) + String.fromCharCode(n)) === hashed) {
                                key1 = String.fromCharCode(i) + String.fromCharCode(j) + String.fromCharCode(k) + String.fromCharCode(l) + String.fromCharCode(m) + String.fromCharCode(n)
                            }
                        }
                    }
                }
            }
        }
    }
    postMessage(key1);
}