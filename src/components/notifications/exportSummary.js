// import jsPDF from 'jspdf';

// const COLORS = {
//   PRIMARY: '#0065EF',
//   SECONDARY: '#1E88E5', 
//   TEXT: '#2f2f2f',
//   LIGHT: '#66A3FF',
//   DARK: '#004BB5',
//   GRAY: '#9E9E9E',
//   LIGHT_GRAY: '#E0E0E0'
// };

// const FONT_SIZES = {
//   LARGE: 16,
//   MEDIUM: 12,
//   SMALL: 10,
//   MINI: 8
// };

// const MARGINS = {
//   TOP: 15,
//   BOTTOM: 15,
//   LEFT: 15,
//   RIGHT: 15,
// };

// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } catch (e) {
//     return 'Fecha desconocida';
//   }
// };

// const formatDateForFilename = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0].replace(/-/g, '');
//   } catch (e) {
//     return 'sin_fecha';
//   }
// };

// const addHeading = (doc, text, size = FONT_SIZES.LARGE, isBold = true) => {
//   const pageWidth = doc.internal.pageSize.width;
  
//   doc.setFontSize(size);
//   doc.setFont(undefined, isBold ? 'bold' : 'normal');
//   doc.setTextColor(COLORS.PRIMARY);
//   doc.text(text, pageWidth / 2, doc.y, { align: 'center' });
  
//   doc.y += size + 5;
// };

// const addSubheading = (doc, text, size = FONT_SIZES.MEDIUM) => {
//   doc.setFontSize(size);
//   doc.setFont(undefined, 'bold');
//   doc.setTextColor(COLORS.DARK);
//   doc.text(text, MARGINS.LEFT, doc.y);
  
//   doc.setDrawColor(COLORS.LIGHT_GRAY);
//   doc.line(MARGINS.LEFT, doc.y + 5, doc.internal.pageSize.width - MARGINS.RIGHT, doc.y + 5);

//   doc.y += size + 8;
// };

// const addText = (doc, text, size = FONT_SIZES.SMALL, color = COLORS.TEXT) => {
//   doc.setFontSize(size);
//   doc.setFont(undefined, 'normal');
//   doc.setTextColor(color);
//   doc.text(text, MARGINS.LEFT, doc.y);

//   doc.y += size + 3;
// };

// const addSpacer = (doc, space = 5) => {
//   doc.y += space;
// };

// const checkPageBreak = (doc, height = 10) => {
//   if (doc.y + height > doc.internal.pageSize.height - MARGINS.BOTTOM) {
//     doc.addPage();
//     doc.y = MARGINS.TOP;
//     return true;
//   }
//   return false;
// };

// const addHeader = (doc) => {
//   doc.setFontSize(FONT_SIZES.LARGE);
//   doc.setFont(undefined, 'bold');
//   doc.setTextColor(COLORS.PRIMARY);
//   doc.text('Informe Académico', doc.internal.pageSize.width / 2, MARGINS.TOP + 25, { align: 'center' });

//   doc.y = 60;
// };

// const addStudentInfo = (doc, summary) => {
//   addSubheading(doc, 'INFORMACIÓN DEL ESTUDIANTE');
//   addText(doc, `Nombre: ${summary.studentInfo.firstName} ${summary.studentInfo.lastName}`);
//   addText(doc, `Grado: ${summary.studentInfo.degree || 'No especificado'}`);
//   addText(doc, `Años completados: ${Array.isArray(summary.studentInfo.yearsCompleted)
//     ? summary.studentInfo.yearsCompleted.join(", ")
//     : summary.studentInfo.yearsCompleted || 'No especificado'}`);
//   addSpacer(doc);
// };

// const addAcademicInfo = (doc, summary) => {
//   if (summary.academicInfo) {
//     addSubheading(doc, 'INFORMACIÓN ACADÉMICA');
//     addText(doc, `Nota media: ${summary.academicInfo.averageGrade ? summary.academicInfo.averageGrade.toFixed(2) : 'N/A'}`);
//     addText(doc, `Créditos obtenidos: ${summary.academicInfo.earnedCredits} de ${summary.academicInfo.totalCredits}`);
//     addSpacer(doc);
//   }
// };

