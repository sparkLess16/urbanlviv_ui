import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/ReportForm.css";

const ReportForm = () => {
    const [photoInputs, setPhotoInputs] = useState([0]);
    const [previews, setPreviews] = useState({});
    const [attachments, setAttachments] = useState({});
    const [priorities, setPriorities] = useState([]);
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef({});

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
        try {
            const title = document.getElementById("problemName").value;
            const priorityId = parseInt(document.getElementById("status").value, 10);
            const problemTypeId = parseInt(document.getElementById("type").value, 10);
            const description = document.getElementById("description").value;
            const location = document.getElementById("placeHapp").value;
            const Attachments = Object.values(attachments);

            const body = {
                Title: title,
                Description: description,
                Location: location,
                PriorityId: priorityId,
                ProblemTypeId: problemTypeId,
                Attachments,
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
            // optional: reset form or redirect
        } catch (err) {
            console.error("Create report failed", err);
            setError("Не вдалося створити звіт");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-form">
            <h2 className="addRep">Add a Report</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="oneline">
                <div className="input-group wide">
                    <label>Name of problem</label>
                    <input type="text" id="problemName" />
                </div>
                <div className="input-group wide">
                    <label>Priority of Problem</label>
                    <select id="status">
                        <option value="">Select priority</option>
                        {priorities.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="input-group full-width">
                <label>Type of Problem</label>
                <select id="type">
                    <option value="">Select type</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group full-width">
                <label>Description</label>
                <textarea id="description" rows={3} />
            </div>

            <div className="input-group full-width">
                <label>Place of happening</label>
                <input type="text" id="placeHapp" />
            </div>

            <div className="input-group full-width">
                <label>Photo</label>
                <div id="photoContainer" className="photo-container full-width">
                    {photoInputs.map((id) => (
                        <div key={id} className="photo-upload-wrapper">
                            <div className="photo-upload" onClick={() => handlePhotoClick(id)}>
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