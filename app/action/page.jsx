'use client'
import PageSchoolInfo from '@/components/PageSchoolInfo';

export default function OneClass(){
const data = {
  "SCHOOL NAME": "Mentor SS",
  "BOX NO": "P.O BOX 921",
  "CLASS ": "Number of subject per student",
  "DISTRICT/CITY": "LIRA",
  "EMAIL": "mentorss@gmail.com",
  "EXAMS": "Mid term Exams",
  "LOCATION": "kampala road, 1Km off Lango College",
  "MOTO": "We Nature for success",
  "PHONE": " +256 387928447, +256 789 674 323"
};

    
    return(
        <div className='px-3 '>
            {data===null? (<h1>Loading</h1>):<PageSchoolInfo data={data}/>}
            <div className='mt-3'>
                <div className='gap-2'>
                    hello
                </div>
            </div>
        </div>
    )
}