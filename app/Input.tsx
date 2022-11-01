"use client";

import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  style: Record<string, string>;
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

const shortenUrl = async (url: string) => {
  const response = await axios.post("/shorten", { url });
  return response.data;
};

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const Input = (props: Props) => {
  const { style } = props;
  const [shortenedUrlResponse, setShortenedUrlResponse] = useState({
    shortenedUrl: "",
    base64QRCode: "",
  });
  const [displayPopup, setDisplayPopup] = useState(false);
  const [url, setUrl] = useState("");
  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (displayPopup) {
      setDisplayPopup(true);
      timeoutRef.current = setTimeout(() => {
        setDisplayPopup(false);
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayPopup]);

  const handleShorten = useCallback(async () => {
    if (urlRegex.test(url)) {
      const shortenedUrl = await shortenUrl(url);
      setShortenedUrlResponse(shortenedUrl);
    }
  }, [url]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  return (
    <div className={`width-full ${style.wrapper}`}>
      <input
        className={`${style.input} ${
          url !== "" && !urlRegex.test(url) && style.invalid
        }`}
        value={url}
        type="text"
        placeholder="Enter a URL"
        onChange={e => {
          handleChange(e);
        }}
        onKeyUp={e => {
          if (e.key === "Enter" && url !== "" && urlRegex.test(url)) {
            handleShorten();
          }
        }}
      />
      <div
        hidden={shortenedUrlResponse.shortenedUrl === ""}
        className={style.result}
      >
        <div className={style.shortenedUrl}>
          <a
            href={shortenedUrlResponse.shortenedUrl}
            target="_blank"
            rel="noreferrer"
          >
            {shortenedUrlResponse.shortenedUrl}
          </a>
          <button
            className={`${style.copy} ${displayPopup ? style.show : ""}`}
            onClick={() => {
              setDisplayPopup(true);
              navigator.clipboard.writeText(shortenedUrlResponse.shortenedUrl);
            }}
          />
        </div>
        <Image
          className={style.qrCode}
          src={`data:image/png;base64,${shortenedUrlResponse.base64QRCode}`}
          alt="QR Code"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default Input;
