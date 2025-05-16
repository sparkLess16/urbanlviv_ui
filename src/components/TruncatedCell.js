import { useRef, useState, useEffect } from "react";

const TruncatedCell = ({ text }) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setIsTruncated(true);
    }
  }, [text]);

  return (
    <div className="truncate-cell">
      <div ref={textRef} className="truncate-text">
        {text}
      </div>
      {isTruncated && <div className="custom-tooltip">{text}</div>}
    </div>
  );
};

export default TruncatedCell;
