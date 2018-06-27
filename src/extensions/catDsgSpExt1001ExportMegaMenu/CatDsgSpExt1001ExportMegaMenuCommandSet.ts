import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CatDsgSpExt1001ExportMegaMenuCommandSetStrings';

const LOG_SOURCE: string = 'CatDsgSpExt1001ExportMegaMenuCommandSet';
import pnp, { Web, Folder } from "sp-pnp-js";
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICatDsgSpExt1001ExportMegaMenuCommandSetProperties {
  // This is an example; replace with your own properties
  megaMenuListName: string;
  megaMenuJsonFileRelativeUri: string;
  megaMenuJsonFileName: string;
}
export interface ISharePointURL {
  Description: string;
  Url: string;
}
export interface IMegaMenuListItem {
  Title: string;
  FileLeafRef: string;
  FileSystemObjectType: boolean;
  ServerUrl: string;
  fuseMegaMenuSortOrder: number;
  fuseMegaMenuColumnLocation: number;
  fuseMegaMenuURL: ISharePointURL;
  fuseMegaMenuOpenNewWindow: boolean;
  fuseJSLinkColorPicker: string;
  fuseJSLinkIconography: string;
}

export interface IMegaMenu {
  Title: string;
  Sort: number;
  ColumnLocation: number;
  MenuURL: string;
  ServerURL: string;
  IsFolder: boolean;
  ItemLevel: number;
  Iconography: string;
  ColorPicker: string;
  OpenLinkInNewWindow: string;
}

