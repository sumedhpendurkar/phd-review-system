var account_sheet_url = "https://docs.google.com/spreadsheets/d/1UWcbToPpGux2qT_u7YHJROfdH_jlSp4-apZGEs52w08/edit#gid=0";

var student_info_sheet_url = "https://docs.google.com/spreadsheets/d/1vSpjuhHL4BpCgV7-mdMYtCIVd4VfQpKHw16218awcV8/edit#gid=0";
var faculty_data_sheet_url = "https://docs.google.com/spreadsheets/d/1QzU70E5pUVw7QQ7Lmqgzth4Mg7a79AB-aaGxqd_NkJI/edit#gid=0";
var student_review_sheet_url = "https://docs.google.com/spreadsheets/d/1Ndizu-BwuJ8-rexcruRsrPfot9mgVtP5RE1Qz6PDxFw/edit#gid=0";
var url_review_year_information = "https://docs.google.com/spreadsheets/d/18EJyEDD-NufR0dtzzoXbA9mtvIQC-jr0zxF13IkWqIc/edit#gid=0";


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
  Route.path("admin_view", loadAdminView);
  Route.path("student_review", loadStudentReview);
  Route.path("student_details", loadStudentDetails);
  Route.path("add_review", loadAddReview);
  Route.path("profile", loadProfile);
  Route.path("index", loadHome);
  Route.path("see_reviews", loadAllStudentReviews);
  
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
//    var tmp = HtmlService.createTemplateFromFile("student_search");
//    tmp.records = student_records;
//    Logger.log("records -------" + student_records[0][1]);
//    return tmp.evaluate();
  /*}
  else{
//    Logger.log(e.parameter['page']);
    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate(); 
  }*/
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

function isAdmin(){
  Logger.log(getCredential());
  return "admin" == getCredential();
}

function isFaculty(){
  return "faculty" == getCredential();
}

function isStudent(){
  return "student" == getCredential();
}

