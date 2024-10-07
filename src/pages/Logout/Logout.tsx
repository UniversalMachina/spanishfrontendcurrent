import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../LoginContext";

const Logout: React.FC = () => {
  const { logout } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/signup");
  }, [logout, navigate]);

  return null;
};

export default Logout;