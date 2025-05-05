import React from "react";
import { useParams } from "react-router-dom";
import ReportView from "../components/ReportView";

const ReportDetailPage = () => {
  const { reportId } = useParams();
  return (
    <div>
      <ReportView key={reportId} />
    </div>
  );
};

export default ReportDetailPage;
