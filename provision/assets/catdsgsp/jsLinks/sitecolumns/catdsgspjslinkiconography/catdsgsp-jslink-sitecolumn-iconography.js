/***************************************************************
JavaScript master file for the Iconography Engine
Table of Contents:


1.0 - Iconography Wizard
		1.0.0 - Script Loading Init's
		1.0.1 - JSLink Init Script
		1.0.2 - JSLink NewForm Function
		1.0.3 - JSLink ViewForm Function
		1.0.4 - JSLink EditForm Function
		1.0.5 - JSLink Execute FieldOverride
	1.1 - Global settings & variable declaration
		1.1.1 - Control Launch Pre-Check
		1.1.2 - Initilization Settings & Configurations
			1.1.2.1 - Create Loading Message Methods
			1.1.2.2 - Delete Loading Message Methods
	1.2 - IconographyEngine Properties Data Connection Methods
		1.2.1 - JSON Object from SP List
		1.2.2 - JSON Object from External File
			1.2.2.1 - JSON Object External File Location
	1.3 - Build Modal HTML Methods
		1.3.1 - Category Grouped HTML
			1.3.1.1 - Category Grouped HTML Click Event(s
		1.3.2 - Search Icons HTML
	1.4 - Wizard Trigger Creation for Form
	1.5 - Modal dialog instantiation
		1.5.1 - Select icon logic within Modal
	1.6 - Update IconographyEngine value input field 
	1.7 - Display selected IconographyEngine icon on Form
	1.8 - Pre-existing Value Check - Edit Form
	1.9 - Utility Functions
		1.9.1 - Return Unique Values in an Array Method
		1.9.2 - Calculate how many icons in each Category
		1.9.3 - LoadScript - Dynamic JS Loading Function
		1.9.4 - LoadCSS - Dynamic CSS Loading Function
	
	
	
/***** READ ME - BEGIN *****

OVERVIEW:
	This control provides users the ability to assign to their list item a specific Icon from the Font Awesome font library.
	The Icon Wizard value that is assigned and stored with each individual list item is a vector based font icon. This allows
	it to be fully scalable, colorable, animatable.
	
	It creates an interactive wizard where the user can browse through a library of icons and select which icon they would
	like to be associated to their list item.

TECHNICAL OVERVIEW:
	The control is modularly designed to allow for customization around multiple areas of the control's implementation.
	For example, you can modify where the Icon Wizard icons are retried from and loaded into the wizard by customizing
	the function responsible for creating the JSON Data Object.
	
	MUST READ: 	There are specific lines of comment in the code, "*****InitSetting*****" that define the
				configurable properties of the control. These properties can and should be updated to match
				your project or client requirements.
				
				There is also a associated CSS File that uses the value of one of the
				"InitSetting" properties to preface all of the required CSS Classes with to ensure uniqueness.
				
	NOTE: 	This particular implementation of the control is used to associate a Icon Wizard Icon value to a SharePoint
			List / Library Item by storing the FontAwsome CSS value into a text field.
			ALTHOUGH, the current programmatic design of the control allows you to use implement the wizard
			on any form where the Icon Wizard CSS value can be stored in a text field, in or out of SharePoint.
	
	
DATA STORAGE OVERVIEW:
	Each icon within the Font Awesome font library has an associated CSS classname and hex value.
	The CSS classname for the individual icon is stored into a text field on the SharePoint List/Library.
	Within web parts and controls, this value can be extracted from the list and used as an icon that 
	is associated with the individual list item. Because it is a true font icon, it is scalable,
	colorable, animatable, etc.




/***** READ ME - END *****
	
***************************************************************/
//jQuery.noConflict();








/*************************************/
/* Section 1.0.0 - Script Loading Init's JS - Begin*/
/*************************************/

function fuse_IconographyEngine_ScriptLoading() {

// *****InitSetting*****

/* CSS Dynamic Loading */
fuse_IconographyEngine_loadCss(_spPageContextInfo.siteAbsoluteUrl + '/catdsgsp/jslinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography.css');
fuse_IconographyEngine_loadCss('https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');

/* JS Dynamic Loading */

fuse_IconographyEngine_loadScript('https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min.js', function () {
	fuse_IconographyEngine_loadScript("https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/jquery-ui.min.js", function () {
		
		
		fuse_IconographyEngine_LaunchPreCheck();
	
	});
});

}
/* Global Variables */

// This prefix value is prepended to the CSS Classname constructor below to isolate all of the
// control's CSS classnames to a unique client/project specific value.
var fuse_IconographyEngine_GlobalVar_CompanyProjectCSSPrefix = 'fuse';

// This prefix is prepended with the client/project CSS prefix above to ensure all CSS Classes
// within the Icon Wizard Control are unique to the control.
var fuse_IconographyEngine_GlobalVar_CSSPrefix = fuse_IconographyEngine_GlobalVar_CompanyProjectCSSPrefix + '-IconographyEngine-';



/*************************************/
/* Section 1.0.0 - Script Loading Init's JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.1 - JSLink Init Script JS - Begin*/
/*************************************/

// Create a namespace for our functions so we don't collide with anything else
var fuse_IconographyGlobalObj = fuse_IconographyGlobalObj || {};

// This is the CSS Control Prefix Classname for inserting the HTML <DIV> block that the Icon Wizard Control JS will be looking for.
//		This is also the same class name prefix used in the Icon Wizard Control found at: 'fuse_IconographyControlObj.ControlCSSPrefix'
fuse_IconographyGlobalObj.ControlCSSPrefix = fuse_IconographyEngine_GlobalVar_CSSPrefix;

