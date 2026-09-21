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
  pairMarksWithIds,
  reshapeGradeTostring
}