# Test Cases

## Test Case 1
<ol>
    <li>Go to your deployment site collection site content page after you deploy this app</li>
    <li>Ensure that Libraries named 'Catapult Systems Customer'(url is:catdsgspcustomer)/'Catapult Systems'(url is:catdsgsp)/'MegaMenu'(url is :MegaMenu) are all exists</li>
    <li>Open Catapult Systems Customer library and you will see the jslinks files are exists as below paths</br>
        <ol>
           <li>/jsLinks/sitecolumns/catdsgspjslinkcolorpicker/catdsgsp-jslink-sitecolumn-colorpicker.js</li>
           <li>/jsLinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography.js</li>
           <li>/jsLinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography.css</li>
           <li>/jsLinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography-json.js</li>
        </ol>
    </li>
    <li>Go Back to Site content and open Mega menu list and make sure you are on modern UI not the classic one</li>
    <li>Ensure you will see the 'Publish MegaMenu JSON' command with upload icon is showed on command bar</br></li>
    <li>Click the new item link and ensure you can see the context menu items: 'CatDsgSp MegaMenu Navigation Link','CatDsgSp MegaMenu Level One Fold','CatDsgSp MegaMenu Level Two Folder'</li>
</ol>

## Test Case 2
<ol>
    <li>Go to mega menu list and make sure there have no items and the mega menu json file storage folder such as /catdsgspcustomer/data  was not exists</li>
    <li>Click 'Publish MegaMenu Json' command verify the alert message of there have no data in mega menu list will be displayed</li>
    <li>Go to catdsgspcustomer library and make sure the data folder was automatically created</li>
    <li>Go back to mega menu list and click new item link to Create 'CatDsgSp MegaMenu Navigation Link','CatDsgSp MegaMenu Level One Fold','CatDsgSp MegaMenu Level Two Folder' content type item one by one
    <li>Ensure each items can be successfully created</li>
    <li>Edit each created content type items and ensure they can be editable and saved correctly</li>
    <li>Go back to mega menu list and click 'Publish MegaMenu Json' command </li>
    <li>Verify the successfully export mega menu to specific path(such as catdsgspcustomer/data/catDsgSp-js-megamenu-json.js) message box will be showed</li>
    <li>Go to catdsgspcustomer library and based on json storage path such as catdsgspcustomer/data/catDsgSp-js-megamenu-json.js verify the file exists </li>
</ol>
