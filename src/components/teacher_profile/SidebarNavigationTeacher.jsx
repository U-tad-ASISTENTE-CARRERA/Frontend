const SidebarNavigation = ({ activeSection, setActiveSection }) => {
    const sections = [
      { id: "personal", label: "Información principal" },
      { id: "pupils", label: "Alumnos tutelados" },
    ];
  
    return (
      <div className="flex md:flex-col flex-row w-full md:w-64 gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap rounded-sm">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              activeSection === id ? "bg-blue-100" : ""
            }`}
            onClick={() => setActiveSection(id)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };
  
  export default SidebarNavigation;
  