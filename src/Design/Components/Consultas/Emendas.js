import react , {useState} from  'react';
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import dataSiafi from './../../../Utils/orgaosSiafi.json';

const  Emendas = () =>{
  //  http://localhost:4000/emendas?ano=2014&cidade=SAO%20MATEUS%20DO%20SUL&valorEmpenhado_min=10000&valorEmpenhado_max=50000&valorLiquidado_min=0&valorLiquidado_max=10000&valorPago_min=0&valorPago_max=5000&valorRestoInscrito_min=0&valorRestoInscrito_max=10000&valorRestoCancelado_min=0&valorRestoCancelado_max=10000&valorRestoPago_min=0&valorRestoPago_max=5000
  const [ano, setAno] =  useState();
  const [cidade, setCidade] =  useState();
  const [valorEmpenhado_min, setValorEmpenhado_min] =  useState(0);
  const [valorEmpenhado_max, setValorEmpenhado_max] =  useState(0);
  const [valorLiquidado_min, setValorLiquidado_min] =  useState(0);
  const [valorLiquidado_max, setValorLiquidado_max] =  useState(0);
  const [valorPago_min, setValorPago_min] =  useState(0);
  const [valorPago_max, setValorPago_max] =  useState(0);
  const [valorRestoInscrito_min, setValorRestoInscrito_min] =  useState(0);
  const [valorRestoInscrito_max, setValorRestoInscrito_max] =  useState(0);
  const [valorRestoCancelado_min, setValorRestoCancelado_min] =  useState(0);
  const [valorRestoCancelado_max, setValorRestoCancelado_max] =  useState(0);
  const [valorRestoPago_min, setValorRestoPago_min] =  useState(0);
  const [valorRestoPago_max, setValorRestoPago_max] =  useState(0);
  

  


    const fetchTest = async() =>{
    
//url exemplo : http://localhost:4000/emendas?ano=2014&cidade=SAO%20MATEUS%20DO%20SUL&valorEmpenhado_min=10000&valorEmpenhado_max=50000&valorLiquidado_min=0&valorLiquidado_max=10000&valorPago_min=0&valorPago_max=5000&valorRestoInscrito_min=0&valorRestoInscrito_max=10000&valorRestoCancelado_min=0&valorRestoCancelado_max=10000&valorRestoPago_min=0&valorRestoPago_max=5000
      const response = await axios.get('https://api.portaldatransparencia.gov.br/api-de-dados/emendas', {
        params: {
          'ano': '2000',
          'pagina': '1'
        },
        headers: {
          'accept': '*/*',
          'chave-api-dados': 'cf113c73ed26bc6783e7448d0d018ba6'
        }
      });
      console.log(response.data);
      debugger;
      }
      const handleAno = (e) =>{
        setAno(e.currentTarget.value)
      }
    

    return (
        <div className="text-center">     
    
          {/* displaying our message from our API call */}
          
          <label>Digite o ano:</label>
          <input value={ano} onChange={e => handleAno(e)} />
          
          <Button type="submit" variant="danger" onClick={() => fetchTest()}>
            Consultar emendas
          </Button>
        </div>
      );
    
}

export default Emendas