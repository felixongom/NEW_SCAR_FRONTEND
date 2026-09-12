"use client"
function LogoutButton() {
    function logout(){
        //push school to status, and save jwt to localstorage
        let importantData = localStorage.getItem('importantData')    
        if(importantData){
        let data = JSON.parse(importantData)
        delete data.token
        localStorage.setItem('importantData', JSON.stringify({...data}))
        window.location = '/'
        }
  }
  return (
    <button onClick={logout} className="px-1 py-0 bg-red-800 rounded text-xs text-white cursor-pointer">Logout</button>
  )
}

export default LogoutButton