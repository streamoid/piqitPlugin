var piqitclient = {
    imageSearch: function(params, success, fail) {
        var camQuality = params.quality ? params.quality : 75;
        var camSourceType = params.sourceType ? params.sourceType : Camera.PictureSourceType.CAMERA;
        var camAllowEdit = params.allowEdit ? true : false;
        var key = params.key;
        var gender = "";
        var category = "";
        if (params.category != null)
            category = params.category;
        if (params.gender != null)
            gender = params.gender;
        var options = {quality: camQuality, destinationType: Camera.DestinationType.DATA_URL,
            sourceType: camSourceType, allowEdit: camAllowEdit, encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: false};

        navigator.camera.getPicture(function(imageData) {
            piqitclient.onPhotoDataSuccess(imageData, key, category, gender, success, fail);
        }
        , function() {
            piqitclient.onFail(fail);
        }
        , options);
    },
    onPhotoDataSuccess: function(imageData, key, category, gender, successCallback, failureCallback) {
        var http = new XMLHttpRequest();
        var url = "http://staging.streamoid.com/demo/cordovaApi.php";
        var params = "imageData=" + imageData + "&key=" + key + "&category=" + category + "&gender=" + gender;
        http.open("POST", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.setRequestHeader("Content-length", params.length);
        http.setRequestHeader("Connection", "close");

        http.onreadystatechange = function() {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                successCallback(http.responseText);
            }else{
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