import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { useSummary } from "./useSummary";
import { useNotifications } from "./useNotifications";
import { exportToPDF } from "./exportSummary";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { FaFileAlt } from "react-icons/fa";

const SendReportButton = ({ tutorId, tutorName, baseUrl = "http://localhost:3000" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(null);
  const [isSending, setIsSending] = useState(false);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const userRole = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.role : "";
  
  const { 
    loading: summaryLoading,
    error: summaryError,
    generateSummary
  } = useSummary({ baseUrl, token, role: userRole });

  const {
    loading: notificationLoading,
    error: notificationError,
    sendNotificationToTeacher
  } = useNotifications({ baseUrl, token, role: userRole });

  const openModal = () => {
    setIsModalOpen(true);
    setShowMsg(null);
    setMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowMsg(null);
    setMessage("");
  };

  const handleSendReport = async () => {
    setShowMsg(null);
    setIsSending(true);

    try {
      const newSummary = await generateSummary();
      if (!newSummary) throw new Error("No se pudo generar el informe académico");

      const pdfExporter = exportToPDF(newSummary);
      const pdfDocument = pdfExporter.download();
      if (!pdfDocument) throw new Error("No se pudo generar el documento PDF");

      const notificationMessage = message.trim() || "He compartido mi informe académico contigo.";
      const notificationResult = await sendNotificationToTeacher(
        tutorId,
        notificationMessage
      );

      if (notificationResult) {
        setShowMsg({
          type: "success",
          text: "Informe generado y enviado correctamente a tu tutor"
        });
        
        setTimeout(closeModal, 2000);
      } else {
        throw new Error("No se pudo enviar la notificación al tutor");
      }
    } catch (err) {
      console.error("Error al enviar el informe:", err);
      setShowMsg({
        type: "error",
        text: err.message || "Error al enviar el informe. Inténtalo de nuevo más tarde."
      });
    } finally {
      setIsSending(false);
    }
  };

  const loading = summaryLoading || notificationLoading || isSending;
  const error = summaryError || notificationError;

  if (loading && !isModalOpen) return <LoadingModal message="Cargando ..." />;

  return (
    <>
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-full hover:opacity-80 transition"
        onClick={openModal}
        title="Enviar informe"
        style={{ backgroundColor: `${theme.palette.primary.hex}20`, color: theme.palette.primary.hex }}
      >
        <FaFileAlt className="text-sm" />
        <span className="text-sm">Enviar informe</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold" style={{ color: theme.palette.primary.hex }}>
                Enviar Informe a {tutorName}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Cerrar"
              >
                X
              </button>
            </div>
            
            {loading ? (
              <div className="py-8 flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: theme.palette.primary.hex }}></div>
                <p className="text-gray-600">
                  {loading ? "Generando y enviando informe..." : "Procesando..."}
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            ) : showMsg ? (
              <div className={`bg-${showMsg.type === 'success' ? 'green' : 'red'}-50 border-l-4 border-${showMsg.type === 'success' ? 'green' : 'red'}-500 p-4 mb-4`}>
                <div className="flex">
                  <div className="ml-3">
                    <p className={`text-sm text-${showMsg.type === 'success' ? 'green' : 'red'}-700`}>
                      {showMsg.text}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label 
                    htmlFor="tutor-message" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.palette.text.hex }}
                  >
                    Mensaje para {tutorName} (opcional)
                  </label>
                  <textarea
                    id="tutor-message"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Escribe un mensaje para ${tutorName}`}
                    className="w-full p-2 border rounded-md"
                    style={{ 
                      borderColor: theme.palette.lightGray.hex,
                      color: theme.palette.text.hex 
                    }}
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-md"
                    style={{ borderColor: theme.palette.lightGray.hex }}
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handleSendReport}
                    className="px-4 py-2 text-white rounded-md flex items-center gap-2"
                    style={{ backgroundColor: theme.palette.primary.hex }}
                  >
                    <span>Enviar Informe</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SendReportButton;