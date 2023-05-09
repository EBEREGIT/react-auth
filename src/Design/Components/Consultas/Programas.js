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
  const [removeEncerrados, setRemoveEncerrados] = useState("");


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

  const handleRemoveEncerradosChange = (event) => {
    setRemoveEncerrados(event.target.value);
  };

  const fetchProgramas = (e) =>{
    const option = e.currentTarget.id;
    const urlBase = process.env.REACT_APP_URL_BASE;
    const configuration = {
      method: "get",
      url: `https://nervous-pink-sunglasses.cyclic.app/programas/${anoDisponibilizacao}/${sitPrograma}/${uf}/`,
    };
    axios(configuration)
      .then((result) => {
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
  const dataPicker = (dateArrIni, dateArrFim) =>{
    let returnArr = [];

    for (let i = 0; i < dateArrFim.length; i++){
      if(dateArrFim[i] != null){
        returnArr.push(dateArrFim[i])
      }
    }
    for (let i = 0; i < dateArrIni.length; i++){
      if(dateArrIni[i] != null){
        returnArr.push(dateArrIni[i])
      }
    }
    if(dateArrIni[0]!= null){
      returnArr.push("Proposta voluntária");
    }
    if(dateArrIni[1] != null){
      returnArr.push("Emenda parlamentar");
    }
    if(dateArrIni[2] != null){
      returnArr.push("Proponente específico");
    }
    return returnArr;
  }
  const datafix = (anomesdia) =>{
    if(anomesdia){
      const splittedData = anomesdia.split('/'); 
      const fixedArr = splittedData.reverse();
      const retData = fixedArr.join("/");
      return retData;
    }else{
      return "-";
    }
  }

  const printProgramas = async(json) => {
    const addDatetime = doc => {
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text(dataApenas + ", às " + horarioApenas, 20, 830, {
          align: 'left'
        });
      }
    };
    const programasData = json.data;
    const dataApenas =  new Date().toLocaleDateString('pt-BR');
    const horarioApenas = new Date().toLocaleTimeString('en-US', { hour12: false, 
      hour: "numeric", 
      minute: "numeric"});
    const dataArr = dataApenas.split('/');
    const horarioArr = horarioApenas.split(':');
    let namefile = `${uf}_${dataArr[2]}-${dataArr[1]}-${dataArr[0]}-${horarioArr[0]}\\${horarioArr[1]}`;
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
      "Abertura",
      "Fechamento",
      "Tipo",
      "Modalidade do programa",
      "Natureza jurídica do programa",
      "Ação orçamentária",
      "UF"
    ];
    var rows = [];
    for (let i = 0; i < programasData.length; i++) {
      const datasETipo = dataPicker([
        programasData[i].DT_PROG_INI_RECEB_PROP,
        programasData[i].DT_PROG_INI_EMENDA_PAR,
        programasData[i].DT_PROG_INI_BENEF_ESP],
        [programasData[i].DT_PROG_FIM_RECEB_PROP,
        programasData[i].DT_PROG_FIM_EMENDA_PAR,
        programasData[i].DT_PROG_FIM_BENEF_ESP,
      ]);
      const  fixacao = (acao) =>{
        try{
          let orc = String(acao)
          orc = orc.slice(-4);
          return orc;
        }
        catch(e){
          console.log(e);
        }

      }
      var temp = [
        `${programasData[i].COD_PROGRAMA}  
        ${programasData[i].NOME_PROGRAMA} `,
        `${programasData[i].COD_ORGAO_SUP_PROGRAMA} 
        ${programasData[i].DESC_ORGAO_SUP_PROGRAMA}`, 
        programasData[i].DATA_DISPONIBILIZACAO,
        datafix(datasETipo[1]),
        datafix(datasETipo[0]),
        datasETipo[2],
        programasData[i].MODALIDADE_PROGRAMA,
        programasData[i].NATUREZA_JURIDICA_PROGRAMA,
        fixacao(programasData[i].ACAO_ORCAMENTARIA),
        programasData[i].UF_PROGRAMA
      ];
      if(removeEncerrados == "true"){
        var today = new Date();
        var dateProg = new Date(datasETipo[0]);
        if (dateProg > today) {
          rows.push(temp);
        } else if (dateProg < today) {
          console.log(`Programa ${programasData[i].COD_PROGRAMA}${programasData[i].NOME_PROGRAMA} não está mais disponível. vencido em ${datafix(datasETipo[0])}`);
        } else {
 
        }
      }else{
        rows.push(temp);
      }
      
    }
    if(headerFooter === "true"){
      pdf.addImage(cabecalhoBase64, 'JPEG', 0, 2, 1200, 100);
      pdf.autoTable(columns, rows,{
        cellWidth: "wrap",  
        startY: 130,
        columnStyles: {
          0: {halign: 'center'},
          1: {halign: 'center'},
          2: {halign: 'center'},
          3: {halign: 'center'},
          4: {halign: 'center'},
          5: {halign: 'center'},
          6: {halign: 'center'},
          7: {halign: 'center'},
          8: {halign: 'center'},
          9: {halign: 'center'},
          10: {halign: 'center'},
          11: {halign: 'center'},
          
        } ,
      });
      const addFooters = doc => {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.addImage(rodapeBase64, 'JPEG', 950, 792, 240, 52);
        }
      };      
      addFooters(pdf);
    }else if((headerFooter === "false")||(headerFooter === "")){
      pdf.autoTable(columns, rows,{
        cellWidth: "wrap",  
        startY: 20,
        headStyles:{
          valign: 'middle',
          halign : 'center'
        },
        columnStyles: {
          0: {halign: 'center', valign: 'middle',},
          1: {halign: 'center', valign: 'middle',},
          2: {halign: 'center', valign: 'middle',},
          3: {halign: 'center', valign: 'middle',},
          4: {halign: 'center', valign: 'middle',},
          5: {halign: 'center', valign: 'middle',},
          6: {halign: 'center', valign: 'middle',},
          7: {halign: 'center', valign: 'middle',},
          8: {halign: 'center', valign: 'middle',},
          9: {halign: 'center', valign: 'middle',},
          10: {halign: 'center', valign: 'middle',},
          11: {halign: 'center', valign: 'middle',},
        } , 
      });
    }
    addDatetime(pdf);
    console.log(pdf.output("data out"));

    pdf.save(namefile);
  };
 
  useEffect(() => {
    if(!ufFetched){
      const options = ufList.map(estado => ({value: estado.sigla, label: estado.Estado}))
      setUfOptions(options)
      setUfFetched(true)
    }   
  })

  const gerarXlsx = (data) =>{
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
              value={true}
              checked={headerFooter === "true"}
              onChange={handleHeaderFooterChange}
            />
            Adicionar cabeçalho e rodapé
          </label>
          <br />
          <label>
            <input
              type="radio"
              value={false}
              checked={headerFooter === "false"}
              onChange={handleHeaderFooterChange}
            />
            Remover cabeçalho e rodapé
          </label>
        </div>
        <hr />
        <div>
          <label>
            <input
              type="radio"
              value={true}
              checked={removeEncerrados === "true"}
              onChange={handleRemoveEncerradosChange}
            />
            Remover programas com prazo encerrado
          </label>
          <br />
          <label>
            <input
              type="radio"
              value={false}
              checked={removeEncerrados === "false"}
              onChange={handleRemoveEncerradosChange}
            />
            Manter programas com prazo encerrado
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