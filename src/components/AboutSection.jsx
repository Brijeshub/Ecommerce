import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutSection = () => {
    const teamMembers = [
        {
            name: 'Brijesh Kumar',
            photo: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=JD',
            role: 'CEO & Founder'
        },
        {
            name: 'Brijesh Kumar',
            photo: 'https://via.placeholder.com/150x150/059669/FFFFFF?text=JS',
            role: 'CTO'
        },
        {
            name: 'Brijesh Kumar',
            photo: 'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=MJ',
            role: 'Lead Developer'
        },
        {
            name: 'Brijesh Kumar',
            photo: 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=SW',
            role: 'UI/UX Designer'
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
        }, 2000); // 1 second interval

        return () => clearInterval(interval);
    }, [teamMembers.length]);

    return (
        <div className=" relative overflow-hidden w-full h-52 bg-cyan-800 rounded-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -600, opacity: 0 }}
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 15 },
                        opacity: { duration: 0.9 }
                    }}
                    className="mb-10 absolute inset-0 flex items-center justify-center p-6 "
                >
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 ">
                        <img
                            src={teamMembers[currentIndex].photo}
                            alt={teamMembers[currentIndex].name}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-cyan-300 shadow-lg"
                        />
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-cyan-200 mb-1">
                                {teamMembers[currentIndex].name}
                            </h3>
                            <p className="text-cyan-300 text-sm md:text-base">
                                {teamMembers[currentIndex].role}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {teamMembers.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-cyan-300' : 'bg-cyan-600'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AboutSection;
