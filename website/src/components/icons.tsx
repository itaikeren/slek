export const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {" "}
    <g clipPath="url(#clip0_105_288)">
      {" "}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H66.6667V66.6667H0V0ZM133.333 66.6667H66.6667V133.333H0V200H66.6667V133.333H133.333V200H200V133.333H133.333V66.6667ZM133.333 66.6667H200V0H133.333V66.6667Z"
        fill="url(#paint0_linear_105_288)"
      />{" "}
    </g>{" "}
    <defs>
      {" "}
      <linearGradient id="paint0_linear_105_288" x1="27.5" y1="19" x2="149" y2="174.5" gradientUnits="userSpaceOnUse">
        {" "}
        <stop stopColor="#F3ACFF" /> <stop offset="1" stopColor="#A7B5FF" />{" "}
      </linearGradient>{" "}
      <clipPath id="clip0_105_288">
        {" "}
        <rect width="200" height="200" fill="white" />{" "}
      </clipPath>{" "}
    </defs>{" "}
  </svg>
);

export const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16 8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 3.52 2 4.08 2 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 16 4.08 16 5.2 16H8m3.2 6h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-7.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 8 19.92 8 18.8 8h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 9.52 8 10.08 8 11.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C9.52 22 10.08 22 11.2 22Z"
    />
  </svg>
);

export const ConfirmedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 6 9 17l-5-5" />
  </svg>
);

export const GithubIcon = () => (
  <svg
    className="cursor-pointer text-slate-500 transition-colors hover:text-black"
    onClick={() => window.open("https://github.com/itaikeren/slek", "_blank")}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <g clip-path="url(#a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 0C5.372 0 0 5.38 0 12.02a12.02 12.02 0 0 0 8.207 11.405c.6.11.818-.26.818-.58 0-.284-.01-1.041-.015-2.043-3.339.726-4.043-1.612-4.043-1.612-.545-1.39-1.332-1.759-1.332-1.759-1.09-.744.083-.73.083-.73 1.203.085 1.837 1.239 1.837 1.239 1.07 1.836 2.809 1.306 3.492.998.11-.776.42-1.305.763-1.605-2.664-.304-5.466-1.336-5.466-5.941 0-1.312.468-2.386 1.235-3.226-.124-.304-.535-1.526.117-3.18 0 0 1.008-.324 3.3 1.231A11.477 11.477 0 0 1 12 5.813c1.02.005 2.046.138 3.005.404 2.29-1.555 3.296-1.232 3.296-1.232.655 1.655.243 2.877.12 3.181.768.84 1.234 1.914 1.234 3.226 0 4.617-2.807 5.634-5.48 5.931.431.371.814 1.104.814 2.226 0 1.606-.014 2.903-.014 3.297 0 .321.216.696.825.578A12.023 12.023 0 0 0 24 12.02C24 5.38 18.626 0 12 0Z"
        clip-rule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