// *****InitSetting*****
// This is internal name of the SharePoint Column that we are looking to override.
// We assign it here to access it in the Display/View/Edit/New Form funcitons below.
// but it must also be declared in the Fields Override below, which cannot use the varialble.
var SpSiteColumnName = 'catdsgspJSLinkIconography';

 
// Create a function for customizing the Field Rendering of our fields
fuse_IconographyGlobalObj.CustomizeFieldRendering = function () 
{

    var fieldJsLinkOverride = {};
    fieldJsLinkOverride.Templates = {};    

    fieldJsLinkOverride.Templates.Fields =
    {
        // *****InitSetting*****
        // We must also declare the SharePoint Column Name here because it will not allow us to use the variable declared above.
        // Make sure the Priority field view gets hooked up to the GetPriorityFieldIcon method defined below
        'catdsgspJSLinkIconography' : { 'View': fuse_IconographyGlobalObj.ViewItemForm, 'DisplayForm': fuse_IconographyGlobalObj.ViewItemForm, 'NewForm' : fuse_IconographyGlobalObj.NewItemForm, 'EditForm' : fuse_IconographyGlobalObj.EditItemForm }
    };

    //fieldJsLinkOverride.OnPostRender = scriptLoading//function() {alert('PostRender')}
    
    
    
 	    	console.log('got here');
    // Register the rendering template
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldJsLinkOverride);
};
 
// Create a function for getting the Priority Field Icon value (called from the first method)
fuse_IconographyGlobalObj.GetPriorityFieldIcon = function (ctx) {

};




/*************************************/
/* Section 1.0.1 - JSLink Init Script JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.2 - JSLink NewForm Function JS - Begin*/
/*************************************/


fuse_IconographyGlobalObj.NewItemForm = function (ctx) 
{
		
	var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
        return document.getElementById(fuse_IconographyGlobalObj.ControlCSSPrefix + "JSLinkInput").value;
    });
    
    formCtx.registerInitCallback(formCtx.fieldName, function () {
        fuse_IconographyEngine_ScriptLoading();
    });
    
    var iconographyEngineHTML = '<div class="' + fuse_IconographyGlobalObj.ControlCSSPrefix + 'IconographyEngine-Marker"><span style="display:none;"><input id="' + fuse_IconographyGlobalObj.ControlCSSPrefix + 'JSLinkInput"></span></div>';
    
    return iconographyEngineHTML;    
};


/*************************************/
/* Section 1.0.2 - JSLink NewForm Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.3 - JSLink ViewForm Function JS - Begin*/
/*************************************/

fuse_IconographyGlobalObj.ViewItemForm = function (ctx) 
{

	// NOTE: If styles are not already being loaded globally, use the following function call to load for this SP View
    // fuse_IconographyEngine_loadCss('RELATIVE PATH TO CSS');
    fuse_IconographyEngine_loadCss(_spPageContextInfo.siteAbsoluteUrl + '/catdsgsp/jslinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography.css');

	console.log('got here now');
	console.log(ctx.CurrentItem);    
    var iconographyEngineHTML = '<i class="fa fa-' + ctx.CurrentItem[SpSiteColumnName] + ' fa-2x"></i>';
    
    return iconographyEngineHTML;    
};


/*************************************/
/* Section 1.0.3 - JSLink ViewForm Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.4 - JSLink EditForm Function JS - Begin*/
/*************************************/


fuse_IconographyGlobalObj.EditItemForm = function (ctx) 
{

console.log('got here edit form');
	
	var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
	console.log(ctx.CurrentItem);
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
        return document.getElementById(fuse_IconographyGlobalObj.ControlCSSPrefix + "JSLinkInput").value;
    });
    
    formCtx.registerInitCallback(formCtx.fieldName, function () {
        fuse_IconographyEngine_ScriptLoading();
    });
    
    var iconographyEngineHTML = '<div class="' + fuse_IconographyGlobalObj.ControlCSSPrefix + 'IconographyEngine-Marker"><span><input value="' + ctx.CurrentItem[SpSiteColumnName] + '" id="' + fuse_IconographyGlobalObj.ControlCSSPrefix + 'JSLinkInput"></span></div>';
    
    return iconographyEngineHTML;    
};



/*************************************/
/* Section 1.0.4 - JSLink EditForm Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.0.5 - JSLink Execute FieldOverride JS - Begin*/
/*************************************/

fuse_IconographyGlobalObj.CustomizeFieldRendering();


/*************************************/
/* Section 1.0.5 - JSLink Execute FieldOverride JS - End*/
/*************************************/
/*************************************/
/* Section 1.1.1 - Control Launch Pre-Check JS - Begin*/
/*************************************/

	// First check to see if the Icon Wizard Control Marker HTML Object Exists.
	// If it does, start the control by calling the '' function
	
	// *****InitSetting*****
	// NOTE: This entire script can be changed based on the how and where this control
	// will be implemented and used.
	
//$(document).ready(function () {

function fuse_IconographyEngine_LaunchPreCheck() {

	// In this case, we are using a custom sharepoint New/Edit/View Form that includes
	// a div with the following specific classname to initialize the control.
	var iconographyEngineControlLocationCSSClass = '.' + fuse_IconographyEngine_GlobalVar_CSSPrefix + 'IconographyEngine-Marker';

	if ($(iconographyEngineControlLocationCSSClass).length > 0) {
		
		fuse_IconographyEngine_Control_Init();
	}
}
//});



/*************************************/
/* Section 1.1.1 - Control Launch Pre-Check JS - End*/
/*************************************/
/*************************************/
/* Section 1.1.2 - Initilization Settings & Configurations JS - Begin*/
/*************************************/

