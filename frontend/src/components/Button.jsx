const colorMap = {
        blue: "border-blue-500 from-blue-400 to-blue-500 hover:from-blue-500",
        red: "border-red-500 from-red-400 to-red-500 hover:from-red-500",
        green: "border-green-500 from-green-400 to-green-500 hover:from-green-500",
    }

function Button({ children, color = "blue", className = "", ...props }) {
    const colorClasses = colorMap[color] || colorMap.blue;

    return (
        <button
            className={`w-[20vw] h-[10vh] border-1 bg-gradient-to-r ${colorClasses} rounded-[10px] text-center text-white text-shadow-md/20 shadow-md/30 hover:cursor-pointer hover:bg-gradient-to-br hover:shadow-lg/30 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button