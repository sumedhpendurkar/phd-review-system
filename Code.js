var account_sheet_url = "https://docs.google.com/spreadsheets/d/1UWcbToPpGux2qT_u7YHJROfdH_jlSp4-apZGEs52w08/edit#gid=0";

var student_info_sheet_url = "https://docs.google.com/spreadsheets/d/1vSpjuhHL4BpCgV7-mdMYtCIVd4VfQpKHw16218awcV8/edit#gid=0";
var faculty_data_sheet_url = "https://docs.google.com/spreadsheets/d/1QzU70E5pUVw7QQ7Lmqgzth4Mg7a79AB-aaGxqd_NkJI/edit#gid=0";

var userEmail = '';

var Route = {};
Route.path = function(param, callBack){
  Route[param] = callBack;
}


function doGet(e){
  //Logger.log(e);
  var userInfo = {};
  userInfo.email = Session.getActiveUser().getEmail();
  Logger.log(userInfo.email); //actions can be taken based on these
  userEmail = userInfo.email;
  var cls = null;
  if(e.parameters.v){
    cls = e.parameters.v; 
  }
  else {
    cls = userClickedLogin(userInfo); 
  }
  
  Route.path("student_view", loadStudentView);
  Route.path("faculty_view", loadFacultyView);
  Route.path("student_review", loadStudentReview);
  Route.path("student_details", loadStudentDetails);
  Route.path("add_review", loadAddReview);
  Route.path("profile", loadProfile);
  Route.path("index", loadHome);
  
  Logger.log(e.parameters.v);
  if(Route[cls]){
    return Route[cls](e);
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
//    Logger.log(e.parameter['page']);
    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate(); 
  }*/
}

function getCredential(){
  var userInfo = {};
  userInfo.email = userEmail;
  var view = userClickedLogin(userInfo);
  if(view=='student_vnew'){
    return 'student';
  }
  else if(view=='faculty_view'){
    return 'faculty';
  }
  else if(view=='admin_view'){
    return 'admin';
  }
  else{
    return 'basic';
  }
  
}

function userClickedLogin(userInfo){
  if(search("Student", userInfo.email)){
    return 'student_view';
  }
  else if(search("Faculty", userInfo.email)){
    return 'faculty_view';
  }
  else if(search("Admin", userInfo.email)){
    return 'admin_view';
  }
  else{
    return 'index';
  }
}

