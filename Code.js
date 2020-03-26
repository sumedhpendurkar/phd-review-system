function doGet(e){
  
  Logger.log(e);
  Logger.log(ScriptApp.getService().getUrl());
  if (!e.parameter.page){
    return HtmlService.createTemplateFromFile("login").evaluate();
  }
  else{
    Logger.log(e.parameter['page']);
    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate(); 
  }
}


function submitClicked(userInfo){
  Logger.log("Submit was clicked");
  
  var url = "https://docs.google.com/spreadsheets/d/1C5YZ2Lt903A-YGguYQH02JtL9vxs66sMydcD7BeZFJ4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("data");

  
//  var parent_folder = DriveApp.getFolderById("1Jbdc1BcfbpAzEEAyPreDJ20gWfXPzHwB");
//  var folderName = getFolders(parent_folder,userInfo.email);
//  if (folderName === false){
//    var newFolder = parent_folder.createFolder(userInfo.email);
//    Logger.log(userInfo.filename);
//    if (userInfo.filename!=""){
//      uploadFileToDrive(userInfo.fileContent,userInfo.filename,userInfo.email);
//    }
//  }else{
//    
//  }
  
  ws.appendRow([userInfo.firstname,userInfo.lastname,userInfo.email,userInfo.reviewyear]);
  
}




function loginClicked(){
  Logger.log("Login was clicked");
}



function getFolders(parent_folder,folder_name){
  var folders = parent_folder.getFolders();     
  while (folders.hasNext()) {
    var folder = folders.next();
    if(folder_name == folder.getName()) {         
      return folder;
    }
  }
  return false;
}

function uploadFileToDrive(base64Data, fileName,folder_name) {
  Logger.log("insde uploade file to drive");
  try{
    var splitBase = base64Data.split(','),
        type = splitBase[0].split(';')[0].replace('data:','');

    var byteCharacters = Utilities.base64Decode(splitBase[1]);
    var ss = Utilities.newBlob(byteCharacters, type);
    ss.setName(fileName);

    var dropbox = folder_name; // Folder Name
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    var file = folder.createFile(ss);

    Logger.log(file.getName());
    return file.getName();
    
  }catch(e){
    return 'Error: ' + e.toString();
  }
}





function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function getScriptUrl(){
  eval(UrlFetchApp.fetch('https://cdn.rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
  var uri = URI(ScriptApp.getService().getUrl());
  return uri.directory('/a/tamu.edu'+uri.directory());
}