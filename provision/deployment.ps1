Param(
    [Parameter(Mandatory = $true)]
    [string]$siteURL,
    [Parameter(Mandatory = $true)]
    [string]$siteAdminUrl,
    [Parameter(Mandatory = $true)]
    [string]$scope,
    [switch]$SkipFeatureDeployment,
    [switch]$SkipProvision,
    [Parameter(Mandatory = $true)]
    [System.Management.Automation.PSCredential]$credential
)

Import-Module "..\..\Cat_DSG_SP_PowerShell\modules\Import-SharePointReferences\Import-SharePointReferences.psm1"
Import-SharePointReferences SharePointOnline

if(!$credential) {
    $credential=Get-Credential
}
Write-Host "Connecting to site collection..."
Connect-PnPOnline -Url $siteUrl -Credentials $credential

$appFile = "..\sharepoint\solution\cat-dsg-sp-ext-1001-mega-menu-provision.sppkg"
$appTitle = "Catapult Systems - Export Mega Menu"

Write-Host "Getting App to see if app already uploaded to catalog..."
$apps = Get-PnPApp -Scope $scope

$existApp = $apps | Where-Object {$_.Title -eq $appTitle} | Select-Object -First 1
if ($existApp) {
    Write-Host "Removing exist App..."
    Uninstall-PnPApp -Identity $existApp.Id -Scope $scope -ErrorAction Stop
    Start-Sleep -Seconds 200
}
if ($SkipFeatureDeployment -eq $true) {
    Write-Host "Uploading App to catalog..."
    $app = Add-PnPApp -Path $appFile -Scope $scope -Overwrite -SkipFeatureDeployment -Publish -ErrorAction Stop
    Write-Host "Installing App to Target Site..."
    Install-PnPApp -Identity $app.Id  -Scope $scope -Wait -ErrorAction Stop
}
else {
    Write-Host "Uploading App to catalog..."
    $app = Add-PnPApp -Path $appFile  -Scope $scope -Overwrite -ErrorAction Stop
    Publish-PnPApp -Identity  $app.Id -Scope $scope
    Start-Sleep -Seconds 200
    Write-Host "Installing App to Target Site..."
    Install-PnPApp -Identity $app.Id   -Scope $scope -Wait -ErrorAction Stop
}

if ($SkipProvision -eq $false) {
    $catDsgSpMegaMenuNavigationLinkContentTypeName='CatDsgSp MegaMenu Navigation Link'
    $catDsgSpMegaMenuLevelTwoFolderContentTypeName='CatDsgSp MegaMenu Level Two Folder'
    $megaMenuTitle='MegaMenu'
    
    Write-Host "Getting local asset files..."
    $assetsFolder=[System.IO.DirectoryInfo](Get-Item './assets');
    $assetFiles=(Get-ChildItem -Path "./assets" -Recurse -File);
    
    Write-Host "Uploading asset files to site collection..."
    foreach($file in $assetFiles) {
        $file=[System.IO.FileInfo]$file;
        $fileServerRelativeUrl= $file.Directory.FullName.ToString().Replace($assetsFolder.FullName,"").Replace('\','/');
        Write-Host "Uploading file $fileServerRelativeUrl ..."
        Add-PnPFile -Path $file.FullName -Folder $fileServerRelativeUrl -ErrorAction Stop
    }
    
    Write-Host "Connecting to SPO Service..."
    Connect-SPOService -url $siteAdminUrl -Credential $credential
    
    Write-Host "Setting Site Collection Add and Customize Pages as true..."
    Set-SPOsite $siteUrl -DenyAddAndCustomizePages 0 -ErrorAction Stop
    
    Write-Host "Setting JSlink for field 'catdsgspJSLinkColorPicker'..."
    Set-PnPField -Identity 'catdsgspJSLinkColorPicker' -Values @{JSLink="~siteCollection/catdsgsp/jsLinks/sitecolumns/catdsgspjslinkcolorpicker/catdsgsp-jslink-sitecolumn-colorpicker.js";} -UpdateExistingLists -ErrorAction Stop
    
    Write-Host "Setting JSlink for field 'catdsgspJSLinkIconography'..."
    Set-PnPField -Identity 'catdsgspJSLinkIconography' -Values @{JSLink="~siteCollection/catdsgsp/jsLinks/sitecolumns/catdsgspjslinkiconography/catdsgsp-jslink-sitecolumn-iconography.js";} -UpdateExistingLists -ErrorAction Stop
    
    write-host 'Resolving Mega Menu Customized Fields Display Name Issue...'
    $clientContext=Get-PnPContext
    $web=$clientContext.Web
    $lists=$web.lists
    $clientContext.Load($lists)
    $clientContext.ExecuteQuery()
    $megaMenuList=$lists | Where-Object {$_.Title.toLower() -eq $megaMenuTitle.toLower()} | Select-Object -First 1
    if($megaMenuList) {
        write-host "Removing Content Type $catDsgSpMegaMenuNavigationLinkContentTypeName from $megaMenuTitle ..."
        Remove-PnPContentTypeFromList -List $megaMenuTitle  -ContentType $catDsgSpMegaMenuNavigationLinkContentTypeName -ErrorAction stop
        write-host "Removing Content Type $catDsgSpMegaMenuLevelTwoFolderContentTypeName from $megaMenuTitle ..."
        Remove-PnPContentTypeFromList -List $megaMenuTitle  -ContentType $catDsgSpMegaMenuLevelTwoFolderContentTypeName -ErrorAction stop
    
        write-host "Addding Content Type $catDsgSpMegaMenuNavigationLinkContentTypeName to $megaMenuTitle..."
        Add-PnPContentTypeToList -List $megaMenuTitle -ContentType $catDsgSpMegaMenuNavigationLinkContentTypeName -ErrorAction stop
        write-host "Addding Content Type $catDsgSpMegaMenuLevelTwoFolderContentTypeName to $megaMenuTitle..."
        Add-PnPContentTypeToList -List $megaMenuTitle -ContentType $catDsgSpMegaMenuLevelTwoFolderContentTypeName -ErrorAction stop
    }
    else {
        Write-Host "Failed to find the mega menu list named $megaMenuTitle"
    }   
} else {
    Write-Host "Skipped Provision as you set SkipProvision as true"
}
