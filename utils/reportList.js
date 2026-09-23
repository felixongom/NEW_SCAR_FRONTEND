import _ from "lodash"
import { FaRegRegistered } from "react-icons/fa6";
import { VscLayersActive} from "react-icons/vsc";
import { BsActivity } from "react-icons/bs";
import { IoNewspaperOutline, IoHomeOutline} from "react-icons/io5";
import { LuSchool } from "react-icons/lu";
import { RiFileUploadLine } from "react-icons/ri";
import { BsCloudUpload } from "react-icons/bs";
import { CiSettings, } from "react-icons/ci";


// let base_api_path = 'http://localhost:3001/api/'
let base_api_path = 'https://sscar.to'+'/api/'  
// full name for subject
let a_subject_full_name ={
    MTC:'MATHEMATICS',
    ENG:'ENGLISH LANGUAGE',
    PHY:'PHYSICS',
    CHE:'CHEMISTRY',
    BIO:'BIOLOGY',
    HIS:'HISTORY AND POL. EDUC',
    GEO:'GEOGRAPHY',
    ENT:'ENTREPRENEURSHIP EDUC',
    AGR:'AGRICULTURE PRINCIPLE AND PRACTICE',
    ICT:'ICT',
    GP:'GENERAL PAPER',
    CRE:'CHRISTIAN RELIGIOUS EDUCATION',
    PE:'PHYSICAL EDUCATION',
    FA:'ART AND DESIGN',
    LIT:'LITERATURE IN ENGLISH',
    KIS:'KISWAHILI',
    ECO:'ECONOMICS',
    TD:'TECHNICAL DRAWING',
    FAN:'FOOD AND NUTRITION',
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
// 
const exam = {BOT:'BEGINNING OF TERM',  MOT:'MID OF TERM', EOT:'END OF TERM'}
const roman_term = {1:'I', 2:'II', 3:'III'}

export  {base_api_path,
  colors, 
  nav_links,
  exam,
  roman_term,
  paper_code,
  a_subject_full_name
}