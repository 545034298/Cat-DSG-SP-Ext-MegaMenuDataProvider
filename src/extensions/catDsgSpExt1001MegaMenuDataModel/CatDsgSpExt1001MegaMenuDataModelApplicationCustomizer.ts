import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CatDsgSpExt1001MegaMenuDataModelApplicationCustomizerStrings';

const LOG_SOURCE: string = 'CatDsgSpExt1001MegaMenuDataModelApplicationCustomizer';
import pnp, { Web } from "sp-pnp-js";
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICatDsgSpExt1001MegaMenuDataModelApplicationCustomizerProperties {
  // This is an example; replace with your own property
  megaMenuListName: string;
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

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CatDsgSpExt1001MegaMenuDataModelApplicationCustomizer
  extends BaseApplicationCustomizer<ICatDsgSpExt1001MegaMenuDataModelApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    
    return this.exportMegaMenu();
  }


  protected exportMegaMenu():Promise<void> {
    this.getNestedMegaMenu().then((nestedMenu: any[]) => {
      document.write(JSON.stringify(nestedMenu));
      // To be implemented the export logic
    }, (error) => {
      Dialog.alert(error);
    });
    return Promise.resolve<void>();
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
                MenuURL: menu.fuseMegaMenuURL == null ? null : menu.fuseMegaMenuURL.Url,
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
        reject("The mega menu list name should not be null or empty");
      }
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
}
