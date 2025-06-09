import { useEffect, useState } from "react";

function AnalyseFile({ fileURL }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function sendImage() {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      try {
        // Fetch the image as a blob from the URL
        const imgRes = await fetch(fileURL);
        const imgBlob = await imgRes.blob();
        const formData = new FormData();
        formData.append("file", imgBlob, "image.jpg");

        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to analyze file");
        const data = await res.json();
        // setAnalysis(data.analysis?.choices?.[0]?.text || "No analysis found.");
        setAnalysis(data.analysis.choices.at(0).text);
      } catch (err) {
        setError("Analysis failed.");
        console.log("error analysis", err);
      } finally {
        setLoading(false);
      }
    }
    if (fileURL) sendImage();
  }, [fileURL]);

  return (
    <div
      className="pop-up"
      style={{ minWidth: 350, minHeight: 180, textAlign: "center" }}
    >
      {loading && <div>Loading analysis...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {analysis && (
        <div>
          <h2>AI Analysis</h2>
          <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
            {analysis}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AnalyseFile;
