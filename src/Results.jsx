import React, { useState, useEffect } from 'react';

export default function Results() {
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    // Obtener los resultados guardados en sessionStorage
    const results = JSON.parse(sessionStorage.getItem('results')) || [];
    console.log(results, 'results');
    setSavedResults(results);
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-gray-200">
      <div className="mt-16 w-5/6">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Resultados Guardados
        </h5>
        <div className="space-y-6">
          {savedResults.length > 0 ? (
            savedResults.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
                <h6 className="text-xl font-semibold mb-1">{result.formula.name}</h6>
                {result.timestamp && (
                  <p className="text-xs text-gray-500">
                    {formatDate(result.timestamp)}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">{result.formula.description}</p>
                <div className="mt-4">
                  <h6 className="font-semibold">Features:</h6>
                  <ul className="list-disc pl-5">
                    {result.features.map((feature, idx) => (
                      <li key={idx} className="text-sm">
                        <strong>{feature.name}:</strong> {feature.value} {feature.unitOfMeasureID}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No hay resultados guardados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