function fuse_IconographyEngine_Control_Init() {

	// *****InitSetting*****
	// Dynamically load the required CSS for this control.
	
	// We dynamically load the control because this control might be called outside the scope
	// of a custom master page. (ie. Form Pages, JSLink, etc.)


	/*****/
	// Define the control's global object & variables - BEGIN
	/*****/
	
	
		// Create the global object which will hold the configuration properties as well as
		// the FontAwsome data object with all of the font icon references.
			var fuse_IconographyControlObj = {};
			
		// This will be used to generate the interface for launching the wizard.
		// It can be a DIV placed manually on the form, or a pre-existing UNIQUE class 
		// for where the data for the icon will be stored
		
		// *****InitSetting*****
		// Global Prefix for ensuring unique Class that can be changed to match the 
		// project or client.
			fuse_IconographyControlObj.ControlCSSPrefix = fuse_IconographyEngine_GlobalVar_CSSPrefix;
				
		// *****InitSetting*****	
		// Icon Wizard Icon Data List Name. This should be updated with the appropriate list name where the
		// Icon Wizard data is located.
		// NOTE: Only required if your data is located in a SharePoint List. Used by fuse_IconographyEngine_generateJSONDataObjectSPList()
		// function for SharePoint CSOM Data Access.
			fuse_IconographyControlObj.IconographyEngineDataListName = 'LISTNAMEHERE';
	
		// *****InitSetting*****
		// NOTE: This control ASSUMES that the Marker is the parent classname
		// of where the input field is located. It can either be added manually or 
		// pre-exist, but it MUST be UNIQUE.
		// NOTE: 	Automatically generated for you when using JSLink in SharePoint. OTHERWISE, this CSS Classname will need to be added
		// 			to the form manually.	
			fuse_IconographyControlObj.IconographyEngineMarkerLocation = '.' + fuse_IconographyControlObj.ControlCSSPrefix + 'IconographyEngine-Marker';
		
			
		// FontAwsome Control Wizard creation function. We include it in the fuse_IconographyControlObj
		// object so that the IconographyEngine Data Access function will simply need to call the "iconographyEngineCreateWizard" method of the object
			fuse_IconographyControlObj.iconographyEngineCreateWizard = function(iconographyEngineCreateArg) { fuse_IconographyEngine_createWizardTrigger(iconographyEngineCreateArg) };
			
	
	/*****/		
	// Define the control's global object & variables - END
	/*****/
			
		
			
		// Once we have defined out variables, lets perform some presentation logic while the wizard
		// is initializing.
		// NOTE: 	Because the Icon Wizard icon data is pulled in using CSOM, there can be a slight delay
		// 			before the wizard is fully ready for use upon page load. To prevent any negative user
		//			experience, we will hide the FontAwsome font value input field and create a 
		//			"Loading..." status message until the wizard is completely ready.
		
		
			// Create an object to hold the input field
				var $objIconographyEngineTextField = $(fuse_IconographyControlObj.IconographyEngineMarkerLocation).find(':input');
	
			// Add a custom CSS Classname to the Input Object and then hide the field from view
				$objIconographyEngineTextField.addClass(fuse_IconographyControlObj.ControlCSSPrefix + 'ValueInput-Item');
				$objIconographyEngineTextField.hide();
				
				
			// Create the "Loading..." HTML to be displayed immediately upon page load
				var loadingHTML = fuse_IconographyEngine_generateLoadingHTML(fuse_IconographyControlObj)
				$objIconographyEngineTextField.before(loadingHTML);
				
			// Insert the loadingHTML into the "iconographyEngineMarker" container
				//$(fuse_IconographyControlObj.IconographyEngineMarkerLocation).prepend(loadingHTML);

			//return;
		
			// Call the generateJSONObject function to create the JSON Data Array Object and add it 
			// to the 'fuse_IconographyControlObj' object. Once the data object has been created and added,
			// we will execute the FontAwsome Wizard functions.
			
				//fuse_IconographyEngine_createWizardTrigger(ControlCSSPrefix, IconographyEngineMarkerLocation);
				//fuse_IconographyEngine_generateJSONDataObjectSPList(fuse_IconographyControlObj);
				fuse_IconographyEngine_generateJSONDataObjectExternalFile(fuse_IconographyControlObj);

};

/*************************************/
/* Section 1.1.2 - Initilization Settings & Configurations JS - End*/
/*************************************/
/*************************************/
/* Section 1.1.2.1 - Create Loading Message Methods JS - Begin*/
/*************************************/

function fuse_IconographyEngine_generateLoadingHTML(fuse_IconographyControlObj) {

	// Create the HTML for the loading message. This message will then be removed
	// from the DOM once the Wizard has fully loaded. The function is simple in it's current
	// state, but can be more robust being a separated function.
	
	var loadingHTML = '<div class="' + fuse_IconographyControlObj.ControlCSSPrefix + 'Loading-Wrapper"><i class="fa fa-spinner fa-pulse"></i></div>';
	
	return(loadingHTML);
	



}



/*************************************/
/* Section 1.1.2.1 - Create Loading Message Methods JS - End*/
/*************************************/
/*************************************/
/* Section 1.1.2.2 - Delete Loading Message Methods JS - Begin*/
/*************************************/

function fuse_IconographyEngine_removeLoadingHTML(fuse_IconographyControlObj) {

	// Remove the HTML for the loading message from the DOM.
	
		$('.' + fuse_IconographyControlObj.ControlCSSPrefix + 'Loading-Wrapper').remove();
}



/*************************************/
/* Section 1.1.2.2 - Delete Loading Message Methods JS - End*/
/*************************************/
/*************************************/
/* Section 1.2.1 - JSON Object from SP List JS - Begin*/
/*************************************/


function fuse_IconographyEngine_generateJSONDataObjectSPList(fuse_IconographyControlObj) {

	// This function is used to build the IconographyEngine JSON Data Object that contains
	// the information about all of the available Icon Wizard Icons.
	
	// The function can be replaced with any other data access function, but the JSON Data Object Array
	// must added to the fuse_IconographyControlObj as fuse_IconographyControlObj.jsonIconographyEngineDataObj with the following structure:
	
	// [ { IconographyEngineIconCategory: "Category Value", IconographyEngineIconClass: "Value", IconographyEngineTitle: "Value"}, {Next Object} ]
	// The above properties are expected for the rest of the Control to succeed.
	

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {

	//var clientContext = new SP.ClientContext(siteUrl);
    var clientContext = new SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle(fuse_IconographyControlObj.IconographyEngineDataListName);

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
        '<RowLimit>800</RowLimit></View>'
    );

    this.collListItem = oList.getItems(camlQuery);
    
    this.fuse_IconographyControlObj = fuse_IconographyControlObj;

    // This identifies the list/library fields we will be obtaining from the list/library
    clientContext.load(collListItem, "Include(Title, IconClassName, IconCategory)");

    // Call the appropriate functions based on Success or Failure of the CSOM Connection    
    clientContext.executeQueryAsync(
        Function.createDelegate(this, fuse_IconographyEngine_CSOMQuerySucceeded),
        Function.createDelegate(this, fuse_IconographyEngine_CSOMQueryFailed)
    );


});

}