// const addStrengths = (doc, summary) => {
//   if (summary.strengths) {
//     checkPageBreak(doc, 30);
//     addSubheading(doc, 'FORTALEZAS');

//     if (summary.strengths.topSubjects && summary.strengths.topSubjects.length > 0) {
//       addText(doc, 'Mejores asignaturas:', FONT_SIZES.MEDIUM, COLORS.SECONDARY);
//       summary.strengths.topSubjects.forEach(subject => {
//         addText(doc, `• ${subject.name}: ${subject.grade.toFixed(1)}`, FONT_SIZES.SMALL, COLORS.TEXT);
//       });

//       addSpacer(doc, 2);
//     }

//     if (summary.strengths.strongProgrammingLanguages && summary.strengths.strongProgrammingLanguages.length > 0) {
//       addText(doc, `Lenguajes de programación destacados:`, FONT_SIZES.MEDIUM, COLORS.SECONDARY);
//       addText(doc, summary.strengths.strongProgrammingLanguages.join(', '), FONT_SIZES.SMALL, COLORS.TEXT);
//     }
    
//     addSpacer(doc);
//   }
// };

// const addWeaknesses = (doc, summary) => {
//   if (summary.weaknesses) {
//     checkPageBreak(doc, 30);
//     addSubheading(doc, 'ÁREAS DE MEJORA');

//     if (summary.weaknesses.weakSubjects && summary.weaknesses.weakSubjects.length > 0) {
//       addText(doc, 'Asignaturas a mejorar:', FONT_SIZES.MEDIUM, COLORS.SECONDARY);
//       summary.weaknesses.weakSubjects.forEach(subject => {
//         addText(doc, `• ${subject.name}: ${subject.grade.toFixed(1)}`, FONT_SIZES.SMALL, COLORS.TEXT);
//       });
      
//       addSpacer(doc, 2);
//     }

//     if (summary.weaknesses.weakProgrammingLanguages && summary.weaknesses.weakProgrammingLanguages.length > 0) {
//       addText(doc, 'Lenguajes a reforzar:', FONT_SIZES.MEDIUM, COLORS.SECONDARY);
//       addText(doc, summary.weaknesses.weakProgrammingLanguages.join(', '), FONT_SIZES.SMALL, COLORS.TEXT);
//     }
    
//     addSpacer(doc);
//   }
// };

// const addRoadmapProgress = (doc, summary) => {
//   if (summary.roadmapProgress && summary.roadmapProgress.name) {
//     checkPageBreak(doc, 40);
//     addSubheading(doc, 'PROGRESO EN ROADMAP');
//     addText(doc, `Roadmap: ${summary.roadmapProgress.name}`);

//     const completedPercentage = summary.roadmapProgress.totalCheckpoints > 0
//       ? Math.round((summary.roadmapProgress.completedCheckpoints / summary.roadmapProgress.totalCheckpoints) * 100)
//       : 0;

//     addText(doc, `Progreso: ${completedPercentage}% (${summary.roadmapProgress.completedCheckpoints} de ${summary.roadmapProgress.totalCheckpoints} checkpoints)`);

//     // Barra de progreso visual
//     const barWidth = 170;
//     const filledWidth = (barWidth * completedPercentage) / 100;

//     doc.setDrawColor(COLORS.LIGHT_GRAY);
//     doc.setFillColor(COLORS.LIGHT_GRAY);
//     doc.roundedRect(MARGINS.LEFT, doc.y, barWidth, 5, 1, 1, 'F');

//     doc.setDrawColor(COLORS.PRIMARY);
//     doc.setFillColor(COLORS.PRIMARY);
//     doc.roundedRect(MARGINS.LEFT, doc.y, filledWidth, 5, 1, 1, 'F');

