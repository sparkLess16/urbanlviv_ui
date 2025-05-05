import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/ReportForm.css";

const ReportForm = ({ onSubmitted }) => {
  const [title, setTitle] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoInputs, setPhotoInputs] = useState([0]);
  const [previews, setPreviews] = useState({});
  const [attachments, setAttachments] = useState({});
  const [priorities, setPriorities] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Load priorities
    axios
      .get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/priorities",
        { headers }
      )
      .then((res) => {
        const raw = Array.isArray(res.data.Data) ? res.data.Data : [];
        const list = raw.map((item) => ({
          id: parseInt(item.priority_id, 10),
          name: item.priority_display_name || item.priority_name,
        }));
        setPriorities(list);
      })
      .catch((err) => {
        console.error("Failed to load priorities", err);
        setError("Не вдалося завантажити пріоритети");
      });

    // Load problem types
    axios
      .get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/problem-types",
        { headers }
      )
      .then((res) => {
        const raw = Array.isArray(res.data.Data) ? res.data.Data : [];
        const list = raw.map((item) => ({
          id: parseInt(item.problem_type_id, 10),
          name: item.problem_display_name || item.problem_name,
        }));
        setTypes(list);
      })
      .catch((err) => {
        console.error("Failed to load problem types", err);
        setError("Не вдалося завантажити типи проблем");
      });
  }, []);

  const handlePhotoClick = (index) => {
    inputRefs.current[index]?.click();
  };

  const handlePhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result; // includes "data:image/...;base64,"
      // show preview
      setPreviews((prev) => ({ ...prev, [index]: dataUrl }));
      // save attachment with full Data URL
      setAttachments((prev) => ({
        ...prev,
        [index]: {
          FileName: file.name,
          Content: dataUrl,
          FileDescription: file.name,
        },
      }));
    };
    reader.readAsDataURL(file);
    if (index === photoInputs.length - 1) {
      setPhotoInputs((prev) => [...prev, prev.length]);
    }
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    setError(null);

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Required";
    if (!priorityId) newErrors.priority = "Required";
    if (!typeId) newErrors.type = "Required";
    if (!description.trim()) newErrors.description = "Required";
    if (!location.trim()) newErrors.location = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // clear previous errors if valid
    setErrors({});

    try {
      const Attachments = Object.values(attachments);

      const body = {
        Title: title.trim(),
        Description: description.trim(),
        Location: location.trim(),
        PriorityId: parseInt(priorityId),
        ProblemTypeId: parseInt(typeId),
        Attachments: Object.values(attachments),
      };

      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create",
        body,
        { headers }
      );

      alert("Report created successfully");
      if (onSubmitted) {
        onSubmitted();
      }
      setTitle("");
      setPriorityId("");
      setTypeId("");
      setDescription("");
      setLocation("");
      setPreviews({});
      setAttachments({});
      setPhotoInputs([0]);
      setErrors({});
    } catch (err) {
      console.error("Create report failed", err);
      setError("Не вдалося створити звіт");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-form">
      <h2 className="addRep">
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
      {error && <div className="error-message">{error}</div>}

      <div className="oneline">
        <div className="input-group wide">
          <label>Name of problem</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <span className="input-error">{errors.title}</span>}
        </div>
        <div className="input-group wide">
          <label>Priority of Problem</label>
          <select
            value={priorityId}
            onChange={(e) => setPriorityId(e.target.value)}
          >
            <option value="">Select priority</option>
            {priorities.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {errors.priority && (
            <span className="input-error">{errors.priority}</span>
          )}
        </div>
      </div>

      <div className="input-group full-width">
        <label>Type of Problem</label>
        <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
          <option value="">Select type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {errors.type && <span className="input-error">{errors.type}</span>}
      </div>

      <div className="input-group full-width">
        <label>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <span className="input-error">{errors.description}</span>
        )}
      </div>

      <div className="input-group full-width">
        <label>Place of happening</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {errors.location && (
          <span className="input-error">{errors.location}</span>
        )}
      </div>

      <div className="input-group full-width">
        <label>Photo</label>
        <div id="photoContainer" className="photo-container full-width">
          {photoInputs.map((id) => (
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

      <button onClick={submitReport} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add"}
      </button>
    </div>
  );
};

export default ReportForm;
