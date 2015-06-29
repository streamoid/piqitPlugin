var piqitclient = {
    imageSearch: function(params,success,fail) {
        navigator.notification.alert(
              JSON.stringify(params),    // message
              null,       // callback
              "Workshop", // title
              'OK'        // buttonName
          );
        var camQuality = params.quality? params.quality:75;
        var camSourceType = params.sourceType ? params.sourceType:Camera.PictureSourceType.CAMERA;
        var camAllowEdit = false;
        
        var options={quality:camQuality, destinationType: Camera.DestinationType.DATA_URL,
        sourceType:camSourceType, allowEdit:camAllowEdit, encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false};
    navigator.notification.alert(
              JSON.stringify(options),    // message
              null,       // callback
              "Workshop", // title
              'OK'        // buttonName
          );
        navigator.camera.getPicture(function(imageData){
            piqitclient.onPhotoDataSuccess(imageData,success,fail);
        }
        ,function(){
            navigator.notification.alert(
              "imageDatafail",    // message
              null,       // callback
              "Workshop", // title
              'OK'        // buttonName
          );
            //piqitclient.onFail(fail);
        }
        ,options);
    },
    onPhotoDataSuccess: function(imageData, successCallback,failureCallback) {
    
        $.ajax({
            type: "POST",
            url: "http://staging.streamoid.com/demo/cordovaApi.php",
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