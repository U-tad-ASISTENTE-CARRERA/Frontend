export const dniRegex = (dni) => /^\d{8}[A-Z]$/.test(dni);

export const nameRegex = (name) => {
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
  return namePattern.test(name);
};

export const dateRegex = (dateString) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(dateString) && !isNaN(new Date(dateString).getTime());
};