function getCredential(){
  var userInfo = {};
  userInfo.email = Session.getActiveUser().getEmail();
  var view = userClickedLogin(userInfo);
  if(view =='student_view'){
    return 'student';
  }
  else if(view =='faculty_view'){
    return 'faculty';
  }
  else if(view =='admin_view'){
    return 'admin';
  }
  else{
    return 'basic';
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
  //Logger.log("in render:" + tmp["review_years"]);
  return tmp.evaluate();
}

function loadProfile(){
  return render("profile");
}

function loadStudentReview(){
  return render("student_review");
}

function loadStudentDetails(e){
  /*
  var uin = e.parameters.uin;
  var args = {};
  args.record = getStudentInfo(uin)[0];
  return render("student_details", args);
  */

  var uin = e.parameters.uin;
  var filtered_student_record = getThatStudentInfo(uin);
  var tmp = HtmlService.createTemplateFromFile("student_details");
  tmp.record = filtered_student_record[0];
  return tmp.evaluate();
}

function loadAllStudentReviews(e){
  var uin = e.parameters.uin;
  var filtered_student_reviews = getStudentReviews(uin);
  var tableDataHtml = convertFilteredStudentReviewsDataToHTMLTable(filtered_student_reviews);
  var tmp = HtmlService.createTemplateFromFile("see_reviews");
  tmp.tableDataHtml = tableDataHtml;
  return tmp.evaluate();
}

function loadAddReview(e){
  var args = {};
  args.uinValue = e.parameters.uin;
  Logger.log("args are ----- " + args)
  return render("add_student_review", args);
}

function getAllReviewYears() {
  var review_year_records = getAllReviewYearInformation();
  Logger.log(review_year_records);
  var all_review_years = review_year_records.map(function(r){return r[0];});
  all_review_years.sort();
  all_review_years.reverse();
  Logger.log(all_review_years);
  return all_review_years;
}

function loadStudentView() {
  return render("student_info");
}

function loadFacultyView() {
  return render("student_search");
}

function loadAdminView() {
  var review_years = getAllReviewYears();
  var args = {};
  args.review_years = review_years;
  return render("admin", args);
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
  userInfo.degreeplanstatus = "";
  userInfo.prelime_date = "";
  userInfo.proposal_date = "";
  userInfo.defense_date = "";
  userInfo.cv_url = "";
  
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var values = ws.getDataRange().getValues();
  var headers = values[0];
  
  for (var i = 1; i < values.length; i++) {
    if (rowValue(values, i, "email") == userInfo.email) {
      
      Logger.log("Email"+userInfo.email);
      userInfo.firstname = rowValue(values, i, "first_name");
      userInfo.lastname = rowValue(values, i, "last_name");
      userInfo.UIN = rowValue(values, i, "uin");
      userInfo.startsem = rowValue(values, i, "start_semester");
      userInfo.qualstatus = rowValue(values, i, "qualifying_exam_pass_fail");
      userInfo.numattempts = rowValue(values, i, "number_of_qualifying_exam_attempts");
      userInfo.advisor = rowValue(values, i, "advisor");
      userInfo.coadvisor = rowValue(values, i, "co-advisor");
      userInfo.degreeplanstatus = rowValue(values, i, "degree_plan_submitted");
      
      if(rowValue(values, i, "prelim_date")!=""){
        userInfo.prelime_date = rowValue(values, i, "prelim_date").toISOString();
      }
      

      if(rowValue(values, i, "proposal_date")!="") {
        userInfo.proposal_date = rowValue(values, i, "proposal_date").toISOString();
      }
            
      if(rowValue(values, i, "final_defense_date")!=""){
        userInfo.defense_date = rowValue(values, i, "final_defense_date").toISOString();
      }
      
      userInfo.cv_url = rowValue(values, i, "cv_link");
      
      break;
    }
  
  Logger.log(userInfo)
  }
  Logger.log("Returning Userinfo");
  Logger.log(userInfo);
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
//      Drive.Permissions.insert(
//        {
//          'role': 'reader',
//          'type': 'user',
//          'value': email
//        },
//        fileId,
//        {
//          'sendNotificationEmails': 'false'
//        });
      
    }
    
    
    Logger.log("Uploading is done");
    
  } catch (f) {
    return f.toString();
  }
  
}


