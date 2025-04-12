'use client';
import React, { useState } from "react";
import { updateStreamTitle } from "@/app/lib/actions";
import { Pencil, Check, X } from "lucide-react"; // Import icons from lucide-react

export default function EditButton({ streamId, initialTitle }) {
    const [title, setTitle] = useState(initialTitle);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(initialTitle);

    const handleEdit = async () => {
        const updatedStream = await updateStreamTitle(streamId, newTitle);
        if (updatedStream) {
            setTitle(newTitle);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <input 
                        type='text' 
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)} 
                        className='border p-2 rounded-lg'
                    />
                    <button 
                        className='bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600'
                        onClick={handleEdit}
                    >
                        <Check size={24} />
                    </button>
                    <button 
                        className='bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600'
                        onClick={() => setIsEditing(false)}
                    >
                        <X size={24} />
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold"> {title} </h2>
                    <button 
                        className='bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-blue-600' 
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil size={15} />
                    </button>
                </>
            )}
        </div>
    );
}