//     doc.y += 10;
//   }
// };

// const addFooter = (doc) => {
//   const pageCount = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i);
//     doc.setFontSize(FONT_SIZES.MINI);
//     doc.setTextColor(COLORS.GRAY);
//     doc.text(
//       `Asistente de Carrera Profesional - Página ${i} de ${pageCount}`,
//       doc.internal.pageSize.width / 2,
//       doc.internal.pageSize.height - 10,
//       { align: 'center' }
//     );
//   }
// };

// export const exportToPDF = (summary) => {
//   if (!summary) {
//     console.error('No hay datos para exportar');
//     return {
//       download: () => console.error('No hay datos para exportar')
//     };
//   }

//   const download = () => {
//     try {
//       const doc = new jsPDF();
//       doc.y = MARGINS.TOP;

//       addHeader(doc);
//       addStudentInfo(doc, summary);
//       addAcademicInfo(doc, summary);
//       addStrengths(doc, summary);
//       addWeaknesses(doc, summary);
//       addRoadmapProgress(doc, summary);
//       // addFooter(doc);

//       const fileName = `Informe_academico_${summary.studentInfo.firstName}_${summary.studentInfo.lastName}_${formatDateForFilename(summary.createdAt)}.pdf`;
//       doc.save(fileName);

//       return doc;
//     } catch (error) {
//       console.error('Error al generar el PDF:', error);
//       return null;
//     }
//   };

//   const getDocument = () => {
//     try {
//       const doc = new jsPDF();
//       doc.y = MARGINS.TOP;

//       addHeader(doc);
//       addStudentInfo(doc, summary);
//       addAcademicInfo(doc, summary);
//       addStrengths(doc, summary);
//       addWeaknesses(doc, summary);
//       addRoadmapProgress(doc, summary);
//       addFooter(doc);

//       return doc;
//     } catch (error) {
//       console.error('Error al generar el documento PDF:', error);
//       return null;
//     }
//   };

//   return {
//     download,
//     getDocument
//   };
// };

import jsPDF from 'jspdf';

const COLORS = {
  PRIMARY: '#0065EF',
  SECONDARY: '#1E88E5', 
  TEXT: '#2f2f2f',
  LIGHT: '#66A3FF',
  DARK: '#004BB5',
  GRAY: '#9E9E9E',
  LIGHT_GRAY: '#E0E0E0'
};

const FONT_SIZES = {
  LARGE: 16,
  MEDIUM: 12,
  SMALL: 10,
  MINI: 8
};

const MARGINS = {
  TOP: 30,
  BOTTOM: 30,
  LEFT: 20,
  RIGHT: 20,
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Fecha desconocida';
  }
};

const formatDateForFilename = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0].replace(/-/g, '');
  } catch (e) {
    return 'sin_fecha';
  }
};

const addLogo = (doc) => {
  try {
    const logoBase64 = '/logo.png';

    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 30; // Adjust logo width as needed
    const logoHeight = 30; // Adjust logo height as needed
    const xPosition = (pageWidth - logoWidth) / 2;
    
    doc.addImage(logoBase64, 'PNG', xPosition, MARGINS.TOP, logoWidth, logoHeight);
    
    return logoHeight + 10; // Return height with some padding
  } catch (error) {
    console.error('Error adding logo:', error);
    return 0;
  }
};

const addSubheading = (doc, text, size = FONT_SIZES.MEDIUM) => {
  doc.setFontSize(size);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(COLORS.DARK);
  
  // Add a line before the subheading
  doc.setDrawColor(COLORS.LIGHT_GRAY);
  doc.line(MARGINS.LEFT, doc.y, doc.internal.pageSize.width - MARGINS.RIGHT, doc.y);
  
  // Move down slightly and add text
  doc.y += 7;
  doc.text(text, MARGINS.LEFT, doc.y);
  
  // Move down after text
  doc.y += size + 5;
};