function fuse_IconographyEngine_CSOMQuerySucceeded(sender, args) {
       
    // Create JSON Array to hold the IconographyEngine Icons
    	jsonIconographyEngineObj = [];
    
    // Create JSON Array to hold the IconographyEngine Icon Categories
    	jsonIconographyCategoriesObj = [];
    
    // Create the listItemEnumerator to Enumerate through the list.
    var listItemEnumerator = collListItem.getEnumerator();

    // For each item in the list, we need to loop through and build the DataSignature HTML Block that will be used to creating 
    // the interactive portion of the wizard.          
    while (listItemEnumerator.moveNext()) {

        var oListItem = listItemEnumerator.get_current();
        
        //Title, IconClassName, IconCategory
        
        // Available Properies:
        	// oListItem.get_file().get_serverRelativeUrl() // File Location for Doc Lib Item
        	// oListItem.get_item('FeaturePointListCategory').Label // Managed MetaData
        	// oListItem.get_item('FeaturePointListHotSpotColor') // Normal List Item
        
           	// Create Object to hold the IconographyEngine Icon Value
		   		item = {};
		        item ["IconographyEngineTitle"] = oListItem.get_item('Title');
		        item ["IconographyEngineIconClass"] = oListItem.get_item('IconClassName');
		        item ["IconographyEngineIconCategory"] = oListItem.get_item('IconCategory');
		        
			        
        	// Add the item to the jsonIconographyEngineObj Array
		        jsonIconographyEngineObj.push(item);
		        
			// Add the item category to the jsonIconographyCategoriesObj Array
				jsonIconographyCategoriesObj.push(oListItem.get_item('IconCategory'));
				
    }
    
    	// Return the JSON Object to the requestor.    	
    	// Add the jsonIconographyEngineDataObj array object to the fuse_IconographyControlObj object
    		fuse_IconographyControlObj.jsonIconographyEngineDataObj = jsonIconographyEngineObj;
    		
    	// Add the jsonIconographyEngineDataObj object to the fuse_IconographyControlObj object
    	
    		// Use the GetUniqueValsInArray Utility function to return the unique Category Values
    		var uniqueCategories = fuse_IconographyEngine_getUniqueValsInArray(jsonIconographyCategoriesObj);
    	
    		// Now add the array of Unique Categories for the IconographyEngine Icons to the fuse_IconographyControlObj
    		fuse_IconographyControlObj.jsonIconographyEngineCategoriesObj = uniqueCategories;
    		    		
    		
    	// Pass the updated fuse_IconographyControlObj object to the "iconographyEngineCreateWizard" method to initilize the Icon Wizard Icon Wizard
    		fuse_IconographyControlObj.iconographyEngineCreateWizard(fuse_IconographyControlObj);

}

