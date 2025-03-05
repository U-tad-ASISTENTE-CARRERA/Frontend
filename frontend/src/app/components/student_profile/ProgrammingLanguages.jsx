const ProgrammingLanguages = ({ programmingLanguages, setProgrammingLanguages }) => {
    const handleProgrammingLanguagesChange = (e) => {
      const newLanguages = e.target.value.split(",").map((lang) => ({ language: lang.trim() }));
      setProgrammingLanguages(newLanguages);
    };
  
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">Lenguajes de Programación</label>
        <input
          type="text"
          value={programmingLanguages.map((lang) => lang.language).join(", ")}
          onChange={handleProgrammingLanguagesChange}
          placeholder="Ejemplo: JavaScript, Python, Java"
          className="block w-full mt-1 p-2 border rounded-md"
        />
      </div>
    );
  };
  
  export default ProgrammingLanguages;
  