import React, { useState } from "react";
import { theme } from "@/constants/theme";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaTrash,
  FaTrashAlt,
  FaCheck,
  FaHourglassHalf,
  FaStar,
  FaStarHalfAlt,
  FaStar as FaStarSolid,
  FaTimes,
  FaBriefcase,
  FaBriefcaseClock,
  FaGraduationCap,
  FaTag,
  FaCalendarAlt,
  FaEye
} from "react-icons/fa";

const JobOfferCard = ({ 
  offer, 
  isFavorite, 
  toggleFavorite,
  handleOfferClick,
  deleteJobOffer,
  saving,
  isFavoriteCard = false,
  userEligibility 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    if (typeof deleteJobOffer !== 'function') {
      console.error("deleteJobOffer function is not defined or not a function");
      return;
    }

    if (!offer || !offer.url) {
      console.error("Cannot delete: offer or offer.url is missing");
      return;
    }

    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteJobOffer(offer.url);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting job offer:", error);
      alert("No se pudo eliminar la oferta. Por favor, inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const isRecent = () => {
    if (!offer.date) return false;
    const offerDate = new Date(offer.date);
    const now = new Date();
    const diffTime = Math.abs(now - offerDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const getJobTypeInfo = () => {
    switch (offer.jobType) {
      case "I":
        return { icon: <FaGraduationCap className="mr-1" />, text: "Prácticas", color: theme.palette.accent.hex };
      case "F":
        return { icon: <FaBriefcase className="mr-1" />, text: "Tiempo completo", color: theme.palette.primary.hex };
      case "P":
        return { icon: <FaBriefcaseClock className="mr-1" />, text: "Tiempo parcial", color: theme.palette.complementary.hex };
      default:
        return { icon: <FaBriefcase className="mr-1" />, text: "Empleo", color: theme.palette.dark.hex };
    }
  };

  const jobTypeInfo = getJobTypeInfo();

  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => handleOfferClick(e, offer.title, offer.source)}
      className="block transition-all duration-200 bg-white border rounded-lg overflow-hidden hover:shadow-lg transform hover:-translate-y-1"
      style={{ borderColor: theme.palette.lightGray.hex, borderLeft: `4px solid ${jobTypeInfo.color}` }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1" style={{ color: theme.palette.text.hex }}>{offer.title}</h3>
            <div className="flex items-center text-sm mb-2" style={{ color: theme.palette.gray.hex }}>
              {offer.company && (
                <span className="mr-3 flex items-center">
                  <FaBuilding className="mr-1" /> {offer.company}
                </span>
              )}
              {offer.location && (
                <span className="mr-3 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> {offer.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex ml-2">
            {isFavoriteCard && deleteJobOffer && (
              <button
                onClick={handleDelete}
                className={`p-2 text-lg ml-1 rounded-full transition-colors ${showDeleteConfirm ? 'bg-red-100' : 'hover:bg-red-50'}`}
                disabled={isDeleting}
                aria-label="Eliminar oferta"
              >
                {isDeleting ? (
                  <FaHourglassHalf className="animate-pulse" />
                ) : showDeleteConfirm ? (
                  <FaTrash className="text-red-600" />
                ) : (
                  <FaTrashAlt />
                )}
              </button>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(offer);
              }}
              disabled={saving}
              className="p-2 text-xl rounded-full transition-colors hover:bg-yellow-50"
              aria-label={isFavorite && typeof isFavorite === 'function' && isFavorite(offer.url) ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {saving ? (
                <FaHourglassHalf className="animate-pulse" />
              ) : (isFavorite && typeof isFavorite === 'function' && isFavorite(offer.url)) || isFavoriteCard ? (
                <FaStarSolid style={{ color: theme.palette.warning.hex }} />
              ) : (
                <FaStar style={{ color: theme.palette.gray.hex }} />
              )}
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="mt-2 mb-2 p-2 rounded bg-red-50 text-sm">
            <p className="text-red-700 mb-2">¿Eliminar esta oferta?</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded text-xs">
                {isDeleting ? <><FaHourglassHalf className="mr-1" /> Eliminando...</> : <><FaCheck className="mr-1" /> Sí, eliminar</>}
              </button>
              <button onClick={cancelDelete} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                <FaTimes className="mr-1" /> Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center mt-3 text-xs">
          <span className="mr-2 px-2 py-1 rounded-full font-medium" style={{ backgroundColor: jobTypeInfo.color + '20', color: jobTypeInfo.color }}>
            {jobTypeInfo.icon} {jobTypeInfo.text}
          </span>

          {isRecent() && (
            <span className="mr-2 px-2 py-1 rounded-full font-medium" style={{ backgroundColor: theme.palette.success.hex + '20', color: theme.palette.success.hex }}>
              <FaTag className="mr-1" /> Reciente
            </span>
          )}

          <span className="text-xs" style={{ color: theme.palette.gray.hex }}>
            <FaCalendarAlt className="mr-1" /> {formatDate(offer.date)}
            {offer.visitCount > 1 && (
              <span className="ml-2">
                <FaEye className="mr-1" /> {offer.visitCount} veces
              </span>
            )}
          </span>
        </div>
      </div>
    </a>
  );
};

export default JobOfferCard;