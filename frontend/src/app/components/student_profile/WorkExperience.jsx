const WorkExperience = ({ workExperience, setWorkExperience }) => (
    <div>
      <label>Experiencia Laboral</label>
      <input
        type="text"
        value={workExperience.join(", ")}
        onChange={(e) => setWorkExperience(e.target.value.split(",").map((exp) => exp.trim()))}
        className="block w-full p-2 border"
      />
    </div>
  );
  
  export default WorkExperience;
  