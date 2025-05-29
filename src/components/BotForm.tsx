import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import '../styles/BotForm.css';

interface BotFormProps {
  onSubmit: (formData: BotFormData) => void;
  onStop: () => void;
  savedData: BotFormData | null;
  isProcessing: boolean;
  stats: {
    premium: number;
    declined: number;
    threeDSecure: number;
  };
}

export interface BotFormData {
  bin: string;
  mes: string;
  ano: string;
  cvv: string;
}

export const BotForm: React.FC<BotFormProps> = ({ onSubmit, onStop, savedData, isProcessing, stats }) => {
  const [formData, setFormData] = useState<BotFormData>({
    bin: '',
    mes: '',
    ano: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (savedData) {
      setFormData(savedData);
    }
  }, [savedData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    let validatedValue = value;
    
    if (id === 'bin') {
      validatedValue = value
        .replace(/[^0-9xX]/g, '') 
        .toLowerCase()              
        .substring(0, 16);           
    } else if (id === 'mes') {
      validatedValue = value.replace(/[^\d]/g, '').substring(0, 2);
      
      const month = parseInt(validatedValue);
      if (validatedValue.length === 2 && (month < 1 || month > 12)) {
        setErrors(prev => ({ ...prev, mes: 'Month must be between 01-12' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.mes;
          return newErrors;
        });
      }
    } else if (id === 'ano') {
      validatedValue = value.replace(/[^\d]/g, '').substring(0, 4);
      
      const year = parseInt(validatedValue);
      const currentYear = new Date().getFullYear();
      if (validatedValue.length === 4 && year < currentYear) {
        setErrors(prev => ({ ...prev, ano: 'Year must be current or future' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.ano;
          return newErrors;
        });
      }
    } else if (id === 'cvv') {
      validatedValue = value.replace(/[^\d]/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: validatedValue
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.mes.length !== 2) {
      newErrors.mes = 'Month must be 2 digits (MM)';
    }
    
    if (formData.ano.length !== 4) {
      newErrors.ano = 'Year must be 4 digits (YYYY)';
    }
    
    if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const maskContent = (content: string) => {
    return showContent ? content : content.replace(/./g, '*');
  };

  return (
    <div className="bot-form-container">
      <div className="form-header">
        <h2>Bot Interfaz</h2>
        <div className="status-indicator">
          {isProcessing ? (
            <>
              <span className="status-dot processing"></span>
              <span>PROCESANDO...</span>
            </>
          ) : (
            <>
              <span className="status-dot ready"></span>
              <span>ACTIVO</span>
            </>
          )}
        </div>
      </div>
      
      <form id="bot-form" onSubmit={handleSubmit}>
        <div className={`field ${errors.bin ? 'error' : ''}`}>
          <label htmlFor="bin">
            BIN
            <button
              type="button"
              className="visibility-toggle"
              onClick={() => setShowContent(!showContent)}
            >
              {showContent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {errors.bin && <span className="error-message">{errors.bin}</span>}
          </label>
          <input 
            id="bin" 
            value={maskContent(formData.bin)}
            onChange={handleChange}
            placeholder="123412341234xxxx" 
            disabled={isProcessing}
          />
        </div>
        
        <div className={`field ${errors.mes ? 'error' : ''}`}>
          <label htmlFor="mes">
            MES (MM)
            {errors.mes && <span className="error-message">{errors.mes}</span>}
          </label>
          <input 
            id="mes" 
            value={maskContent(formData.mes)}
            onChange={handleChange}
            placeholder="09" 
            disabled={isProcessing}
          />
        </div>
        
        <div className={`field ${errors.ano ? 'error' : ''}`}>
          <label htmlFor="ano">
            AÑO (YYYY)
            {errors.ano && <span className="error-message">{errors.ano}</span>}
          </label>
          <input 
            id="ano" 
            value={maskContent(formData.ano)}
            onChange={handleChange}
            placeholder="2027" 
            disabled={isProcessing}
          />
        </div>
        
        <div className={`field ${errors.cvv ? 'error' : ''}`}>
          <label htmlFor="cvv">
            CVV
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </label>
          <input 
            id="cvv" 
            value={maskContent(formData.cvv)}
            onChange={handleChange}
            placeholder="123" 
            disabled={isProcessing}
          />
        </div>
        
        <div className="button-group">
          <Button 
            type="submit" 
            loading={isProcessing}
            disabled={isProcessing || Object.keys(errors).length > 0}
          >
            {isProcessing ? 'PROCESANDO...' : 'Iniciar Bot'}
          </Button>
          
          {isProcessing && (
            <Button 
              type="button"
              variant="danger"
              onClick={onStop}
            >
              Stop Bot
            </Button>
          )}
        </div>

        <div className="stats-row">
          <div className="stat-item premium">
            <span className="stat-label">Premium:</span>
            <span className="stat-value">{stats.premium}</span>
          </div>
          <div className="stat-item declined">
            <span className="stat-label">Declined:</span>
            <span className="stat-value">{stats.declined}</span>
          </div>
          <div className="stat-item three-d">
            <span className="stat-label">Count:</span>
            <span className="stat-value">{stats.threeDSecure}</span>
          </div>
        </div>
      </form>
    </div>
  );
};