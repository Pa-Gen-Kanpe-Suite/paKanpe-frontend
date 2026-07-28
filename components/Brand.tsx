import React from "react";

export function Brand({ className }: BrandProps) {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      className="mx-auto mt-4"
      style={{
        width: "120px",
        height: "auto",
      }}
    />
  );
}
