import _ from 'lodash'

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

 //
const getLearnerMarksIds = (learners, learnerIds, keys) => {
    let list_of_ids = _.filter(learners, (learner)=> learnerIds.includes(learner.learner_id))
        .flatMap(learner => [
            ..._.map(keys, key => learner.aoi_id?.[key]),
            ..._.map(keys, key => learner.marks_id?.[key]) 
        ])
    return _.filter(list_of_ids, ids=>ids!==undefined)
}; 

 export {
  capitalize,
  reshapeGradeTostring,
  getLearnerMarksIds
}