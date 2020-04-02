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


function submitProfile(userInfo){
  Logger.log("Submit was clicked");
  
  var url = "https://docs.google.com/spreadsheets/d/1UWcbToPpGux2qT_u7YHJROfdH_jlSp4-apZGEs52w08/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("data");
  
  ws.appendRow([userInfo.firstname,userInfo.lastname,userInfo.email,userInfo.reviewyear]);
}

function uploadFileToDrive(content, filename, email){
  try {
    var dropbox = "phd_review_dev";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    var contentType = content.substring(5,content.indexOf(';')),
        bytes = Utilities.base64Decode(content.substr(content.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, filename);

    folder.createFolder(email).createFile(blob);

    Logger.log("done uploading file");

  } catch (f) {
    return f.toString();
  }
}


function loginClicked(){
  Logger.log("Login was clicked");
}

//
//function getFolders(parent_folder,folder_name){
//  var folders = parent_folder.getFolders();     
//  while (folders.hasNext()) {
//    var folder = folders.next();
//    if(folder_name == folder.getName()) {         
//      return folder;
//    }
//  }
//  return false;
//}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function getScriptUrl(){
  eval(UrlFetchApp.fetch('https://cdn.rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
  var uri = URI(ScriptApp.getService().getUrl());
  return uri.directory('/a/tamu.edu'+uri.directory());
}