var piqitclient = {
    imageSearch: function(params, success, fail) {
        var camQuality = params.quality ? params.quality : 75;
        var camSourceType = params.sourceType ? params.sourceType : Camera.PictureSourceType.CAMERA;
        var camAllowEdit = params.allowEdit ? true : false;
        var key = params.key;
        var user = params.user ? params.user : "anon";
        var count = 10;
        var gender = "";
        var category = "";
        if (params.category != null)
            category = params.category;
        if (params.gender != null)
            gender = params.gender;
        if (params.count != null)
            count = params.count;
        var options = {quality: camQuality, destinationType: Camera.DestinationType.DATA_URL,
            sourceType: camSourceType, allowEdit: camAllowEdit, encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: false};

        navigator.camera.getPicture(function(imageData) {
            piqitclient.onPhotoDataSuccess(imageData, key,user, category, gender,count, success, fail);
        }
        , function() {
            piqitclient.onFail(fail);
        }
        , options);
    },
    onPhotoDataSuccess: function(imageData, key,user, category, gender,count, successCallback, failureCallback) {
        
        //algo for scaling down the image to max dimension of 640p keeping aspect intact
        var img = new Image();
        img.src = "data:image/jpeg;base64," + imageData;
        var dataUrl="data:image/jpeg;base64," + imageData;
        var MAX_WIDTH = 640;
        var width = img.width;
        var height = img.height;
        var ratio = 1.33;
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_WIDTH) {
                width *= MAX_WIDTH / height;
                height = MAX_WIDTH;
            }
        }
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var newImagedata=canvas.toDataURL("image/jpeg", 0.8);
        
        var http = new XMLHttpRequest();
        var url = "http://staging.streamoid.com/demo/cordovaApi.php";
        var params = "imageData=" + newImagedata + "&key=" + key+ "&user=" + user + "&category=" + category + "&gender=" + gender+"&count="+count;
        http.open("POST", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //http.setRequestHeader("Content-length", params.length);
        //http.setRequestHeader("Connection", "close");

        http.onreadystatechange = function() {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                successCallback(http.responseText,dataUrl);
            } else {
                failureCallback();
            }
        }
        http.send(params);
    },
    onFail: function(failureCallback) {
        failureCallback();
    }
};
module.exports = piqitclient;