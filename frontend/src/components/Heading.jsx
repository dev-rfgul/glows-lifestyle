
const Home = ({ heading, subHeading }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-10 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                {heading}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
                {subHeading}
            </p>
            
        </div>

    )
}

export default Home