import react, { useEffect, useState } from  'react';
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import { DateExtract } from './../../../Utils/Tools';
import dataSiafi from './../../../Utils/orgaosSiafi.json';
import dataMunicipios from './../../../Utils/municipiosIBGE.json';

const  Convenios = () =>{

    const [dataConvenio, setDataConvenio] = useState('');
    const [codigoIbge, setCodigoIbge] = useState('');
    const [optionsOrgaosSiafi, setOptionsOrgaosSiafi] = useState([{}]);
    const [optionsMunicipios, setOptionsMunicipios] = useState([{}]);
    const [orgaoSiafi, setOrgaoSiafi] = useState();
    const [municipio, setMunicipio ] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);

    const fetchTransparencia = (data) =>{
        console.log(dataConvenio)
        fetch('https://api.portaldatransparencia.gov.br/api-de-dados/despesas/documentos?dataEmissao=15%2F01%2F2020&fase=2&gestao=123&pagina=1&unidadeGestora=123', {
          method: "GET",
          headers: {
            "chave-api-dados": "cf113c73ed26bc6783e7448d0d018ba6",
            "accept": "*/*"
          }
        })
        .then(response => response.json())  // converter para json
        .then(json => console.log(json))    //imprimir dados no console
        .catch(err => console.log('Erro de solicitação', err));
    }

    const setData = (data) =>{
      let dataArray =  DateExtract(data);
      setDataConvenio(dataArray);
    }

    const handleOptionsOrgaoSiafi =(e)=>{
      setOrgaoSiafi(e.value);
      console.log(e.value)
    }

    const handleOptionsMunicipio =(e)=>{
      setMunicipio(e);
    }
    
    const fetchLocalSiafi = ()=>{
      console.log(dataSiafi)
    }

    

    useEffect(() =>{
      if(dataLoaded === false){        
        let optionsSiafi = dataSiafi.map(item => ({"value": item.codigo, "label" : item.descricao}));        
        setOptionsOrgaosSiafi(optionsSiafi);
        let optionsMunicipios = dataMunicipios.map(item => ({"value": item.codigoIbge, "label" : item.nome}));        
        setOptionsOrgaosSiafi(optionsSiafi);
        setOptionsMunicipios(optionsMunicipios)
        setDataLoaded(true);
      }
    })

    return (
        <div className="text-center">     
    
          {/* displaying our message from our API call */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              
              value={""}
              onChange={(newValue) => {
                setData(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
              <br />
              
          <Select placeholder={"Escolha o órgão"} options={optionsOrgaosSiafi} onChange={e => handleOptionsOrgaoSiafi(e)} onClick={e => handleOptionsOrgaoSiafi(e)}/>
          <Select placeholder={"Escolha o município"} options={optionsMunicipios} onChange={e => handleOptionsMunicipio(e)} onClick={e => handleOptionsMunicipio(e)}/>
          <Button type="submit" variant="danger" onClick={() => fetchTransparencia()}>
            Consultar convênios
          </Button>
          <Button type="submit" variant="danger" onClick={() => fetchLocalSiafi()}>
            fetch json
          </Button>
        </div>
      );
    
}

export default Convenios