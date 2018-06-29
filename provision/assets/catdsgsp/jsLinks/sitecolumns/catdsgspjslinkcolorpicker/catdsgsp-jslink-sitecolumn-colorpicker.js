// <reference path="http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.11.2.js" />

/***************************************************************
jQuery master file for the Interactive Color Selector
Table of Contents:


1.0 - JSLink Site Column Color Selector Wizard
		1.0.0 - JSLink Init Script
		1.0.1 - JSLink NewForm Function
		1.0.2 - JSLink ViewForm Function
		1.0.3 - JSLink EditForm Function

1.3 - Color Picker Modal Dialog
	1.3.1 - Edit / New Form Color Picker Dialog
	
	
	
/***** READ ME - BEGIN *****

OVERVIEW:
	This control providees the ability for the user to interactively associate a color as an attritbute associated to some list,
	library or page. It is tied to a single line to text site column using the JSLink property on the site column.

TECHNICAL OVERVIEW:
	The control uses the SPO Color picker page located at "_layouts/15/morecolors.aspx" and using the modal dialog function built
	into SP. It allows inline grid editing using the "SP.JsGrid.PropertyType.Utils.RegisterEditControl" override.
	
	MUST READ: 	
				
	NOTE: 	
	
	
DATA STORAGE OVERVIEW:




/***** READ ME - END *****
	
***************************************************************/

/*************************************/
/* Section 1.0.0 - JSLink Init Script JS - Begin*/
/*************************************/

// Load the CSS for the Control.
	//util_loadJsCssFile('/sites/LaunchPointPilotDev/Style Library CSP/Styles/JSLinkSiteColumns/cspColorPicker.css', 'css')


// Create the Primary Control Object that will hold all the properties and data
	cspJSLink_ColorPicker = {};	
	
// Project or company acrynom for CSS Classnames
	cspJSLink_ColorPicker.cssAcrynom = 'fuse';

// Control Name for comibing with Prefix to ensure unique CSS classnames
	cspJSLink_ColorPicker.cssControlName = 'JSLinkColorPicker';
	
// Combined acrynom and control name for a fully unique CSS prefix for all dynamic classnames
	cspJSLink_ColorPicker.cssControlPrefix = cspJSLink_ColorPicker.cssAcrynom + '-' + cspJSLink_ColorPicker.cssControlName + '-'
	
// Output ID for the HTML Block that will hold the color icon
	cspJSLink_ColorPicker.HTMLID = 'fuseJSLinkColorPickerField';
	
// HTML 'Data-" attribute that is used on the HTML object for displaying the color value.
	cspJSLink_ColorPicker.HTMLDataAttr = 'fusecolorvalue';

// GridView & Site Column specific variables
	
	// 'cellContext' to be used for checking user edit-ability - TODO
	cspJSLink_ColorPicker.cellContext = ctx;
	cspJSLink_ColorPicker.columnName = "catdsgspJSLinkColorPicker";
	


// *****InitSetting*****
	// We must also declare the SharePoint Column Name here because it will not allow us to use the variable declared above.
	// Make sure the Priority field view gets hooked up to the GetPriorityFieldIcon method defined below
(function () {

    var cspJSLinkColorPicker = {};
    cspJSLinkColorPicker.Templates = {};
    cspJSLinkColorPicker.Templates.Fields = {
        "catdsgspJSLinkColorPicker": {
            "View": cspJSLinkColorPicker_ViewForm,
            "DisplayForm": cspJSLinkColorPicker_ViewForm,
            "EditForm": cspJSLinkColorPicker_EditForm,
            "NewForm": cspJSLinkColorPicker_NewForm
        }
    };
 
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(cspJSLinkColorPicker);
 
})();



/*************************************/
/* Section 1.0.0 - JSLink Init Script JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.1 - JSLink NewForm Function JS - Begin*/
/*************************************/

function cspJSLinkColorPicker_NewForm(ctx) {

    var color = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
 
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
    	return $('#' + cspJSLink_ColorPicker.HTMLID).data(cspJSLink_ColorPicker.HTMLDataAttr)
        //return document.getElementById('cspJSLinkColorPickerField').getAttribute("data-cspcolorvalue");
        
    });
    formCtx.registerInitCallback(formCtx.fieldName, function () {
        cspJSLinkColorPicker_loadScript('https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min.js',function(){
         });
    });
     
    var fieldhtml = "<div id='" + cspJSLink_ColorPicker.HTMLID + "' data-" + cspJSLink_ColorPicker.HTMLDataAttr + "='" + color + "' style='width:20px;height:20px;background-color:" + color + ";border:1px solid #000;padding: 2px;' onclick='cspJSLinkColorPicker_InitDialog(\"" + cspJSLink_ColorPicker.HTMLID + "\")'></div>";
    return fieldhtml;
}



