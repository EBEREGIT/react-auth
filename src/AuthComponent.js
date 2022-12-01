import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Select from 'react-select';
import axios from "axios";
import Cookies from "universal-cookie";
import Convenios from "./Design/Components/Consultas/Convenios";
import Programas from "./Design/Components/Consultas/Programas";
import Orgaos from "./Design/Components/Consultas/Orgaos";
import Emendas from "./Design/Components/Consultas/Emendas"
const cookies = new Cookies();


// get token generated on login
const token = cookies.get("TOKEN");

export default function AuthComponent() {
  // set an initial state for the message we will receive after the API call
  const [message, setMessage] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState('');
  const tiposConsulta  = [
    {
      "Convenios": {
        "Descricao": "Convenios"
      }
    },
    {
      "Orgaos":{
        "Descricao": "Orgaos"
      }
    },
    {
      "Despesas": {
        "Descricao": "Despesas"
      }
    },
    {
      "Emendas": {
        "Descricao": "Emendas"
      }
    }
  ]
  // useEffect automatically executes once the page is fully loaded
  useEffect(() => {
    
  }, []);

  // logout
  const logout = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }

  
  const optionsConsulta = [
    { value: 'Convenios', label: 'Convênios do Poder Executivo Federal' },
    { value: 'Programas', label: 'Programas' },
    { value: 'Emendas', label: 'Emendas parlamentares' },
    { value: 'Orgaos', label: 'Órgãos' },
  ]
  const handleOptionsConsulta =(e)=>{
    setTipoConsulta(e.value);
  }

  
 
  return (
    <div className="text-center">     

      {/* displaying our message from our API call */}
      
      <Select placeholder={"Escolha um tipo de Consulta"} options={optionsConsulta} onChange={e => handleOptionsConsulta(e)} onClick={e => handleOptionsConsulta(e)}/>
      { tipoConsulta === "Convenios" &&<Convenios />}
      { tipoConsulta === "Programas" &&<Programas />}
      { tipoConsulta === "Emendas" &&<Emendas />}
      { tipoConsulta === "Orgaos" &&<Orgaos />}
      {/* logout */}
      <br/><br/><br/><br/><br/><br/><br/><br/>
      <Button type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
