// Unauthorized.tsx
import React from "react";

const Unauthorized: React.FC = () => {
  return (
    <div>
      <h1 style={styles.heading}>403 - Unauthorized</h1>
      <p style={styles.message}>
        You do not have permission to view this page.
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#dc3545",
  },
  message: {
    fontSize: "1rem",
    color: "#6c757d",
  },
};

export default Unauthorized;
