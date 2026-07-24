import React from "react";
import { FaCheckCircle, FaClock, FaExclamationCircle, FaCheckDouble } from "react-icons/fa";

const ComplaintStatus = ({ currentStatus }) => {
  const steps = [
    { label: "Pending", icon: <FaClock /> },
    { label: "Under Review", icon: <FaExclamationCircle /> },
    { label: "In Progress", icon: <FaClock /> },
    { label: "Resolved", icon: <FaCheckDouble /> }
  ];

  const getStepStatus = (stepLabel) => {
    const order = ["Pending", "Under Review", "In Progress", "Resolved"];
    const currentIndex = order.indexOf(currentStatus || "Pending");
    const stepIndex = order.indexOf(stepLabel);

    if (stepIndex < currentIndex) return "step-completed";
    if (stepIndex === currentIndex) return "step-current";
    return "step-upcoming";
  };

  return (
    <div className="status-tracker-container">
      <h3>Complaint Progress Timeline</h3>
      <div className="tracker-steps">
        {steps.map((step, idx) => {
          const statusClass = getStepStatus(step.label);
          return (
            <div key={step.label} className={`tracker-step ${statusClass}`}>
              <div className="step-node">
                {statusClass === "step-completed" ? <FaCheckCircle /> : step.icon}
              </div>
              <span className="step-label">{step.label}</span>
              {idx < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintStatus;
