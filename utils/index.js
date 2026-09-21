import axios from "axios";
import { base_api_path } from "./reportList";

const numbersArray =(n, from=0)=> Array.from({ length: n}, (_, i) => i + from + 1);
const generateNumbersFrom = (n, start) => Array.from({ length: n }, (_, i) => start + i);

// 

function chunkArray(arr, chunk_size, first_chunk_size = 30) {
  if (!Array.isArray(arr)) throw new Error('Input must be an array');
  if (typeof chunk_size !== 'number' || chunk_size <= 0) throw new Error('chunk_size must be a positive number');
  if (typeof first_chunk_size !== 'number' || first_chunk_size <= 0) throw new Error('first_chunk_size must be a positive number');

  if (arr.length === 0) return [];

  // Take the first chunk manually
  const firstChunk = _.take(arr, first_chunk_size);
  const remaining = _.drop(arr, first_chunk_size);

  // Use lodash.chunk for the rest
  const restChunks = _.chunk(remaining, chunk_size);

  return [firstChunk, ...restChunks];
}


const pickAndSetImage = (event, dispatch) => {
    const files = event.target.files;
    if (!files) return;
    const imageUrls = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            imageUrls.push(e.target.result);
            // Only update state when all files are read
            if (imageUrls.length === files.length) {                            
              dispatch({type:'LOGO', payload:imageUrls[0]});
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
//upload logo
const uploadLogo = async(event, dispatch, school_info, sscar_code, token) => {
    const file = event.target.files;
    if (!file) return;
    const fd = new FormData()
    fd.append('logo', file[0])
      // 
    const res = await axios.post(`${base_api_path}school/upload-logo/${sscar_code}`,fd,{
              headers:{'Authorization':`Bearer ${getToken('access_token')}`}
            })
    
    dispatch({type:'LOGO', payload:res.data?.logo})
    dispatch({ type: 'SCHOOL_INFO', payload:{
                  ... school_info, 
                  ['logo']:res.data?.logo //change school name to logged in school name
                }})
    
  };

//paginate array

const paginate = (arr, option)=>{
    let perpage = 12
    let page = 1

    if(!arr)return
    if(option && option?.perpage && option?.perpage!==0 ){
        perpage = option?.perpage
    }
    //
    if(option && option?.page && option?.page!==0 ){
        page = option?.page
    }

    let start = (page-1)*perpage
    let stop = (page*perpage)
    let result = arr.slice(start, stop)
    let has_next =  stop < arr.length
    let has_prev = ((page-1)*perpage) > 1
    let num_pages = Math.ceil(arr.length/perpage)
    let next_page = arr.length > stop?page+1:null 
    let prev_page = page-1<1?null:page-1
    let position = (page-1)*perpage + 1
    return {
        page,
        perpage,
        has_next,
        has_prev,
        data:result,
        next_page,
        prev_page,
        num_pages,
        position
    }


}

// round off numbers
function roundOff(value, decimals = 1) {
  const num = parseFloat(value);
  if (isNaN(num)) return value; // Return original value if not a number
  return num.toFixed(decimals);
}

// counting students in each stream
function countStudentsByStream(dataArray) {
  const grouped = _.groupBy(dataArray, student => student.STREAM?.toUpperCase() || 'UNKNOWN');
  const streamCounts = _.mapValues(grouped, group => group.length);
  return {
    total: dataArray.length,
    streams: streamCounts
  };
}
//generate range for the string
function generateGradingRanges(data) {
  const filtered = data.filter(item => typeof item.RANGE === 'number');
  const sorted = filtered.sort((a, b) => a.RANGE - b.RANGE);

  const result = sorted.map((item, index) => {
    const currentStart = Math.round(item.RANGE);
    const nextItem = sorted[index + 1];
    const currentEnd = nextItem
      ? Math.round(nextItem.RANGE - 0.6)
      : 100;

    return {
      ...item,
      RANGE_STRING: `${currentStart==0?currentStart:currentStart+1}-${currentEnd}`
    };
  });

  return result;
}

// assign color to rws
function rowColor(avg_mark){
  avg_mark = roundOff(avg_mark,2)
  if(avg_mark >= 0 && avg_mark < 50) return 'text-red-500';
  if(avg_mark>=80) return 'text-green-600'
}

// 
function getScore(score){
  if(score===1||score===2){
    return 'D'+score
  }else if(score===9){
    return 'F'+9
  }else if(score===7 || score===8){
    return 'P'+score
  }else if(score===3||score===4 || score===5 ||score===6){
    return 'C'+score
  }else{
    return '-'
  }
}
// 
function getComment(letter, subject){
  if(letter ==='A') return 'Exceptional understanding'
  if(letter ==='B') return 'Strong grasp of concepts'
  if(letter ==='C') return 'Meets expectation with potentials'
  if(letter ==='D') return 'Needs improvement in some areas'
  if(letter ==='E') return 'Can benefit from extra support'
  if(letter ==='O' && ['ICT', 'SM','S/M', 'GP'].includes(subject.split(' ')[0])) return 'Met passing requirements'
  if(letter ==='O') return 'Shows basic understanding'
  if(letter ==='F') return "Didn't meet passing requirements"
}

/**
 * Sorts an object's keys alphabetically,
 * but always places:
 *   – "GP" as the last key
 *   – and the second-last key as whichever exists first among ["ICT", "SM", "S/M"]
 */
function sortObjectWithGpIct(obj) {
  const allKeys = _.keys(obj);
  // Which of these special keys actually exists?
  const secondLastKey = _.find(['ICT', 'SM', 'S/M'], k => _.has(obj, k));
  // Remove GP and the special second-last from the normal list
  const normalKeys = _.sortBy(
    _.without(allKeys, 'GP', secondLastKey),
    _.identity        // simple alphabetical
  );
  // Build the final ordered list of keys
  const finalKeys = secondLastKey
    ? [...normalKeys, secondLastKey, 'GP']
    : [...normalKeys, 'GP'];
  // Recreate the object in that order
  return _.fromPairs(finalKeys.map(k => [k, obj[k]]));
}

//CHECK If a suent does a subject
function isRegistered(AOI_3,EOA_80 ){
  if(AOI_3 && AOI_3 !='-' && (AOI_3>0 || AOI_3<=20) ) return true
  if(EOA_80 && EOA_80 !='-' && (EOA_80>0 || EOA_80<=80) ) return true
  if(AOI_3 === '-' || EOA_80 === '-' ) return true
  return false
}

//get token
function getToken (token){
  const importantData = localStorage.getItem('importantData')
  return JSON.parse(importantData)?.token?.[token] 
}

//extract unique subject
const getUniqueSubjects = (students) => {
  if(!(students || students && students.length===0) ) return []
  
  const preferredOrder = ["ENG","MTC","PHY","CHE","BIO","HIS","GEO"];
  const subjects = [
    ...new Set(
      students.flatMap(student =>
        Object.keys(student.subjects || {})
      )
    )
  ];
  // 
  const preferred = preferredOrder.filter(subject =>subjects.includes(subject));
  const remaining = subjects
    .filter(subject => !preferredOrder.includes(subject))
    .sort((a, b) => a.localeCompare(b));

  return [...preferred, ...remaining];
};

//count grade
const getSubjectGradeCount = (students, subjects, exam, clas) =>{
  let result = []
  const grades = {A: 0, B: 0, C: 0, D: 0, E: 0 }
  let grade_weight = {A:7, B:6, C:5, D:4, E:3, F:2, MISS:1}
  
  if(clas>4) {
    grades.F = 0
  }


  subjects.forEach((subject) => {
    const gradeCount = {...grades, MISS: 0}

    students.forEach((student) => {
      const subjectData = student.subjects?.[subject];

      // Ignore students who don't have this subject
      if (!subjectData) return;

      // TOTAL is null => MISS
      if (subjectData.TOTAL === null) {
        gradeCount.MISS++;
        return;
      }

      // Count the grade
      const grade = subjectData?.[exam=='AOI'?"AOI_AVERAGE_GRADE":exam=='EOC'?"EXAM_AVERAGE_GRADE":"GRADE"]//AVERAGE_GRADE;

      if (Object.keys(grades).includes(grade)) {
        gradeCount[grade]++;
      }
    });

    // TOTAL = sum of all grades including MISS
    gradeCount.TOTAL = Object.keys(grades).reduce((acc, current)=>acc + gradeCount[current],0) + gradeCount.MISS;

    // percentage

    gradeCount.subject = subject

    result = [...result, gradeCount];
    result = result.map(one_subject=>{
      let percentage = {}
      Object.keys({...grades, MISS:0}).map(grade=>{
        percentage[grade+'Per'] = one_subject[grade] / one_subject.TOTAL*100
      })
      // 
      let weight = {}
      Object.keys({...grades, MISS:0}).map(grade=>{
        weight[grade+'Weight'] = percentage[grade+'Per'] / grade_weight[grade]
      })
      let _TOTAL_WEIGHT = Object.values(weight||{}).reduce((acc, current)=>acc+current,0)
      
      const EXPECTED_WAIGHT = 100 *Object.values(weight||{}).reduce((acc, current)=>acc+current,0) +1
      const TOTAL_WEIGHT = _TOTAL_WEIGHT/EXPECTED_WAIGHT*100
      // console.log(_TOTAL_WEIGHT, EXPECTED_WAIGHT);

      // 
      return {...one_subject, ...percentage, ...weight, TOTAL_WEIGHT}
    })
  });
  return  _.orderBy(result, ['TOTAL_WEIGHT', 'AWeight','BWeight', 'CWeight' ], ['asc', 'asc','asc','asc']);
}

// Count the general grade for a class
const countAverageGrades = (students, exam) => {
  const grades = ['A', 'B', 'C', 'D', 'E', 'MISS'];
  
  const countGrades = (data) => {
    const r = Object.fromEntries(grades.map(g => [g, 0]));
    
    data.forEach(({ AVERAGE_GRADE, EXAM_AVERAGE_GRADE, AOI_AVERAGE_GRADE }) => {
      let grade_key = exam=='AOI'?AOI_AVERAGE_GRADE:exam=='EOC'?EXAM_AVERAGE_GRADE:AVERAGE_GRADE//AVERAGE_GRADE
      const grade = grades.includes(grade_key)
        ? grade_key
        : 'MISS';

      r[grade]++;
    });

    r.TOTAL = data.length;

    grades.forEach(g => {
      r[`${g}Per`] = r[g] / r.TOTAL * 100;
    });

    return r;
  };

  // Overall is ALWAYS the first element
  const result = [
    {
      ...countGrades(students)
    }
  ];

  // Get only existing streams
  const streams = [...new Set(
    students
      .map(s => s.STREAM)
      .filter(Boolean)
  )];

  // Add each stream after overall
  streams.forEach(STREAM => {
    result.push({
      STREAM,
      ...countGrades(
        students.filter(s => s.STREAM === STREAM)
      )
    });
  });

  return result;
};
// 
 export {
  rowColor,
  generateGradingRanges,
  countStudentsByStream, 
  roundOff,
  numbersArray,
  generateNumbersFrom,
  chunkArray,
  pickAndSetImage,
  paginate,
  getScore,
  getComment,
  sortObjectWithGpIct,
  isRegistered,
  uploadLogo,
  getToken,
  getUniqueSubjects,
  getSubjectGradeCount,
  countAverageGrades
  // 
}

