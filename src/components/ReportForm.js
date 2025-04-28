import { useState, useRef } from "react";
import "../styles/ReportForm.css";

function submitReport() {
  const problemName = document.getElementById("problemName").value;
  const status = document.getElementById("status").value;
  const description = document.getElementById("description").value;

  // For now, just logging input values
  console.log({
    problemName,
    status,
    description,
  });

  alert("Report submitted!");
}

const ReportForm = () => {
  const [photoInputs, setPhotoInputs] = useState([0]); // unique keys
  const [previews, setPreviews] = useState({});
  const inputRefs = useRef({});

  const handlePhotoClick = (index) => {
    inputRefs.current[index].click();
  };

  const handlePhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [index]: reader.result,
        }));
      };
      reader.readAsDataURL(file);

      if (index === photoInputs.length - 1) {
        setPhotoInputs((prev) => [...prev, prev.length]);
      }
    }
  };

  return (
    <div class="report-form">
      <h2 class="addRep">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="36" rx="7" fill="white" />
          <path
            d="M22 28.75H9C8.04 28.75 7.25 27.96 7.25 27V14C7.25 9.58 9.58 7.25 14 7.25H22C26.42 7.25 28.75 9.58 28.75 14V22C28.75 26.42 26.42 28.75 22 28.75ZM14 8.75C10.42 8.75 8.75 10.42 8.75 14V27C8.75 27.14 8.86 27.25 9 27.25H22C25.58 27.25 27.25 25.58 27.25 22V14C27.25 10.42 25.58 8.75 22 8.75H14Z"
            fill="#292D32"
          />
          <path
            d="M21.5 18.75H14.5C14.09 18.75 13.75 18.41 13.75 18C13.75 17.59 14.09 17.25 14.5 17.25H21.5C21.91 17.25 22.25 17.59 22.25 18C22.25 18.41 21.91 18.75 21.5 18.75Z"
            fill="#292D32"
          />
          <path
            d="M18 22.25C17.59 22.25 17.25 21.91 17.25 21.5V14.5C17.25 14.09 17.59 13.75 18 13.75C18.41 13.75 18.75 14.09 18.75 14.5V21.5C18.75 21.91 18.41 22.25 18 22.25Z"
            fill="#292D32"
          />
        </svg>
        Add a Report
      </h2>

      <div class="oneline">
        <div class="input-group wide">
          <label>Name of problem</label>
          <input type="text" id="problemName" placeholder="" />
        </div>

        <div class="input-group wide">
          <label>Priority of Problem</label>
          <select id="status">
            <option value="ASAP">ASAP</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div class="input-group full-width">
        <label>Type of Problem</label>
        <select id="type"></select>
      </div>

      <div class="input-group full-width">
        <label>Description</label>
        <textarea id="description" rows="3" placeholder=""></textarea>
      </div>

      <div class="input-group full-width">
        <label>Place of happening</label>
        <div class="placeHapp full-width">
          <input type="text" id="placeHapp" placeholder="" />
        </div>
      </div>

      <div class="input-group full-width">
        <label>Photo</label>
        <div id="photoContainer" class="photo-container full-width">
          {photoInputs.map((id, idx) => (
            <div key={id} className="photo-upload-wrapper">
              <div
                className="photo-upload"
                onClick={() => handlePhotoClick(id)}
              >
                {previews[id] ? (
                  <img src={previews[id]} alt="Preview" className="preview" />
                ) : (
                  <span>Add Photo</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => (inputRefs.current[id] = el)}
                  onChange={(e) => handlePhotoChange(e, id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onclick={submitReport}>Add</button>
    </div>
  );
};

export default ReportForm;
