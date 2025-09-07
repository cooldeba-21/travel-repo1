// client/components/GoogleIcon.tsx
import React from "react";

type Props = {
  className?: string;
};

const GoogleIcon: React.FC<Props> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
    width="20"
    height="20"
  >
    <path
      fill="#4285F4"
      d="M488 261.8c0-17.5-1.6-34.3-4.7-50.6H249v95.8h135.6c-5.8 31.2-23.4 57.6-50 75.2v62h80.8c47.2-43.4 72.6-107.3 72.6-182.4z"
    />
    <path
      fill="#34A853"
      d="M249 498c67.6 0 124.2-22.4 165.6-60.8l-80.8-62c-22.4 15-51 24-84.8 24-65 0-120-43.8-139.6-102.8h-82.2v64.8C85.8 448 161.8 498 249 498z"
    />
    <path
      fill="#FBBC05"
      d="M109.4 296.4c-4.6-13.8-7.2-28.4-7.2-43.4s2.6-29.6 7.2-43.4v-64.8H27.2C9.6 175.2 0 211.6 0 253s9.6 77.8 27.2 108.2l82.2-64.8z"
    />
    <path
      fill="#EA4335"
      d="M249 97c36.8 0 69.8 12.6 95.6 37.2l71.6-71.6C373.2 25.6 316.6 0 249 0 161.8 0 85.8 50 49.4 126.6l82.2 64.8C129 140.8 184 97 249 97z"
    />
  </svg>
);

export default GoogleIcon;