function search(sheetName, searchTerm){//usage: search('Student', 'a.kunder@tamu.edu') or search('Faculty', 'xyz@tamu.edu')
  var ss = SpreadsheetApp.openByUrl(account_sheet_url);
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

function loadProfile(){
  return render("profile");
}

function loadStudentReview(){
  return render("student_review");
}

function loadStudentDetails(e){
  var uin = e.parameters.uin;
  var args = {};
  args.record = getStudentInfo(uin)[0];
  return render("student_details", args);
}

function loadAddReview(e){
  var args = {};
  args.uinValue = e.parameters.uin;
  args.firstName = "Anna";
  args.lastName = "Shekhawat";
  return render("add_student_review", args);
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

function clickedLogout(html_text){
//  ScriptApp.invalidateAuth();
  Logger.log(html_text, getScriptUrl(), Session.getActiveUser().getEmail());
}

function rowValue(values, rowIdx, headerLabel) {
  return values[rowIdx][values[0].indexOf(headerLabel)];
}

function getProfileInformation() {
  
  var userInfo = {};
  
  userInfo.email = Session.getActiveUser().getEmail();
  userInfo.firstname = "";
  userInfo.lastname = "";
  userInfo.UIN = "";
  userInfo.startsem = "";
  userInfo.qualstatus = "";
  userInfo.numattempts = "";
  userInfo.advisor = "";
  userInfo.coadvisor = "";
  userInfo.degreeplanstauts = "";
  userInfo.prelime_date = "";
  userInfo.proposal_date = "";
  userInfo.defense_date = "";
  userInfo.cv_url = "";

  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var values = ws.getDataRange().getValues();
  var headers = values[0];
  Logger.log(rowValue(values, 1, "email"));
  
  for (var i = 1; i < values.length; i++) {
    if (rowValue(values, i, "email") == userInfo.email) {
      
      userInfo.firstname = rowValue(values, i, "first_name");
      userInfo.lastname = rowValue(values, i, "last_name");
      userInfo.UIN = rowValue(values, i, "uin");
      userInfo.startsem = rowValue(values, i, "start_semester");
      userInfo.qualstatus = rowValue(values, i, "qualifying_exam_pass_fail");
      userInfo.numattempts = rowValue(values, i, "number_of_qualifying_exam_attempts");
      userInfo.advisor = rowValue(values, i, "advisor");
      userInfo.coadvisor = rowValue(values, i, "co-advisor");
      userInfo.degreeplanstatus = rowValue(values, i, "degree_plan_submitted");
      
      if(values[i][10]!=""){
        userInfo.prelime_date = rowValue(values, i, "prelim_date").toLocaleDateString();
      }
      
      if(values[i][11]!=""){
        userInfo.proposal_date = rowValue(values, i, "proposal_date").toLocaleDateString();
      }
      
      if(values[i][12]!=""){
      userInfo.defense_date = rowValue(values, i, "final_defense_date").toLocaleDateString();
      }
      
      userInfo.cv_url = rowValue(values, i, "cv_link");
      
      break;
    }
  }
  return userInfo;
}
//////////////////////////////////////////////////////////////////////// Updating Student Informaiton //////////////////////////////////////////////////////

function setRowValue(ws, values, rowIdx, headerLabel, value) {
  var headers = values[0];
  ws.getRange(rowIdx+1, headers.indexOf(headerLabel)+1).setValue(value);
}

function submitProfile(userInfo){
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var values = ws.getDataRange().getValues();
  var userExists = false;
  
  var i = 1;
  while(i < values.length ) {
    if (rowValue(values, i, "email") == userInfo.email) {
      userExists = true;
      setRowValue(ws, values, i, "first_name", userInfo.firstname);
      setRowValue(ws, values, i, "last_name", userInfo.lastname);
      setRowValue(ws, values, i, "uin", userInfo.UIN);
      setRowValue(ws, values, i, "start_semester", userInfo.startsem);
      setRowValue(ws, values, i, "qualifying_exam_pass_fail", userInfo.qualstatus);
      setRowValue(ws, values, i, "number_of_qualifying_exam_attempts", userInfo.numattempts);
      setRowValue(ws, values, i, "advisor", userInfo.advisor);
      setRowValue(ws, values, i, "co-advisor", userInfo.coadvisor);
      setRowValue(ws, values, i, "degree_plan_submitted", userInfo.degreeplanstatus);
      setRowValue(ws, values, i, "prelim_date", userInfo.prelime_date);
      setRowValue(ws, values, i, "proposal_date", userInfo.proposal_date);
      setRowValue(ws, values, i, "final_defense_date", userInfo.defense_date);      
      break;  
    }
    
    i++;
  }
  
  if (!userExists){ 
    ws.appendRow([i, "", userInfo.firstname,userInfo.lastname,userInfo.UIN,userInfo.email,
                  userInfo.startsem,1, 1, userInfo.advisor, userInfo.coadvisor,
                  userInfo.degreeplanstatus,userInfo.qualstatus,userInfo.numattempts,
                  "",userInfo.prelime_date,userInfo.proposal_date, userInfo.defense_date
                 ]);
  }
  
}


/////////////////////////////////////////////////////////////////////// File Upload Code///////////////////////////////////////////////////////////////////

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
      
           
      fl = s_folder.createFile(blob);
      var file_url = fl.getUrl();
      update_file_url(email,file_url);
      
      fileId = fl.getId();
      Drive.Permissions.insert(
        {
          'role': 'reader',
          'type': 'user',
          'value': email
        },
        fileId,
        {
          'sendNotificationEmails': 'false'
        });
      
//      s_folder.createFile(blob);
//      var file_url;
//      var files = s_folder.getFilesByName(new_file_name);
//      while (files.hasNext()) { 
//        var file = files.next();
//        if(file.getName()==new_file_name){
//            file_url = file.getUrl();
//        }
//      }
    }
    
    
    Logger.log("Uploading is done");
    
  } catch (f) {
    return f.toString();
  }
  
}

function update_file_url(email,file_url){
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  
  for (var i = 1; i < values.length; i++) {
    if (rowValue(values, i, "email") == email) {
      setRowValue(ws, values, i, "cv_link", file_url);
    }
  }
  
  Logger.log("file url Updated")
}

//////////////////////////////////////

function get_advisor_list(){
  
  var ss = SpreadsheetApp.openByUrl(faculty_data_sheet_url);
  var ws = ss.getSheetByName("f_data");
  var list = ws.getRange(2,1, ws.getRange("A2").getDataRegion().getLastRow(),1).getValues();
  
  var advisorlist = list.map(function(r){return '<option value="'+r[0]+'">'+r[0]+'</option>';}).join('');
  Logger.log(advisorlist)
  
  return advisorlist;
}

////////////////////////////////////////////////////////// Other Stuff ///////////////////////////////////////////////////////////////////////////////

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function getScriptUrl(){
  eval(UrlFetchApp.fetch('https://cdn.rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
  var uri = URI(ScriptApp.getService().getUrl());
  return uri.directory('/a/tamu.edu'+uri.directory());
}