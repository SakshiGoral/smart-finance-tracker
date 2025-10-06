import React from 'react';

const Have = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Have
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg text-gray-600 mb-4">
            Welcome to the Have page.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Section 1</h2>
              <p className="text-blue-700">This is the first section of your have page.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-2">Section 2</h2>
              <p className="text-green-700">This is the second section of your have page.</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-400 text-center">
          Generated from prompt: "I have a React login page and I want to add a **pop-up modal component** that can show messages like login success, errors, or hints. Please provide complete React code that includes:

1. A reusable **Modal component** with title, message, and close button.
2. Smooth **enter/exit animations** for the modal using Framer Motion or CSS transitions.
3. Ability to trigger the modal from the login page on **events** such as:
   - Successful login
   - Invalid credentials
   - Info or hint messages
4. Optional **overlay background** with slight transparency that closes the modal when clicked outside.
5. Responsive design so it looks good on both desktop and mobile.
6. Include **props for customization**: title text, message text, type (success/error/info), and optional callback on close.
7. Provide comments explaining how to integrate the modal into the existing login page without breaking current functionality."
        </div>
      </div>
    </div>
  );
};

export default Have;