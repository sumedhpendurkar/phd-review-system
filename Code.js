var url = "https://docs.google.com/spreadsheets/d/1UWcbToPpGux2qT_u7YHJROfdH_jlSp4-apZGEs52w08/edit#gid=0";
var Route = {};
Route.path = function(param, callBack){
  Route[param] = callBack;
}

function doGet(e){
  //Logger.log(e);
  var userInfo = {};
  userInfo.email = Session.getActiveUser().getEmail();
  Logger.log(userInfo.email); //actions can be taken based on these
  var cls = userClickedLogin(userInfo);
  
  Route.path("student_login", loadStudentView);
  Route.path("faculty_login", loadFacultyView);
  Route.path("index", loadHome);
  
  Logger.log(e.parameters.v);
  if(Route[cls]){
    return Route[cls]();
  }else{
    //return HtmlService.createHtmlOutput("<h1>Page Not Found!</h1>");
    return loadHome();
  }
//  Logger.log(ScriptApp.getService().getUrl());
//  var student_records = getAllStudentRecords();
//  //if (!e.parameter.page){
//    var tmp = HtmlService.createTemplateFromFile("review_monitor");
//    tmp.records = student_records;
//    Logger.log("records -------" + student_records[0][1]);
//    return tmp.evaluate();
  /*}
  else{
    Logger.log(e.parameter['page']);
    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate(); 
  }*/
}

function userClickedLogin(userInfo){
  if(search("Student", userInfo.email)){
    return 'student_login';
  }
  else if(search("Faculty", userInfo.email)){
    return 'faculty_login';
  }
  else{
    return 'index';
  }
}

function search(sheetName, searchTerm){//usage: search('Student', 'a.kunder@tamu.edu') or search('Faculty', 'xyz@tamu.edu')
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName(sheetName);
  var data = ws.getRange(1, 1, ws.getLastRow(), 1).getValues();
  var nameList = data.map(function (r){return r[0];});
  
  var index = nameList.indexOf(searchTerm);
  Logger.log([ss, sheetName, searchTerm, index]);
  if(index>=0){
    return 1;
  }
  else{
    return 0;
  }
}

function render(file, argsObject){
  Logger.log(file, argsObject);
  var tmp = HtmlService.createTemplateFromFile(file);
  if(argsObject){
    var keys = Object.keys(argsObject);
    keys.forEach(function(key){
      tmp[key] = argsObject[key];
    });
  }//END IF
  return tmp.evaluate();
}

function loadStudentView() {
  return render("student_info");
}

function loadFacultyView() {
  
  return render("review_monitor");
}

function loadHome(){
  return render("index");
}

function submitProfile(userInfo){
  Logger.log("Submit was clicked");
  
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
