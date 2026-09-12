import _ from "lodash"
import { FaRegRegistered } from "react-icons/fa6";
import { VscLayersActive} from "react-icons/vsc";
import { BsActivity } from "react-icons/bs";
import { IoNewspaperOutline, IoHomeOutline} from "react-icons/io5";
import { LuSchool } from "react-icons/lu";
import { RiFileUploadLine } from "react-icons/ri";
import { BsCloudUpload } from "react-icons/bs";
import { CiSettings, } from "react-icons/ci";




let base_api_path = 'http://localhost:3001/api/'
// full name for subject
let subject_full_name ={
    '*':'General*',
    MTC:'MATHEMATICS',
    MAT:'MATHEMATICS',
    ENG:'ENGLISH LANGUAGE',
    PHY:'PHYSICS',
    CHE:'CHEMISTRY',
    BIO:'BIOLOGY',
    HIS:'HISTORY AND POL. EDUC',
    GEO:'GEOGRAPHY',
    ENT:'ENTREPRENEURSHIP EDUC',
    ECO:'ECONOMICS',
    AGR:'AGRICULTURE',
    ICT:'ICT',
    CRE:'CRE',
    IRE:'ISLAMIC RELIGIOUS EDUCATION',
    DIV:'DIVINITY',
    PE:'PHYSICAL EDUCATION',
    FA:'ART AND DESIGN',
    IPS:'ART AND DESIGN',
    TD:'TECHNICAL DRAWING',
    LIT:'LITERATURE IN ENGLISH',
    KIS:'KISWAHILI',
    GP:'GENERAL PAPER',
    SM:'SUBSIDIARY MATHEMATICS',
    'S/M':'SUBSIDIARY MATHEMATICS',

    
}
// 
const o_level_report_list = {
  EOT: [
    { name: 'Standard Report Card', path: '/report-card/standard' },
    { name: 'Dense Report Card', path: '/report-card/neoro' },
    { name:'Zito Report Card: AOI, BOT, MOT', path: '/report-card/zito?BOT=EX1&MOT=EX2'},
    { name:'Zito Report Card: AOI, BOT, EOT', path: '/report-card/zito?BOT=EX1&EOT=EX3'},
    { name:'Zito Report Card: AOI, MOT, EOT', path: '/report-card/zito?MOT=EX2&EOT=EX3'},
    { name:'Zito Report Card: AOI, BOT, MOT, EOT', path: '/report-card/zito?BOT=EX1&MOT=EX2&EOT=EX3'},
    { name:'Zito Report Card: AOI Only', path: '/report-card/aoi'},
  ],
  //
  SUMMARY: [
    { name: 'General Performance Sheet In Letters', path: '/sammury/grade' },
    { name: 'General Performance Sheet In Figures', path: '/sammury/marks' },
    // { name: 'Detailed Mark Sheet per Subject', path: '/sammury/mark-sheet/physics/all-result' },
    // { name: 'Mark Sheet per Subject', path: '/sammury/mark-sheet/physics/all-result' },
    { name: 'Number of each grade per subject', path: '/sammury/count-scores'},
  ],
  SUBJECTS:'subjects'
};
// 
const a_level_report_list = {
  EOT: [
    { name: 'Standard Report Card', path: '/report-card/standard' },
    { name: 'Dense Report Card', path: '/report-card/neoro' },
  ],
  // 
  SUMMARY: [
    { name: 'General Performance In Letters', path: '/sammury/grade' },
    { name: 'General Performance In Figures', path: '/sammury/marks' },
    { name: 'General Scores', path: '/sammury/scores' },
    { name: 'Number of each grade per subject', path: '/sammury/count-scores'},
  ],
  SUBJECTS:'subjects'
};

// full name for subject
let a_subject_full_name ={
    MTC:'MATHEMATICS',
    ENG:'ENGLISH LANGUAGE',
    PHY:'PHYSICS',
    CHE:'CHEMISTRY',
    BIO:'BIOLOGY',
    HIS:'HISTORY AND POL. EDUC',
    HISA:'HISTORY',
    GEO:'GEOGRAPHY',
    ENT:'ENTREPRENEURSHIP EDUC',
    AGR:'AGRICULTURE',
    AGRA:'AGRICULTURE PRINCIPLE AND PRACTICE',
    ICT:'ICT',
    ICTA:'SUBSIDARY ICT',
    GP:'GENERAL PAPER',
    CRE:'CRE',
    DIV:'CHRISTIAN RELIGIOUS EDUCATION',
    PE:'PHYSICAL EDUCATION',
    FA:'ART AND DESIGN',
    LIT:'LITERATURE IN ENGLISH',
    LITA:'LITERATURE',
    KIS:'KISWAHILI',
    ECO:'ECONOMICS',
    TD:'TECHNICAL DRAWING',
    SM:'SUBSIDIARY MATHEMATICS',
    'S/M':'SUBSIDIARY MATHEMATICS'
}

// 
let paper_code = {
  PHY:'P510',CHE:'P525',BIO:'P530',MTC:'P425',FA:'P615', AGR:'P515', GEO:'P250',
  DIV:'P235', CRE:'P235', ENT:'P230', ECO:'P220',HIS:'P210',LIT:'P310',TD:'P730',SM:'S475',
  'S/M':'S475', ICT:'S850', GP:'S101'

}
// 

let colors = ['#1a3300','#0d0d0d','#99004d','#b32400','#00802b','#b35900',
  '#800080','#990000','#007a99', '#999900','#4c0080','#008080']

// 
function getPhotoByName(photos, name) {
  const formattedInput = name.replace(/\s+/g, '').toLowerCase();
  // 
  const student = _.find(photos, (photo) => {
    const formattedStudentName = photo?.name?.replace(/\s+/g, '').toLowerCase();
    return formattedStudentName === formattedInput;
  });
  return student ? student?.image : null;
}

// links in the nave bar
const nav_links = [
  {name:'My School', path:'/A/my-school', icon:<LuSchool />},
  {name:'Register New Students', path:'/A/register-new-students', icon:<FaRegRegistered />},
  {name:'Enrole Students', path:'/A/enrole-students', icon:<VscLayersActive />},
  {name:'Enroled Students', path:'/A/enroled', icon:<BsActivity/>},
  {name:'Results', path:'/A/results', icon:<IoNewspaperOutline/>},
  {name:'Upload Photos', path:'/A/upload-photos', icon:<BsCloudUpload/>},
  {name:'Upload Marks', path:'/A/upload-marks', icon:<RiFileUploadLine/>},
  {name:'More Settings', path:'/A/more-settings', icon:<CiSettings/>},
  {name:'Home', path:'/home', icon:<IoHomeOutline />},

]

// full names of a term
const term = {
  BOT:'Beginning Of Term Report',
  MOT:'Mid-Term Report',
  EOT:'End Of Term Report',
  EOC:'End of Cycle'
}
const exam = {BOT:'BEGINNING OF TERM',  MOT:'MID OF TERM', EOT:'END OF TERM'}
const roman_term = {1:'I', 2:'II', 3:'III'}

export  {base_api_path,
  getPhotoByName, 
  o_level_report_list, 
  a_level_report_list, 
  colors, 
  subject_full_name,
  nav_links,
  term,
  exam,
  roman_term,
  paper_code,
  a_subject_full_name
}