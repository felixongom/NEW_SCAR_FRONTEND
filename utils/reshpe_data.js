import _ from 'lodash'
import { subject_full_name } from './reportList'
import { isRegistered } from '.'

function transformStudentData(dataArray) {
  const knownSubjects = ['ICT', 'ENG', 'ENT', 'PHY', 'CHE', 'BIO', 'MTC', 'HIS', 'GEO', 'CRE', 'LIT', 'AGR', 'KIS', 'FA', 'PE'] // extend this list
  const nonSubjectFields = ['STD NO','STUDENT NAME', 'SEX', 'STREAM', 'INDEX', 'PAY CODE', 'TOTAL', 'AVG', 'MID AVG GRADE','MID COMM', 'COMM', 'PSN', 'NUM SUBJ', 'MID TOTAL(3)', 'MID TOTAL(20)','MID TOTAL(80)', 'MID TOTAL(100)','MID2 TOTAL(3)','MID AVG(3)','MID AVG(20)','AVG GRADE', 'PSN', 'PSN_IN_STREAM']
  
  return dataArray.map((student) => {
    // Only pick the non-subject fields that exist
    const baseFields = _.pick(student, nonSubjectFields)

    // Convert empty strings in baseFields to null
    const cleanedFields = _.mapValues(baseFields, v => v === '' ? null : v)

    const subjects = {}

    _.forEach(student, (value, key) => {
      if (nonSubjectFields.includes(key)) return

      const matchedSubject = knownSubjects.find(sub => key.toUpperCase().includes(sub))

      if (matchedSubject) {
        if (!subjects[matchedSubject]) {
          subjects[matchedSubject] = { subject: matchedSubject }
        }

        const field = key.replace(new RegExp(matchedSubject, 'i'), '').trim() || 'SCORE'
        subjects[matchedSubject][field] = value === '' ? null : value
      }
    })

    return {
      ...cleanedFields,
      subjects: _.values(subjects)
    }
  })
}

// Reshape school info
 function  convertSchoolInfoToObject(inputArray) {
  const result = {};
  if(!Array.isArray(inputArray)) return inputArray
  inputArray?.forEach(item => {
    if (item && Object.keys(item).length === 2 && 'ARTTRIBUTE' in item && 'VALUE' in item) {
      result[item.ARTTRIBUTE.trim()] = item.VALUE;
    }
  });
  return result;
}

// capitalize text in
function capitalize(str) {
  let _str = str?.trim()
  if (typeof _str !== 'string') return '';
  return _str.charAt(0).toUpperCase() + _str.slice(1).toLowerCase();
}
//
function getSubjectPerformanceByPrefix(dataArray, subjectPrefix) {
  return dataArray.map(student => {
    const result = {
      index: student.INDEX,
      name: student['STUDENT NAME'],
      stream: student.STREAM,
      gender: student.SEX,
    };

    // Add all keys that start with the subject prefix (case-insensitive)
    Object.keys(student).forEach(key => {
      if (key.toUpperCase().startsWith(subjectPrefix.toUpperCase())) {
        result[key] = student[key];
      }
    });

    return result;
  });
}

// Get data for each subject
function reportOneSubject(students, subj){
  subj = subj==='*'?'BIO':subj
  let one_subject = _.map(students, student=>{
    let filtered_attribute = {subject: subj}
    // 
    for (let subj_attribute in student){
      if(subj_attribute.startsWith(subj)){
        // remove subject namer
        let attr_name = subj_attribute.replace(subj+" ", '').trim()
        let attr_value = student[subj_attribute]
        filtered_attribute = {'STUDENT NAME':student['STUDENT NAME'],'STREAM':student['STREAM'], ...filtered_attribute, [attr_name]:attr_value}
      }
    }
    return filtered_attribute
  })
  return one_subject.filter(subj=>isRegistered(subj['AOI'], subj['EOA(80)']) )
}

