var url_student_personal_details = "https://docs.google.com/spreadsheets/d/1vSpjuhHL4BpCgV7-mdMYtCIVd4VfQpKHw16218awcV8/edit#gid=0";
var url_student_review_details = "https://docs.google.com/spreadsheets/d/1Ndizu-BwuJ8-rexcruRsrPfot9mgVtP5RE1Qz6PDxFw/edit#gid=0";

function getAllStudentRecords() {
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()-3).getValues(); // note: explicitly excluding date columns (they cause error?)
  Logger.log(student_records);
  return student_records;
}

function getAllStudentsReviewData() {
  var ss = SpreadsheetApp.openByUrl(url_student_review_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  Logger.log(student_records);
  return student_records;
}

function getEmptyReviewData() {
  var student_records = [];
  for(var i = 0; i < 21; i++) {
    student_records.push("");
  }
  Logger.log("student_records: " + student_records);
  return student_records;
}



function handleSearchBtnClickedByUser(userInfo){
  
  var filteredData = getAllStudentRecords();
  
  
  if(userInfo.firstName != null){
    filteredData = ArrayLib.filterByText(filteredData, 2, userInfo.firstName);
  }

  if(userInfo.lastName != null){
    filteredData = ArrayLib.filterByText(filteredData, 3, userInfo.lastName);
  }
  
  if(userInfo.uin != null){
    filteredData = ArrayLib.filterByText(filteredData, 4, userInfo.uin);
  }
  
  return filteredData;
}

function getReviewInformationForUinAndYear(uin, reviewYear) {
  //uin = parseInt(uin);
  //reviewYear = parseInt(reviewYear);
  
  Logger.log("uin =" + uin + ", reviewYear =" + reviewYear +".");
  
  var filteredData = getAllStudentsReviewData();
  Logger.log("before filtering: " + filteredData);
  
  if(uin != null && uin != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 0, uin);
  }
  
  Logger.log("after first filtering: " + filteredData);
  
  if(reviewYear != null && reviewYear != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 1, reviewYear);
  }
  
  Logger.log("after second filtering: " + filteredData);
  
  if(filteredData != null && filteredData != undefined && filteredData.length > 0) {
    return filteredData[0];
  }
  Logger.log("getting empty review data now");
  
  emptyReviewData = getEmptyReviewData();
  Logger.log("emptyReviewdat = " + emptyReviewData);
  return emptyReviewData;
}

function updateStudentReviewDetails(studentReviewDetails) {
  var ss = SpreadsheetApp.openByUrl(url_student_review_details);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var dataExists = false;
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == studentReviewDetails.uin && values[i][1] == studentReviewDetails.reviewYear && values[i][2] == getUser()) {
      dataExists = true;
      Logger.log("data exists");
      
      ws.getRange(i + 1,3 + 1).setValue(studentReviewDetails.rating);
      ws.getRange(i + 1,8 + 1).setValue(studentReviewDetails.commentsForStudents);
      ws.getRange(i + 1,10 + 1).setValue(studentReviewDetails.needsToImproveGrade);
      ws.getRange(i + 1,11 + 1).setValue(studentReviewDetails.noStudentReportAvailable);
      ws.getRange(i + 1,12 + 1).setValue(studentReviewDetails.misconduct);
      ws.getRange(i + 1,13 + 1).setValue(studentReviewDetails.needsToPassQualiferExam);
      ws.getRange(i + 1,14 + 1).setValue(studentReviewDetails.needsToFindAdvisor);
      ws.getRange(i + 1,15 + 1).setValue(studentReviewDetails.needsToFileDegreePlan);
      ws.getRange(i + 1,16 + 1).setValue(studentReviewDetails.needsToDoPrelim);
      ws.getRange(i + 1,17 + 1).setValue(studentReviewDetails.needsToSubmitProposal);
      ws.getRange(i + 1,18 + 1).setValue(studentReviewDetails.needsToFinishSoon);
      
      break;  
    } 
  }
  
  if (!dataExists){ 
    Logger.log("adding new row");
    ws.appendRow([studentReviewDetails.uin, studentReviewDetails.reviewYear, getUser(), studentReviewDetails.rating, "", "", "", "",
                  studentReviewDetails.commentsForStudents, "", studentReviewDetails.needsToImproveGrade,
                  studentReviewDetails.noStudentReportAvailable, studentReviewDetails.misconduct, studentReviewDetails.needsToPassQualiferExam,
                  studentReviewDetails.needsToFindAdvisor, studentReviewDetails.needsToFileDegreePlan, studentReviewDetails.needsToDoPrelim,
                  studentReviewDetails.needsToSubmitProposal, studentReviewDetails.needsToFinishSoon
                 ]);
  }  
}

function getUser() {
  var user = Session.getActiveUser().getEmail();
  if(user == "walker@tamu.edu" || user == "karrie@tamu.edu") {
    return "admin";
  }
  return user;
}

function getStudentInfo(uin){
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_record = ArrayLib.filterByText(student_records, 4, uin);
  Logger.log(filtered_student_record)
  return filtered_student_record;
}








function getThatStudentInfo(uin){
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_record = ArrayLib.filterByText(student_records, 4, uin);
  
  return filtered_student_record;
}

function getStudentReviews(uin){
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet2");
  
  var student_reviews = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_reviews = ArrayLib.filterByText(student_reviews, 1, uin);
  
  return filtered_student_reviews;
}

function convertFilteredStudentReviewsDataToHTMLTable(filtered_student_reviews){
  var tableDataHtml = "";
  for(var i = 0; i < filtered_student_reviews.length; i++){
    tableDataHtml = tableDataHtml + "<tr>" + 
                                        "<td>" + filtered_student_reviews[i][3] + "</td>" + 
                                        "<td>" + filtered_student_reviews[i][2] + "</td>" + 
                                        "<td>" + filtered_student_reviews[i][6] + "</td>" + 
                                    "</tr>";
  }
  return tableDataHtml;
}