function fuse_IconographyEngine_CSOMQueryFailed(sender, args) {

    console.log('failed');

    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

/*************************************/
/* Section 1.2.1 - JSON Object from SP List JS - End*/
/*************************************/
/*************************************/
/* Section 1.2.2 - JSON Object from External File JS - Begin*/
/*************************************/

function fuse_IconographyEngine_generateJSONDataObjectExternalFile(fuse_IconographyControlObj) {

console.log('got here');

	// Obtain the JSON path from the JSON path function.
	var jsonPath = fuse_IconographyEngine_generateJSONDataObjectExternalFile_Location(fuse_IconographyControlObj);

	$.getJSON(jsonPath, function(data) {

    	// Return the JSON Object to the requestor.    	
    	// Add the jsonIconographyEngineDataObj array object to the fuse_IconographyControlObj object
    		fuse_IconographyControlObj.jsonIconographyEngineDataObj = data;
    		
    	// Now we need to create a unique list of the IconographyEngine Icon Categories
    	
    		// Create JSON Array to hold the IconographyEngine Icon Categories
		    	jsonIconographyCategoriesObj = []; 
		    	
		    // Loop through the jsonIconographyEngineDataObj object array and aggregate all of the categories.
	    		for (i=0; i < fuse_IconographyControlObj.jsonIconographyEngineDataObj.length; i++) {
	    		
	    			jsonIconographyCategoriesObj.push(fuse_IconographyControlObj.jsonIconographyEngineDataObj[i].IconographyEngineIconCategory);
	    		
	    		}
    	
    		// Use the GetUniqueValsInArray Utility function to return the unique Category Values
    		var uniqueCategories = fuse_IconographyEngine_getUniqueValsInArray(jsonIconographyCategoriesObj);
    	
    		// Now add the array of Unique Categories for the IconographyEngine Icons to the fuse_IconographyControlObj
    		fuse_IconographyControlObj.jsonIconographyEngineCategoriesObj = uniqueCategories;    		
    		
    	// Pass the updated fuse_IconographyControlObj object to the "iconographyEngineCreateWizard" method to initilize the Icon Wizard Icon Wizard
    		fuse_IconographyControlObj.iconographyEngineCreateWizard(fuse_IconographyControlObj);
    });

}

/*************************************/
/* Section 1.2.2 - JSON Object from External File JS - End*/
/*************************************/
/*************************************/
/* Section 1.2.2.1 - JSON Object External File Location JS - Begin*/
/*************************************/

function fuse_IconographyEngine_generateJSONDataObjectExternalFile_Location(fuse_IconographyControlObj) {

	// This is a helper function that provides the relative path to the JSON.
	// NOTE: 	This is included as a helper function, so if the need arises to provide an alternative path
	//			to another JSON file is needed, over-riding this single function can be done with ease.
	
	var jsonPath = _spPageContextInfo.siteAbsoluteUrl + '/catdsgsp/jslinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography-json.js';
	
	return jsonPath;

}



/*************************************/
/* Section 1.2.2.1 - JSON Object External File Location JS - End*/
/*************************************/
/*************************************/
/* Section 1.3.1 - Category Grouped HTML JS - Begin*/
/*************************************/

function fuse_IconographyEngine_generateModalHTML(fuse_IconographyControlObj) {

		//Generate the Modal HTML and return it to the requestor.
		
		//Create variables for local use within the funciton
			
			// Create the CSS Control Prefix for HTML CSS
		var ControlCSSPrefix = fuse_IconographyControlObj.ControlCSSPrefix;
		
			// Create the Modal Root CSS Class Wrapper
		var classWrapper = fuse_IconographyControlObj.ControlCSSPrefix + 'WizardModal-Wrapper';
		
			// Create the modalHTML variable and the opening DIV tag.
		var modalHTML = '<div id="' + classWrapper + '" title="Please Select an Icon">';
		
		
		/*
		
		IN PROGRESS DEVELOPMENT
		
		*/
		
		
		modalHTML += '<div class="' + ControlCSSPrefix + 'Icon-Search-Wrapper">';
		
		modalHTML += '<div class="' + ControlCSSPrefix + 'Icon-Search-Trigger ' + ControlCSSPrefix + 'Icon-Search-TriggerClosed"></div>';
		
		modalHTML += '<div class="' + ControlCSSPrefix + 'Icon-Search-Content-Wrapper ' + ControlCSSPrefix + 'Icon-Search-Content-Wrapper-Closed">';
		modalHTML += '<input class="' + ControlCSSPrefix + 'Icon-Search-Input">';
		modalHTML += '<input class="' + ControlCSSPrefix + 'Icon-Search-Button" type="button" value="Search">';
		modalHTML += ' <input class="' + ControlCSSPrefix + 'Icon-SearchClear-Button" type="button" value="Clear Search">';
		modalHTML += '</div></div>';
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
			
		
		// Generate the HTML
		// NOTE: The HTML can be constructed in ANY format desired, but it MUST INCLUDE the following:
		//		 - The custom "ControlCSSPrefix + Icon-Item" CSS Class
		//		 - The "data-iconographyengineclass" attribute
		//		 - The "data-iconographyenginehashval" attribute (OPTIONAL)		
		
		// NOTE: TODO I WOULD LIKE TO FIND A MORE EFFICIENT WAY OF PROCESSESING THIS, BUT FOR NOW THIS WILL WORK.
		// We want to separate the Icons into their respective categories.
		// Begin by looping through the IconographyEngine Category Array Object to get the distinct Categories
		for (c=0; c < fuse_IconographyControlObj.jsonIconographyEngineCategoriesObj.length; c++) {
		
			// Create a DIV wrapper for all the distinct categories.
					modalHTML += '<div class="' + ControlCSSPrefix + 'Icon-Category-Wrapper">';
					modalHTML += '<div class="' + ControlCSSPrefix + 'Icon-Category-Title">' + fuse_IconographyControlObj.jsonIconographyEngineCategoriesObj[c] + '</div>';
					modalHTML += '<div class="' + ControlCSSPrefix + 'Icon-Category-Item-Wrapper">';
		
			// For each category loop through the Array Objects of IconographyEngine Icons and find those matching this category
			for (i=0; i < fuse_IconographyControlObj.jsonIconographyEngineDataObj.length; i++) {
						
				if (fuse_IconographyControlObj.jsonIconographyEngineDataObj[i].IconographyEngineIconCategory == fuse_IconographyControlObj.jsonIconographyEngineCategoriesObj[c]) {
					modalHTML = modalHTML + '<i class="fa fa-' + fuse_IconographyControlObj.jsonIconographyEngineDataObj[i].IconographyEngineIconClass + ' ';
					modalHTML = modalHTML + ControlCSSPrefix + 'Icon-Item" data-iconographyengineclass="' + fuse_IconographyControlObj.jsonIconographyEngineDataObj[i].IconographyEngineIconClass + '">';
					modalHTML = modalHTML + '</i>';
				} // End of IF statement
			} // End of FontAwsome Icon Loop
			
			// Close the DIV wrapper for the distinct category and the Item Wrapper.
					modalHTML += '</div></div>';
			
		} // End of Distinct Category Loop
				
		// Close out the HTML DIV
			modalHTML = modalHTML + '</div>'
			//console.log(modalHTML);    		
    		
    		// Identify how many many icons belong to each category by calling the 'fuse_IconographyEngine_calculateIconPerCategoryCount(fuse_IconographyControlObj)' function
    		var modalHTML = fuse_IconographyEngine_calculateIconPerCategoryCount(modalHTML, ControlCSSPrefix);

			
			
			
			
			
			
			
				
		/*modalHTML = modalHTML + '<i class="fa fa-music ' + ControlCSSPrefix + 'Icon-Item" data-iconographyengineclass="fa-tags" data-iconographyenginehashval="f02c"></i>';
		modalHTML = modalHTML + '<i class="fa fa-empire ' + ControlCSSPrefix + 'Icon-Item" data-iconographyengineclass="fa-empire" data-iconographyenginehashval="f1d1"></i>';
		modalHTML = modalHTML + '<i class="fa fa-rebel ' + ControlCSSPrefix + 'Icon-Item" data-iconographyengineclass="fa-rebel" data-iconographyenginehashval="f1d0"></i>';
		modalHTML = modalHTML + '</div>'*/
		
		// Add the HTML to the fuse_IconographyControlObj.
		
		fuse_IconographyControlObj.IconographyEngineModalHTML = modalHTML;
		
		console.log('added to object');
		console.log(fuse_IconographyControlObj);
		
}



function fuse_IconographyEngine_SearchClickEvents(ControlCSSPrefix) {

// Search Trigger
	
	// Clear Search Click Trigger	
	$('.' + ControlCSSPrefix + 'Icon-Search-Trigger').off('click');
	
	// Setup the click event for the search button trigger
	$('.' + ControlCSSPrefix + 'Icon-Search-Trigger').on('click', function() {
	
		// Determine if we are opening or closing the search controls. If we are closing them, we
		// will assume that the user wants to 'clear' the search while closing the search controls
		if ($(this).hasClass(ControlCSSPrefix + 'Icon-Search-TriggerOpen')) {
			fuse_IconographyEngine_SearchClickEvents_ClearSearch(ControlCSSPrefix);
		}
		
	
		// Find the search content wrapper sibling
		$(this).siblings('.' + ControlCSSPrefix + 'Icon-Search-Content-Wrapper').slideToggle();
		$(this).toggleClass(ControlCSSPrefix + 'Icon-Search-TriggerOpen ' + ControlCSSPrefix + 'Icon-Search-TriggerClosed')
		
	});
	
	
	 $('.' + ControlCSSPrefix + 'Icon-Search-Input').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('.' + ControlCSSPrefix + 'Icon-Search-Button').click();//Trigger search button click event
        }
    });
	
	
	
	
	
	



	// Clear Search
	$('.' + ControlCSSPrefix + 'Icon-SearchClear-Button').off('click');
	
	
	$('.' + ControlCSSPrefix + 'Icon-SearchClear-Button').on('click', function() {
	
	
		fuse_IconographyEngine_SearchClickEvents_ClearSearch(ControlCSSPrefix);
		return;
	
		// Remove all 'search' related css classnames and then update the category counts
				
			// Remove all 'search' css classnames from the individual icons.
			$('.' + ControlCSSPrefix + 'Icon-Item').each(function() {
			
				$(this).removeClass(ControlCSSPrefix + 'Icon-Search-MatchDisplay');
				$(this).removeClass(ControlCSSPrefix + 'Icon-Search-MatchHide');
				
			});
			
			// Remove all 'search' css classnames from the category containers.
			$('.' + ControlCSSPrefix + 'Icon-Category-Wrapper').each(function() {
				$(this).removeClass(ControlCSSPrefix + 'Icon-Category-Search-MatchHide');
			});
			
			// Reset the counts
			$('.' + ControlCSSPrefix + 'Icon-Category-Wrapper').each(function() {
				
				var iconCount = $(this).find('.' + ControlCSSPrefix + 'Icon-Item').size();
				$(this).find('.' + ControlCSSPrefix + 'Icon-Count').html(iconCount);
			
			});
			
			
	
	
	});


	// Since the Category Click event is created each time the control wizard is invoked, we will remove the click event before
	// re-invoking. This will ensure that multiple click events are not invoked.
	$('.' + ControlCSSPrefix + 'Icon-Search-Button').off('click');

	$('.' + ControlCSSPrefix + 'Icon-Search-Button').on('click', function(event){
	
		var $buttonClicked = $(this);
		
		// First capture the search string to filter against.
		var searchString = $buttonClicked.siblings('.' + ControlCSSPrefix + 'Icon-Search-Input').val();
		
		// Check for any value
		if (searchString == '') {  };
		
		// Process through each category wrapper, look for a match in each
		// data-iconographyengineclass value
		$('.' + ControlCSSPrefix + 'Icon-Category-Wrapper').each(function() {
		
		
		
		
		
			// Now roll through each icon
			$(this).find('.' + ControlCSSPrefix + 'Icon-Item').each(function() {
			
				// Since this might not be the first search performed, we want to remove any search result related styles
				$(this).removeClass(ControlCSSPrefix + 'Icon-Search-MatchDisplay ' + ControlCSSPrefix + 'Icon-Search-MatchHide');
			
				// Check to see if the 'iconographyengineclass' data attribute matches the string
				var iconNameUpper = $(this).data('iconographyengineclass').toUpperCase();
				var searchStringUpper = searchString.toUpperCase();
				
				// Now lets see if the search string for the filter is found.
			    // If it is NOT found, then we will hide the HTML Object
			    if (iconNameUpper.indexOf(searchStringUpper) > -1) {
			        $(this).addClass(ControlCSSPrefix + 'Icon-Search-MatchDisplay');
			    }
			    else {
			    	$(this).addClass(ControlCSSPrefix + 'Icon-Search-MatchHide');
			    }
			
			});
			
			// Now we must check to see if the category has any matched icons before we move onto the next
			var iconCategorySearchMatchCount = $(this).find('.' + ControlCSSPrefix + 'Icon-Search-MatchDisplay').size();
			console.log(iconCategorySearchMatchCount);
			if (iconCategorySearchMatchCount == 0) {
				$(this).addClass(ControlCSSPrefix + 'Icon-Category-Search-MatchHide');
			}
			else {
				$(this).removeClass(ControlCSSPrefix + 'Icon-Category-Search-MatchHide');
			}
			
			// Now we have to update the count
			$(this).find('.' + ControlCSSPrefix + 'Icon-Count').html(iconCategorySearchMatchCount);
		
		
		});
		
	
	});
	
};