export default class CatDsgSpExt1001ExportMegaMenuCommandSet
  extends BaseListViewCommandSet<ICatDsgSpExt1001ExportMegaMenuCommandSetProperties> {

  private commandVisibilityPromise: Promise<any> = null;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized CatDsgSpExt1001ExportMegaMenuCommandSet`);
    return this.commandVisibilityPromise = this.IsTargetMegaMenuList();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const exportMegaMenuCommand: Command = this.tryGetCommand('CATDSGSPCOMMAND_EXPORTMEGAMENU');
    if (exportMegaMenuCommand) {
      this.commandVisibilityPromise.then((isMegaMenuList: boolean) => {
        exportMegaMenuCommand.visible = isMegaMenuList;
      });
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'CATDSGSPCOMMAND_EXPORTMEGAMENU':
        this.exportMegaMenu().then((value:any) => {
          Dialog.alert(strings.CatDsgSpExt1001ExportMegaMenuSucceedMessage+':'+this.context.pageContext.site.serverRelativeUrl + this.properties.megaMenuJsonFileRelativeUri+'/'+this.properties.megaMenuJsonFileName);
        }, (error)=> {
          Dialog.alert(strings.CatDsgSpExt1001ExportMegaMenuFailedMessage+':'+this.context.pageContext.site.serverRelativeUrl + this.properties.megaMenuJsonFileRelativeUri+'/'+this.properties.megaMenuJsonFileName);
        });
        break;
      default:
        throw new Error(strings.CatDsgSpExt1001ExportMegaMenuUnknownCommand);
    }
  }
  
  protected exportMegaMenu(): Promise<any> {
    return new Promise<any>((resolve,reject)=>{
      this.getNestedMegaMenu().then((nestedMenu: any[]) => {
        let DesktopJSON = this.util_GenerateDesktopJSON(nestedMenu);
        let MobileJson = this.util_GenerateMobileJSON(nestedMenu);
        let outputJSON = {
          OutputDesktopJSON: DesktopJSON,
          OutputMobileJSON: MobileJson
        };
        return outputJSON;
      }).then((outputJSON) => {
        let web = new Web(this.context.pageContext.site.absoluteUrl);
        
        web.getFolderByServerRelativePath(this.context.pageContext.site.serverRelativeUrl + this.properties.megaMenuJsonFileRelativeUri).files.add(this.properties.megaMenuJsonFileName, JSON.stringify(outputJSON)).then((result) => {
          resolve(true);
        }, (error) => {
           reject(error);
        });
      }, (error) => {
        reject(strings.CatDsgSpExt1001ExportMegaMenuFailedMessage);
      });
    });
  }

  protected getNestedMegaMenu(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.getMegaMenu().then((megaMenus: IMegaMenu[]) => {
        if (megaMenus.length > 0) {
          megaMenus = megaMenus.sort((menu1, menu2) => menu1.ItemLevel.toString().localeCompare(menu2.ItemLevel.toString()));
          let nestedMegaMenus = this.util_CreateNestedJSON_ParsePathSignature(megaMenus, 'ServerURL', 'children');
          nestedMegaMenus = nestedMegaMenus.sort((a, b) => a.Sort.toString().localeCompare(b.Sort.toString()));
          nestedMegaMenus.forEach(firstLevelMegaMenu => {
            firstLevelMegaMenu.children.sort((secondLevelMegaMenuA, secondLevelMegaMenuB) => {
              return parseFloat(secondLevelMegaMenuA.Sort) - parseFloat(secondLevelMegaMenuB.Sort);
            });
          });
          nestedMegaMenus.forEach(firstLevelMegaMenu => {
            firstLevelMegaMenu.children.forEach(secondLevelMegaMenu => {
              secondLevelMegaMenu.Children = secondLevelMegaMenu.children.sort((thirdLevelMegaMenuA, thirdLevelMegaMenuB) => {
                return parseFloat(thirdLevelMegaMenuA.Sort) - parseFloat(thirdLevelMegaMenuB.Sort);
              });
            });
          });
          resolve(nestedMegaMenus);
        }
        else {
          resolve([]);
        }
      }, (error) => {
        reject(error);
      });

    });
  }

  protected getMegaMenu(): Promise<IMegaMenu[]> {
    return new Promise<IMegaMenu[]>((resolve, reject) => {
      // Need to be replace with  for production purpose
      let web = new Web('https://catsysdemo.sharepoint.com/sites/fusedemonorthstarprime');
      if (this.properties.megaMenuListName != null && this.properties.megaMenuListName != '') {
        let list = web.lists.getByTitle(this.properties.megaMenuListName);
        let filterStrings = "ID eq 1 or ID gt 1";
        let orderbyFieldName = 'fuseMegaMenuSortOrder';
        let isAscOrder = true;
        list.items.select('FileLeafRef', 'ServerUrl', 'FileSystemObjectType', 'fuseJSLinkColorPicker', 'fuseJSLinkIconography', 'fuseMegaMenuOpenNewWindow', 'fuseMegaMenuURL', 'fuseMegaMenuColumnLocation', 'Title', 'fuseMegaMenuSortOrder').filter(filterStrings).orderBy(orderbyFieldName, isAscOrder).get().then((items: IMegaMenuListItem[]) => {
          if (items.length > 0) {
            let megaMenus = items.map((menu: IMegaMenuListItem) => {
              let megaMenu: IMegaMenu = {
                Title: menu.Title,
                Sort: menu.fuseMegaMenuSortOrder,
                ColumnLocation: menu.fuseMegaMenuColumnLocation,
                MenuURL: menu.fuseMegaMenuURL == null ? '' : menu.fuseMegaMenuURL.Url,
                ServerURL: menu.ServerUrl,
                IsFolder: menu.FileSystemObjectType,
                ItemLevel: menu.ServerUrl.split("/").length - 1,
                Iconography: menu.fuseJSLinkIconography,
                ColorPicker: menu.fuseJSLinkColorPicker,
                OpenLinkInNewWindow: menu.fuseMegaMenuOpenNewWindow == null ? '_self' : (menu.fuseMegaMenuOpenNewWindow ? '_blank' : '_self')
              };
              return megaMenu;
            });
            resolve(megaMenus);
          }
          else {
            resolve([]);
          }
        }, (error) => {
          reject(error);
        });
      }
      else {
        reject(strings.CatDsgSpExt1001ExportMegaMenuListNameRequired);
      }
    });

  }

  protected IsTargetMegaMenuList(): Promise<any> {
    return pnp.sp.web.getList(this.context.pageContext.list.serverRelativeUrl).get().then(list => {
      if (list) {
        let targetMegaMenuListName = this.properties.megaMenuListName === null ? '' : this.properties.megaMenuListName.toLocaleLowerCase();
        if ((list.Title.toString() as String).toLocaleLowerCase() === targetMegaMenuListName) {
          return true;
        }
      }
      return false;
    }, (error) => {
      return false;
    });
  }

  //#region Private methods
  private util_CreateNestedJSON_ParsePathSignature(menus: IMegaMenu[], pathObjPropertyName: string, childArrayPropertyName: string): any[] {
    var json = [];
    for (var i = 0; i < menus.length; i++) {
      var objArrayItem = menus[i];
      this.util_CreateNestedJSON_ParsePathSignature_AddItem(objArrayItem, json, pathObjPropertyName, childArrayPropertyName);
    }
    return json;
  }
  private util_CreateNestedJSON_ParsePathSignature_AddItem(currentItem, jsonOutput, pathObjPropertyName, childArrayPropertyName): any[] {
    for (var i = 0; i < jsonOutput.length; i++) {
      var jsonArrayItem = jsonOutput[i];
      // Here we are checking to see if the 'pathObjPropertyName', which is the URL path or file directory path
      // of the current item, to see if it includes the current jsonArrayItem Level 'pathObjPropertyName'.
      // Essentially, this checks to see if the currentItem, belongs inside the current jsonArrayItem as a child
      if (currentItem[pathObjPropertyName].indexOf(jsonArrayItem[pathObjPropertyName]) == 0) {
        this.util_CreateNestedJSON_ParsePathSignature_AddItem(currentItem, jsonArrayItem[childArrayPropertyName], pathObjPropertyName, childArrayPropertyName);
        // Item was added to the current jsonArrayItem level as a child, so we can exit the function.
        return;
      }
    }
    // Item currentItem was not added to the jsonArrayItem as a Child, so we will add it to the current level of the jsonOutput as a sibling.
    currentItem[childArrayPropertyName] = [];
    jsonOutput.push(
      currentItem
    );
  }
  private util_GenerateDesktopJSON(nestedMegaMenus): any {
    // Copy the 'NestedItemsJSON' object into a new object for the column based desktop JSON
    let OutputDesktopJSON = JSON.parse(JSON.stringify(nestedMegaMenus));
    // Generate the columns
    OutputDesktopJSON.forEach((firstLevel) => {
      // Create a columns array on the TopLevel
      firstLevel.columns = [];
      // This generates the column objects for us, BUT this is not dynamic.
      // Create a QuickLaunchBar array
      firstLevel.quicklaunchbar = [];
      // Cycle through each Second Level child item and based on it's column designation, add it to the columns array
      firstLevel.children.forEach((secondLevel) => {
        var secondLevelColumnLocation = secondLevel.ColumnLocation;
        // First check to see if the child is a 'QuickLaunchBar' item. If so, we can add it to  th 'quicklaunch' arrya
        // and move onto the next child.
        if (secondLevel.IsQuickLaunchBar == true) {
          firstLevel.quicklaunchbar.push(secondLevel);
          return;
        }
        // Check to see if there are already any existing column array items. This simply means that a SecondLevel MenuGroup has been added
        // to a column array item.
        if (firstLevel.columns.length > 0) {
          // Set a flag for if the columnLocation was found.
          // If an existing column matches the column of the current child,
          // we will set this flag to 'true'. If not, it will remain false and we will
          // add the column to the parent.
          var columnFound = false;
          // Because column array items exist for the current TopLevel item, we want to cycle through
          // them and see if any of them are a column match for the current SecondLevel MenuGroup.
          firstLevel.columns.forEach((column, index) => {
            // Check to see if the current column array item is a match to the current SecondLevel Menu Group column
            if (index == secondLevelColumnLocation) {
              // An existing column has been found that matches the column for this SecondLevel Menu Group, so add
              // the child group to the column array and set the 'columnFound' flag to true and exit the firstLevel.columns .each function
              columnFound = true;
              column.children.push(secondLevel);
              return;
            }
          });
          // After the looping through all the columns, if a match has still not been found for the current SecondLevel Menu Group,
          // then we want to add it to the column array item for the column and add the SecondLevel Menu Group to that new column array item.
          if (columnFound == false) {
            firstLevel.columns.push({ children: [secondLevel], 'column': secondLevelColumnLocation });
          }
        } // End of '(firstLevel.columns.length > 0)'
        // else should only happen once, for the first column being added to the .columns array on the TopLevel.
        else {
          // No columns currently exist, so create the first column
          //console.log('first added and should only fire once:');
          //console.log(this);
          firstLevel.columns.push({ children: [secondLevel], 'column': secondLevelColumnLocation });
        }
      });
      // Now that all the columns have been added and/or populated with the SecondLevel Menu Group's, we want to sort
      // the .columns array to be in the correct order, so that the HTML creation can assume that each array item is a column.
      if (firstLevel.columns.length > 0) {
        firstLevel.columns = firstLevel.columns.sort((a, b) => {
          return a.column.toString().localeCompare(b.column.toString());
        });
      }
      // Reset the .children array to be equal to the columns array and delete the columns array.
      // NOTE:	This is done to ensure that the JSON maintains uniformity in it's formatting of children
      //			infinitely for as many children as exists. It allows the parsing of the JSON to dynamically
      //			and recursively process all of the children no matter the depth or 'lineage' of the children.
      firstLevel.children = firstLevel.columns;
      delete firstLevel.columns;
    });
    return OutputDesktopJSON;
  }
  private util_GenerateMobileJSON(nestedMegaMenus): any {
    // The 'NestedItemsJSON' format is accurately formatted and sorted for use with a vertically flat mobile mega menu implementation.
    // We will simply copy it into a new object in case it must be modified later so the 'NestedItemsJSON' remain untouched.
    // Copy the 'NestedItemsJSON' object into a new object for the column based Mobile JSON
    let OutputMobileJSON = JSON.parse(JSON.stringify(nestedMegaMenus));
    return OutputMobileJSON;
  }

}