/*************************************/
/* Section 1.0.1 - JSLink NewForm Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.2 - JSLink ViewForm Function JS - Begin*/
/*************************************/

function cspJSLinkColorPicker_ViewForm(ctx) {

    var color = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
    
    var fieldhtml = "<div id='" + cspJSLink_ColorPicker.HTMLID + "' data-" + cspJSLink_ColorPicker.HTMLDataAttr + "='" + color + "' style='cursor:pointer;width:20px;height:20px;background-color:" + color + ";border:1px solid #000;padding:2px;'></div>";
    return fieldhtml;
};



/*************************************/
/* Section 1.0.2 - JSLink ViewForm Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.3 - JSLink EditForm Function JS - Begin*/
/*************************************/

function cspJSLinkColorPicker_EditForm(ctx) {

    var color = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
 
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
        return $('#' + cspJSLink_ColorPicker.HTMLID).data(cspJSLink_ColorPicker.HTMLDataAttr)
        //return document.getElementById(cspJSLink_ColorPicker.HTMLID).getAttribute("data-" + attrValue);
    });
    
    formCtx.registerInitCallback(formCtx.fieldName, function () {
        cspJSLinkColorPicker_loadScript('https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min.js',function(){
         });
    });
    var fieldhtml = "<div id='" + cspJSLink_ColorPicker.HTMLID + "' data-" + cspJSLink_ColorPicker.HTMLDataAttr + "='" + color + "' style='width:20px;height:20px;background-color:" + color + ";border:1px solid #000;padding: 2px;' onclick='cspJSLinkColorPicker_InitDialog(\"" + cspJSLink_ColorPicker.HTMLID + "\")'></div>";
    return fieldhtml;
}


		
/*************************************/
/* Section 1.0.3 - JSLink EditForm Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.3.1 - Edit / New Form Color Picker Dialog JS - Begin*/
/*************************************/

function cspJSLinkColorPicker_InitDialog(fieldID) {


$('body').on('customEvent', function() {
            
            	$('.ms-dlgContent').addClass(cspJSLink_ColorPicker.cssControlPrefix + 'DialogBox');
            
            
            });

    SP.SOD.executeFunc("SP.UI.Dialog.js", "SP.UI.DialogOptions", function () {
        SP.SOD.executeFunc("sp.js", "SP.Utilities.Utility.get_layoutsLatestVersionRelativeUrl", function () {
            var d = SP.UI.$create_DialogOptions();
            
            console.log(d);
            
            // Checks to see if a value already exists in the field. If not, then it just displays a color icon defined in the "else" statement.
            if (!IsNullOrUndefined(document.getElementById(fieldID)))
                d.args = $('#' + cspJSLink_ColorPicker.HTMLID).attr('data-' + cspJSLink_ColorPicker.HTMLDataAttr);
            else
                d.args = "#FFFFFF";
            var e = SP.Utilities.UrlBuilder.urlCombine(SP.PageContextInfo.get_webServerRelativeUrl(), SP.Utilities.Utility.get_layoutsLatestVersionRelativeUrl());
            
            // Get the URL of the morecolors.aspx and use it to set the URL on the dialog as well as other properties.
            e = SP.Utilities.UrlBuilder.urlCombine(e, "morecolors.aspx");
            d.url = e;
            d.title = "More Colors";
            
            console.log(d);
            
            // Setup the Callback once the dialog has been interacted with. (OK or cancel has been clicked)
            d.dialogReturnValueCallback = function (d, b) {
 
                if (d === SP.UI.DialogResult.OK) {
                
                	// Set the data- attribute with the proper color and assign the color to the background-color property of the color icon.
                    $('#' + cspJSLink_ColorPicker.HTMLID).attr('data-' + cspJSLink_ColorPicker.HTMLDataAttr, b);
                    $('#' + cspJSLink_ColorPicker.HTMLID).css('background-color', b);
                }
            };
            SP.UI.ModalDialog.showModalDialog(d);
            $('body').trigger('customEvent');     
            return false
        })
    });
}



function cspJSLinkColorPicker_loadScript(url, callback) {
 
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/*************************************/
/* Section 1.3.1 - Edit / New Form Color Picker Dialog JS - End*/
/*************************************/