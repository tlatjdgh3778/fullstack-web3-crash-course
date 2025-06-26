"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
  label,
  placeholder,
  value,
  type = "text",
  large = false,
  onChange,
}: InputFieldProps) {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400 placeholder:text-sm text-gray-900 font-medium bg-white";
  
  const inputClasses = `${baseClasses} ${large ? "min-h-[120px]" : "h-12"}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          rows={5}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
        />
      )}
    </div>
  );
}