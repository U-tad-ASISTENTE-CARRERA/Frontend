"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllRoadmaps } from '@/components/exploreRoadmaps/roadmapsData.js';
import { theme } from '@/constants/theme';
import LoadingModal from '@/components/LoadingModal';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function ExploreRoadmaps() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = () => {
      try {
        const data = getAllRoadmaps();
        setRoadmaps(data);
      } catch (error) {
        console.error("Error al cargar las especialidades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const filteredRoadmaps = useCallback(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (normalizedSearchTerm === '') return roadmaps;
    
    return roadmaps.filter(roadmap => {
      return roadmap.name ? roadmap.name.toLowerCase().includes(normalizedSearchTerm) : false;
    });
  }, [roadmaps, searchTerm]);

  const handleRoadmapClick = useCallback((roadmapId) => {
    router.push(`/exploreRoadmaps/${roadmapId}`);
  }, [router]);

  const filteredResults = filteredRoadmaps();

  if (loading) return <LoadingModal />;
  
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 shadow-text">
          Explorar Especialidades
        </h1>

        <div className="mb-8 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Buscar especialidad por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border rounded-full focus:outline-none focus:ring-2 transition-all duration-300"
            style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex, fontFamily: 'Montserrat', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
          />
          <FaSearch 
            className="absolute left-4 top-1/2 transform -translate-y-1/2" 
            style={{ color: theme.palette.gray.hex }} 
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <FaTimes 
                className="text-gray-400 hover:text-gray-600 transition-colors" 
              />
            </button>
          )}
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredResults.map((roadmap) => (
              <div
                key={roadmap.id}
                onClick={() => handleRoadmapClick(roadmap.id)}
                className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer hover:bg-opacity-100"
                style={{ fontFamily: 'Montserrat', borderLeft: `4px solid ${theme.palette.primary.hex}` }}
              >
                <div className="p-4">
                  <div className="mb-3 flex items-center">
                    <h2 className="font-semibold text-lg line-clamp-1" style={{ color: theme.palette.dark.hex }}>
                      {roadmap.name}
                    </h2>
                  </div>
                  
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: theme.palette.text.hex }}>
                    {roadmap.shortDescription || "Explora esta especialidad tecnológica"}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {roadmap.languages && roadmap.languages.slice(0, 3).map((lang, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: `${theme.palette.primary.hex}15`, color: theme.palette.primary.hex }}
                      >
                        {lang}
                      </span>
                    ))}
                    {roadmap.languages && roadmap.languages.length > 3 && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: `${theme.palette.gray.hex}15`, color: theme.palette.gray.hex }}
                      >
                        +{roadmap.languages.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
            <p className="text-lg text-gray-600" style={{ fontFamily: 'Montserrat' }}>
              No se encontraron especialidades que coincidan con "{searchTerm}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}