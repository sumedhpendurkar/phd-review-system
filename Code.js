var sheet_url = "https://docs.google.com/spreadsheets/d/1Xf3HsVXoxCE9MDgDdbIj1U8De2NpSEMVTQpN2hlTMGk/edit#gid=0";

function doGet(e){
  Logger.log(e);
  Logger.log(ScriptApp.getService().getUrl());
//  if (!e.parameter.page){
//    return HtmlService.createTemplateFromFile("login").evaluate();
//  }
//  else{
//    Logger.log(e.parameter['page']);
//    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate(); 
//  }
  
  return HtmlService.createTemplateFromFile('views/student_info').evaluate(); 
}


function getProfileInformation() {
  var userInfo = {};
  userInfo.email = Session.getActiveUser().getEmail();
  
//  var url = "https://docs.google.com/spreadsheets/d/1C5YZ2Lt903A-YGguYQH02JtL9vxs66sMydcD7BeZFJ4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(sheet_url);
  var ws = ss.getSheetByName("data");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][2] == userInfo.email) {
      
      userInfo.firstname = values[i][0];
      userInfo.lastname = values[i][1];
//      userInfo.reviewyear = values[i][3];
      userInfo.advisor = values[i][4];
      
      if(values[i][5]!=""){
        userInfo.first_sem_date = values[i][5].toISOString().slice(0,10);
      }
      
      if(values[i][6]!=""){
        userInfo.dplan_filed_date = values[i][6].toISOString().slice(0,10);
      }
      
      if (values[i][7]!=""){
        userInfo.qual_passed = values[i][7];
      }
//      else{
//        userInfo.qual_approved_sem = "Fall";
//      }
      if(values[i][8]!=""){
        userInfo.prelime_approved_date = values[i][8].toISOString().slice(0,10);
      }
      
      if(values[i][9]!=""){
        userInfo.proposal_approved_date = values[i][9].toISOString().slice(0,10);
      }
      
//      if(values[i][10]!=""){
//      userInfo.final_exam_approved_date = values[i][10].toISOString().slice(0,10);
//      }
//      
//      if(values[i][11]!=""){
//        userInfo.dissertation_approved_date = values[i][11].toISOString().slice(0,10);
//      }
      
      break;
    }
  }
  
  return userInfo;
}

function submitProfile(userInfo){
  var ss = SpreadsheetApp.openByUrl(sheet_url);
  var ws = ss.getSheetByName("data");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var userExists = false;
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][2] == userInfo.email) {
      userExists = true;
      if(userInfo.firstname!=values[i][0]){
        ws.getRange(i+1,0+1).setValue(userInfo.firstname);
      }
      if(userInfo.lastname!=values[i][1]){
        ws.getRange(i+1,1+1).setValue(userInfo.lastname);
      }
//      if(userInfo.reviewyear!=values[i][3]){
//        ws.getRange(i+1,3+1).setValue(userInfo.reviewyear);
//      }
      if(userInfo.advisor!=values[i][4]){
        ws.getRange(i+1,4+1).setValue(userInfo.advisor);
      }
      if(userInfo.first_sem_date!=values[i][5]){
        ws.getRange(i+1,5+1).setValue(userInfo.first_sem_date);
      }
      if(userInfo.dplan_filed_date!=values[i][6]){
        ws.getRange(i+1,6+1).setValue(userInfo.dplan_filed_date);
      }
      if(userInfo.qual_passed!=values[i][7]){
        ws.getRange(i+1,7+1).setValue(userInfo.qual_passed);
      }
      if(userInfo.prelime_approved_date!=values[i][8]){
        ws.getRange(i+1,8+1).setValue(userInfo.prelime_approved_date);
      }
      if(userInfo.proposal_approved_date!=values[i][9]){
        ws.getRange(i+1,9+1).setValue(userInfo.proposal_approved_date);
      }
//      if(userInfo.final_exam_approved_date!=values[i][10]){
//        ws.getRange(i+1,10+1).setValue(userInfo.final_exam_approved_date);
//      }
//      if(userInfo.dissertation_approved_date!=values[i][11]){
//        ws.getRange(i+1,11+1).setValue(userInfo.dissertation_approved_date);
//      }
      break;
    } 
  }
  
  if (!userExists){ 
    ws.appendRow([userInfo.firstname,userInfo.lastname,userInfo.email,
                  /*userInfo.year*/"",userInfo.advisor,userInfo.first_sem_date,
                  userInfo.dplan_filed_date, userInfo.qual_passed,
                  userInfo.prelime_approved_date,userInfo.proposal_approved_date
//                  userInfo.final_exam_approved_date,userInfo.dissertation_approved_date
                 ]);
  }
  
}


function folderExistsIn(parent_folder,folder_name){
  var folders = parent_folder.getFolders();     
  while (folders.hasNext()) {
    var folder = folders.next();
    if(folder_name == folder.getName()) {         
      return folder;
    }
  }
  return false;
}

function uploadFileToDrive(content, filename, email,file_type){
  try {
//    var email = userInfo.email;
    var dropbox = "phd_review_dev";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    
    if (!folderExistsIn(folder,email)){
      folder.createFolder(email);
    }
    
    var s_folder, s_folders = DriveApp.getFoldersByName(email);
    
    if (s_folders.hasNext()) {
      
      s_folder = s_folders.next();
      var c  = s_folder.getFiles();
      if (c.hasNext()){
        while (c.hasNext()){
          file = c.next();
          file_name = file.getName();
          if (file_name.indexOf(file_type[0])==0){
            file_id = file.getId();
            s_folder.removeFile(file);
          }
        }
        Logger.log("Previous similar type file deleted");
      } 
      
      var new_file_name = file_type+"_"+filename;
      var contentType = content.substring(5,content.indexOf(';')),
          bytes = Utilities.base64Decode(content.substr(content.indexOf('base64,')+7)),
          blob = Utilities.newBlob(bytes, contentType, new_file_name);
      
      s_folder.createFile(blob);
      var file_url;
      var files = s_folder.getFilesByName(new_file_name);
      while (files.hasNext()) { 
        var file = files.next();
        if(file.getName()==new_file_name){
            file_url = file.getUrl();
        }
      }
    }
    
    update_file_url(email,file_url);
    Logger.log("Uploading is done");
    
  } catch (f) {
    return f.toString();
  }
  
}

function update_file_url(email,file_url){
//  var url = "https://docs.google.com/spreadsheets/d/1C5YZ2Lt903A-YGguYQH02JtL9vxs66sMydcD7BeZFJ4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(sheet_url);
  var ws = ss.getSheetByName("data");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][2] == email) {
      ws.getRange(i+1,12+1).setValue(file_url);
    }
  }
  
  Logger.log("file url Updated")
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function getScriptUrl(){
  eval(UrlFetchApp.fetch('https://cdn.rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
  var uri = URI(ScriptApp.getService().getUrl());
  return uri.directory('/a/tamu.edu'+uri.directory());
}