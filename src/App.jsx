import React, { useState, useEffect } from 'react';
import { Avatar, Card, Dropdown, Navbar, Label, Select, TextInput, Button } from "flowbite-react";
import formulas from './data/formulas.json';
import features from './data/features.json';
import { FaRegSave } from "react-icons/fa";
import { LuCalculator } from "react-icons/lu";
export default function App() {
  const [selectedFormula, setSelectedFormula] = useState(formulas[0]);
  const [inputs, setInputs] = useState([]);
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [view, setView] = useState('calculadora'); // Estado para cambiar entre vistas

  // Filtrar los inputs basados en los IDs de los features que están en la fórmula seleccionada
  useEffect(() => {
    const formulaIds = selectedFormula.equation.match(/\b\w+\b/g); // Extraer los IDs de la fórmula
    const filteredInputs = features.filter(feature => formulaIds.includes(feature.id));
    setInputs(filteredInputs);
  }, [selectedFormula]);

  const handleFormulaChange = (e) => {
    const selectedFormula = formulas.find(formula => formula.name === e.target.value);
    setSelectedFormula(selectedFormula);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setValues({
      ...values,
      [id]: parseFloat(value) || 0 // Asegurarse de manejar los valores correctamente
    });
  };

  const handleCalculate = () => {
    try {
      // Evalúa la ecuación de la fórmula seleccionada
      const formula = selectedFormula.equation;
      const rawResult = new Function(
        ...inputs.map(input => input.id),
        `return ${formula}`
      )(...inputs.map(input => values[input.id]));
  
      // Limita el resultado a 4 decimales
      const formattedResult = parseFloat(rawResult.toFixed(4));
      setResult(formattedResult);
    } catch (error) {
      console.error("Error al calcular la fórmula:", error);
      setResult("Error en el cálculo");
    }
  };
  

  const handleSaveResult = () => {
    // Crear el objeto con la fórmula y los valores de los features
    console.log(selectedFormula,'selectedFormula')
    const resultData = {
      formula: {
        equation: selectedFormula.equation,
        name: selectedFormula.name,
        description: selectedFormula.description || '',
      },
      features: inputs.map(input => ({
        id: input.id,
        name: input.name,
        unitOfMeasureID: input.unitOfMeasureID,
        value: values[input.id]
      })),
      timestamp: new Date().toISOString()
    };

    // Obtener el array actual de resultados en sessionStorage, o crear uno si no existe
    const savedResults = JSON.parse(sessionStorage.getItem('results')) || [];
    
    // Agregar el nuevo resultado al array
    savedResults.push(resultData);
    
    // Guardar el array de resultados actualizado en sessionStorage
    sessionStorage.setItem('results', JSON.stringify(savedResults));
    
    alert('Resultado guardado');
  };

  const handleNavClick = (viewName) => {
    setView(viewName); // Cambia la vista según el enlace clickeado
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-gray-200">
      <div className="mt-16 w-5/6 flex justify-center">
        {/* Si el estado "view" es "calculadora", se muestra la calculadora, sino, se muestra los resultados */}
        {view === 'calculadora' ? (
          <Card className='max-w-[70rem]'>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Calculadora de carbono
            </h5>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
              Calcula el valor de la unidad, los descuentos, impuestos y más.
            </p>
            <div className="flex flex-col md:flex-row gap-6 w-full">
              {/* Lado izquierdo: Formulario */}
              <div className="flex-1">
                <div className="max-w-md mb-3">
                  <div className="mb-2 block">
                    <Label htmlFor="formula" value="Seleccionar una formula" />
                    <p className='text-gray-500 text-xs font-light'>{selectedFormula.description}</p>
                  </div>
                  <Select
                    id="formula"
                    required
                    value={selectedFormula.name}
                    onChange={handleFormulaChange}
                  >
                    {formulas.map((item) => (
                      <option key={item.name}>{item.name}</option>
                    ))}
                  </Select>
                </div>
                {inputs.map((item) => (
                  <div className="max-w-md mb-3" key={item.id}>
                    <div className="mb-2 block">
                      <Label htmlFor={item.id} value={`${item.name} (${item.unitOfMeasureID})`} />
                    </div>
                    <TextInput
                      id={item.id}
                      type="number"
                      sizing="md"
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
                <Button type="button" className="mt-4 w-full font-medium md:w-fit " onClick={handleCalculate}>
                    <LuCalculator className="h-5 w-5 mr-2"/>
                    Calcular
                </Button>

                {result !== null && (
                  <>
                    <div className="mt-4 text-2xl">
                      <p className="text-base text-gray-500 inline-block">Resultado</p>
                      <p className="font-bold">
                        {result} <span className="font-medium text-gray-500 text-sm">{selectedFormula.unitOfMeasureID}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      color="light"
                      className="mt-4 w-full md:w-fit"
                      onClick={handleSaveResult}
                    >
                      <FaRegSave className="h-5 w-5 mr-2" />
                      Guardar Resultado
                    </Button>
                  </>
                )}

              </div>
              {/* Lado derecho: Imagen */}
              <div className="flex-1 flex justify-center items-center">
                <img
                  src="/calculator-image.png"
                  alt="Calculator"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </Card>
        ) : (
          <div>
            {/* Lógica para mostrar los resultados guardados */}
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Resultados Guardados</h5>
            <div className="space-y-6">
              {/* Aquí va el componente para mostrar los resultados guardados */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
