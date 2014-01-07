(function(){


    var ogreAPI = {
        canvas : null,
        helper: {
            bgImage: null,
            repeatBg: true
        },
        initializeCanvas : function() {
            ogreAPI.canvas = new fabric.Canvas('canvas');


            var settings = {
                text: 'test doi zece',
                fontFamily: 'Verdana',
                fontSize: 20,
                textColor: 'black'
            };


            ogreAPI.addText(settings);
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
                        });
                    };
                };

                reader.readAsDataURL(e.target.files[0]);

                var fileName = $('#imgLoader').val();
                fileName = fileName.split('\\');
                $('.dummy-imgLoader #img-path').val( fileName[fileName.length -1] );
            });
        },
        addText: function(settings) {
            var text = new fabric.Text( settings.text, {
                fontFamily: settings.fontFamily,
                fontSize: settings.fontSize,
                fontStyle: settings.fontStyle,
                fontWeight: settings.fontWeight,
                textDecoration: settings.textDecoration,
                fill: settings.textColor,
                top: 500,
                left: 100
            });

            ogreAPI.canvas.add(text);
        },
        exportInfographic: function() {
            var png = ogreAPI.canvas.toDataURL({
                format: 'png'
            });
            console.log(png);
        },
        loadDummyInfographic : function() {
            var test = '<svg width="700" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" stroke="none" stroke-width="0" fill="none" class="dxc dxc-chart" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><defs><clipPath id="DevExpress_1"><rect x="0" y="0" width="700" height="300" rx="0" ry="0" fill="none" stroke="none" stroke-width="0"></rect></clipPath><clipPath id="DevExpress_2"><rect x="0" y="0" width="700" height="300" rx="0" ry="0" fill="none" stroke="none" stroke-width="0" transform="translate(-609,-12)"></rect></clipPath><pattern id="DevExpressPattern_1" width="5" height="5" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="5" height="5" rx="0" ry="0" fill="#ffa500" opacity="0.75"></rect><path stroke-width="2" stroke="#ffa500" d="M 2.5 -2.5 L -2.5 2.5M 0 5 L 5 0 M 7.5 2.5 L 2.5 7.5"></path></pattern><pattern id="DevExpressPattern_2" width="5" height="5" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="5" height="5" rx="0" ry="0" fill="#ffa500" opacity="0.5"></rect><path stroke-width="2" stroke="#ffa500" d="M 2.5 -2.5 L -2.5 2.5M 0 5 L 5 0 M 7.5 2.5 L 2.5 7.5"></path></pattern><clipPath id="DevExpress_3"><rect x="22" y="10" width="557" height="265" rx="0" ry="0" fill="none" stroke="none" stroke-width="0"></rect></clipPath><pattern id="DevExpressPattern_3" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="6" height="6" rx="0" ry="0" fill="#ffa500" opacity="0.75"></rect><path stroke-width="2" stroke="#ffa500" d="M 3 -3 L -3 3M 0 6 L 6 0 M 9 3 L 3 9"></path></pattern><pattern id="DevExpressPattern_4" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="6" height="6" rx="0" ry="0" fill="#ffa500" opacity="0.5"></rect><path stroke-width="2" stroke="#ffa500" d="M 3 -3 L -3 3M 0 6 L 6 0 M 9 3 L 3 9"></path></pattern></defs><g class="dxc-background"></g><g class="dxc-legend" transform="translate(609,12)" clip-path="url(#DevExpress_2)"><g><g class="dxc-item" transform="translate(0,0)"><rect x="0" y="0" width="12" height="12" rx="0" ry="0" fill="#ffa500"></rect><text x="19" y="0" text-anchor="start" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;" transform="translate(0,10)"><tspan x="19" dy="0">My oranges</tspan></text></g></g></g><g class="dxc-strips-group"><g class="dxc-h-strips" clip-path="url(#DevExpress_3)"></g><g class="dxc-v-strips" clip-path="url(#DevExpress_3)"></g></g><g class="dxc-constant-lines-group"><g class="dxc-h-constant-lines" clip-path="url(#DevExpress_3)"></g><g class="dxc-v-constant-lines" clip-path="url(#DevExpress_3)"></g></g><g class="dxc-axes-group"><g class="dxc-h-axis"><g class="dxc-grid"></g><g class="dxc-elements"><text x="62" y="297" text-anchor="middle" transform="rotate(0,62,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="62" dy="0">Monday</tspan></text><text x="141" y="297" text-anchor="middle" transform="rotate(0,141,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="141" dy="0">Tuesday</tspan></text><text x="221" y="297" text-anchor="middle" transform="rotate(0,221,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="221" dy="0">Wednesday</tspan></text><text x="301" y="297" text-anchor="middle" transform="rotate(0,301,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="301" dy="0">Thursday</tspan></text><text x="380" y="297" text-anchor="middle" transform="rotate(0,380,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="380" dy="0">Friday</tspan></text><text x="460" y="297" text-anchor="middle" transform="rotate(0,460,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="460" dy="0">Saturday</tspan></text><text x="539" y="297" text-anchor="middle" transform="rotate(0,539,297)" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="539" dy="0">Sunday</tspan></text></g><g class="dxc-line"></g></g><g class="dxc-v-axis"><g class="dxc-grid"><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 275.5 L 579 275.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 231.5 L 579 231.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 187.5 L 579 187.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 144.5 L 579 144.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 100.5 L 579 100.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 56.5 L 579 56.5"></path><path stroke-width="1" stroke="#808080" stroke-opacity="0.35" d="M 22 12.5 L 579 12.5"></path></g><g class="dxc-elements"><text x="12" y="279" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">0</tspan></text><text x="12" y="235" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">2</tspan></text><text x="12" y="191" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">4</tspan></text><text x="12" y="148" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">6</tspan></text><text x="12" y="104" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">8</tspan></text><text x="12" y="60" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">10</tspan></text><text x="12" y="16" text-anchor="end" style="fill: #808080; fill-opacity: 0.75; font-family: \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 400; font-size: 12px; cursor: default;"><tspan x="12" dy="0">12</tspan></text></g><g class="dxc-line"></g></g></g><g class="dxc-border"></g><g class="dxc-series-group"><g class="dxc-series" transform="translate(0,0) scale(1,1)"><g class="dxc-elements" clip-path="url(#DevExpress_3)"></g><g class="dxc-markers" stroke-width="0" stroke="none" fill="#ffa500" r="0" inh="true" stroke-dasharray="none" line-width="2"><rect x="34" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="113" y="231" width="56" height="44" rx="0" ry="0"></rect><rect x="193" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="273" y="187" width="56" height="88" rx="0" ry="0"></rect><rect x="352" y="144" width="56" height="131" rx="0" ry="0"></rect><rect x="432" y="34" width="56" height="241" rx="0" ry="0"></rect><rect x="511" y="187" width="56" height="88" rx="0" ry="0"></rect></g></g></g><g class="dxc-labels-group"><g class="dxc-series-labels" clip-path="url(#DevExpress_3)" opacity="1"></g></g><g class="dxc-tooltip"><path fill="#000000" stroke="none" opacity="0.1" d="M 0 0" visibility="hidden"></path><path d="M 0 0 Z" visibility="hidden"></path><text x="0" y="0" text-anchor="middle" visibility="hidden" style="font-family: \'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana; font-weight: 200; font-size: 26px; fill: #ffffff; fill-opacity: 0.75; cursor: default;"><tspan x="0" dy="0">0</tspan></text></g><g class="dxc-crosshair-cursor"></g><g class="dxc-trackers" opacity="0.0001"><g class="dxc-crosshair-trackers" stroke="none" fill="grey"></g><g class="dxc-series-trackers"><g class="dxc-pane-tracker"></g></g><g class="dxc-markers-trackers" stroke="none" fill="grey"><g class="dxc-pane-tracker" clip-path="url(#DevExpress_3)"><rect x="34" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="113" y="231" width="56" height="44" rx="0" ry="0"></rect><rect x="193" y="209" width="56" height="66" rx="0" ry="0"></rect><rect x="273" y="187" width="56" height="88" rx="0" ry="0"></rect><rect x="352" y="144" width="56" height="131" rx="0" ry="0"></rect><rect x="432" y="34" width="56" height="241" rx="0" ry="0"></rect><rect x="511" y="187" width="56" height="88" rx="0" ry="0"></rect></g></g><g class="dxc-legend-trackers" stroke="none" fill="grey" transform="translate(609,12)"><rect x="-10" y="-6" width="101" height="23" rx="0" ry="0"></rect></g></g></svg>';

            setTimeout(function() {
                //$('#chart').css({'display':'none'});
                
                ogreAPI.initializeCanvas();
                //var chart = document.getElementById('chart').innerHTML;
                
                var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(test);

                fabric.Image.fromURL(dataUrl, function(img) {
                    ogreAPI.canvas.add(img);
                });
            }, 100);
        },
        colorPicker: function(){
            $('.clrpicker').ColorPicker({
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
                $('.menu li').on('click', function() {
                    if($(this).children().length == 0) return;

                    $(this).find('>:first-child').addClass('submenu-active');
                    $('.menu').addClass('slide-left');
                });
            },
            menuBackButton: function() {
                //Menu Back Button Listener
                $('.back-btn').on('click', function(event) {
                    event.stopPropagation();
                    //$(this).closest('ul').removeClass('submenu-active');
                    $(this).parent().removeClass('submenu-active');
                    $('.menu').removeClass('slide-left');
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
            }
        }
    };

    window.API = ogreAPI;


    $(document).ready(function() {
        
        $('.pager span').text(""); //Eliminate the text from bullets on the slider

        
        ogreAPI.listeners.loginButton();

        ogreAPI.listeners.menuItemButton();

        ogreAPI.listeners.menuBackButton();

        ogreAPI.setCanvasBackgroundImage();

        ogreAPI.listeners.optionsRepeatBg();

        ogreAPI.colorPicker();

        ogreAPI.listeners.heightCustomization();

        ogreAPI.listeners.widthCustomization();

        ogreAPI.addImage();

        ogreAPI.loadDummyInfographic();

        //ogreAPI.addText();

    });
})();