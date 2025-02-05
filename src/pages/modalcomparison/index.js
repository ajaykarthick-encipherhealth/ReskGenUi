import { useState } from "react";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/chatService";
import { ProgressSpinner } from "primereact/progressspinner";
import CardSkeleton from "../../components/skeleton/card";

const ModalComparison = ({ getChatReply, getEHReply }) => {
  const [patientRecord, setPatientRecord] = useState("");
  const [openAiResponse, setOpenAiResponse] = useState("");
  const [ehResponse, setEhResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [initialHit, setInitialHit] = useState(false)

  const handleProceed = async () => {
    try {
      setChatLoading(true);
      const openAiData = await getChatReply(patientRecord);
      if (ehResponse) {
        setTimeout(() => {
          setOpenAiResponse(openAiData.response || "No response received");
        }, 3000);
      } else {
        setTimeout(() => {
          setOpenAiResponse(openAiData.response || "No response received");
        }, 3000);
      }
    } catch (error) {
      setOpenAiResponse("Error fetching response");
    } finally {
      setChatLoading(false);
    }
  };

  const handleProceeds = async () => {
    try {
      setAiLoading(true);
      const ehData = await getEHReply(patientRecord);
      if (ehData.response.model == "code") {
        setTimeout(() => {
          setEhResponse(ehData.response.response || "No response received");
          console.log(ehData.response.model);
        }, 6000);
      } else {
        setEhResponse(ehData.response.response || "No response received");
      }
    } catch (error) {
      setEhResponse("Error fetching response");
    } finally {
      setAiLoading(false);
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
        background: "rgb(244, 244, 244)",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "2000px",
        margin: "auto",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
      }}
    >
      <h2 style={{ color: "#333" }}>Patient Record Comparison</h2>

      <div style={{ width: "90%" }}>
        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
          Patient Record
        </label>
        <textarea
          placeholder="Enter patient record..."
          rows={10}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            width: "100%",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
          }}
          value={patientRecord}
          onChange={(e) => setPatientRecord(e.target.value)}
        />
      </div>

      <button
        onClick={() => {
          setEhResponse("");
          setOpenAiResponse("");
          handleProceed();
          handleProceeds();
          setInitialHit(true)
        }}
        style={{
          padding: "12px 20px",
          border: "none",
          background: "#007bff",
          color: "white",
          cursor: "pointer",
          borderRadius: "5px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
        // disabled={chatLoading}
      >
        {"Process"}
      </button>
      {initialHit && 
        <div style={{ display: "flex", gap: "30px", width: "90%" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Open Source AI Response
            </label>
            {chatLoading || !openAiResponse ? (
              <CardSkeleton height={340} />
            ) : (
              <textarea
                rows={15}
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  width: "100%",
                  borderRadius: "8px",
                  background: "#e9ecef",
                  fontSize: "14px",
                  fontFamily: "Arial, sans-serif",
                }}
                value={openAiResponse}
                readOnly
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              EH AI Response
            </label>
            {aiLoading || !ehResponse ? (
              <CardSkeleton height={340} />
            ) : (
              <textarea
                rows={15}
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  width: "100%",
                  borderRadius: "8px",
                  background: "#e9ecef",
                  fontSize: "14px",
                  fontFamily: "Arial, sans-serif",
                }}
                value={ehResponse}
                readOnly
              />
            )}
          </div>
        </div> }
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
