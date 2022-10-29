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

const Input = (props: Props) => {
  const { style } = props;
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [displayPopup, setDisplayPopup] = useState(false);
  const url = useRef("");
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
    shortenUrl(url.current).then(data => {
      setShortenedUrl(data);
    });
  }, []);

  return (
    <div className={`width-full ${style.wrapper}`}>
      <input
        className={style.input}
        type="text"
        placeholder="Enter a URL"
        onChange={e => (url.current = e.target.value)}
        onKeyUp={e => {
          if (e.key === "Enter" && url.current && url.current !== "") {
            shorten();
          }
        }}
      />
      <div hidden={shortenedUrl === ""} className={style.result}>
        <a href={shortenedUrl} target="_blank" rel="noreferrer">
          {shortenedUrl}
        </a>
        <button
          className={style.copy}
          onClick={() => {
            setDisplayPopup(true);
            navigator.clipboard.writeText(shortenedUrl);
          }}
        />
        <div className={`${style.popup} ${!displayPopup && style.show}`}>
          <div className={style.popupText}>Copied to clipboard</div>
        </div>
      </div>
    </div>
  );
};

export default Input;
