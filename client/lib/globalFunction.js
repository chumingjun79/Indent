//设置日期控件格式
setDatePicker = function(){
    $('.datepicker').datepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        autoclose: true,
        todayHighlight: true
    });
};

//重置验证控件的状态
resetBootstrapValidator = function(formClassName){
    var bootstrapValidator = $(formClassName).data('bootstrapValidator');
    bootstrapValidator.resetForm(false);
};

//手动触发验证，验证错误的话返回false
touchBootstrapValidator = function(formClassName){
    var bootstrapValidator = $(formClassName).data('bootstrapValidator');
    bootstrapValidator.validate();
    return bootstrapValidator.isValid();
};

//根据jquery-confirm控件而来，设置了一些默认参数。
//caption:标题
chumjConfirm = function(caption, callback){
    $.confirm({
        icon: 'fa fa-question-circle-o',
        title: '提示',
        content: caption,
        theme: 'modern',
        type: 'orange',
        buttons: {
            ok: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    if(typeof callback == "function")
                        callback(true);
                }
            },
            cancle: {
                text: '取消',
                action: function () {
                    if(typeof callback == "function")
                        callback(false);
                }
            }
        }
    });
};

//根据jquery-confirm控件而来，这里只针对一个控件，如果是多个的话需要参照这个函数再扩展。
//caption:标题，inputHtml:自定义控件的html语句，inputClass:返回值控件的类名或ID
//alertValue:警示提示信息
chumjInput = function(caption, inputHtml, inputClass, alertValue, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        inputHtml +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var value = this.$content.find(inputClass).val();
                    if(!value){
                        $.alert(alertValue);
                        return false;
                    };
                    if(typeof callback == "function")
                        callback(true, value);
                }
            },
            cancel: {
                text: '取消',
                action: function () {
                    if(typeof callback == "function")
                        callback(false, '');
                }
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
};

//实现无“闪现”下载文件
downloadByIframe = function(url){
    if (Meteor.isCordova){
        var fileTransfer = new FileTransfer();
        var fileURL = 'cdvfile://localhost/persistent/indent_down.xlsx';

        fileTransfer.download(
            url,
            fileURL,
            function(entry) {
                Bert.alert("下载成功，请到文件管理器根目录下查看indent_down.xlsx文件", 'info');
                console.log("download complete: " + entry.toURL());
                cordova.plugins.fileOpener2.open(
                    fileURL,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    {
                        error : function(e) {
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success : function () {
                            console.log('file opened successfully');
                        }
                    }
                );
            },
            function(error) {
                console.log("download error source: " + error.source);
                console.log("download error target: " + error.target);
            },
            false,
            {}
        );
    } else {
        var iframe = document.getElementById("myIframe");
        if (iframe) {
            iframe.src = url;
        } else {
            iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = url;
            iframe.id = "myIframe";
            document.body.appendChild(iframe);
        }
        ;
        iframe.onload = function () {
            var xinxi = document.getElementById("myIframe").contentWindow.document.body.innerText;
            if (xinxi) {
                Bert.alert(xinxi, 'danger');
            }
            ;
        };
    };
};