function fuse_IconographyEngine_SearchClickEvents_ClearSearch(ControlCSSPrefix) {

// Remove all 'search' related css classnames and then update the category counts
				
			// Clear the input field
			$('.' + ControlCSSPrefix + 'Icon-Search-Input').val('');
			
			// Remove all 'search' css classnames from the individual icons.
			$('.' + ControlCSSPrefix + 'Icon-Item').each(function() {
			
				$(this).removeClass(ControlCSSPrefix + 'Icon-Search-MatchDisplay');
				$(this).removeClass(ControlCSSPrefix + 'Icon-Search-MatchHide');
				
			});
			
			// Remove all 'search' css classnames from the category containers.
			$('.' + ControlCSSPrefix + 'Icon-Category-Wrapper').each(function() {
				$(this).removeClass(ControlCSSPrefix + 'Icon-Category-Search-MatchHide');
			});
			
			// Reset the counts
			$('.' + ControlCSSPrefix + 'Icon-Category-Wrapper').each(function() {
				
				var iconCount = $(this).find('.' + ControlCSSPrefix + 'Icon-Item').size();
				$(this).find('.' + ControlCSSPrefix + 'Icon-Count').html(iconCount);
			
			});



}

/*************************************/
/* Section 1.3.1 - Category Grouped HTML JS - End*/
/*************************************/
/*************************************/
/* Section 1.3.1.1 - Category Grouped HTML Click Event(s) JS - Begin*/
/*************************************/

