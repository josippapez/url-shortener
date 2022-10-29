"use client";

import axios from "axios";
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
  const [shortenedUrl, setShortenedUrl] = useState("");
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

  const shorten = useCallback(() => {
    shortenUrl(url).then(data => {
      setShortenedUrl(data);
    });
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
        onChange={e => setUrl(e.target.value)}
        onKeyUp={e => {
          if (e.key === "Enter" && url !== "" && urlRegex.test(url)) {
            shorten();
          }
        }}
      />
      <div hidden={shortenedUrl === ""} className={style.result}>
        <a href={shortenedUrl} target="_blank" rel="noreferrer">
          {shortenedUrl}
        </a>
        <button
          className={`${style.copy} ${displayPopup ? style.show : ""}`}
          onClick={() => {
            setDisplayPopup(true);
            navigator.clipboard.writeText(shortenedUrl);
          }}
        />
      </div>
    </div>
  );
};

export default Input;
