import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CatDsgSpExt1001MegaMenuDataModelApplicationCustomizerStrings';

const LOG_SOURCE: string = 'CatDsgSpExt1001MegaMenuDataModelApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICatDsgSpExt1001MegaMenuDataModelApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CatDsgSpExt1001MegaMenuDataModelApplicationCustomizer
  extends BaseApplicationCustomizer<ICatDsgSpExt1001MegaMenuDataModelApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    return Promise.resolve();
  }
}