function fuse_IconographyEngine_categoryGroupModalClickEvents(ControlCSSPrefix) {

	// Since the Category Click event is created each time the control wizard is invoked, we will remove the click event before
	// re-invoking. This will ensure that multiple click events are not invoked.
	$('.' + ControlCSSPrefix + 'Icon-Category-Title').off('click');

	$('.' + ControlCSSPrefix + 'Icon-Category-Title').on('click', function(event){
	
		$(this).toggleClass(ControlCSSPrefix + 'Icon-Category-Title-Open').siblings('.' + ControlCSSPrefix + 'Icon-Category-Item-Wrapper').slideToggle();
	
	});
	
};


/*************************************/
/* Section 1.3.1.1 - Category Grouped HTML Click Event(s) JS - End*/
/*************************************/
/*************************************/
/* Section 1.4 - Wizard Trigger Creation for Form JS - Begin*/
/*************************************/

function fuse_IconographyEngine_createWizardTrigger(fuse_IconographyControlObj) {

	
	// Create the local variables for the ControlCSSPrefix and IconographyEngineMarkerLocation from the fuse_IconographyControlObj object passed in the argument list.
	var ControlCSSPrefix = fuse_IconographyControlObj.ControlCSSPrefix;
	var IconographyEngineMarkerLocation = fuse_IconographyControlObj.IconographyEngineMarkerLocation;

	// Create the IconographyEngine Control trigger and hide the corresponding Input Text field where the Font value will be stored.
	
	// Generate the HTML for the ICON Wizard Control
	var WizardHTML = '<div class="' + ControlCSSPrefix + 'Wizard-Master-Wrapper"><div class="' + ControlCSSPrefix + 'WizardDisplay-Wrapper"></div><div class="' + ControlCSSPrefix + 'WizardLaunchTrigger"></div></div>';
	
	// Insert the triggerHTML into the "iconographyEngineMarker" container
		$(IconographyEngineMarkerLocation).prepend(WizardHTML);
		
	// Create the HTML for the IconographyEngine Icon Display and add it to the fuse_IconographyControlObj object.
		fuse_IconographyEngine_generateModalHTML(fuse_IconographyControlObj);
			
	// Check if the input field already has an existing IconographyEngine Value
	// NOTE: This is used for editing existing items (edit form) where the value has already been selected
		fuse_IconographyEngine_editFormExistingValueCheck(ControlCSSPrefix);
	
	// Create the click event for the Wizard Launch Trigger
	$('.' + ControlCSSPrefix + 'WizardLaunchTrigger').on('click', function(event){
	
		fuse_IconographyEngine_createModalDialog(ControlCSSPrefix, fuse_IconographyControlObj);
	
	});
	
	// Now that we have finished creating the wizard, we can remove the "Loading" HTML from the DOM.
		fuse_IconographyEngine_removeLoadingHTML(fuse_IconographyControlObj);


}


/*************************************/
/* Section 1.4 - Wizard Trigger Creation for Form JS - End*/
/*************************************/
/*************************************/
/* Section 1.5 - Modal dialog instantiation JS - Begin*/
/*************************************/

function fuse_IconographyEngine_createModalDialog(ControlCSSPrefix, fuse_IconographyControlObj) {

		// Create the HTML to be included in the Modal
		//var modalHTML = fuse_IconographyEngine_generateModalHTML(ControlCSSPrefix);
		
		//var modalHTML = fuse_IconographyEngine_generateModalHTML(fuse_IconographyControlObj);
		var modalHTML = fuse_IconographyControlObj.IconographyEngineModalHTML;
						
		// Instantiate the Modal using jQueryUI
		$(modalHTML).dialog({
			modal: true,
			maxWidth:700,
			width:700,
			maxHeight:500,
			dialogClass: ControlCSSPrefix + 'WizardModal-Dialog-Wrapper'
		});
		
		// Enable the click event functinoality for the categories of IconographyEngine Icons.
		fuse_IconographyEngine_categoryGroupModalClickEvents(ControlCSSPrefix);
		
		// IN PROGRESS DEVELOPMENT
		fuse_IconographyEngine_SearchClickEvents(ControlCSSPrefix);
		
		// Enable the icon selection functionality and return the desired icon
		fuse_IconographyEngine_selectIcon(ControlCSSPrefix);

}

/*************************************/
/* Section 1.5 - Modal dialog instantiation JS - End*/
/*************************************/
/*************************************/
/* Section 1.5.1 - Select icon logic within Modal JS - Begin*/
/*************************************/

