import "./Home.css";
import { useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import { toast  } from 'react-toastify';

function App() {


  const [parsedData, setParsedData] = useState({file_No_MFA_Key:[], file_With_MFA_key:[]});
  const [Results, SetResults] = useState({file_No_MFA_Key:[], file_With_MFA_key:[]});
  const [tableRows, setTableRows] = useState({file_No_MFA_Key:[], file_With_MFA_key:[]});
  const [values, setValues] = useState({file_No_MFA_Key:[], file_With_MFA_key:[]});
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false)
  const [uploaded, setUploaded] = useState({file_No_MFA_Key:false, file_With_MFA_key:false})
  const [fileExtension, setFileExtension] = useState(false)

  const changeHandler = (event) => {
    let allowedExtention = '.csv'
    let fileName = event.target.files[0].name
    let lastIndexofFilename = fileName.lastIndexOf('.')
    if(fileName.slice(lastIndexofFilename)===allowedExtention){
      setFileExtension(true)
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        SetResults({...Results,[event.target.id]:results.data})

        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.forEach((d) => {
            if(rowsArray.length <1){
                rowsArray.push(Object.keys(d));
            }
          valuesArray.push(Object.values(d));

        });
        // Parsed Data Response in array format
        setParsedData({...parsedData,[event.target.id]:results.data});

        // Filtered Column Names
        setTableRows({...tableRows,[event.target.id]:rowsArray[0]});

        // Filtered Values
        setValues({...values,[event.target.id]:valuesArray});
      },
    });

    setUploaded({...uploaded,[event.target.id]:true})
    }else{
      toast.info('Please Enter a CSV file')
    }

  };





let headers = [
    {label: 'User id', key: 'User id'},{label: 'User name', key: 'User name'},
    {label: 'email', key: 'email'},{label: 'User status', key: 'User status'},{label: 'Added to org', key: 'Added to org'},{label: 'Org role', key: 'Org role'}, 
    {label: 'Last seen in Jira Service Management', key: 'Last seen in Jira Service Management'},{label: 'Two-step verification (managed account)', key: 'Two-step verification (managed account)'}
  ] 

  const Calculate = () =>{
    if(fileExtension){

      if(uploaded.file_No_MFA_Key && uploaded.file_With_MFA_key){
        Results.file_No_MFA_Key.forEach((No_MFA_ROW)=>{
            Results.file_With_MFA_key.forEach((MFA_file_row)=>{
                if(No_MFA_ROW.email!==''){
                    if(No_MFA_ROW.email === MFA_file_row.Email){
                        No_MFA_ROW['Two-step verification (managed account)'] = MFA_file_row["Two-step verification (managed account)"]
                    }
                }else{
                    No_MFA_ROW['Two-step verification (managed account)'] = "Email not found inn non mfa file"
                }
            })
        })
    
    
        let requiredFile = Results.file_No_MFA_Key
            requiredFile.forEach((obj,i)=>{
                let keys = Object.keys(obj)
                if(!keys.includes("Two-step verification (managed account)")){
                    obj["Two-step verification (managed account)"] = 'Email Not found in MFA File' 
                }
        })
    
        setData(requiredFile)
        if(uploaded.file_No_MFA_Key && uploaded.file_With_MFA_key){
            setShow(true)
    
        }
    }else{
      toast.info("Please Add Files")
    }

    }else{
      toast.info("Please Add CSV Files")
    }
  }

  const csvReport = {
    data: data,
    headers: headers,
    filename: 'nofil.csv'
  };

  return (
    <div className="home">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
    <div className="content">
    <div className="container">
    <div className="input_container">
        <label htmlFor="file"> USER FILE</label>
        <input type="file" name="file" id='file_No_MFA_Key' onChange={changeHandler} accept=".csv" className="Fileinput" />
    </div>



    <div className="input_container">
        <label htmlFor="file"> MFA STATUS FILE</label>
        <input type="file" name="file" id='file_With_MFA_key' onChange={changeHandler} accept=".csv" className="Fileinput"/>
    </div>


        <button className="btn" onClick={Calculate}>Click</button>
      {show && <CSVLink {...csvReport}  className='btn'>Export to CSV</CSVLink> }
    </div>
    </div>
</div>


  );
}

export default App;
