import { useState } from "react";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/chatService";
import { ProgressSpinner } from "primereact/progressspinner"; // Import PrimeReact Spinner

const ModalComparison = ({ getChatReply, getEHReply }) => {
  const [openAiText, setOpenAiText] = useState("");
  const [ehText, setEhText] = useState("");
  const [openAiResponse, setOpenAiResponse] = useState("");
  const [ehResponse, setEhResponse] = useState("");
  const [showResponses, setShowResponses] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleProceed = async () => {
    try {
      setLoading(true); // Start loading

      const openAiData = await getChatReply(openAiText);
      setOpenAiResponse(openAiData.response || "No response received");

      const ehData = await getEHReply(ehText);
      setEhResponse(ehData.response || "No response received");

      setShowResponses(true);
    } catch (error) {
      console.error("Error fetching responses:", error);
      setOpenAiResponse("Error fetching response");
      setEhResponse("Error fetching response");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
        padding: "20px",
        background: "#f4f4f4",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        margin: "auto",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#333" }}>Model Comparison</h2>

      {/* Input Fields */}
      <div style={{ display: "flex", gap: "30px", width: "90%" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            OpenAI Model
          </label>
          <textarea
            rows={10}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              minHeight: "120px",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            }}
            value={openAiText}
            onChange={(e) => setOpenAiText(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            EH Model
          </label>
          <textarea
            rows={10}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              minHeight: "120px",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            }}
            value={ehText}
            onChange={(e) => setEhText(e.target.value)}
          />
        </div>
      </div>

      {/* Process Button with Loading Indicator */}
      <button
        onClick={handleProceed}
        style={{
          padding: "12px 20px",
          border: "none",
          background: loading ? "#ccc" : "#007bff",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
          borderRadius: "5px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Processing..." : "Process"}
      </button>

      {/* Loading Spinner */}
      {loading && <ProgressSpinner />}

      {/* Responses */}
      {showResponses && !loading && (
        <div style={{ display: "flex", gap: "30px", width: "90%" }}>
          <div
            style={{ display: "flex", flexDirection: "column", width: "50%" }}
          >
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              OpenAI Response
            </label>
            <textarea
              rows={10}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                width: "100%",
                borderRadius: "8px",
                minHeight: "120px",
                background: "#e9ecef",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
              }}
              value={openAiResponse}
              readOnly
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "50%" }}
          >
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              EH Response
            </label>
            <textarea
              rows={10}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                width: "100%",
                borderRadius: "8px",
                minHeight: "120px",
                background: "#e9ecef",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
              }}
              value={ehResponse}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
};

const connector = connect(
  (state) => ({
    msgReply: state.chartService?.chatReply,
  }),
  {
    getChatReply: allActions.getChatReply,
    getEHReply: allActions.getEhChatReply,
  }
);

export default connector(ModalComparison);
