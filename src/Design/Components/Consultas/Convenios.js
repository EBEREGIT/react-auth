import  { useEffect, useState } from  'react';
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import { validarCNPJ } from './../../../Utils/Tools';
import dataSiafi from './../../../Utils/orgaosSiafi.json';
import dataMunicipios from './../../../Utils/municipiosSiafi.json';
import CpfCnpj from "@react-br-forms/cpf-cnpj-mask";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const  Convenios = () =>{


    const [codigoSIAFI, setCodigoSiafi] = useState('');
    const [cnpjValido, setCnpjValido] = useState(false);
    const [optionsOrgaosSiafi, setOptionsOrgaosSiafi] = useState([{}]);
    const [optionsMunicipios, setOptionsMunicipios] = useState([{}]);
    const [orgaoSiafi, setOrgaoSiafi] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [orgaoNome, setOrgaoNome] = useState('');
    const [municipioNome, setMunicipioNome] = useState('');
    const [cnpj, setCnpj] = useState("");
    const [mask, setMask] = useState("");
    
    const fetchConvenios = (data) =>{
      debugger;
      const configuration = {
        method: "get",
        url: `https://nervous-pink-sunglasses.cyclic.app/convenio/${codigoSIAFI}/${cnpj}/${orgaoSiafi}`,
      };
      axios(configuration)
        .then((result) => {
          debugger;
          printConvenios(result.data);
        })
        .catch((error) => {
          console.log(error)
        });
    }

    const handleOptionsOrgaoSiafi =(e)=>{
      setOrgaoSiafi(e.value);
      setOrgaoNome(e.label);
    }

    const handleOptionsMunicipio =(e)=>{
      setCodigoSiafi(e.value);
      setMunicipioNome(e.label);
    }

    const handleCnpjChange = (e)=>{
      let numberPattern = /\d+/g;
      const cnpjInput = e.currentTarget.value;
      let numbersCNPJ = cnpjInput.match(numberPattern).join('');
      setCnpj(numbersCNPJ);
      const isValido = validarCNPJ(cnpjInput)
      setCnpjValido(isValido)
    }


    useEffect(() =>{
      if(dataLoaded === false){        
        let optionsSiafi = dataSiafi.map(item => ({"value": item.codigo, "label" : item.descricao}));        
        setOptionsOrgaosSiafi(optionsSiafi);
        let optionsMunicipios = dataMunicipios.map(item => ({"value": item.codigoSiafi, "label" : item.nomeMunicipio}));        
        setOptionsOrgaosSiafi(optionsSiafi);
        setOptionsMunicipios(optionsMunicipios)
        setDataLoaded(true);
      }
    })


    const printConvenios = (json) => {
      const conveniosData = json.data;
      const pdf = new jsPDF("l", "pt", "a4");
      const columns = [
        "Número convênio",
        "UF",
        "Nome município",
        "Situação convênio",
        "Nome órgão",
        "Nome convenente",
        "Tipo ente",
        "Tipo convenente",
        "Valor liberado",
        "Valor última liberação",
        "Data última liberação"
      ];
      var rows = [];
      for (let i = 0; i < conveniosData.length; i++) {

        var temp = [
          conveniosData[i].NumeroConvenio,
          conveniosData[i].UF,
          conveniosData[i].NomeMunicipio,
          conveniosData[i].SituacaoConvenio,
          conveniosData[i].NomeOrgaoConcedente,
          conveniosData[i].NomeConvenente,
          conveniosData[i].TipoConvenente,
          conveniosData[i].TipoEnteConvenente,
          conveniosData[i].ValorLiberado,
          conveniosData[i].ValorUltimaLiberacao,
          conveniosData[i].DataUltimaLiberacao,
        ];
        rows.push(temp);
      }
      pdf.text(235, 40, "Convênios do governo Federal selecionados");
      
      pdf.autoTable(columns, rows,{
        cellWidth: "wrap",
    
        startY: 20
      });
      console.log(pdf.output("data out"));
      pdf.save("pdf");
    };

  

    return (
        <div className="text-center">     
    
          {/* displaying our message from our API call */}
          
              <br />
              {!cnpjValido && <span>*</span>}
              <CpfCnpj
                value={cnpj}
                onChange={e =>handleCnpjChange(e)}
              />
              {!cnpjValido && <span>CNPJ inválido</span>}
          <Select placeholder={"Escolha o órgão"} options={optionsOrgaosSiafi} onChange={e => handleOptionsOrgaoSiafi(e)} onClick={e => handleOptionsOrgaoSiafi(e)}/>
          <Select placeholder={"Escolha o município"} options={optionsMunicipios} onChange={e => handleOptionsMunicipio(e)} onClick={e => handleOptionsMunicipio(e)}/>
          {cnpjValido && <Button type="submit" variant="danger" onClick={() => fetchConvenios()}>
            Consultar convênios
          </Button>}
        </div>
      );
    
}

export default Convenios