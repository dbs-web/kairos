import React from 'react'
import './App.css'
import CandidateForm from './CandidateForm'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Análise Política João Santana</h1>
        <p>Formulário de Coleta de Dados para Análise Estratégica</p>
      </header>
      <main>
        <CandidateForm />
      </main>
    </div>
  )
}

export default App