(function(){


    var ogreAPI = {
        canvas : null,
        images: [],
        helper: {
            bgImage: null,
            repeatBg: true
        },
        initializeCanvas: function() {
            ogreAPI.canvas = new fabric.Canvas('canvas');
            ogreAPI.setCanvasHeight(900);
            $('#canvas-height').val( ogreAPI.canvas.getHeight() );
            $('#canvas-width').val( ogreAPI.canvas.getWidth() );
        },
        clearCanvas: function() {
            ogreAPI.canvas.clear();
        },
        setCanvasWidth: function(width) {
            ogreAPI.canvas.setWidth(width).renderAll();
        },
        setCanvasHeight: function(height) {
            ogreAPI.canvas.setHeight(height).renderAll();
        },
        setCanvasBackgroundColor : function(color) {
            ogreAPI.canvas.backgroundColor = color;
            ogreAPI.canvas.renderAll();
        },
        setCanvasBackgroundImage: function(repeat) {
            
            repeat = repeat ? repeat : 'repeat';

            $('#bgLoader').change(function (e) {

                var reader = new FileReader();

                reader.onload = function(event) {
                    var imgObj = new Image();
                    imgObj.src = event.target.result;
                    ogreAPI.helper.bgImage = imgObj.src;
                    imgObj.onload = function() {
                        ogreAPI.canvas.setBackgroundColor({
                            source: imgObj.src,
                            repeat: repeat
                        }, function() { ogreAPI.canvas.renderAll() });
                        
                    };
                };
                reader.readAsDataURL(e.target.files[0]);

                var fileName = $('#bgLoader').val();
                fileName = fileName.split('\\');
                $('.dummy-bgLoader #bg-path').val( fileName[fileName.length -1] );

                $('#options-menu .background-repeat').addClass('active');
            });
        },
        backgroundImageRepeatToggle: function(){

            ogreAPI.canvas.setBackgroundColor({
                source: ogreAPI.helper.bgImage,
                repeat: ogreAPI.helper.repeatBg
            }, function() { ogreAPI.canvas.renderAll() });
        },
        addImage: function() {
            $('#imgLoader').change(function (e) {

                var reader = new FileReader();

                reader.onload = function(event) {
                    var imgObj = new Image();
                    imgObj.src = event.target.result;

                    imgObj.onload = function() {
                        
                        fabric.Image.fromURL(imgObj.src, function(img) {
                            ogreAPI.canvas.add(img).renderAll();
                            img.myClass = "image";
                            img.name = e.target.files[0].name.split('.')[0];
                            ogreAPI.images.push(img);
                            ogreAPI.canvas.setActiveObject( img );
                        });
                    };
                };

                reader.readAsDataURL(e.target.files[0]);

                var fileName = e.target.files[0].name;
                fileName = fileName.split('.');
                $('.dummy-imgLoader #img-path').val( fileName[0] );
            });
        },
        text: {
            editing: false,
            object: null,
            addText: function(settings) {

                var text = new fabric.Text( settings.text, {
                    fontFamily: settings.fontFamily,
                    fontSize: settings.fontSize || 15,
                    fontStyle: settings.fontStyle,
                    fontWeight: settings.fontWeight,
                    textDecoration: settings.textDecoration,
                    fill: settings.textColor,
                    top: ogreAPI.canvas.getHeight() / 2,
                    left: ogreAPI.canvas.getWidth() / 2
                });

                ogreAPI.canvas.add(text);
                API.canvas.setActiveObject( text );
            },

            getCurrentTextSettings: function(object) {

                ogreAPI.text.object = object;

                ogreAPI.text.editing = true;

                var settings = {
                    text: object.text,
                    fontColor: object.fill,
                    fontStyle: object.fontStyle,
                    fontWeight: object.fontWeight,
                    textDecoration: object.textDecoration,
                    fontSize: object.fontSize,
                    fontFamily: object.fontFamily,
                };

                $('#add-text-menu #add-text').val(object.text);
                $('.text-color .clrpicker').ColorPickerSetColor(object.fill).css({'background-color':object.fill});

                if(object.fontStyle == "italic") {
                    $("#italic").prop('checked', true);
                } else $("#italic").prop('checked', false);

                if(object.fontWeight == "bold") {
                    $("#bold").prop('checked', true);
                } else $("#bold").prop('checked', false);
                if(object.textDecoration == "underline") {
                    $("#underline").prop('checked', true);
                } else $("#underline").prop('checked', false);

                $("#text-size > input").val(object.fontSize);
                $('#font-selection').val(object.fontFamily);

            },

            modifyButton: function() {
                $("#modify-text").on('click', function() {
                    ogreAPI.text.object.setText( $('#add-text-menu #add-text').val() );
                    ogreAPI.text.object.fill = $('.text-color .clrpicker').css('background-color');

                    ogreAPI.text.object.fontStyle = $('#italic').is(':checked') ? "italic" : "";
                    ogreAPI.text.object.fontWeight = $('#bold').is(':checked') ? "bold" : "";
                    ogreAPI.text.object.textDecoration = $('#underline').is(':checked') ? "underline" : "";

                    ogreAPI.text.object.fontSize = $("#text-size > input").val();
                    ogreAPI.text.object.fontFamily = $('#font-selection').val();

                    ogreAPI.canvas.renderAll();
                });
            },

            submitText: function() {

                var text, textColor = "#000", textSize, textFont;
                var textStyle = {
                    italic: "",
                    bold: "",
                    underline: ""
                };

                $('.text-style > input').on('change', function(e) {
                    e.preventDefault();

                    if( $(this).is(':checked') ){
                        textStyle[ $(this).attr('name') ] = $(this).attr('name');
                    } else {
                        textStyle[ $(this).attr('name') ] = "";
                    }

                });

                $('#submit').on('click', function(e) {
                    e.preventDefault();

                    text = $('#add-text').val();

                    textSize = $('#text-size > input').val();

                    textFont = $('#font-selection').val();

                    textColor = $('.text-color .clrpicker').css('background-color');

                    var settings = {
                        text: text,
                        fontFamily: textFont,
                        fontSize: textSize,
                        textColor: textColor,
                        fontStyle: textStyle.italic,
                        fontWeight: textStyle.bold,
                        textDecoration: textStyle.underline

                    };

                    if(settings.text.length > 0 && !ogreAPI.text.editing)
                        ogreAPI.text.addText(settings);
                });
            },

            resetForm: function() {
                $('#add-text-menu #add-text').val("");
                $('.text-color .clrpicker').ColorPickerSetColor("#000").css({'background-color':"#000"});
                $("#italic").prop('checked', false);
                $("#bold").prop('checked', false);
                $("#underline").prop('checked', false);
                $("#text-size > input").val("15");
                $('#font-selection').val("Arial");
            }
        },

        charts:{
            chart: null,

            chartsOnCanvas: [],

            options: {},

            addFileButon: function (){
             
                ogreAPI.charts.options = {
                    chart: {
                        renderTo: 'container',
                        defaultSeriesType: $('#chartType').val(),
                        borderRadius: 0,
                    },
                    title: {
                        text: ''
                    },
                    subtitle :{
                        text: ''
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [],
                    credits: {
                        enabled: false
                    }
                };

                $('#file').on('change', function(evt) {
    
                    //Retrieve the first (and only!) File from the FileList object
                    var file = evt.target.files[0];
                    //ogreAPI.file = file;
                    ogreAPI.charts.options.series = [];
                    ogreAPI.charts.options.title.text = $('#title').val();
                    ogreAPI.charts.options.subtitle.text = $('#subtitle').val();

                    $('#dummy-chart-file').val(file.name.split(".")[0]);

                    if(file) {

                        var r = new FileReader();

                        r.onload = function(e) {
                            var data = e.target.result;

                            // Split the lines
                            var lines = data.split('\n');

                            // Iterate over the lines and add categories or series
                            $.each(lines, function(lineNo, line) {
                                var items = line.split(',');

                                // header line containes categories
                                if(lineNo == 0) {
                                    $.each(items, function(itemNo, item) {
                                        if (itemNo > 0) ogreAPI.charts.options.xAxis.categories.push(item);
                                    });
                                }

                                    // the rest of the lines contain data with their name in the first 
                                    // position
                                else {

                                    var series = {
                                        data: []
                                    };

                                    $.each(items, function(itemNo, item) {
                                        if (itemNo == 0) {
                                            series.name = item;
                                        } else {
                                            series.data.push(parseFloat(item));
                                        }
                                    });

                                    ogreAPI.charts.options.series.push(series);
                                }
                            });
                            // Create the chart
                            //ogreAPI.chart = new Highcharts.Chart(ogreAPI.charts.options);
                            ogreAPI.charts.chart = new Highcharts.Chart(ogreAPI.charts.options);
                        };

                        r.readAsText(file);
                    }
                });
            },

            dropdownOptions: function(){

                $('#chartType').on('change', function() {

                    ogreAPI.charts.chart = $('#container').highcharts();

                    if(ogreAPI.charts.chart) {
                        ogreAPI.charts.chart.destroy();
                        var chartType = $('#chartType').val();

                        ogreAPI.charts.options.chart.defaultSeriesType = chartType;
                        ogreAPI.charts.options.title.text = $('#title').val();
                        ogreAPI.charts.options.subtitle.text = $('#subtitle').val();

                        ogreAPI.charts.chart = new Highcharts.Chart(ogreAPI.charts.options);
                    }
                });

                $('#charts-panel #add-chart').on('click', function() {
                    ogreAPI.loadInfographic();
                    $('#charts-wrapper').addClass('hide');
                });

                $('#charts-panel .back-button').on('click', function() {
                    $('#charts-wrapper').addClass('hide');
                });
            },
        },

        exportInfographic: {
            _toSVG: function() {
                var infographic = ogreAPI.canvas.toSVG();
                

                $('#export-svg a').attr('href', "data:application/octet-stream," + encodeURIComponent(infographic) );
            },
            _toPNG: function() {
                var infographic = ogreAPI.canvas.toDataURL({
                    format: 'png'
                });

                $('#export-png a').attr('href', infographic);
            },
            _toJPG: function() {
                var infographic = ogreAPI.canvas.toDataURL({
                    format: 'jpg'
                });

                $('#export-jpg a').attr('href', infographic);
            },
            all: function() {

                $('#export').on('click', function() {
                    ogreAPI.exportInfographic._toSVG();
                    ogreAPI.exportInfographic._toPNG();
                    ogreAPI.exportInfographic._toJPG();
                });
            }
        },

        loadInfographic : function() {
            var test = '<svg width="700" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" stroke="none" stroke-width="0" fill="none" class="dxc dxc-chart" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><defs><clipPath id="DevExpress_1"><rect x="0" y="0" width="700" height="300" rx="0" ry="0" fill="none" stroke="none" stroke-width="0"></rect></clipPath><clipPath id="DevExpress_2"><rect x="0" y="0" width="700" height="300" rx="0" ry="0" fill="none" stroke="none" stroke-width="0" transform="translate(-609,-12)"></rect></clipPath><pattern id="DevExpressPattern_1" width="5" height="5" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="5" height="5" rx="0" ry="0" fill="#ffa500" opacity="0.75"></rect><path stroke-width="2" stroke="#ffa500" d="M 2.5 -2.5 L -2.5 2.5M 0 5 L 5 0 M 7.5 2.5 L 2.5 7.5"></path></pattern><pattern id="DevExpressPattern_2" width="5" height="5" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="5" height="5" rx="0" ry="0" fill="#ffa500" opacity="0.5"></rect><path stroke-width="2" stroke="#ffa500" d="M 2.5 -2.5 L -2.5 2.5M 0 5 L 5 0 M 7.5 2.5 L 2.5 7.5"></path></pattern><clipPath id="DevExpress_3"><rect x="22" y="10" width="557" height="265" rx="0" ry="0" fill="none" stroke="none" stroke-width="0"></rect></clipPath><pattern id="DevExpressPattern_3" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="6" height="6" rx="0" ry="0" fill="#ffa500" opacity="0.75"></rect><path stroke-width="2" stroke="#ffa500" d="M 3 -3 L -3 3M 0 6 L 6 0 M 9 3 L 3 9"></path></pattern><pattern id="DevExpressPattern_4" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="6" height="6" rx="0" ry="0" fill="#ffa500" opacity="0.5"></rect><path stroke-width="2" stroke="#ffa500" d="M 3 -3 L -3 3M 0 6 L 6 0 M 9 3 L 3 9"></path></pattern></defs><g class="dxc-background"></g><g class="dxc-legend" transform="translate(609,12)" clip-path="url(#DevExpress_2)"><g><g class="dxc-item" transform="translate(0,0)"><rect x="0" y="0" width="12" height="12" rx="0" ry="0" fill="#ffa500"></rect><text x="19" y="0" text-anchor="start" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;" transform="translate(0,10)"><tspan x="19" dy="0">My oranges</tspan></text></g></g></g><g class="dxc-strips-group"><g class="dxc-h-strips" clip-path="url(#DevExpress_3)"></g><g class="dxc-v-strips" clip-path="url(#DevExpress_3)"></g></g><g class="dxc-constant-lines-group"><g class="dxc-h-constant-lines" clip-path="url(#DevExpress_3)"></g><g class="dxc-v-constant-lines" clip-path="url(#DevExpress_3)"></g></g><g class="dxc-axes-group"><g class="dxc-h-axis"><g class="dxc-grid"></g><g class="dxc-elements"><text x="62" y="297" text-anchor="middle" transform="rotate(0,62,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="62" dy="0">Monday</tspan></text><text x="141" y="297" text-anchor="middle" transform="rotate(0,141,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="141" dy="0">Tuesday</tspan></text><text x="221" y="297" text-anchor="middle" transform="rotate(0,221,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="221" dy="0">Wednesday</tspan></text><text x="301" y="297" text-anchor="middle" transform="rotate(0,301,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="301" dy="0">Thursday</tspan></text><text x="380" y="297" text-anchor="middle" transform="rotate(0,380,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="380" dy="0">Friday</tspan></text><text x="460" y="297" text-anchor="middle" transform="rotate(0,460,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="460" dy="0">Saturday</tspan></text><text x="539" y="297" text-anchor="middle" transform="rotate(0,539,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="539" dy="0">Sunday</tspan></text></g><g class="dxc-line"></g></g><g class="dxc-v-axis"><g class="dxc-grid"><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 275.5 L 579 275.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 231.5 L 579 231.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 187.5 L 579 187.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 144.5 L 579 144.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 100.5 L 579 100.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 56.5 L 579 56.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 12.5 L 579 12.5"></path></g><g class="dxc-elements"><text x="12" y="279" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">0</tspan></text><text x="12" y="235" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">2</tspan></text><text x="12" y="191" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">4</tspan></text><text x="12" y="148" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">6</tspan></text><text x="12" y="104" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">8</tspan></text><text x="12" y="60" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">10</tspan></text><text x="12" y="16" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">12</tspan></text></g><g class="dxc-line"></g></g></g><g class="dxc-border"></g><g class="dxc-series-group"><g class="dxc-series" transform="translate(0,0) scale(1,1)"><g class="dxc-elements" clip-path="url(#DevExpress_3)"></g><g class="dxc-markers" stroke-width="0" stroke="none" fill="#ffa500" r="0" inh="true" stroke-dasharray="none" line-width="2"><rect x="34" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="113" y="231" width="56" height="44" rx="0" ry="0"></rect><rect x="193" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="273" y="187" width="56" height="88" rx="0" ry="0"></rect><rect x="352" y="144" width="56" height="131" rx="0" ry="0"></rect><rect x="432" y="34" width="56" height="241" rx="0" ry="0"></rect><rect x="511" y="187" width="56" height="88" rx="0" ry="0"></rect></g></g></g><g class="dxc-labels-group"><g class="dxc-series-labels" clip-path="url(#DevExpress_3)" opacity="1"></g></g><g class="dxc-tooltip"><path fill="#000000" stroke="none" opacity="0.1" d="M 0 0" visibility="hidden"></path><path d="M 0 0 Z" visibility="hidden"></path><text x="0" y="0" text-anchor="middle" visibility="hidden" style="font-family: \'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 200; font-size: 26px; fill: #ffffff; fill-opacity: 0.75; cursor: default;"><tspan x="0" dy="0">0</tspan></text></g><g class="dxc-crosshair-cursor"></g><g class="dxc-trackers" opacity="0.0001"><g class="dxc-crosshair-trackers" stroke="none" fill="grey"></g><g class="dxc-series-trackers"><g class="dxc-pane-tracker"></g></g><g class="dxc-markers-trackers" stroke="none" fill="grey"><g class="dxc-pane-tracker" clip-path="url(#DevExpress_3)"><rect x="34" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="113" y="231" width="56" height="44" rx="0" ry="0"></rect><rect x="193" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="273" y="187" width="56" height="88" rx="0" ry="0"></rect><rect x="352" y="144" width="56" height="131" rx="0" ry="0"></rect><rect x="432" y="34" width="56" height="241" rx="0" ry="0"></rect><rect x="511" y="187" width="56" height="88" rx="0" ry="0"></rect></g></g><g class="dxc-legend-trackers" stroke="none" fill="grey" transform="translate(609,12)"><rect x="-10" y="-6" width="101" height="23" rx="0" ry="0"></rect></g></g></svg>';

            //setTimeout(function() {
                //$('#chart').css({'display':'none'});
                
                //var chart = document.getElementById('chart').innerHTML;

                var chart = $('#charts-panel svg')[0].outerHTML;
                
                //var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(test);

                var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(chart);

                fabric.Image.fromURL(dataUrl, function(img) {

                    img.top = 100;
                    img.left = 100;
                    ogreAPI.canvas.add(img);
                    ogreAPI.charts.chartsOnCanvas.push( img );
                    img.myClass = "chart";

                });
           // }, 100);
        },
        colorPicker: function(){

            $('.bg-color .clrpicker').ColorPicker({
                color: '#000000',
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $('.clrpicker').css('backgroundColor', '#' + hex);
                    ogreAPI.setCanvasBackgroundColor('#' + hex);
                }
            });

            $('.clrpicker').on('click', function() {
                $('#options-menu .background-repeat').removeClass('active');
            });

            $('.text-color .clrpicker').ColorPicker({
                color: '#000000',
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $('.text-color .clrpicker').css('backgroundColor', '#' + hex);
                }
            });
        },
        listeners: {
            loginButton: function() {
                //Login/Register Button Listener
                $('.login-register').on('click', function(e) {
                    e.preventDefault();
                    $('.login-area').toggleClass('active');
                });
            },
            menuItemButton: function() {
                //Menu Item Button Listener
                $('.menu > ul > li').on('click', function(e) {

                    e.stopPropagation();

                    if($(this).attr('id') == "charts-item") {
                        $('#charts-wrapper').removeClass('hide');
                        $('#file').val("");
                        $('#title').val("");
                        $('#subtitle').val("");
                        $('#dummy-chart-file').val("");
                        $('#container').empty();
                    } else if($(this).attr('id') == "text-item") {
                        //$('.text-color .clrpicker').ColorPickerSetColor("#000").css({'background-color':"#000"});
                    }

                    if($(this).children().length == 0) return;

                    $(this).find('>:first-child').addClass('submenu-active');
                    $('.menu').addClass('slide-left');
                });

                $('#clear-board').on('click', function() {
                    ogreAPI.canvas.clear();
                    ogreAPI.setCanvasBackgroundColor('#fff');
                });
            },
            menuBackButton: function() {
                //Menu Back Button Listener
                $('.back-btn').on('click', function(event) {
                    event.stopPropagation();
                    //$(this).closest('ul').removeClass('submenu-active');
                    $(this).parent().removeClass('submenu-active');
                    $('.menu').removeClass('slide-left');

                    ogreAPI.canvas.deactivateAll().renderAll(); //Deselects all objects that are active on canvas

                    if( $(this).parent().attr('id') == "add-text-menu" ) {
                        ogreAPI.text.editing = false;

                        setTimeout(function() {
                            ogreAPI.text.resetForm();
                            $('#add-text-menu #submit').removeClass('shift-up');
                        }, 300);
                    } else if( $(this).parent().attr('id') == "image-menu") {
                        setTimeout(function() {
                            $('.dummy-imgLoader').removeClass('hide');
                            $('#img-path').val("");
                        }, 500);
                    }
                });
            },

            objectClick: function() {
                //This can get the instance of an object for further modifications 
                ogreAPI.canvas.on('object:selected', function(options) {
                    $('.sub-menu').removeClass('submenu-active');
                    if(options.target) {

                        
                        
                        if(options.target.get('type') == "image") {

                            if(options.target.myClass == "chart") {
                                //Bring up the chart guns
                                $('.menu-wrapper .menu').addClass('slide-left');
                                $('.menu-wrapper .menu #image-menu').addClass('submenu-active');
                                $('.dummy-imgLoader').addClass('hide');
                                $('#image-menu .remove-wrapper').css('height', 46);
                            }

                            if(options.target.myClass == "image") {

                                $('.menu-wrapper .menu').addClass('slide-left');
                                $('.menu-wrapper .menu #image-menu').addClass('submenu-active');
                                $('.dummy-imgLoader').removeClass('hide');

                                $('#img-path').val( options.target.name );
                                $('#image-menu .remove-wrapper').css('height', 46);
                            }
                        } else if(options.target.get('type') == "text") {
                            //Get text menu
                            $('#add-text-menu #submit').addClass('shift-up');
                            $('#add-text-menu .remove-wrapper').css('height', 46);
                            

                            $('.menu-wrapper .menu').addClass('slide-left');
                            $('.menu-wrapper .menu #add-text-menu').addClass('submenu-active');

                            ogreAPI.text.getCurrentTextSettings(options.target);
                        }
                    }
                });

                ogreAPI.canvas.on('selection:cleared', function() {
                    ogreAPI.text.editing = false;
                    ogreAPI.text.resetForm();
                    $('.sub-menu').removeClass('submenu-active');
                    $('.menu').removeClass('slide-left');
                    $('#add-text-menu #submit').removeClass('shift-up');
                    $('.remove-wrapper').css('height', 0);
                    $('#imgLoader').val("");
                    $('#img-path').val(""); //From Image Menu

                });
            },
            optionsRepeatBg: function() {
                $('#bg-repeat').on('change', function(){
                    ogreAPI.helper.repeatBg = $(this).is(':checked') ? 'repeat' : 'no-repeat';
                    ogreAPI.backgroundImageRepeatToggle();
                });
            },
            heightCustomization: function() {
                $('#canvas-height').on('change', function() {
                    ogreAPI.setCanvasHeight( $(this).val() );
                });
            },
            widthCustomization: function() {
                $('#canvas-width').on('change', function() {
                    ogreAPI.setCanvasWidth( $(this).val() );
                });
            },
            removeButton: function() {
                $('.remove-button').on('click', function() {
                    ogreAPI.canvas.remove( ogreAPI.canvas.getActiveObject() );
                });
            },
            
            offsetFix: function() {
                $('section').on('scroll', function() {
                    ogreAPI.canvas.calcOffset();
                });
            },
            loadTemplate: function(){

                $('#tmp1').on('click',function(){
                    ogreAPI.templates.firstTemplate();
                });

                $('#tmp2').on('click',function(){
                    ogreAPI.templates.secondTemplate();
                });

                $('#tmp3').on('click',function(){
                    ogreAPI.templates.thirdTemplate();
                });
            }
        },

        templates: {
            firstTemplate: function(){
                ogreAPI.canvas.clear();
                        
                var options = {
                    title: {
                        text: 'Monthly Average Temperature',
                        x: -20 //center
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        x: -20
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    yAxis: {
                        title: {
                            text: 'Temperature (°C)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: '°C'
                    },
                    exporting: {
                        enabled: false
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: [{
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }, {
                        name: 'New York',
                        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    }, {
                        name: 'Berlin',
                        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                    }, {
                        name: 'London',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }]
                };

                //var chart = new Highcharts.Chart(options);
                var chart = $('#container').highcharts(options);

                var title = new fabric.Text( "Click to modify title", {
                    fontFamily: 'Arial',
                    fontSize: 60,
                    fill: '#000000',
                    top: 20,
                    left: 210
                });
                var subtitle = new fabric.Text( "Click to modify subtitle", {
                    fontFamily: 'Arial',
                    fontSize: 40,
                    fill: '#000000',
                    top: 100,
                    left: 260
                });
                var introduction = new fabric.Text( "Here you can add description of your infographic", {
                    fontFamily: 'Arial',
                    fontSize: 25,
                    fill: '#000000',
                    top: 180,
                    left: 200
                });

                ogreAPI.canvas.add(title);
                ogreAPI.canvas.add(subtitle);
                ogreAPI.canvas.add(introduction);        
                ogreAPI.setCanvasBackgroundColor('#CCCC99');
              
                chart = $('#container').highcharts();
                var svg = chart.getSVG();
                
                var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);

                fabric.Image.fromURL(dataUrl, function(img) {
                    img.top = 300;
                    img.left = 150;
                    ogreAPI.canvas.add(img)
                    //ogreAPI.charts.push( img );
                    //chartsLength = ogreAPI.charts.length;
                    img.myClass = "chart";
                });
            },
            secondTemplate: function(){
                ogreAPI.canvas.clear();
                var options = {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Historic World Population by Region'
                    },
                    subtitle: {
                        text: 'Source: Wikipedia.org'
                    },
                    xAxis: {
                        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Population (millions)',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' millions'
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 100,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Year 1800',
                        data: [107, 31, 635, 203, 2]
                    }, {
                        name: 'Year 1900',
                        data: [133, 156, 947, 408, 6]
                    }, {
                        name: 'Year 2008',
                        data: [973, 914, 4054, 732, 34]
                    }]
                };
                var chart = $('#container').highcharts(options);

                var title = new fabric.Text( "Click to modify title", {
                    fontFamily: 'Arial',
                    fontSize: 60,
                    fill: '#FFFFFF',
                    top: 20,
                    left: 210
                });
                var subtitle = new fabric.Text( "Click to modify subtitle", {
                    fontFamily: 'Arial',
                    fontSize: 40,
                    fill: '#FFFFFF',
                    top: 100,
                    left: 260
                });
                var introduction = new fabric.Text( "Here you can add description of your infographic", {
                    fontFamily: 'Arial',
                    fontSize: 25,
                    fill: '#FFFFFF',
                    top: 180,
                    left: 200
                });

                ogreAPI.canvas.add(title);
                ogreAPI.canvas.add(subtitle);
                ogreAPI.canvas.add(introduction);
                ogreAPI.setCanvasBackgroundColor('#996633');

                chart = $('#container').highcharts();
                var svg = chart.getSVG();
                
                var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);

                fabric.Image.fromURL(dataUrl, function(img) {
                    img.top = 300;
                    img.left = 150;
                    ogreAPI.canvas.add(img)
                    //ogreAPI.charts.chartpush( img );
                    //chartsLength = ogreAPI.charts.length;
                    img.myClass = "chart";
                });
            },
            thirdTemplate: function(){
                ogreAPI.canvas.clear();
                var options = {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: 'Historic and Estimated Worldwide Population Distribution by Region'
                    },
                    subtitle: {
                        text: 'Source: Wikipedia.org'
                    },
                    xAxis: {
                        categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
                        tickmarkPlacement: 'on',
                        title: {
                            enabled: false
                        }
                    },

                    yAxis: {
                        title: {
                            text: 'Percent'
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        area: {
                            stacking: 'percent',
                            lineColor: '#ffffff',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#ffffff'
                            }
                        }
                    },
                    series: [{
                        name: 'Asia',
                        data: [502, 635, 809, 947, 1402, 3634, 5268]
                    }, {
                        name: 'Africa',
                        data: [106, 107, 111, 133, 221, 767, 1766]
                    }, {
                        name: 'Europe',
                        data: [163, 203, 276, 408, 547, 729, 628]
                    }, {
                        name: 'America',
                        data: [18, 31, 54, 156, 339, 818, 1201]
                    }, {
                        name: 'Oceania',
                        data: [2, 2, 2, 6, 13, 30, 46]
                    }]
                };
                
                var chart = $('#container').highcharts(options);

                var title = new fabric.Text( "Click to modify title", {
                    fontFamily: 'Arial',
                    fontSize: 60,
                    fill: '#FFFFFF',
                    top: 20,
                    left: 210
                });
                var subtitle = new fabric.Text( "Click to modify subtitle", {
                    fontFamily: 'Arial',
                    fontSize: 40,
                    fill: '#FFFFFF',
                    top: 100,
                    left: 260
                });
                var introduction = new fabric.Text( "Here you can add description of your infographic", {
                    fontFamily: 'Arial',
                    fontSize: 25,
                    fill: '#FFFFFF',
                    top: 180,
                    left: 200
                });

                ogreAPI.canvas.add(title);
                ogreAPI.canvas.add(subtitle);
                ogreAPI.canvas.add(introduction);
                ogreAPI.setCanvasBackgroundColor('#006699');

                chart = $('#container').highcharts();
                var svg = chart.getSVG();
                
                var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);

                fabric.Image.fromURL(dataUrl, function(img) {
                    img.top = 300;
                    img.left = 150;
                    ogreAPI.canvas.add(img)
                    //ogreAPI.charts.push( img );
                    //chartsLength = ogreAPI.charts.length;
                    img.myClass = "chart";
                });
            }
        }
    };

    window.API = ogreAPI;


    $(document).ready(function() {
        
        $('.pager span').text(""); //Eliminate the text from bullets on the slider

        ogreAPI.initializeCanvas();

        ogreAPI.templates.firstTemplate();

        ogreAPI.listeners.loadTemplate();

        ogreAPI.listeners.objectClick();

        ogreAPI.text.modifyButton();
        
        //ogreAPI.listeners.loginButton();

        ogreAPI.listeners.menuItemButton();

        ogreAPI.listeners.menuBackButton();

        ogreAPI.setCanvasBackgroundImage();

        ogreAPI.listeners.optionsRepeatBg();

        ogreAPI.colorPicker();

        ogreAPI.listeners.heightCustomization();

        ogreAPI.listeners.widthCustomization();

        ogreAPI.addImage();

        ogreAPI.listeners.offsetFix();

        ogreAPI.text.submitText();

        ogreAPI.listeners.removeButton();

        ogreAPI.exportInfographic.all();

        ogreAPI.charts.addFileButon();

        ogreAPI.charts.dropdownOptions();

    });
})();