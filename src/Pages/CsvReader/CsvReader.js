import React from "react";
import { useState } from "react";
import {CSVLink} from 'react-csv'
import Style from '../CsvReader/CsvReader.module.css'
const CsvReader = () => {
    const [csvFile, setcsvFile] = useState()
    const [csvArray, setcsvArray] = useState([])
    const [csvByBrand, setcsvByBrand] = useState([])
    const [showFile,setShowFiles]=useState(false)

    const[filename,setFielname]=useState()
    const Header_iput0_file=[
        {label:"Product name",key:"Product_name"},
        {label:"Average",key:"Average"}]

    const Header_iput1_file=[
            {label:"Product name",key:"Product_name"},
            {label:"Brand",key:"Brand"}]

    const GetDataFromOrders = (Rows, Delim) => {
        let obj = { Product_Average_Map: {}, Product_Brand_Count_Map: {} }

        for (let i = 0; i <= Rows.length; i++) {
            if (Rows[i] === undefined) {
                break;
            }

            let values = Rows[i].split(Delim);

            obj.Product_Average_Map[values[2]] = obj.Product_Average_Map[values[2]] === undefined ? { q: parseInt(values[3]), c: 1 } : { q: parseInt(values[3]) + obj.Product_Average_Map[values[2]].q, c: obj.Product_Average_Map[values[2]].c + 1 }

            obj.Product_Brand_Count_Map[values[2]+"_"+values[4]]=
            obj.Product_Brand_Count_Map[values[2]+"_"+values[4]] === undefined ?1:
            obj.Product_Brand_Count_Map[values[2]+"_"+values[4]]+1
        }

        return obj
    }

    const GetProductPopularBrand = (Product_Brand_Count_Map) => {
        let res = {}
        const result = Object.entries(Product_Brand_Count_Map).map(([ProductPerBrand, OrdersCount]) => {
            let Product_Prand_splited = ProductPerBrand.split('_')
            if (res[Product_Prand_splited[0]] == undefined) {
                res[Product_Prand_splited[0]] = { brand: Product_Prand_splited[1], quantity: OrdersCount }
            }
            else {
                if (res[Product_Prand_splited[0]].quantity < OrdersCount) {
                    res[Product_Prand_splited[0]] = { brand: Product_Prand_splited[1], quantity: OrdersCount }
                }
            }
        })
        return res;
    }

    const GetProductAverageOrderCount=(Product_Average_Map)=>{

return Object.entries(Product_Average_Map).map(([k, v])=> 
({Product_name: k, Average: v.q/v.c}));
    }

    const Handelcsv = (Str, Delim = ',') => {
         const Rows = Str.slice(Str.indexOf('\n') + 1).split(/\r?\n|\r/)
 
      
    var dataObj  = GetDataFromOrders(Rows,Delim)
    const Product_Average_Map = GetProductAverageOrderCount(dataObj.Product_Average_Map)
    
    const Product_Brand_Count_Map=GetProductPopularBrand(dataObj.Product_Brand_Count_Map)    

        console.log("first File",Product_Average_Map)
        console.log("secod File",Product_Brand_Count_Map)
      let HandleProduct_Brand_Count_Map=  Object.entries(Product_Brand_Count_Map).map(([k, v])=> 
({Product_name: k,Brand:v.brand}));
setcsvByBrand(HandleProduct_Brand_Count_Map)

console.log(HandleProduct_Brand_Count_Map)
        setcsvArray(Product_Average_Map)
    }
    const submit = () => {
        const file = csvFile;
        const Reader = new FileReader();
        Reader.onload = function (e) {
            const TEXT = e.target.result;
            console.log(TEXT)
            Handelcsv(TEXT)
        }
        Reader.readAsText(file)
        setShowFiles(true)
    }
     return (
        <>
        <div className={Style.Main}>
        <form>
            <div>
                
            <input
    type='file'
    accept='.csv'
    id='csvFile'
    onChange={(e) => {
        setcsvFile(e.target.files[0])
        setFielname(e.target.files[0].name)
        if (csvFile) {submit()}

    }}
/>

<label for="file" id="selector">Select File</label>
{csvFile?
    <button className={Style.Read} onClick={(e) => {
    e.preventDefault();
    if (csvFile) {
        submit()}
}}>READ</button>:null}

{showFile?
    <div className={Style.DowloadFiles}>
<CSVLink
data={csvArray}
headers={Header_iput0_file}
filename={`0_order_${filename}`}
target="_blank"
className={Style.CSVLink}
>
{`0_order_${filename}`}  

    </CSVLink>
    <CSVLink
data={csvByBrand}
headers={Header_iput1_file}
filename={`1_order_${filename}`}
target="_blank"
className={Style.CSVLink}

>
{`1_order_${filename}`}  
  </CSVLink>
</div>:null}

            </div>

 
<br />
<br />
{csvArray.length > 0 ? null : null}

</form>


        </div>

   </>

    )
}
export default CsvReader