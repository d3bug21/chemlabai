
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
        <div className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                ChemLab AI
            </h1>
        </div>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
            Visualize the invisible. Combine reactants and witness stunning chemical reactions unfold.
        </p>
    </header>
  );
};

export default Header;
