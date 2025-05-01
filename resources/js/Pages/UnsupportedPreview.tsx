import React from 'react';
import { Head } from '@inertiajs/react';

interface UnsupportedPreviewProps {
  fileUrl: string;
  fileName: string;
  mimeType: string;
}

export default function UnsupportedPreview({ fileUrl, fileName, mimeType }: UnsupportedPreviewProps) {
  return (
    <>
      <Head title="Unsupported File Preview" />
      <div className="max-w-xl mx-auto mt-20 text-center p-6">
        <h1 className="text-2xl font-semibold mb-4">Preview Not Available</h1>
        <p className="text-gray-600 mb-6">
          View this file type <strong>{mimeType}</strong> in another tab.
        </p>
        <a
          href={fileUrl}
          target="_blank"  // Ensure it opens in another tab
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
         {fileName}
        </a>
      </div>
    </>
  );
}
