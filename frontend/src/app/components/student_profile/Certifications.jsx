const Certifications = ({ certifications, setCertifications }) => (
    <div>
      <label>Certificaciones</label>
      <input
        type="text"
        value={certifications.join(", ")}
        onChange={(e) => setCertifications(e.target.value.split(",").map((cert) => cert.trim()))}
        className="block w-full p-2 border"
      />
    </div>
  );
  
  export default Certifications;
  