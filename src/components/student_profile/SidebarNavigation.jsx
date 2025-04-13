import { theme } from "@/constants/theme";

const SidebarNavigation = ({ activeSection, setActiveSection }) => {
  const groupedSections = [
    {
      title: "Perfil personal",
      items: [
        { id: "personal", label: "Información principal" },
        { id: "languages", label: "Idiomas" },
        { id: "programming", label: "Lenguajes de programación" },
        { id: "certifications", label: "Certificaciones" },
      ],
    },
    {
      title: "Trayectoria",
      items: [
        { id: "employee", label: "Experiencia laboral" },
        { id: "AH", label: "Expediente académico" },
      ],
    },
    {
      title: "Apoyo académico",
      items: [
        { id: "showTutor", label: "Tutor" },
      ],
    },
    {
      title: "Historial",
      items: [
        { id: "activityLog", label: "Registro de actividad" },
      ],
    },
  ];

  return (
    <aside
      className="flex md:flex-col flex-row w-full md:w-64 gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap rounded-sm p-4"
    >
      <div className="hidden md:block mb-2">
        <h2
          className="text-lg font-bold"
          style={{ color: theme.palette.text.hex }}
        >
          Panel de perfil
        </h2>
      </div>

      <div className="flex md:flex-col flex-row gap-6 w-full">
        {groupedSections.map(({ title, items }) => (
          <div key={title} className="flex flex-col gap-3 min-w-max">
            <div className="flex flex-col gap-1">
              <p
                className="text-xs uppercase font-semibold tracking-wide"
                style={{ color: theme.palette.gray.hex }}
              >
                {title}
              </p>
              <hr
                className="mb-2"
                style={{ borderColor: theme.palette.lightGray.hex }}
              />
            </div>

            {items.map(({ id, label }) => (
              <button
                key={id}
                className="px-4 py-2 rounded text-sm transition-all duration-200 text-left"
                style={{
                  backgroundColor:
                    activeSection === id
                      ? theme.palette.light.hex
                      : "transparent",
                  color:
                    activeSection === id
                      ? theme.palette.background.hex
                      : theme.palette.text.hex,
                  fontWeight: activeSection === id
                    ? theme.fontWeight.semibold
                    : theme.fontWeight.regular,
                  boxShadow:
                    activeSection === id ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                }}
                onClick={() => setActiveSection(id)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarNavigation;
