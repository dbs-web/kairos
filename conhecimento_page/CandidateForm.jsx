import React, { useState } from 'react'
import './CandidateForm.css'

const CandidateForm = () => {
  const [activeTab, setActiveTab] = useState('candidato')
  const [formData, setFormData] = useState({
    // Dados básicos do candidato
    fullName: '',
    urnName: '',
    age: '',
    birthPlace: '',
    maritalStatus: '',
    education: '',
    currentProfession: '',
    previousProfession: '',
    hobbies: '',
    favoriteTeam: '',
    religion: '',

    // Histórico político
    partyAffiliation: '',
    partyHistory: '',
    politicalExperienceYears: '',
    previousPositions: '',
    mainAchievements: '',
    mainProjects: '',
    governmentVision: '',
    candidateNumber: '',
    previousSlogans: '',
    politicalMentorsAllies: '',

    // Características pessoais
    strengths: '',
    weaknesses: '',
    familyStructure: '',
    familyRelevancePublicImage: '',
    lifeStory: '',
    personalValues: '',
    politicalMotivations: '',
    electorateConnection: '',
    currentPublicPerception: '',
    positiveAssociations: '',
    negativeAssociations: '',
    mediaMentionsSummary: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const tabs = [
    { id: 'candidato', label: 'Candidato', icon: '👤' },
    { id: 'comunicacao', label: 'Comunicação', icon: '📢' },
    { id: 'trajetoria', label: 'Trajetória', icon: '📈' },
    { id: 'plataforma', label: 'Plataforma', icon: '📋' },
    { id: 'eleitorado', label: 'Eleitorado', icon: '👥' },
    { id: 'cenario', label: 'Cenário', icon: '🗺️' },
    { id: 'vulnerabilidades', label: 'Vulnerabilidades', icon: '⚠️' }
  ]

  const renderCandidatoTab = () => (
    <div className="form-section">
      <h3>Dados Pessoais Básicos</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="fullName">Nome Completo *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="urnName">Nome de Urna</label>
          <input
            type="text"
            id="urnName"
            name="urnName"
            value={formData.urnName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Idade</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthPlace">Local de Nascimento</label>
          <input
            type="text"
            id="birthPlace"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maritalStatus">Estado Civil</label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
          >
            <option value="">Selecione...</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viúvo(a)</option>
            <option value="uniao_estavel">União Estável</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="religion">Religião</label>
          <input
            type="text"
            id="religion"
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3>Formação e Profissão</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="education">Formação Acadêmica</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentProfession">Profissão Atual</label>
          <input
            type="text"
            id="currentProfession"
            name="currentProfession"
            value={formData.currentProfession}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="previousProfession">Profissão Anterior</label>
          <input
            type="text"
            id="previousProfession"
            name="previousProfession"
            value={formData.previousProfession}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3>Interesses Pessoais</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="hobbies">Hobbies e Interesses</label>
          <textarea
            id="hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="favoriteTeam">Time de Futebol</label>
          <input
            type="text"
            id="favoriteTeam"
            name="favoriteTeam"
            value={formData.favoriteTeam}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )

  const renderOtherTabs = () => (
    <div className="form-section">
      <div className="placeholder-content">
        <h3>Seção em Desenvolvimento</h3>
        <p>Esta seção será implementada com os formulários específicos para:</p>
        <ul>
          <li>Comunicação e Imagem Pública</li>
          <li>Trajetória Política e Legado</li>
          <li>Plataforma e Posicionamentos</li>
          <li>Dados Eleitorais e Opinião Pública</li>
          <li>Análise do Ecossistema Político</li>
          <li>Vulnerabilidades e Pontos de Crise</li>
        </ul>
        <p>Por enquanto, você pode testar a seção "Candidato" que está funcional.</p>
      </div>
    </div>
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    alert('Dados salvos! Verifique o console para ver os dados.')
  }

  return (
    <div className="candidate-form">
      <div className="form-header">
        <h2>Formulário de Análise Política</h2>
        <p>Preencha as informações do candidato para análise estratégica</p>
      </div>

      <div className="form-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {activeTab === 'candidato' ? renderCandidatoTab() : renderOtherTabs()}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Salvar Dados
          </button>
          <button type="button" className="preview-button">
            Visualizar Dados
          </button>
        </div>
      </form>
    </div>
  )
}

export default CandidateForm