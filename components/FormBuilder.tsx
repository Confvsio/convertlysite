'use client';

import React, { useState, KeyboardEvent } from 'react';

const questions = [
  { id: 1, text: "Quel est ton prénom ?", type: "short_text" },
  { id: 2, text: "Quel âge as-tu ?", type: "number" },
  { id: 3, text: "Quel est ton niveau d'étude ?", type: "short_text" },
  { id: 4, text: "Pourquoi souhaites-tu rejoindre le serveur ?", type: "long_text" },
  { id: 5, text: "Quel est ton why (ton pourquoi) ?", type: "long_text" },
  { id: 6, text: "Depuis combien de temps es-tu dans le développement personnel/entrepreneuriat ?", type: "short_text" },
  { id: 7, text: "Quels sont tes accomplissements ?", type: "long_text" },
  { id: 8, text: "Dans quel domaine souhaites-tu te lancer ou dans quel business es-tu ?", type: "short_text" },
  { id: 9, text: "Quels sont tes objectifs pour l'avenir ?", type: "long_text" },
  { id: 10, text: "Quelles sont les étapes que tu envisages pour réaliser ton projet ?", type: "long_text" },
  { id: 11, text: "Quel est ton identifiant Discord ?", type: "short_text" },
];

const FormBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData[questions[currentStep].id]) {
      newErrors[questions[currentStep].id] = "Ce champ est obligatoire";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm()) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        try {
          const response = await fetch('https://formspree.io/f/mkgwkjyd', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            setIsSubmitted(true);
            setFormData({});
          } else {
            console.error('Form submission failed');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (questions[currentStep].type === 'long_text' && value.length <= 250) {
      setFormData({ ...formData, [questions[currentStep].id]: value });
    } else if (questions[currentStep].type !== 'long_text') {
      setFormData({ ...formData, [questions[currentStep].id]: value });
    }
    setErrors({ ...errors, [questions[currentStep].id]: '' });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && questions[currentStep].type !== 'long_text') {
      e.preventDefault();
      handleNext();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white animated-bg">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Merci pour ta candidature !</h2>
          <p className="text-xl">Nous l'examinerons avec attention et te recontacterons bientôt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white animated-bg">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Formulaire d'inscription pour Lvl'Up</h1>
      <div className="w-full max-w-2xl px-4 md:px-0">
        <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 shadow-lg overflow-hidden form-container">
          <div className="sliding-border"></div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6">{questions[currentStep].text}</h2>
          {questions[currentStep].type === 'long_text' ? (
            <div>
              <textarea
                className="w-full p-4 bg-transparent border-2 border-white rounded-lg focus:outline-none focus:border-purple-300 text-lg md:text-xl transition-all duration-300 ease-in-out placeholder-purple-200 resize-none"
                rows={4}
                onChange={handleInputChange}
                value={formData[questions[currentStep].id] || ''}
                placeholder="Tape ta réponse ici..."
                maxLength={250}
              />
              <p className="text-right text-sm mt-2">
                {(formData[questions[currentStep].id]?.length || 0)}/250 caractères
              </p>
            </div>
          ) : (
            <input
              type={questions[currentStep].type === 'number' ? 'text' : 'text'}
              className="w-full p-4 bg-transparent border-b-2 border-white focus:outline-none focus:border-purple-300 text-lg md:text-xl transition-all duration-300 ease-in-out placeholder-purple-200"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={formData[questions[currentStep].id] || ''}
              placeholder="Tape ta réponse ici..."
            />
          )}
          {errors[questions[currentStep].id] && (
            <p className="text-red-300 mt-2">{errors[questions[currentStep].id]}</p>
          )}
          <div className="mt-8 flex justify-between items-center">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="px-4 md:px-6 py-2 rounded-full text-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              disabled={currentStep === 0}
            >
              Précédent
            </button>
            <span className="text-lg">{currentStep + 1} / {questions.length}</span>
            <button 
              onClick={handleNext}
              className="px-4 md:px-6 py-2 rounded-full bg-white text-purple-600 hover:bg-purple-100 transition-all duration-200"
            >
              {currentStep === questions.length - 1 ? 'Soumettre' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animated-bg {
          background: linear-gradient(-45deg, #0b0b30, #1a0f3d, #2e1065, #4c1d95);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .form-container {
          position: relative;
        }
        .sliding-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        .sliding-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid white;
          border-radius: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .form-container:hover .sliding-border::before {
          opacity: 1;
          animation: slide 6s linear infinite; /* Slower animation */
        }
        @keyframes slide {
          0% {
            clip-path: inset(0 100% 100% 0);
          }
          25% {
            clip-path: inset(0 0 100% 0);
          }
          50% {
            clip-path: inset(0 0 0 100%);
          }
          75% {
            clip-path: inset(100% 0 0 0);
          }
          100% {
            clip-path: inset(0 100% 100% 0);
          }
        }
      `}</style>
    </div>
  );
};

export default FormBuilder;