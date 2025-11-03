// ui/QuillContentRenderer.jsx
import React from "react";

type Content = {
  content: string;
  className?: string;
};

const HtmlRenderer = ({ content, className = "" }: Content) => {
  if (!content) return null;

  return (
    <>
      {/* Quill Editor CSS Styles */}
      <link
        rel="stylesheet"
        href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
      />

      {/* ან გლობალური CSS-ში დაამატეთ ეს სტილები */}
      <style jsx>{`
        .ql-editor {
          padding: 12px 15px;
          border: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          font-size: 14px;
          line-height: 1.42;
          color: #333;
        }

        .ql-editor h1 {
          font-size: 2em;
          margin: 0.67em 0;
          font-weight: bold;
        }

        .ql-editor h2 {
          font-size: 1.5em;
          margin: 0.83em 0;
          font-weight: bold;
        }

        .ql-editor h3 {
          font-size: 1.17em;
          margin: 1em 0;
          font-weight: bold;
        }

        .ql-editor strong {
          font-weight: bold;
        }

        .ql-editor em {
          font-style: italic;
        }

        .ql-editor u {
          text-decoration: underline;
        }

        .ql-editor s {
          text-decoration: line-through;
        }

        .ql-editor ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .ql-editor ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .ql-editor li {
          margin: 0.5em 0;
        }

        .ql-editor p {
          margin: 1em 0;
        }

        .ql-editor blockquote {
          border-left: 4px solid #ccc;
          margin: 1em 0;
          padding-left: 1em;
          font-style: italic;
        }

        .ql-editor a {
          color: #007bff;
          text-decoration: none;
        }

        .ql-editor a:hover {
          text-decoration: underline;
        }

        .ql-editor img {
          max-width: 100%;
          height: auto;
        }

        .ql-editor pre {
          background-color: #f4f4f4;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1em;
          overflow-x: auto;
          font-family: monospace;
        }

        .ql-editor code {
          background-color: #f4f4f4;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        /* Color classes */
        .ql-editor .ql-color-red {
          color: #e60000;
        }

        .ql-editor .ql-color-orange {
          color: #f90;
        }

        .ql-editor .ql-color-yellow {
          color: #ff0;
        }

        .ql-editor .ql-color-green {
          color: #008a00;
        }

        .ql-editor .ql-color-blue {
          color: #06c;
        }

        .ql-editor .ql-color-purple {
          color: #93f;
        }

        /* Background color classes */
        .ql-editor .ql-bg-red {
          background-color: #e60000;
        }

        .ql-editor .ql-bg-orange {
          background-color: #f90;
        }

        .ql-editor .ql-bg-yellow {
          background-color: #ff0;
        }

        .ql-editor .ql-bg-green {
          background-color: #008a00;
        }

        .ql-editor .ql-bg-blue {
          background-color: #06c;
        }

        .ql-editor .ql-bg-purple {
          background-color: #93f;
        }

        /* Alignment classes */
        .ql-editor .ql-align-center {
          text-align: center;
        }

        .ql-editor .ql-align-right {
          text-align: right;
        }

        .ql-editor .ql-align-justify {
          text-align: justify;
        }

        /* Font size classes */
        .ql-editor .ql-size-small {
          font-size: 0.75em;
        }

        .ql-editor .ql-size-large {
          font-size: 1.5em;
        }

        .ql-editor .ql-size-huge {
          font-size: 2.5em;
        }

        /* Indent classes */
        .ql-editor .ql-indent-1 {
          padding-left: 3em;
        }

        .ql-editor .ql-indent-2 {
          padding-left: 6em;
        }

        .ql-editor .ql-indent-3 {
          padding-left: 9em;
        }

        /* Font family classes */
        .ql-editor .ql-font-serif {
          font-family: Georgia, serif;
        }

        .ql-editor .ql-font-monospace {
          font-family: Monaco, "Courier New", monospace;
        }
      `}</style>

      <div
        className={`ql-editor ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};

export default HtmlRenderer;
