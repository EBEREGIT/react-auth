import react from  'react';
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";

const  Emendas = () =>{

    const fetchTest = () =>{
    
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
    

    return (
        <div className="text-center">     
    
          {/* displaying our message from our API call */}
          
          
          <Button type="submit" variant="danger" onClick={() => fetchTest()}>
            Consultar emendas
          </Button>
        </div>
      );
    
}

export default Emendas