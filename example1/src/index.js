document.getElementById("send-btn").onclick(function() {

});

function getData(url, callback) {
    var xhr;
    if (window.XMLHtppRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.respondText);
            }
        }
    };
    
    xhr.open("POST", url, true);
    xhr.send();
}