import { useState, useRef, useEffect } from "react";
import axios from "axios";
import myImg from "../assets/admin-img.png";
import "../styles/AdminPanel.css";
import TruncatedCell from "./TruncatedCell";

const AdminPanel = () => {
  const [priorities, setPriorities] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [counts, setCounts] = useState({ total_reports: 0, user_reports: 0 });
  const [allReports, setAllReports] = useState([]);

  const token = localStorage.getItem("authToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Load priorities,statuses
  useEffect(() => {
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
      });

    axios
      .get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/statuses",
        { headers }
      )
      .then((res) => {
        const raw = Array.isArray(res.data.Data) ? res.data.Data : [];
        const list = raw.map((item) => ({
          id: parseInt(item.status_id, 10),
          name: item.status_display_name,
          color: item.status_color,
        }));
        setStatuses(list);
      })
      .catch((err) => {
        console.error("Failed to load statuses", err);
      });
  }, []);

  // Fetch all reports
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const countRes = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/count",
        { headers }
      );
      const countData = countRes.data.Data || {};
      setCounts({
        total_reports: countData.total_reports || 0,
        user_reports: countData.user_reports || 0,
      });

      const allRes = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report",
        { headers }
      );
      const allItems = allRes.data.Data || [];
      setAllReports(Array.isArray(allItems) ? allItems : []);
      console.log(Array.isArray(allItems) ? allItems : []);
    } catch (err) {
      console.error("Fetching reports failed", err);
    }
  };

  const handlePriorityChange = async (reportId, newPriorityId) => {
    try {
      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/admin/update-priority",
        {
          ReportId: reportId.toString(),
          PriorityId: newPriorityId,
        },
        { headers }
      );

      setAllReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId
            ? { ...r, priority_id: parseInt(newPriorityId, 10) }
            : r
        )
      );
    } catch (error) {
      console.error("Failed to update priority", error);
    }
  };

  const handleStatusChange = async (
    reportId,
    newStatusId,
    ReasonOfChanges = "test"
  ) => {
    try {
      const selectedStatus = statuses.find(
        (status) => status.id === parseInt(newStatusId, 10)
      );
      console.log(reportId, newStatusId, ReasonOfChanges, selectedStatus);
      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/admin/update-status",
        {
          ReportId: reportId.toString(),
          StatusId: newStatusId,
          ReasonOfChanges: ReasonOfChanges.toString(),
        },
        { headers }
      );

      setAllReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId
            ? {
                ...r,
                status_id: parseInt(newStatusId, 10),
                status_name: selectedStatus,
              }
            : r
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <>
      <div className="admin-panel-container-img">
        <img src={myImg} alt="Description" className="admin-panel-img" />
      </div>
      <div className="admin-panel-content-container">
        <div className="upper-content">
          <div className="left-part-text">
            <h2 className="h2-admin">Administration Control Panel</h2>
            <p className="body-admin">
              This panel lets admins update, edit, or delete any report
              submitted by users. You can view all report data and manage it
              directly from here. This panel lets admins update, edit, or delete
              any report.
            </p>
          </div>
          <div className="right-part-blocks">
            <div className="block">
              <div className="block-content">
                <div className="block-upper-part">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="admin-icon"
                  >
                    <path
                      d="M9.92279 12.5884C9.89029 12.5884 9.86862 12.5884 9.83612 12.5884C9.78195 12.5776 9.70612 12.5776 9.64112 12.5884C6.49945 12.4909 4.12695 10.0209 4.12695 6.97675C4.12695 3.87841 6.65112 1.35425 9.74945 1.35425C12.8478 1.35425 15.372 3.87841 15.372 6.97675C15.3611 10.0209 12.9778 12.4909 9.95529 12.5884C9.94445 12.5884 9.93362 12.5884 9.92279 12.5884ZM9.74945 2.97925C7.55029 2.97925 5.75195 4.77758 5.75195 6.97675C5.75195 9.14341 7.44195 10.8876 9.59779 10.9634C9.66279 10.9526 9.80362 10.9526 9.94445 10.9634C12.0678 10.8659 13.7361 9.12175 13.747 6.97675C13.747 4.77758 11.9486 2.97925 9.74945 2.97925Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M17.9178 12.7291C17.8853 12.7291 17.8528 12.7291 17.8203 12.7183C17.3762 12.7616 16.9212 12.4474 16.8778 12.0033C16.8345 11.5591 17.1053 11.1583 17.5495 11.1041C17.6795 11.0933 17.8203 11.0933 17.9395 11.0933C19.5212 11.0066 20.7562 9.70659 20.7562 8.11409C20.7562 6.46742 19.4237 5.13492 17.777 5.13492C17.3328 5.14575 16.9645 4.77742 16.9645 4.33325C16.9645 3.88909 17.3328 3.52075 17.777 3.52075C20.312 3.52075 22.3812 5.58992 22.3812 8.12492C22.3812 10.6166 20.4312 12.6316 17.9503 12.7291C17.9395 12.7291 17.9287 12.7291 17.9178 12.7291Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M9.93374 24.4291C7.81041 24.4291 5.67624 23.8874 4.06208 22.8041C2.55624 21.8074 1.73291 20.4424 1.73291 18.9583C1.73291 17.4741 2.55624 16.0983 4.06208 15.0908C7.31208 12.9349 12.5771 12.9349 15.8054 15.0908C17.3004 16.0874 18.1346 17.4524 18.1346 18.9366C18.1346 20.4208 17.3112 21.7966 15.8054 22.8041C14.1804 23.8874 12.0571 24.4291 9.93374 24.4291ZM4.96124 16.4558C3.92124 17.1491 3.35791 18.0374 3.35791 18.9691C3.35791 19.8899 3.93208 20.7783 4.96124 21.4608C7.65874 23.2699 12.2087 23.2699 14.9062 21.4608C15.9462 20.7674 16.5096 19.8791 16.5096 18.9474C16.5096 18.0266 15.9354 17.1383 14.9062 16.4558C12.2087 14.6574 7.65874 14.6574 4.96124 16.4558Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M19.8683 22.4792C19.4891 22.4792 19.1533 22.2192 19.0774 21.8292C18.9908 21.385 19.2724 20.9625 19.7058 20.865C20.3883 20.7242 21.0166 20.4534 21.5041 20.0742C22.1216 19.6084 22.4574 19.0234 22.4574 18.4059C22.4574 17.7884 22.1216 17.2034 21.5149 16.7484C21.0383 16.38 20.4424 16.12 19.7383 15.9575C19.3049 15.86 19.0233 15.4267 19.1208 14.9825C19.2183 14.5492 19.6516 14.2675 20.0958 14.365C21.0274 14.5709 21.8399 14.9392 22.5008 15.4484C23.5083 16.2067 24.0824 17.2792 24.0824 18.4059C24.0824 19.5325 23.4974 20.605 22.4899 21.3742C21.8183 21.8942 20.9733 22.2734 20.0416 22.4575C19.9766 22.4792 19.9224 22.4792 19.8683 22.4792Z"
                      fill="#6B7280"
                    />
                  </svg>
                  <p className="body-admin">Total Accounts</p>
                </div>
                <p className="big-number">240</p>
              </div>
            </div>

            <div className="block">
              <div className="block-content">
                <div className="block-upper-part">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.3333 24.6458H8.66667C2.4375 24.6458 2.4375 21.3417 2.4375 18.4167V17.3333C2.4375 14.9175 2.4375 12.1875 7.58333 12.1875C8.8725 12.1875 9.34917 12.5017 10.0208 13C10.0533 13.0325 10.0967 13.0542 10.1292 13.0975L11.2342 14.2675C12.1658 15.2533 13.8558 15.2533 14.7875 14.2675L15.8925 13.0975C15.925 13.065 15.9575 13.0325 16.0008 13C16.6725 12.4908 17.1492 12.1875 18.4383 12.1875C23.5842 12.1875 23.5842 14.9175 23.5842 17.3333V18.4167C23.5625 22.555 21.4717 24.6458 17.3333 24.6458ZM7.58333 13.8125C4.0625 13.8125 4.0625 14.9175 4.0625 17.3333V18.4167C4.0625 21.385 4.0625 23.0208 8.66667 23.0208H17.3333C20.5617 23.0208 21.9375 21.645 21.9375 18.4167V17.3333C21.9375 14.9175 21.9375 13.8125 18.4167 13.8125C17.6367 13.8125 17.4742 13.91 17.0083 14.2567L15.9575 15.3725C15.1775 16.1958 14.1267 16.6508 13 16.6508C11.8733 16.6508 10.8225 16.1958 10.0425 15.3725L8.99167 14.2567C8.52583 13.91 8.36333 13.8125 7.58333 13.8125Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M20.5834 13.8126C20.1392 13.8126 19.7709 13.4442 19.7709 13.0001V6.50008C19.7709 4.08425 19.7709 2.97925 16.2501 2.97925H9.75008C6.22925 2.97925 6.22925 4.08425 6.22925 6.50008V13.0001C6.22925 13.4442 5.86091 13.8126 5.41675 13.8126C4.97258 13.8126 4.60425 13.4442 4.60425 13.0001V6.50008C4.60425 4.08425 4.60425 1.35425 9.75008 1.35425H16.2501C21.3959 1.35425 21.3959 4.08425 21.3959 6.50008V13.0001C21.3959 13.4442 21.0276 13.8126 20.5834 13.8126Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M15.0367 10.8115H11.4292C10.985 10.8115 10.6167 10.4432 10.6167 9.99902C10.6167 9.55486 10.985 9.18652 11.4292 9.18652H15.0367C15.4809 9.18652 15.8492 9.55486 15.8492 9.99902C15.8492 10.4432 15.4917 10.8115 15.0367 10.8115Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M15.9467 7.56152H10.53C10.0859 7.56152 9.71753 7.19319 9.71753 6.74902C9.71753 6.30486 10.0859 5.93652 10.53 5.93652H15.9467C16.3909 5.93652 16.7592 6.30486 16.7592 6.74902C16.7592 7.19319 16.4017 7.56152 15.9467 7.56152Z"
                      fill="#6B7280"
                    />
                  </svg>
                  <p className="body-admin">Total Reports</p>
                </div>
                <p className="big-number">240</p>
              </div>
            </div>

            <div className="block">
              <div className="block-content">
                <div className="block-upper-part">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.9166 19.2291C11.7108 19.2291 11.5049 19.1532 11.3424 18.9907C11.0283 18.6766 11.0283 18.1566 11.3424 17.8424L12.1224 17.0624H7.58325C7.13909 17.0624 6.77075 16.6941 6.77075 16.2499C6.77075 15.8057 7.13909 15.4374 7.58325 15.4374H12.1224L11.3424 14.6574C11.1799 14.4949 11.1041 14.2891 11.1041 14.0832C11.1041 13.8774 11.1799 13.6716 11.3424 13.5091C11.6566 13.1949 12.1766 13.1949 12.4908 13.5091L14.6574 15.6757C14.7983 15.8166 14.8741 16.0007 14.8849 16.1741C14.8849 16.2282 14.8849 16.2932 14.8849 16.3474C14.8633 16.4991 14.7983 16.6399 14.6899 16.7699C14.6791 16.7807 14.6574 16.8024 14.6466 16.8132L12.4799 18.9799C12.3283 19.1532 12.1224 19.2291 11.9166 19.2291Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M16.2501 24.6459H9.75008C3.86758 24.6459 1.35425 22.1326 1.35425 16.2501V9.75008C1.35425 3.86758 3.86758 1.35425 9.75008 1.35425H15.1667C15.6109 1.35425 15.9792 1.72258 15.9792 2.16675C15.9792 2.61091 15.6109 2.97925 15.1667 2.97925H9.75008C4.75591 2.97925 2.97925 4.75591 2.97925 9.75008V16.2501C2.97925 21.2442 4.75591 23.0209 9.75008 23.0209H16.2501C21.2442 23.0209 23.0209 21.2442 23.0209 16.2501V10.8334C23.0209 10.3892 23.3892 10.0209 23.8334 10.0209C24.2776 10.0209 24.6459 10.3892 24.6459 10.8334V16.2501C24.6459 22.1326 22.1326 24.6459 16.2501 24.6459Z"
                      fill="#6B7280"
                    />
                    <path
                      d="M23.8334 11.6458H19.5001C15.7951 11.6458 14.3542 10.2049 14.3542 6.49995V2.16661C14.3542 1.84161 14.5492 1.53828 14.8526 1.41911C15.1559 1.28911 15.5026 1.36495 15.7409 1.59245L24.4076 10.2591C24.6351 10.4866 24.7109 10.8441 24.5809 11.1474C24.4509 11.4508 24.1584 11.6458 23.8334 11.6458ZM15.9792 4.12745V6.49995C15.9792 9.29495 16.7051 10.0208 19.5001 10.0208H21.8726L15.9792 4.12745Z"
                      fill="#6B7280"
                    />
                  </svg>

                  <p className="body-admin">Reports In progress</p>
                </div>
                <p className="big-number">240</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-content">
          <div className="bottom-content-upper">
            <div className="bottom-content-text-left">
              <p className="admin-upper">All report information</p>
              <p className="body-admin">View full report details here</p>
            </div>
            <button className="CTA">Add New Report</button>
          </div>
          <div className="bottom-content-table">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>DATE</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>TYPE</th>
                  <th>LOCATION</th>
                  <th>AUTHOR</th>
                </tr>
              </thead>
              <tbody>
                {allReports.map((report) => (
                  <tr key={report.report_id}>
                    <td>
                      <a href="#">{report.report_id}</a>
                    </td>
                    <td className="truncate-cell">
                      <TruncatedCell text={report.title} />
                    </td>
                    <td>{report.created_dt.split("T")[0]}</td>
                    <td>
                      <select
                        className="admin-select"
                        value={report.priority_id}
                        onChange={(e) =>
                          handlePriorityChange(report.report_id, e.target.value)
                        }
                      >
                        {priorities.map((priority) => (
                          <option key={priority.id} value={priority.id}>
                            {priority.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="admin-select"
                        value={report.status_id}
                        onChange={(e) =>
                          handleStatusChange(
                            report.report_id,
                            e.target.value,
                            "test"
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{report.problem_type_name}</td>

                    <td>
                      <TruncatedCell text={report.location} />
                    </td>
                    <td>{report.user_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
