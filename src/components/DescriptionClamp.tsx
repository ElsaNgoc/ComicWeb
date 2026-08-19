"use client";

import { useState } from "react";

export function DescriptionClamp({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 180;

  return (
    <div className="space-y-2">
      <p
        className={`whitespace-pre-wrap text-[0.95rem] leading-relaxed text-muted ${
          !open && long ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="link-soft text-sm font-medium"
        >
          {open ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}
