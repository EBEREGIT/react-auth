import react, { useEffect, useState } from  'react';
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import { validarCNPJ } from './../../../Utils/Tools';
import dataSiafi from './../../../Utils/orgaosSiafi.json';
import dataMunicipios from './../../../Utils/municipiosSiafi.json';
import ufList from './../../../Utils/ufs.json';
import CpfCnpj from "@react-br-forms/cpf-cnpj-mask";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const  Programas = () =>{

  
  const [anoDisponibilizacao, setAnoDisponibilizacao] = useState("");
  const [sitPrograma, setSitPrograma] = useState("");
  const [codOrgPrograma, setCodOrgPrograma] = useState("");
  const [codPrograma, setCodPrograma] = useState("");
  const [uf, setUf] = useState("");
  const [optionProponente, setOptionProponente] = useState('')

  const [ufFetched, setUfFetched] = useState(false);
  const [ufOptions, setUfOptions] = useState([]);


  const situationOptions = [
    {value: "DISPONIBILIZADO", label: "Disponibilizado"},
    {value: "INATIVO", label: "Inativo"},
    {value: "CADASTRADO", label: "Cadastrado"},
  ]

  const proponenteOptions = [
    {value:"RECEB_PROP", label: "Proposta voluntária"},
    {value:"EMENDA_PAR", label: "Proposta de porponente de emenda parlamentar"},
    {value:"BENEF_ESP", label: "Proposta de benefício exclusivo do proponente"},
  ]

  const handleAno = (e) =>{
    setAnoDisponibilizacao(e.currentTarget.value)
  }

  const handleProponenteOptions = (e) =>{    
    setOptionProponente(e.value)
  }

  const handleSituation = (e) => {
    setSitPrograma(e.value)
  }

  const handleUfChange = (e) => {
    setUf(e.value)
  }

  const handleCodOrg = (e) => {
    setCodOrgPrograma(e.currentTarget.value)
  }

  const handleCodPrograma = (e) => {
    setCodPrograma(e.currentTarget.value)
  }

  const fetchConvenios = (data) =>{
    const configuration = {
      method: "get",
      url: `https://nervous-pink-sunglasses.cyclic.app/programa/${anoDisponibilizacao}/${sitPrograma}/${uf}/${codOrgPrograma}`,
    };
    console.log(configuration)
    axios(configuration)
      .then((result) => {
        console.log(result);
        printProgramas(result.data)
      })
      .catch((error) => {
        error = new Error();
      });
  }

  const printProgramas = (json) => {
    const programasData = json.data;
    console.log(programasData);
    const pdf = new jsPDF("l", "pt", "a3");

    const columns = [
      "Nome do programa",
      "Código programa",
      "Data da disponibilização",
      "Abertura (proposta voluntária)",
      "Fechamento (proposta voluntária)",
      "Abertura (emenda parlamentar)",
      "Fechamento (emenda parlamentar)",
      "Abertura (proponente específico)",
      "Fechamento (proponente específico)",
      "Modalidade do programa",
      "Natureza jurídica do programa",
      "Ação orçamentária",
      "uf programa"
    ];
    var rows = [];
    for (let i = 0; i < programasData.length; i++) {

      var temp = [
        programasData[i].NomePrograma,
        programasData[i].CodPrograma,
        programasData[i].DataDisponibilizacao,
        programasData[i].DtProgIniRecebProp|| "-",
        programasData[i].DtProgFimRecebProp|| "-",
        programasData[i].DtProgIniEmendaPar|| "-",
        programasData[i].DtProgFimEmendaPar|| "-",
        programasData[i].DtProgIniBenefEsp|| "-",
        programasData[i].DtProgFimBenefEsp|| "-",
        programasData[i].ModalidadePrograma,
        programasData[i].NaturezaJuridicaPrograma,
        programasData[i].AcaoOrcamentaria,
        programasData[i].UfPrograma
      ];
      rows.push(temp);
    }
    pdf.text(235, 40, "Programas selecionados");
    
    pdf.autoTable(columns, rows,{
      cellWidth: "wrap",
  
      startY: 20
    });
    console.log(pdf.output("data out"));
    pdf.save("pdf");
  };

  useEffect(() => {
    if(!ufFetched){
      const options = ufList.map(estado => ({value: estado.sigla, label: estado.Estado}))
      setUfOptions(options)
      setUfFetched(true)
    }   
  })
    

  return (
    <div className="text-center">     
      <label>Escolha a situação:</label>
      <Select options={situationOptions} onChange={e => handleSituation(e)} />
      <label>Escolha a UF:</label>
      <Select options={ufOptions} onChange={e => handleUfChange(e)} />
      <label>Escolha a qualificação do proponente:</label>
      <Select options={proponenteOptions} onChange={e => handleProponenteOptions(e)} />
      <label>Digite o Código do órgão do programa:</label>
      <input value={codOrgPrograma} onChange={e => handleCodOrg(e)} />
      <br />
      <label>Digite o código do programa:</label>
      <input value={codPrograma} onChange={e => handleCodPrograma(e)} />
      <br />
      <label>Digite o ano:</label>
      <input value={anoDisponibilizacao} onChange={e => handleAno(e)} />
      <br />
      <Button type="submit" variant="danger" onClick={e => fetchConvenios(e)}>
        Consultar Despesas
      </Button>
    </div>
  );
    
}

export default Programas