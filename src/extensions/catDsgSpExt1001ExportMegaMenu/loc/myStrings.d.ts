declare interface ICatDsgSpExt1001ExportMegaMenuCommandSetStrings {
  CatDsgSpExt1001ExportMegaMenuSucceedMessage: string;
  CatDsgSpExt1001ExportMegaMenuFailedMessage: string;
  CatDsgSpExt1001ExportMegaMenuUnknownCommand:string;
  CatDsgSpExt1001ExportMegaMenuListNameRequired:string;
  CatDsgSpExt1001ExportMegaMenuFailedToCreateStorageFolder:string;
  CatDsgSpExt1001ExportMegaMenuFailedToUpload:string;
  CatDsgSpExt1001ExportMegaMenuFailedToRetrieveDataFromList:string
}

declare module 'CatDsgSpExt1001ExportMegaMenuCommandSetStrings' {
  const strings: ICatDsgSpExt1001ExportMegaMenuCommandSetStrings;
  export = strings;
}
