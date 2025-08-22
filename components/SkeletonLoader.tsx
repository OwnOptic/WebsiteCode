import React from 'react';

const SkeletonLoader: React.FC = () => {
    return (
        <div className="bg-white text-gray-800 antialiased flex flex-col min-h-screen">
            {/* Skeleton Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-12 w-28 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="md:hidden h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </header>

            {/* Skeleton Main Content */}
            <main className="flex-grow pt-32 container mx-auto px-6">
                <div className="space-y-12">
                    {/* Hero-like section */}
                    <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    {/* Content section */}
                    <div className="space-y-4 mt-16">
                        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </main>

            {/* Skeleton Footer */}
            <footer className="bg-gray-100 mt-12">
                <div className="py-8 px-12 flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </footer>
        </div>
    );
};

export default SkeletonLoader;
