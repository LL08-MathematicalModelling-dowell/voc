import npsScale from "../assets/nps-scale.png";
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Scales() {
  const navigate = useNavigate();
  const buttons = Array.from({ length: 11 }, (_, i) => i);
  const [submitted, setSubmitted] = useState(-1);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workspace_id = searchParams.get("workspace_id");
  const username = searchParams.get("username");
  const scale_id = searchParams.get("scale_id");
  const channel = searchParams.get("channel");
  const instance = searchParams.get("instance_name");

  const allParamsPresent = workspace_id && username && scale_id && channel && instance;

  async function handleClick(index) {
    setSubmitted(index);
    if (!allParamsPresent) {
      return; 
    }
    const url = `https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=${channel}&instance=${instance}&workspace_id=${workspace_id}&username=${username}&scale_id=${scale_id}&item=${index}`;
    

    window.location.href = url;
  }

  if (!allParamsPresent) {
    return (
      <div className="h-full w-screen flex flex-col justify-center items-center p-4">
        <p className="text-lg font-bold text-red-500">
          You are not authorized to use this page.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-screen relative pb-16 pt-5">
      <div className="w-full flex flex-col justify-center items-center p-2">
        <img
          className="w-[100px]"
          src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png"
          alt="Dowell Logo"
        />
      </div>
      <div className="flex flex-col justify-center items-center p-2 mt-10 sm:mt-0 gap-8">
        <img src={npsScale} alt="NPS Scale" className="w-[350px] sm:w-[450px]" />
        <p className="font-bold text-red-500 sm:text-[25px] text-[18px] text-center">
          Would you recommend our product/service to your friends and colleagues?
        </p>
        <p className="sm:text-[18px] text-[14px] text-center">
          Tell us what you think using the scale below!
        </p>
      </div>

      <div className="flex justify-center items-center gap-1 md:gap-3 mt-12 sm:m-5">
        <style>
          {`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
            
            .loader {
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 3px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top-color: #fff;
              animation: spin 1s linear infinite;
            }
          `}
        </style>
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`sm:px-5 sm:p-2 p-[2px] px-[8px] rounded-full font-bold text-[14px] md:text-[20px]
              hover:bg-blue-600 transition-colors ${submitted === index ? "bg-blue-600 text-white flex justify-center items-center" : "bg-[#ffa3a3]"}`}
            onClick={() => handleClick(index)}
            disabled={submitted !== -1}
          >
            {submitted === index ? <div className="loader"></div> : button}
          </button>
        ))}
      </div>

      <p className="w-full absolute bottom-0 mt-4 flex justify-center items-center text-[12px] sm:text-[14px]">
        Powered by uxlivinglab
      </p>
    </div>
  );
}
