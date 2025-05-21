import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Verification.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Verification = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const [ok, setOk] = useState(null);

    useEffect(() => {
        const token = query.get("token");
        if (!token) {
            setOk(false);
            return;
        }

        axios
            .get(
                `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/verify-account?token=${encodeURIComponent(token)}`
            )
            .then(() => setOk(true))
            .catch(() => setOk(false));
    }, [query]);

    if (ok === null) {
        return (
            <div className="verification-container">
                <h2 className="verification-title">Verifying…</h2>
                <p className="description">Please wait.</p>
            </div>
        );
    }

    return (
        <div className="verification-container">
            <h2 className="verification-title">
                {ok ? "Account Verified!" : "Verification Failed"}
            </h2>
            <p className="description">
                {ok
                    ? "Your account has been successfully verified."
                    : "Unable to verify your account. Please try again or contact support."}
            </p>
            <button
                className="login-button"
                onClick={() => navigate(ok ? "/login" : "/register")}
            >
                {ok ? "Go to Login" : "Back to Registration"}
            </button>
        </div>
    );
};

export default Verification;
