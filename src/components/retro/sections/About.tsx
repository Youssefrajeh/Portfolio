import React, { useState } from 'react';
import { CONTACT, CV_PATH, withBasePath } from '@/lib/site';

const About: React.FC = () => {
    const initialText = `ABOUT ME
=========
I am a full-stack software developer and IT support specialist with a background in Applied Chemistry, 5 years of hands-on computer sales and service experience, and 15+ years in manufacturing quality control and production leadership. Completing the Computer Programming and Analysis Advanced Diploma (Co-op) at Fanshawe College in December 2026 (3.97 GPA, Dean's Honour Roll).

PROFESSIONAL JOURNEY
--------------------
From diagnosing hardware/OS issues, installing Windows and drivers, and upgrading RAM/drives to deploying containerized full-stack web apps with Docker and managing DNS in AWS, I combine hands-on technical troubleshooting with calm root-cause analysis and clear documentation.

LANGUAGES SPOKEN
----------------
* Arabic: Native / Fluent
* English: Advanced
* French: Beginner

CONTACT INFO
------------
Location: ${CONTACT.location}
Email: ${CONTACT.email}
Phone: ${CONTACT.phone}`;

    const [text, setText] = useState(initialText);

    return (
        <div className="flex flex-col h-full font-mono text-black text-xs select-text" style={{ minHeight: '300px' }}>
            <textarea 
                className="w-full flex-1 p-2 border-none outline-none resize-none font-mono text-xs select-text focus:ring-0 bg-white text-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
            />
            {/* Status Bar */}
            <div className="flex justify-between items-center mt-1 pt-1.5 px-2 bg-[#c0c0c0] win95-sunken-gray py-1 border-2">
                <span className="text-[10px] text-gray-700 font-sans">For Help, press F1</span>
                <a 
                  href={withBasePath(CV_PATH)} 
                  download 
                  className="win95-button text-xs font-semibold py-0.5 px-3 text-black border-2 flex items-center gap-1 hover:no-underline"
                >
                  💾 Save & Download CV
                </a>
            </div>
        </div>
    );
};

export default About;