function fuse_IconographyEngine_selectIcon(ControlCSSPrefix) {

		// Create a variable for the clickable icons css class that was create in the 'generateModalHTML'
		var iconClassName = '.' + ControlCSSPrefix + 'Icon-Item';
		
		$(iconClassName).on('click', function(event){
	
			// Obtain the IconographyEngine Value needed to be saved.
				// NOTE: Only one of the options below are needed,
				//		 but both are being provided here for ease of choice
				
			// Hash Value
				//var iconographyEngineIconFontVal = $(this).data('iconographyenginehashval');
			
			// CSS Classname Value
				var iconographyEngineIconFontVal = $(this).data('iconographyengineclass');
			
			// Remove the modal wrapper HTML from the DOM
				$('#' + ControlCSSPrefix + 'WizardModal-Wrapper').remove();
				
			// Update the IconographyEngine Value input field with the clicked icon
			fuse_IconographyEngine_updateValue(ControlCSSPrefix, iconographyEngineIconFontVal);
			
			// Display the IconographyEngine Value on the form to Validate the users selection
			fuse_IconographyEngine_displaySelectedValue(ControlCSSPrefix, iconographyEngineIconFontVal);
				
		});


}





/*************************************/
/* Section 1.5.1 - Select icon logic within Modal JS - End*/
/*************************************/
/*************************************/
/* Section 1.6 - Update IconographyEngine value input field JS - Begin*/
/*************************************/

function fuse_IconographyEngine_updateValue(ControlCSSPrefix, iconographyEngineIconFontVal) {

	// Locate the input field and update it's value with the provided 'iconographyEngineIconFontVal'
	
	$('.' + ControlCSSPrefix + 'ValueInput-Item').val(iconographyEngineIconFontVal);


}




/*************************************/
/* Section 1.6 - Update IconographyEngine value input field JS - End*/
/*************************************/
/*************************************/
/* Section 1.7 - Display selected IconographyEngine icon on Form JS - Begin*/
/*************************************/

function fuse_IconographyEngine_displaySelectedValue(ControlCSSPrefix, iconographyEngineIconFontVal, iconographyEngineInputLocation) {

	// NOTE: Accepting an iconographyEngineInputLocation argument to be utilized and added later to allow a location to be passed. This will be useful for when 
	//		 we need to modify the "Edit Form" version of an existing IconographyEngine Value
	
	// Create the HTML that will be displayed.
		var displayHTML = '<div class="' + ControlCSSPrefix + 'WizardDisplay-Icon fa-' + iconographyEngineIconFontVal + '"></div>'
	
	// Use the 'iconographyEngineIconFontVal' to display the selected icon on the form.
	// This also replaces any existing content that is dispalyed.
		var $html = $('.' + ControlCSSPrefix + 'WizardDisplay-Wrapper').html(displayHTML);
		
	// Change the "Select" message to "Change"
		$('.' + ControlCSSPrefix + 'WizardLaunchTrigger').addClass(ControlCSSPrefix + 'WizardLaunchTrigger-IconSelected');
	


}



/*************************************/
/* Section 1.7 - Display selected IconographyEngine icon on Form JS - End*/
/*************************************/
/*************************************/
/* Section 1.8 - Pre-existing Value Check - Edit Form JS - Begin*/
/*************************************/


function fuse_IconographyEngine_editFormExistingValueCheck(ControlCSSPrefix) {


	// Check for an existing value in the IconographyEngine Input Field
		var iconographyEngineIconFontVal = $('.' + ControlCSSPrefix + 'ValueInput-Item').val();
		
		
		
		// There is a value. We check for 'undefined' and assume if there is a value, it is a valid IconographyEngine value.
		// NOTE: TODO - In a later revision, we should add a better validation check to ensure the value is in fact a true IconographyEngine Value.
		if (iconographyEngineIconFontVal.trim() != '') {
		
			fuse_IconographyEngine_displaySelectedValue(ControlCSSPrefix, iconographyEngineIconFontVal);
		
		}


}



/*************************************/
/* Section 1.8 - Pre-existing Value Check - Edit Form JS - End*/
/*************************************/
/*************************************/
/* Section 1.9.1 - Return Unique Values in an Array Method JS - Begin*/
/*************************************/

function fuse_IconographyEngine_getUniqueValsInArray(inputArray)
{
    var outputArray = [];
    
    for (var i = 0; i < inputArray.length; i++)
    {
        if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
        {
            outputArray.push(inputArray[i]);
        }
    }
   
    return outputArray;
}



/*************************************/
/* Section 1.9.1 - Return Unique Values in an Array Method JS - End*/
/*************************************/
/*************************************/
/* Section 1.9.2 - Calculate how many icons in each Category JS - Begin*/
/*************************************/

function fuse_IconographyEngine_calculateIconPerCategoryCount(modalHTML, ControlCSSPrefix) {
	
	// Create the jQuery Object of the modalHTML so that we can manipulate it's contents.
	var $modalHTML = $(modalHTML);
	
	$modalHTML.find('.' + ControlCSSPrefix + 'Icon-Category-Wrapper').each(function() {
		
		// Calculate the count of icons within the current category.
		var iconCount = $(this).find('.' + ControlCSSPrefix + 'Icon-Item').length;
		
		// Create the count of icons HTML
		var iconCountHTML = '<span class="' + ControlCSSPrefix + 'Icon-Count' + '">' + iconCount + '</span>';
		
		// Add the count of icons HTML to the Category
		$(this).find('.' + ControlCSSPrefix + 'Icon-Category-Title').append(iconCountHTML);
	
	
	});
	
	
	return($modalHTML);	
	




}




/*************************************/
/* Section 1.9.2 - Calculate how many icons in each Category JS - End*/
/*************************************/
/*************************************/
/* Section 1.9.3 - LoadScript - Dynamic JS Loading Function JS - Begin*/
/*************************************/

function fuse_IconographyEngine_loadScript(url, callback) {
 
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
/* Section 1.9.3 - LoadScript - Dynamic JS Loading Function JS - End*/
/*************************************/
/*************************************/
/* Section 1.9.4 - LoadCSS - Dynamic CSS Loading Function JS - Begin*/
/*************************************/

function fuse_IconographyEngine_loadCss(url) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = url;
    document.getElementsByTagName("head")[0].appendChild(css);
}



/*************************************/
/* Section 1.9.4 - LoadCSS - Dynamic CSS Loading Function JS - End*/
/*************************************/

