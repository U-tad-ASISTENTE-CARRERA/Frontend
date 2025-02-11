export const theme = {
  palette: {
    primary: {
      name: "Azul Principal",
      hex: "#0065EF",
    },
    text: {
      name: "Negro",
      hex: "#2f2f2f",
    },
    light: {
      name: "Azul Claro",
      hex: "#66A3FF",
    },
    dark: {
      name: "Azul Oscuro",
      hex: "#004BB5",
    },
    complementary: {
      name: "Naranja",
      hex: "#FF6F20",
    },
    accent: {
      name: "Verde Lima",
      hex: "#A3D600",
    },
    neutral: {
      name: "Gris Claro",
      hex: "#F0F0F0",
    },
    background: {
      name: "Blanco",
      hex: "#FFFFFF",
    },
  },
  fontSizes: {
    s: "12px",
    m: "14px",
    l: "16px",
    xl: "18px",
    xxl: "24px",
  },
  buttonRadios: {
    s: "4px",
    m: "8px",
    l: "12px",
    xl: "16px",
    xxl: "20px",
  },
  fontWeight: {
    thin: "100",
    extraLight: "200",
    ultraLight: "200",
    light: "300",
    regular: "400",
    bold: "700",
  },
};

export const styles = {
  dropdown: {
    display: 'block',
    position: 'absolute',
    top: '50px',
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  submenu: {
    display: 'flex',
    flexDirection: 'column'
  },
  dropdownButton: {
    width: '150px',
    padding: '10px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  modalButton: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  confirm: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  cancel: {
    backgroundColor: '#6c757d',
    color: 'white'
  }
};