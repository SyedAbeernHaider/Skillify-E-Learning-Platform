import React from 'react';

const Hero = () => {
    return (
        <div className="bg-purple-100">
            <div className="container mx-auto px-2 sm:px-6 lg:px-20 py-20 flex flex-col md:flex-row items-center">
                
                <div className="md:w-1/2 text-center md:text-left">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto md:mx-0">
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                            Learn the skills that shape your future.
                        </h1>

                        <p className="text-lg text-gray-600 mb-8">
                            Learning with Skillify pays off. Get started with courses from just $9.99 and build the future you want.
                        </p>

                        <a
                            href="#"
                            className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-md hover:bg-purple-700 transition-transform transform hover:scale-105"
                        >
                            Start Learning Today
                        </a>

                    </div>
                </div>

                <div className="md:w-1/2 mt-12 md:mt-0">
                    <img
                        src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
                        alt="A smiling person learning online"
                        className="rounded-lg shadow-2xl w-full h-auto"
                    />
                </div>

            </div>
        </div>
    );
}
export default Hero;