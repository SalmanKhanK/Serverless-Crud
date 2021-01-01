import React,{useEffect,useState} from "react"
import {Form,Formik,Field,ErrorMessage} from 'formik'
import {Button,Box,TextField,CircularProgress} from '@material-ui/core/';
import styles from './index.module.css'
const IndexPage = () => {
  const [state, setstate] = useState();
  const [Updateid,SetUpdate]=useState();
  const [isUpdate,SetisUpdate]=useState(true);
  const [GetAllMsg,setGetAllMsg]=useState(false)
  const [deletState,setDeletState]=useState(false)
  const [enableAddBtn,SetenableAddbtn]=useState(false)
  useEffect(() => {
    (async ()=>{
     await fetch("/.netlify/functions/hello")
      .then(response=>response.json())
      .then(data=>{
        setstate(data)
        setGetAllMsg(true)
        console.log("Data",JSON.stringify(data))        
      });
    })()
  }, [state]);
  // console.log(state);
  // console.log(GetAllMsg)
  const handleDelete=(id,isDelete)=>{
    if(!isDelete){
      setDeletState(true)
       fetch('/.netlify/functions/delete',{
         method:"delete",
         body:JSON.stringify(id)
       })
       .then(res=>res.json())
       .then(data=>{
        setGetAllMsg(false)
        setDeletState(false)
         console.log(data.delId)
       });
      }
  }
  const handleUpdate=(id)=>{
    const Update=state.find(msg=>msg.ref["@ref"].id===id)  
      SetisUpdate(false)
      SetUpdate(Update)

  }
  return (
      <div>
         <h1 className={styles.text}>Serverless Crud App</h1>
      <Formik
          enableReinitialize={true}
          initialValues={{
            id: !Updateid ? "" : Updateid.ref["@ref"].id,
            details: !Updateid ? "" : Updateid.data.details,
          }}
        onSubmit={
          (values,actions)=>{
            if(isUpdate){
              SetenableAddbtn(true)
               console.log(values);
               fetch("/.netlify/functions/add",{
                 method:"post",
                 body:JSON.stringify(values)
               })
               .then(res=>res.json())
               .then(data=>{
                setGetAllMsg(false)
                SetenableAddbtn(false)
                 console.log(data);
                 actions.resetForm({
                  values: {
                    id:"",
                    details:""
                  },
                 })
               });
          }
          else{
            SetenableAddbtn(true)
            console.log(values);
            fetch('/.netlify/functions/update',{
              method:"put",
              body:JSON.stringify(values)
            })
            .then(res=>res.json())
            .then(data=>{
              setGetAllMsg(false)
              SetenableAddbtn(false)
              SetisUpdate(true)
              console.log(data.message) 
            });
          }
        }  
        }
      >
        {
          (formik)=>(
            <Form onSubmit={formik.handleSubmit} >
          <div  className={styles.root}>
            <Field name="details" type="text" as={TextField} 
            fullWidth
            label="Some Text"
            variant="outlined" id="details" />
            <ErrorMessage name="details" render={(msg)=>(
                          <span style={{color:"red"}}>{msg}</span>
                      )} />
            </div>
            <br/>
        <div className={styles.root}>
            <Button variant="contained" type="submit" color="primary"
            
            disabled={enableAddBtn ? true:false}
            >
                 {isUpdate ? "Add":"Edit"}
            </Button>
            </div>
          </Form>
          )
        }
      </Formik>
      <Box  className={styles.root}>
      <div>{ GetAllMsg ? state.map((data,key)=>{
                   return(
                     <div key={key}>
                     <h3>{data.data.details}</h3>
                    <Button 
                    onClick={()=>handleDelete(data.ref["@ref"].id,deletState)} color="secondary" variant="contained"
                    disabled={deletState ? true:false}
            
                    >
                      Delete
                      </Button> 
                      <span className={styles.btn}></span>
                     <Button onClick={()=>handleUpdate(data.ref["@ref"].id)} 
                     color="primary"
                  
                     variant="contained">
                       Update
                    </Button>
                     </div>
                   )
               }):<div>
                 <CircularProgress/>
               </div>
           }</div>
      </Box>
      <div>
    </div>
    </div>
  )
}
export default IndexPage
