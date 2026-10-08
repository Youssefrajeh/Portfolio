import React, { useState } from 'react';
import { FolderIcon } from '@/components/retro/RetroIcons';
import { skillCategories, skillsData } from '@/data/skillsData';
import type { SkillCategory, SkillCategoryFilter, SkillLevel } from '@/data/types';

// Bar fill used to visualise each proficiency level in List view
const LEVEL_FILL: Record<SkillLevel, number> = {
    Beginner: 35,
    Intermediate: 65,
    Advanced: 90,
};

// One Explorer folder per shared skill category
const folders = skillCategories
    .filter((c): c is SkillCategoryFilter & { id: SkillCategory } => c.id !== 'all')
    .map((c) => {
        const count = skillsData.filter((skill) => skill.category === c.id).length;
        return { id: c.id, label: c.name, size: `${count} file${count === 1 ? '' : 's'}` };
    });

const Skills: React.FC = () => {
    const [currentFolder, setCurrentFolder] = useState<SkillCategory | 'root'>('root');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'large' | 'list'>('large');

    const folderSkills = currentFolder === 'root' ? [] : skillsData.filter((skill) => skill.category === currentFolder);

    const handleFolderDoubleClick = (folderId: SkillCategory) => {
        setCurrentFolder(folderId);
        setSelectedItem(null);
    };

    const handleItemClick = (name: string) => {
        setSelectedItem(name);
    };

    const getPathString = () => {
        if (currentFolder === 'root') return 'C:\\Skills';
        const folderName = folders.find(f => f.id === currentFolder)?.label || '';
        return `C:\\Skills\\${folderName}`;
    };

    const getItemsCount = () => {
        if (currentFolder === 'root') return folders.length;
        return folderSkills.length;
    };

    const getSelectedItemDetails = () => {
        if (!selectedItem) return null;
        if (currentFolder === 'root') {
            const f = folders.find(fold => fold.id === selectedItem);
            return f ? `Folder: ${f.label} (${f.size})` : null;
        } else {
            const s = folderSkills.find(skill => skill.name === selectedItem);
            return s ? `Skill: ${s.name} | Proficiency: ${s.level}` : null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-xs select-none" style={{ minHeight: '340px' }}>
            {/* Explorer Toolbar */}
            <div className="win95-raised p-1 border-b-2 border-[#808080] flex flex-wrap items-center justify-between text-black gap-2">
                <div className="flex items-center gap-1.5">
                    {/* Back/Up Button */}
                    <button 
                        onClick={() => {
                            setCurrentFolder('root');
                            setSelectedItem(null);
                        }}
                        disabled={currentFolder === 'root'}
                        className="win95-button py-0.5 px-2 font-bold flex items-center gap-1 text-[11px]"
                    >
                        <span>⬆</span> Up
                    </button>
                    {/* Path box */}
                    <div className="win95-sunken bg-white px-2 py-0.5 border flex items-center min-w-[150px] text-[11px] font-mono truncate select-text">
                        <span className="text-[#808080] mr-1">Address:</span>
                        {getPathString()}
                    </div>
                </div>

                {/* View Modes */}
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setViewMode('large')}
                        className={`win95-button py-0.5 px-2 text-[11px] ${viewMode === 'large' ? 'win95-button-pressed font-bold' : ''}`}
                    >
                        Large Icons
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`win95-button py-0.5 px-2 text-[11px] ${viewMode === 'list' ? 'win95-button-pressed font-bold' : ''}`}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Folder Content pane */}
            <div className="win95-sunken bg-white p-3 flex-1 overflow-auto border-2 min-h-[220px]">
                {currentFolder === 'root' ? (
                    // Display folders
                    <div className={viewMode === 'large' 
                        ? "grid grid-cols-2 sm:grid-cols-4 gap-4 p-2" 
                        : "flex flex-col gap-1.5 p-1"
                    }>
                        {folders.map((folder) => {
                            const isSelected = selectedItem === folder.id;
                            return (
                                <div
                                    key={folder.id}
                                    onClick={() => handleItemClick(folder.id)}
                                    onDoubleClick={() => handleFolderDoubleClick(folder.id)}
                                    className={`flex items-center cursor-pointer p-1.5 rounded gap-2 ${
                                        viewMode === 'large' ? 'flex-col text-center w-24 mx-auto' : 'flex-row'
                                    } ${isSelected ? 'bg-[#000080] text-white' : 'hover:bg-[#dfdfdf]'}`}
                                >
                                    <FolderIcon size={viewMode === 'large' ? 32 : 16} />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs truncate max-w-[80px]">{folder.label}</span>
                                        {viewMode === 'list' && (
                                            <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                                                {folder.size}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Display files inside folder
                    <div className={viewMode === 'large' 
                        ? "grid grid-cols-2 sm:grid-cols-4 gap-4 p-2" 
                        : "flex flex-col gap-1.5 p-1"
                    }>
                        {folderSkills.map((skill) => {
                            const isSelected = selectedItem === skill.name;
                            return (
                                <div
                                    key={skill.name}
                                    onClick={() => handleItemClick(skill.name)}
                                    className={`flex items-center cursor-pointer p-1.5 rounded gap-2 ${
                                        viewMode === 'large' ? 'flex-col text-center w-24 mx-auto' : 'flex-row'
                                    } ${isSelected ? 'bg-[#000080] text-white' : 'hover:bg-[#dfdfdf]'}`}
                                >
                                    {/* Pixel style File representation */}
                                    <div className="flex items-center justify-center bg-gray-100 border border-gray-400 w-8 h-8 rounded select-none p-1">
                                        <img src={skill.icon} alt="" className="w-full h-full object-contain" draggable={false} />
                                    </div>
                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                        <span className="font-semibold text-xs truncate max-w-[80px]">{skill.name}</span>
                                        {/* Skill progress bar in List mode */}
                                        {viewMode === 'list' ? (
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="w-16 bg-gray-300 h-2 border border-gray-500 overflow-hidden flex">
                                                    <div 
                                                        className="bg-blue-800 h-full" 
                                                        style={{ width: `${LEVEL_FILL[skill.level]}%` }} 
                                                    />
                                                </div>
                                                <span className="text-[10px]">{skill.level}</span>
                                            </div>
                                        ) : (
                                            <span className={`text-[9px] ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                                                {skill.level}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Explorer Status Bar */}
            <div className="win95-sunken-gray py-1 px-2.5 flex justify-between items-center text-[10px] text-gray-700 border-2 select-none">
                <span>{getItemsCount()} object(s)</span>
                <span className="font-semibold text-[#000080]">
                    {getSelectedItemDetails() || 'Select an item to view properties'}
                </span>
            </div>
        </div>
    );
};

export default Skills;
