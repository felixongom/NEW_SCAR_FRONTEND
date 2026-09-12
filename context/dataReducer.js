
let initialState = {
    logo:'',
    selected_clas:'SENIOR 5',
    photos:[],
    transformed_data:'', 
    ranked_data:'',
    school_info: '',
    main_school_info: '',
    gradings: '',
    grade_range:'',
    data_chunk:'',
    num_per_stream:'',
    theme_bg:'#0d0d0d',
    grade_count:'',
    my_subjecs:[],
    my_subject_full_name:{},
    // additional for 'A' level only
    set_time:{ year:new Date().getFullYear(), term:1, exam:'BOT'},
    set_enrolement_time:{ year:new Date().getFullYear(), term:1, exam:[], paper_id:[] },
    reserve_exam:'BOT',
    // 
    a_level_subject:null,
    paper_mode:'landscape',
    selected_exam:'All',
    toggle_manu:false,
    put_position:false,
    token:{},
    // 
    uneb_uce:'',
    dashhboard_on:false,
    // o level
    report_category:'report summary',
}
// 
const dataReducer = (state, action)=>{
    if(action.type === "PHOTOS"){
        return {...state, photos:action.payload};
    }else if(action.type ==="LOGO"){
        return {...state, logo: action.payload};
    }else if(action.type ==="RANKED_DATA"){        
        return {...state, ranked_data: action.payload};
    }else if(action.type ==="TRANSFORMED_DATA"){
        return {...state, transformed_data: action.payload};
    }else if(action.type ==="SCHOOL_INFO"){
        return {...state, school_info: action.payload};
    }else if(action.type ==="MAIN_SCHOOL_INFO"){
        return {...state, main_school_info: action.payload};
    }else if(action.type ==="GRADINGS"){
        return {...state, gradings: action.payload};
    }else if(action.type ==="DATA_CHUNK"){
        return {...state, data_chunk: action.payload};
    }else if(action.type ==="SELECTED_CLAS"){   
        return {...state, selected_clas: action.payload};
    }else if(action.type ==="NUM_PER_STREAM"){                
        return {...state, num_per_stream: action.payload};
    }else if(action.type ==="GRADE_RANGE"){                
        return {...state, grade_range: action.payload};
    }else if(action.type ==="THEME"){    
        return {...state, theme_bg: action.payload};
    }else if(action.type ==="GRADE_COUNT"){        
        return {...state, grade_count: action.payload};
    }else if(action.type ==="MY_SUBJECTS"){        
        return {...state, my_subjecs: action.payload};
    }else if(action.type ==="MY_SUBJECTS_OBJECT"){        
        return {...state, my_subject_full_name: action.payload};
    }else if(action.type ==="SET_TIME"){ 
        return {...state, set_time: action.payload};       
    }else if(action.type ==="RESERVE_EXAM"){ 
        return {...state, reserve_exam: action.payload};       
    }else if(action.type ==="SET_ENROLEMENT_TIME"){        
        return {...state, set_enrolement_time: action.payload};       
    }else if(action.type ==="A_LEVEL_SUBJECT"){        
        return {...state, a_level_subject: action.payload}
    }else if(action.type ==="PUT_POSITION"){ 
        return {...state, put_position:action.payload};
    }else if(action.type ==="PAPER_MODE"){ 
        return {...state, paper_mode:action.payload};
    }else if(action.type ==="SELECTED_EXAM"){ 
        return {...state, selected_exam:action.payload};
    }else if(action.type ==="TOKEN"){ 
        return {...state, token:action.payload};
    }else if(action.type ==="UNEB_UCE"){ 
        return {...state, uneb_uce:action.payload};
    }else if(action.type ==="SORT_UNEB_UCE_DATA"){ 
        return {...state, uneb_uce:{...state.uneb_uce, UNEB_UCE:action.payload}};
    }else if(action.type ==="TOGGLE_MENU"){ 
        return {...state, toggle_manu:action.payload};
    }else if(action.type ==="DASHBOARD_ON"){ 
        return {...state, dashhboard_on:action.payload};
    }else if(action.type ==="REPORT_CATEGORY"){ 
        return {...state, report_category:action.payload};
    }else if(action.type ==="EXAM_CATEGORY"){
        return {...state, exam_category:action.payload};
    }else{
        return state
    }
  }

  export { dataReducer, initialState }