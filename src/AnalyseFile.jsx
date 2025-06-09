import { useEffect, useState } from "react";

function AnalyseFile({ fileURL, file }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function sendFile() {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      try {
        let fileToSend;
        if (file) {
          fileToSend = file;
        } else if (fileURL) {
          // Fetch the file from the URL as a blob
          const res = await fetch(fileURL);
          fileToSend = await res.blob();
        } else {
          throw new Error("No file or fileURL provided");
        }
        const formData = new FormData();
        formData.append("file", fileToSend);

        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to analyze file");
        const data = await res.json();
        setAnalysis(data?.analysis?.choices?.[0]?.text || "No analysis found.");
      } catch (err) {
        setError("Analysis failed.");
        console.log("error analysis", err);
      } finally {
        setLoading(false);
      }
    }
    if (fileURL || file) sendFile();
  }, [file, fileURL]);

  return (
    <div className="pop-up center">
      {loading && <div>Loading analysis...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {analysis && (
        <div>
          <h2>AI Analysis</h2>
          <div>{analysis}</div>
        </div>
      )}
    </div>
  );
}

export default AnalyseFile;
