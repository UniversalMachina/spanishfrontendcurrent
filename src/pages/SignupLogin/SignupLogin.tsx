import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../../LoginContext";
import { FaUser, FaLock, FaGoogle } from 'react-icons/fa'; // Import React Icons
import { AdminSignupPageComponent } from "../../components/adminloginpage";



const ExpertSignUp: React.FC = () => {
  return (
    <div className="w-full h-[1080px] relative rounded-[24px] bg-[#fff] overflow-hidden leading-[normal] tracking-[normal] mq450:h-auto mq450:min-h-[1080]">

      <AdminSignupPageComponent/>
    </div>
  );
};

export default ExpertSignUp;
