"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { theme } from '@/constants/theme';
import { getRoadmapById } from '@/components/exploreRoadmaps/roadmapsData';
import LoadingModal from '@/components/LoadingModal';
import JobTrends from '@/components/exploreRoadmaps/JobTrends';
import SalaryComparison from '@/components/exploreRoadmaps/SalaryComparison';

const RoadmapDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProfile, setExpandedProfile] = useState(null);

  useEffect(() => {
    const loadRoadmap = () => {
      try {
        const data = getRoadmapById(params.id);
        if (data) {
          setRoadmap(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error cargando roadmap:", error);
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [params.id]);

  const toggleProfile = (index) => {
    if (expandedProfile === index) {
      setExpandedProfile(null);
    } else {
      setExpandedProfile(index);
    }
  };

  if (loading) {
    return <LoadingModal />;
  }

  if (!roadmap) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/fondo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Especialidad no encontrada</h2>
          <p className="mb-6">No se ha podido encontrar la información para esta especialidad.</p>
          <button 
            onClick={() => router.push('/exploreRoadmaps')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center mx-auto"
          >
            Volver a especialidades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-10"
      style={{ backgroundImage: "url('/assets/fondo.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed"}}
    >  
      <div className="container mx-auto py-4 px-4">        
        <div className="space-y-8">
          <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold" style={{ color: theme.palette.primary.hex }}> 
                {roadmap.name} 
              </h1>
              
              <button
                onClick={() => router.push(`/exploreRoadmaps`)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: theme.palette.primary.hex,
                  color: theme.palette.background.hex,
                  borderRadius: "0.375rem",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.palette.dark.hex}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.palette.primary.hex}
              >
                Volver
              </button>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-8"> {roadmap.description} </p>
            
            {roadmap.keySubjects && roadmap.keySubjects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ color: theme.palette.primary.hex }}>
                  Temas Clave
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmap.keySubjects.map((subject, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3"
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: theme.palette.primary.hex }}
                      ></div>
                      <span className="font-medium">{subject.name}</span>
                      {subject.difficulty && (
                        <span className="ml-auto text-sm text-gray-500">
                          Dificultad: {subject.difficulty}/5
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">  
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: theme.palette.primary.hex }}>
                    Lenguajes de Programación
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {roadmap.languages && roadmap.languages.map((language, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${theme.palette.primary.hex}15`,
                        color: theme.palette.primary.hex
                      }}
                    >
                      {language}
                    </div>
                  ))}
                  {!roadmap.languages || roadmap.languages.length === 0 && (
                    <p className="text-gray-500 italic">No hay información disponible</p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: theme.palette.primary.hex }}> Frameworks </h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {roadmap.tools && roadmap.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${theme.palette.primary.hex}15`,
                        color: theme.palette.primary.hex
                      }}
                    >
                      {typeof tool === 'object' ? tool.name : tool}
                    </div>
                  ))}
                  {!roadmap.tools || roadmap.tools.length === 0 && (
                    <p className="text-gray-500 italic">No hay información disponible</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.palette.primary.hex }}>
              Perfiles Profesionales
            </h2>

            <JobTrends roadmap={roadmap} />
            
            {roadmap.jobProfiles && roadmap.jobProfiles.length > 0 && (
              <div className="space-y-4">
                {roadmap.jobProfiles.map((profile, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg overflow-hidden shadow-sm transition-all duration-300"
                    style={{ 
                      borderColor: expandedProfile === index ? theme.palette.primary.hex : '#e5e7eb',
                      boxShadow: expandedProfile === index ? `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 3px ${theme.palette.primary.hex}25` : ''
                    }}
                  >
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleProfile(index)}
                      style={{ 
                        backgroundColor: expandedProfile === index ? `${theme.palette.primary.hex}10` : 'white'
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div>{profile.name}</div>
                        <div 
                          className={`px-2 py-1 text-xs rounded-full ${profile.growth === 'alto' || profile.growth === 'muy alto' ? 'bg-green-100 text-green-800' : profile.growth === 'moderado' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800' }`}
                        >
                          {profile.growth || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="mr-4 flex items-center" style={{ color: theme.palette.primary.hex }} >
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="h-2 rounded-full" style={{ width: `${profile.percentage}%`, backgroundColor: theme.palette.primary.hex }}></div>
                          </div>
                          <span className="text-sm font-medium">{profile.percentage}%</span>
                        </div>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 transition-transform duration-300 ${expandedProfile === index ? 'transform rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {expandedProfile === index && (
                      <div className="px-4 py-5 bg-gray-50 border-t"> 
                        <p className="text-gray-600"> {profile.description || "..."} </p>                          
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <SalaryComparison roadmapId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;