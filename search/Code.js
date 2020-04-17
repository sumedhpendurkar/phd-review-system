function doGet(e){
  Logger.log(e);
  Logger.log(ScriptApp.getService().getUrl());
  if (!e.parameter.page){
    return HtmlService.createTemplateFromFile("login").evaluate();
  }
  else if(e.parameter['page'] = "review_monitor"){
    var tmp = HtmlService.createTemplateFromFile("review_monitor");
    tmp.htmlTableHeader = "";
    tmp.htmlTableData = "";
    return tmp.evaluate();
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



// ---------------------------------------------------------------------------------------------------------

  // TODO: 1. Submodularize this function later 2. Change column numbers in the actual app 3. Put review year in search functionality 4. Uppercase Lowercase
  // Have to cross check getLastRow() and getLastColumn() for off by one
function handleSearchBtnClickedByUser(userInfo){
  var url = "https://docs.google.com/spreadsheets/d/11MLNK4B4mgnzxBpes4Xt8CWOKFiYf7eZDYMl2Cbl4eA/edit#gid=0";
  
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("StudentInformation");
  
  var studentInfoDataWithoutHeaders = ws.getRange(2, 1, ws.getRange("A1:A1").getDataRegion().getLastRow(),
  ws.getRange("A1:A1").getDataRegion().getLastColumn()).getValues();
  
  var filteredData = studentInfoDataWithoutHeaders;
  
  if(userInfo.firstName != null){
    filteredData = ArrayLib.filterByText(filteredData, 0, userInfo.firstName);
  }

  if(userInfo.lastName != null){
    filteredData = ArrayLib.filterByText(filteredData, 1, userInfo.lastName);
  }
  
  if(userInfo.uin != null){
    filteredData = ArrayLib.filterByText(filteredData, 2, userInfo.uin);
  }
  
  var wsTemp = ss.getSheetByName("TempTest");
  
  for(var i = 0; i < filteredData.length; i++) {
    wsTemp.appendRow(filteredData[i]);
  }
  
  var htmlTableHeader = "<tr><th>UIN</th><th>Name</th><th>Advisor</th><th> Review Rating </th><th> Start Semester </th><th> Qual Exam </th><th> Degree Plan Submitted?</th><th> Student Report </th><th> Improvement Plan </th><th> CV </th><th> Actions </th></tr>";
  
  var htmlTableData = mapFilteredDataListHtmlTableData(filteredData);
  
  var tmp = HtmlService.createTemplateFromFile("review_monitor");
  tmp.htmlTableHeader = htmlTableHeader;
  tmp.htmlTableData = htmlTableData;
}

function mapFilteredDataListHtmlTableData(filteredData){
  var htmlTableData = "";
  for(var i = 0; i < filteredData.length; i++){
    htmlTableData += "<tr>";
    htmlTableData += "<td>" + filteredData[i][2] + "</td>" 
                    + "<td>" + filteredData[i][1] + ", " + filteredData[i][0] + "</td>"
                    + "<td>X</td><td> 3 </td><td> Fall 2019 </td><td> Pass</td><td> No </td><td> <a href='#'> View </a> </td><td> NA </td><td> <a href='#'> View </a> </td><td> <a class='waves-effect waves-light modal-trigger btn' href='#view-student-info'> Details </a><a class='waves-effect waves-light modal-trigger btn' href='#upload-review'> Add Review </a> </td>";
    htmlTableData += "</tr>";
  }
  return htmlTableData;
}