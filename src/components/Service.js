import axios from "axios";

export async function getData()
{
   return await axios.get("http://localhost:8000/getAllProducts");
}
export async function deleteData(id)
{
   return await axios.delete(`http://localhost:8000/deleteSubcontrol/${id}`);

}
export async function getDataByStandard(standard)
{
   return await axios.get(`http://localhost:8000/getControlsByStandard/${standard}`);

}
export async function postData(data)
{
   return await axios.post("http://localhost:8000/addProduct",data,{headers:{'Content-Type':'application/json'}}
   )
}
export async function putData(subcontrolId ,data)
{
   return await axios.put(`http://localhost:8000/updateSubcontrol/${subcontrolId }`,data,{headers:{'Content-Type':'application/json'}}
   )
}
export async function register(data)
{
   return await axios.post("http://localhost:8000/register",data,{headers:{'Content-Type':'application/json'}}
   )
}
export async function getStandards()
{
   return await axios.get("http://localhost:8000/standards");

}

export async function getRegister() 
{
   return await axios.get("http://localhost:8000/getRegisteredEmails")
}
export async function deleteRegister( email ) {
   
     return await axios.delete(`http://localhost:8000/deleteRegisteredEmail/${email}`);
     
   
 }
 