const addText = (doc, text, size = FONT_SIZES.SMALL, color = COLORS.TEXT, indent = 0) => {
  doc.setFontSize(size);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(color);
  doc.text(text, MARGINS.LEFT + indent, doc.y);

  doc.y += size + 3;
};

const addSpacer = (doc, space = 5) => {
  doc.y += space;
};

const checkPageBreak = (doc, requiredHeight = 30) => {
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = MARGINS.BOTTOM + 10; // Extra padding for footer

  if (doc.y + requiredHeight > pageHeight - bottomMargin) {
    doc.addPage();
    doc.y = MARGINS.TOP;
    return true;
  }
  return false;
};

const addHeader = (doc, summary) => {
  // Add logo first
  const logoHeight = addLogo(doc);
  doc.y = MARGINS.TOP + logoHeight;

  doc.setFontSize(FONT_SIZES.LARGE);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(COLORS.PRIMARY);
  doc.text('Informe Académico', doc.internal.pageSize.width / 2, doc.y, { align: 'center' });

  // Add creation date
  doc.setFontSize(FONT_SIZES.SMALL);
  doc.setTextColor(COLORS.GRAY);
  doc.text(`Generado el: ${formatDate(summary.createdAt)}`, 
    doc.internal.pageSize.width / 2, 
    doc.y + 7, 
    { align: 'center' }
  );

  doc.y += 20;
};

const addStudentInfo = (doc, summary) => {
  addSubheading(doc, 'INFORMACIÓN DEL ESTUDIANTE');
  addText(doc, `Nombre: ${summary.studentInfo.firstName} ${summary.studentInfo.lastName}`);
  addText(doc, `Correo: ${summary.studentInfo.email}`);
  addText(doc, `Grado: ${summary.studentInfo.degree || 'No especificado'}`);
  addText(doc, `Años completados: ${Array.isArray(summary.studentInfo.yearsCompleted)
    ? summary.studentInfo.yearsCompleted.join(", ")
    : summary.studentInfo.yearsCompleted || 'No especificado'}`);
  addSpacer(doc, 5);
};

const addAcademicInfo = (doc, summary) => {
  if (summary.academicInfo) {
    addSubheading(doc, 'INFORMACIÓN ACADÉMICA');
    addText(doc, `Nota media: ${summary.academicInfo.averageGrade ? summary.academicInfo.averageGrade.toFixed(2) : 'N/A'}`);
    addText(doc, `Créditos obtenidos: ${summary.academicInfo.earnedCredits} de ${summary.academicInfo.totalCredits}`);
    addSpacer(doc, 5);
  }
};

const addStrengths = (doc, summary) => {
  if (summary.strengths) {
    checkPageBreak(doc, 40);
    addSubheading(doc, 'FORTALEZAS');

    if (summary.strengths.topSubjects && summary.strengths.topSubjects.length > 0) {
      addText(doc, 'Mejores asignaturas:', FONT_SIZES.MEDIUM, COLORS.SECONDARY);
      summary.strengths.topSubjects.forEach(subject => {
        addText(doc, `• ${subject.name}: ${subject.grade.toFixed(1)}`, FONT_SIZES.SMALL, COLORS.TEXT, 5);
      });

      addSpacer(doc, 2);
    }

    if (summary.strengths.strongProgrammingLanguages && summary.strengths.strongProgrammingLanguages.length > 0) {
      addText(doc, `Lenguajes de programación destacados:`, FONT_SIZES.MEDIUM, COLORS.SECONDARY);
      addText(doc, summary.strengths.strongProgrammingLanguages.join(', '), FONT_SIZES.SMALL, COLORS.TEXT);
    }
    
    addSpacer(doc, 5);
  }
};

