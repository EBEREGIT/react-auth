import react, { useEffect, useState } from  'react';
import { utils, writeFileXLSX } from 'xlsx';
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import ufList from './../../../Utils/ufs.json';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import Timbradosuperior from '../../../assets/cabecalhobase64.txt';
import Timbradoinferior from '../../../assets/rodapebase64.txt';
const  Programas = () =>{

  
  const [anoDisponibilizacao, setAnoDisponibilizacao] = useState("");
  const [sitPrograma, setSitPrograma] = useState("");
  const [uf, setUf] = useState("");
  const [headerFooter, setHeaderFooter] = useState("");
  const [ufFetched, setUfFetched] = useState(false);
  const [ufOptions, setUfOptions] = useState([]);


  const situationOptions = [
    {value: "DISPONIBILIZADO", label: "Disponibilizado"},
    {value: "INATIVO", label: "Inativo"},
    {value: "CADASTRADO", label: "Cadastrado"},
  ]

  const handleAno = (e) =>{
    setAnoDisponibilizacao(e.currentTarget.value)
  }


  const handleSituation = (e) => {
    setSitPrograma(e.value)
  }

  const handleUfChange = (e) => {
    setUf(e.value)
  }

  const handleHeaderFooterChange = (event) => {
    setHeaderFooter(event.target.value);
  };

  const fetchProgramas = (e) =>{
    const option = e.currentTarget.id;
    const urlBase = process.env.REACT_APP_URL_BASE;
    const configuration = {
      method: "get",
      url: `https://nervous-pink-sunglasses.cyclic.app/programas/${anoDisponibilizacao}/${sitPrograma}/${uf}/`,
    };
    console.log(configuration);
    axios(configuration)
      .then((result) => {
        console.log(result);
        if(option === "pdfButton"){
          printProgramas(result.data)
        }
        if(option === "xlsxButton"){
          gerarXlsx(result.data)
        }
        
      })
      .catch((error) => {
        error = new Error();
      });
  }

  const printProgramas = async(json) => {
    const programasData = json.data;

    const cabecalhoTxt =  await fetch(Timbradosuperior)
      .then(response => response.text())
      .then(text => {return text;});
    var cabecalhoBase64 = `data:image/png;base64,` + cabecalhoTxt;
    const rodapeTxt =  await fetch(Timbradoinferior)
      .then(response => response.text())
      .then(text => {return text;});
    var rodapeBase64 = `data:image/png;base64,` + rodapeTxt;
    const pdf = new jsPDF("l", "pt", "a3");

    const columns = [
      "Dados do programa",
      "Dados do órgão",
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
        `${programasData[i].CodPrograma}  
        ${programasData[i].NomePrograma} `,
        `${programasData[i].CodOrgaoSupPrograma} 
        ${programasData[i].DescOrgaoSupPrograma}`, 
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
    if(headerFooter === "true"){
      pdf.addImage(cabecalhoBase64, 'JPEG', 0, 2, 1200, 100);
      pdf.autoTable(columns, rows,{
        cellWidth: "wrap",  
        startY: 130
      });
      const addFooters = doc => {
        const pageCount = doc.internal.getNumberOfPages()
        console.log(pageCount);
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.addImage(rodapeBase64, 'JPEG', 950, 792, 240, 52);
        }
      };
      addFooters(pdf);
    }else if(headerFooter === "false"){
      pdf.autoTable(columns, rows,{
        cellWidth: "wrap",  
        startY: 20
      });
    }
    
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

  const gerarXlsx = (data) =>{
    console.log(data);
    const ws = utils.json_to_sheet(data.data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "programas.xlsx");
  }
    

  return (
    <div className="text-center">     
      <label>Escolha a situação:</label>
      <Select options={situationOptions} onChange={e => handleSituation(e)} />
      <label>Escolha a UF:</label>
      <Select options={ufOptions} onChange={e => handleUfChange(e)} />     
      <label>Digite o ano:</label>
      <input value={anoDisponibilizacao} onChange={e => handleAno(e)} />
      <br />
      {(anoDisponibilizacao > 1990) &&
      <div>
        <Button id="pdfButton" type="submit" variant="danger" onClick={e => fetchProgramas(e)}>
        Gerar pdf
        </Button>
        <div>
      <label>
        <input
          type="radio"
          value="true"
          checked={headerFooter === "true"}
          onChange={handleHeaderFooterChange}
        />
        Adicionar cabeçalho e rodapé
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="false"
          checked={headerFooter === "false"}
          onChange={handleHeaderFooterChange}
        />
        Remover cabeçalho e rodapé
      </label>
    </div>
        <Button id="xlsxButton" type="submit" variant="success" onClick={e => fetchProgramas(e)}>
          Gerar xlsx
        </Button>
      </div>
      }
      
    </div>
  );
    
}

export default Programas