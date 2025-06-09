import { useState } from "react";
import { database } from "./firebase";
import { ref, get, set } from "firebase/database";

function AddFile({ patient, setIsAddFile, setPatient }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    let finalFileName = fileName;
    if (!fileName) {
      finalFileName = file.name;
      setFileName(file.name);
    }
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "dawa2y_unsigned");
    if (finalFileName) {
      data.append("public_id", finalFileName);
    }

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/duxhmprhe/auto/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      setUrl(json.secure_url);
      // --- Save file info to Firebase after successful upload ---
      const filesRef = ref(database, `patients/${patient.id}/files`);
      try {
        const snapshot = await get(filesRef);
        let filesCount = 0;
        if (snapshot.exists()) {
          const files = snapshot.val();
          filesCount = Object.keys(files).length;
        }
        const newFileRef = ref(
          database,
          `patients/${patient.id}/files/${filesCount}`
        );
        await set(newFileRef, {
          fileName: finalFileName,
          fileURL: json.secure_url,
        });
      } catch (error) {
        console.error("Error saving file info to Firebase:", error);
      }
      // --------------------------------------------------------
      setTimeout(async () => {
        const patientRef = ref(database, `patients/${patient.id}`);
        const snapshot = await get(patientRef);
        if (snapshot.exists()) {
          setPatient(snapshot.val());
        }
        setIsAddFile(false);
      }, 700);

      //   alert("Upload successful!");
      console.log("file url", json);
    } catch (err) {
      alert("Upload failed!", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pop-up add-file">
      {url ? (
        <div
          style={{ color: "green", fontWeight: "bold", textAlign: "center" }}
        >
          The file submitted successfully!
        </div>
      ) : (
        <>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <input
            type="text"
            placeholder="File name (optional)"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ margin: "10px 0" }}
          />
          <button type="button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </>
      )}
    </div>
  );
}

export default AddFile;