const addWeaknesses = (doc, summary) => {
  if (summary.weaknesses) {
    checkPageBreak(doc, 40);
    addSubheading(doc, 'ÁREAS DE MEJORA');

    if (summary.weaknesses.weakSubjects && summary.weaknesses.weakSubjects.length > 0) {
      addText(doc, 'Asignaturas a mejorar:', FONT_SIZES.MEDIUM, COLORS.SECONDARY);
      summary.weaknesses.weakSubjects.forEach(subject => {
        addText(doc, `• ${subject.name}: ${subject.grade.toFixed(1)}`, FONT_SIZES.SMALL, COLORS.TEXT, 5);
      });
      
      addSpacer(doc, 2);
    }

    if (summary.weaknesses.weakProgrammingLanguages && summary.weaknesses.weakProgrammingLanguages.length > 0) {
      addText(doc, 'Lenguajes a reforzar:', FONT_SIZES.MEDIUM, COLORS.SECONDARY);
      addText(doc, summary.weaknesses.weakProgrammingLanguages.join(', '), FONT_SIZES.SMALL, COLORS.TEXT);
    }
    
    addSpacer(doc, 5);
  }
};

const addRoadmapProgress = (doc, summary) => {
  if (summary.roadmapProgress && summary.roadmapProgress.name) {
    checkPageBreak(doc, 50);
    addSubheading(doc, 'PROGRESO EN ROADMAP');
    addText(doc, `Roadmap: ${summary.roadmapProgress.name}`);

    const completedPercentage = summary.roadmapProgress.totalCheckpoints > 0
      ? Math.round((summary.roadmapProgress.completedCheckpoints / summary.roadmapProgress.totalCheckpoints) * 100)
      : 0;

    addText(doc, `Progreso: ${completedPercentage}% (${summary.roadmapProgress.completedCheckpoints} de ${summary.roadmapProgress.totalCheckpoints} checkpoints)`);

    // Barra de progreso visual
    const barWidth = doc.internal.pageSize.width - (MARGINS.LEFT + MARGINS.RIGHT);
    const filledWidth = (barWidth * completedPercentage) / 100;

    doc.setDrawColor(COLORS.LIGHT_GRAY);
    doc.setFillColor(COLORS.LIGHT_GRAY);
    doc.roundedRect(MARGINS.LEFT, doc.y, barWidth, 5, 1, 1, 'F');

    doc.setDrawColor(COLORS.PRIMARY);
    doc.setFillColor(COLORS.PRIMARY);
    doc.roundedRect(MARGINS.LEFT, doc.y, filledWidth, 5, 1, 1, 'F');

    doc.y += 10;
  }
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(FONT_SIZES.MINI);
    doc.setTextColor(COLORS.GRAY);
    doc.text(
      `Asistente de Carrera Profesional - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - MARGINS.BOTTOM / 2,
      { align: 'center' }
    );
  }
};

export const exportToPDF = (summary) => {
  if (!summary) {
    console.error('No hay datos para exportar');
    return {
      download: () => console.error('No hay datos para exportar')
    };
  }

  const download = () => {
    try {
      const doc = new jsPDF();
      doc.y = MARGINS.TOP;

      addHeader(doc, summary);
      addStudentInfo(doc, summary);
      addAcademicInfo(doc, summary);
      addStrengths(doc, summary);
      addWeaknesses(doc, summary);
      addRoadmapProgress(doc, summary);
      addFooter(doc);

      const fileName = `Informe_academico_${summary.studentInfo.firstName}_${summary.studentInfo.lastName}_${formatDateForFilename(summary.createdAt)}.pdf`;
      doc.save(fileName);

      return doc;
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      return null;
    }
  };

  const getDocument = () => {
    try {
      const doc = new jsPDF();
      doc.y = MARGINS.TOP;

      addHeader(doc, summary);
      addStudentInfo(doc, summary);
      addAcademicInfo(doc, summary);
      addStrengths(doc, summary);
      addWeaknesses(doc, summary);
      addRoadmapProgress(doc, summary);
      addFooter(doc);

      return doc;
    } catch (error) {
      console.error('Error al generar el documento PDF:', error);
      return null;
    }
  };

  return {
    download,
    getDocument
  };
};