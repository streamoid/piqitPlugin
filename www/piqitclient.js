var piqitclient = {
    imageSearch: function(params, success, fail) {
        var camQuality = params.quality ? params.quality : 75;
        var camSourceType = params.sourceType ? params.sourceType : Camera.PictureSourceType.CAMERA;
        var camAllowEdit = params.allowEdit ? true : false;
        var credentials = params.key;
        var options = {quality: camQuality, destinationType: Camera.DestinationType.DATA_URL,
            sourceType: camSourceType, allowEdit: camAllowEdit, encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: false};

        navigator.camera.getPicture(function(imageData) {
            piqitclient.onPhotoDataSuccess(imageData,credentials,success, fail);
        }
        , function() {
            piqitclient.onFail(fail);
        }
        , options);
    },
    onPhotoDataSuccess: function(imageData,credentials, successCallback, failureCallback) {
        $.ajax({
            type: "POST",
            url: "http://staging.streamoid.com/demo/cordovaApi.php?key="+credentials,
            data: {imageData: imageData},
            error: function(jqXHR, textStatus, errorThrown) {
                failureCallback();
            }
        }).done(function(data) {
            successCallback(data);
        });
    },
    onFail: function(failureCallback) {
        failureCallback();
    }
};
module.exports = piqitclient;