function uploadIp_R_ToDrive(content, filename,file_type,year){
  
  var email = Session.getActiveUser().getEmail();
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
    }
    
    if (!folderExistsIn(s_folder,year)){
      s_folder.createFolder(year);
    }
    
    var y_folder, y_folders = DriveApp.getFoldersByName(year);
    if (y_folders.hasNext()) {
      y_folder = y_folders.next();
      var c  = y_folder.getFiles();
      if (c.hasNext()){
        while (c.hasNext()){
          file = c.next();
          file_name = file.getName();
          if (file_name.indexOf(file_type[0])==0){
            file_id = file.getId();
            y_folder.removeFile(file);
          }
        }
//        while (c.hasNext()){
//          file = c.next();
//          file_name = file.getName();
//          if (file_name.indexOf(file_type[0])==0){
//            file.setName("p"+file_name);
//          }
//        }
        Logger.log("Previous similar type file deleted");
      }
      
      var new_file_name = file_type+"_"+filename;
      var contentType = content.substring(5,content.indexOf(';')),
          bytes = Utilities.base64Decode(content.substr(content.indexOf('base64,')+7)),
          blob = Utilities.newBlob(bytes, contentType, new_file_name);
          
      fl = y_folder.createFile(blob);
      var file_url = fl.getUrl();
      update_review_files_url(email,file_url,file_type,year);
      
      fileId = fl.getId();
//      Drive.Permissions.insert(
//        {
//          'role': 'reader',
//          'type': 'user',
//          'value': email
//        },
//        fileId,
//        {
//          'sendNotificationEmails': 'false'
//        });
 
    }
  }
  catch (f){
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

function update_review_files_url(email,file_url,file_type,year){
//  var url = "https://docs.google.com/spreadsheets/d/1C5YZ2Lt903A-YGguYQH02JtL9vxs66sMydcD7BeZFJ4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var uin = "";
  for (var i = 0; i < values.length; i++) {
    if (values[i][5] == email) {
      uin = values[i][4];
    }
  }
  
  var rs = SpreadsheetApp.openByUrl(url_review_year_information);
  var ww = rs.getSheetByName("Sheet2");
  var rdataRange = ww.getDataRange();
  var rvalues = rdataRange.getValues();
  var flag = false;
  
  for (var i = 0; i < rvalues.length; i++) {
    if (rvalues[i][0] == uin && rvalues[i][1] == year) {
      flag=true;
      if(file_type=="re"){
        ww.getRange(i+1,2+1).setValue(file_url);
      }
      else{
        ww.getRange(i+1,3+1).setValue(file_url);
      }
    }
  }
  
  if(!flag){
    if(file_type=="re"){
      ww.appendRow([uin,year,file_url
                 ]);
    }
    else{
      ww.appendRow([uin,year,"",file_url
                 ]);
    }
  }
  
  
  Logger.log("file url Updated")
}

function check_uin(){
  
  var email = Session.getActiveUser().getEmail();
  var urls ={};
  urls.report="";
  urls.improvement = "";
  
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var uin = "";
  for (var i = 0; i < values.length; i++) {
    if (values[i][5] == email) {
      uin = values[i][4];
    }
  }
  return uin;
}

function get_urls(uin, year){
  
//  var email = Session.getActiveUser().getEmail();
  
//  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
//  var ws = ss.getSheetByName("Sheet1");
//  var dataRange = ws.getDataRange();
//  var values = dataRange.getValues();
//  var uin = "";
//  for (var i = 0; i < values.length; i++) {
//    if (values[i][5] == email) {
//      uin = values[i][4];
//    }
//  }
  
  var urls ={};
  urls.report="";
  urls.improvement = "";
  urls.dl = "";

  var rs = SpreadsheetApp.openByUrl(url_review_year_information);
  var ww = rs.getSheetByName("Sheet2");
  var rdataRange = ww.getDataRange();
  var rvalues = rdataRange.getValues();
  
  for (var i = 0; i < rvalues.length; i++) {
    if (rvalues[i][0] == uin && rvalues[i][1] == year) {
      if(rvalues[i][2]!=""){
        urls.report = rvalues[i][2];
      }
      if(rvalues[i][3]!=""){
        urls.improvement = rvalues[i][3];
      }
      if(rvalues[i][4]!=""){
        urls.dl = rvalues[i][4];
      }
    }
  }
  
  return urls;

}

function getReviewDetails(year){
  
  var email = Session.getActiveUser().getEmail();
  var comments = "";
  
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var uin = "";
  for (var i = 0; i < values.length; i++) {
    if (values[i][5] == email) {
      uin = values[i][4];
    }
  }
  
  var rs = SpreadsheetApp.openByUrl(student_review_sheet_url);
  var ww = rs.getSheetByName("Sheet1");
  var rdataRange = ww.getDataRange();
  var rvalues = rdataRange.getValues();
  
  for (var i = 0; i < rvalues.length; i++) {
    if (rvalues[i][0] == uin && rvalues[i][1] == year && rvalues[i][2]!="admin") {
      
//        comments += " Reviewer Name: "+ rvalues[i][2]+"\t\t\t\t";
      comments += rvalues[i][8]+"\n";
      
    }  
  }
  
  return comments;
  
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

function getMyScriptUrl(){
  var urlString = ScriptApp.getService().getUrl();
  var newUrlString = urlString.substring(0, 25) + "/a/tamu.edu" + urlString.substring(25);
  return newUrlString;
}