//Count number of each grades in a subject
function countEachGrade(students,subj){
  students = reportOneSubject(students, subj)
  let grade_count = {subject:subj, A:0, B:0, C:0, D:0, E:0, MISS:0, TOTAL:0}
  // 
  students.forEach(student => {
    let  exist = isRegistered(student['AOI'], student['EOA(80)'])
    // 
    if(!exist && student['GRADE']==='A'){
      grade_count = {...grade_count, A:grade_count.A+1}
    }else if(!exist && student['GRADE']==='B'){
      grade_count = {...grade_count, B:grade_count.B+1}
    }else if(!exist && student['GRADE']==='C'){
      grade_count = {...grade_count, C:grade_count.C+1}
    }else if(!exist && student['GRADE']==='D'){
      grade_count = {...grade_count, D:grade_count.D+1}
    }else if(!exist && student['GRADE']==='E'){
      grade_count = {...grade_count, E:grade_count.E+1}
    }else if(!exist && student['TOTAL']==='-'){
      grade_count = {...grade_count, MISS:grade_count.MISS+1}
    }else if(exist && student['GRADE']==='A'){
      grade_count = {...grade_count, A:grade_count.A+1}
    }else if(exist && student['GRADE']==='B'){
      grade_count = {...grade_count, B:grade_count.B+1}
    }else if(exist && student['GRADE']==='C'){
      grade_count = {...grade_count, C:grade_count.C+1}
    }else if(exist && student['GRADE']==='D'){
      grade_count = {...grade_count, D:grade_count.D+1}
    }else if(exist && student['GRADE']==='E'){
      grade_count = {...grade_count, E:grade_count.E+1}
    }else if(exist &&  student['TOTAL']==='-'){
      grade_count = {...grade_count, MISS:grade_count.MISS+1}
    }
  });
  let TOTAL = (grade_count.A + grade_count.B + grade_count.C + grade_count.D + grade_count.E + grade_count.MISS )
  //befor returning , attach weight to each grade
   // 
    const PERCENTAGE = {
      Aper:(grade_count.A/TOTAL)*100,
      Bper:(grade_count.B/TOTAL)*100,
      Cper:(grade_count.C/TOTAL)*100,
      Dper:(grade_count.D/TOTAL)*100,
      Eper:(grade_count.E/TOTAL)*100,
      MISSper:(grade_count.MISS/TOTAL)*100,
    }
  // weight
  let WEIGHT = {
    AWeight:PERCENTAGE.Aper*6,
    BWeight:PERCENTAGE.Bper*5,
    CWeight:PERCENTAGE.Cper*4,
    DWeight:PERCENTAGE.Dper*3,
    EWeight:PERCENTAGE.Eper*2,
    MISSWeight:PERCENTAGE.MISSper*1
  } 
  //Total weight
  const TOTAL_WEIGHT =
    WEIGHT.AWeight + 
    WEIGHT.BWeight + 
    WEIGHT.CWeight + 
    WEIGHT.DWeight + 
    WEIGHT.EWeight +
    WEIGHT.MISSWeight
  // 
  const EXPECTED_WAIGHT = 100 * 6

  let data = {
    ...grade_count, 
    ...PERCENTAGE,
    ...WEIGHT,
    TOTAL,
    TOTAL_WAIGHT:TOTAL_WEIGHT,
    EXPECTED_WAIGHT,
    PROGRESS: (TOTAL_WEIGHT/EXPECTED_WAIGHT) *100
  }
  // 
  return {...data}
}
function countGradeOfAllSubjects(students){
  let list_of_grade = []
  let subject_abbr = Object.keys(subject_full_name)
  subject_abbr.forEach(abbr => {
    let grade_obj = countEachGrade(students, abbr)
    list_of_grade = [...list_of_grade, grade_obj]
  });
  return list_of_grade
}

// 
function getMySubjects(obj) {
  if(!obj) return []
  const result = [];
  for (const key in obj) {
    if (key.endsWith("AOI(20)")) {
      // Take the first word before the space
      const firstWord = key.split(" ")[0];
      result.push(firstWord);
    }
  }
  return ['*',...result];
}
// 
function filterSubjects(subjectMap, codeArray) {
  return codeArray.reduce((result, code) => {
    if (subjectMap[code]) {
      result[code] = subjectMap[code];
    }
    return result;
  }, {});
}

//pair id and marks in the a level

function pairMarksWithIds(data, marks_type='marks') {
  if(marks_type==='marks'){
    return _.flatMap(data, item => {
      return _.map(item.marks, (markValue, paperKey) => {
        const num = paperKey.split('_')[1]; // "1", "2", ...
        const idKey = `marks_${num}_id`;
        return { id: item.marks_id[idKey], mark: markValue };
      });
    });
  /*
    {
      marks:{paper_1: 45},
      marks_id:{marks_1_id: 79}
    }
    {
      marks:{aoi_1: null, aoi_2: 13}
      marks_id:{aoi_1_id: 81, aoi_2_id: 82
    }
  */
    
  }else{
    return _.flatMap(data, item => {
      return _.map(item.marks, (markValue, paperKey) => {
        const num = paperKey.split('_')[1]; // "1", "2", ...
        const idKey = `aoi_${num}_id`;
        let res = { id: item.marks_id[idKey], mark: markValue}
        return res;
      });
    });

  }
  
}

// reshape grade data to an oobject for sending to the server
function reshapeGradeTostring(sscar_code, is_subsidiary, grade_array){
  let result_object = {
    sscar_code,
    is_subsidiary:is_subsidiary==='Subsidiary'?true:false,
  }
  let grade_string =''
  // 
  for( let grade of grade_array){
    if(grade.lower_limit && grade.upper_limit && grade.grade){
      grade_string+=`${grade.lower_limit}-${grade.upper_limit}:${grade.grade} `
      result_object = {...result_object, grade:grade_string}
    }
  }

  return result_object
  
}

 export {
  capitalize,
  transformStudentData,
  convertSchoolInfoToObject,
  getSubjectPerformanceByPrefix,
  reportOneSubject,
  countEachGrade,
  countGradeOfAllSubjects,
  getMySubjects,
  filterSubjects,
  pairMarksWithIds,
  reshapeGradeTostring
}