"use client";
import { Copy } from "lucide-react";
import React, { useState } from "react";

export default function CopyButton({ streamKey }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(streamKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className='flex items-center gap-2'>
            <button 
                className='bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-blue-600'
                onClick={copyToClipboard}
            >
                <Copy size={24} />
            </button>
            {copied && <span className='text-green-500'>Copied!</span>}
        </div>
    );
}
