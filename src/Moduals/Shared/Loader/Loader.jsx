import React from "react"; 

const Loader = ({
    message = "Loading...",
    size = "medium",
    fullScreen = false,
    overlay = false,
    spinnerColor = "success",
    textColor = "muted",
    className = "",
    showSpinner = true,
}) => {
    // Determine spinner size classes
    const spinnerSizeClass = {
        small: "spinner-border-sm",
        medium: "",
        large: "spinner-lg",
    }[size];

    // Determine container classes
    const containerClasses = [
        "d-flex",
        "flex-column",
        "align-items-center",
        "justify-content-center",
        className,
    ];

    if (fullScreen) {
        containerClasses.push("position-fixed", "top-0", "start-0", "w-100", "h-100");
        containerClasses.push(overlay ? "bg-white bg-opacity-75" : "");
        containerClasses.push("zindex-modal");
    } else {
        containerClasses.push("py-5");
    }

    return (
        <div className={containerClasses.join(" ")} role="status">
            {showSpinner && (
                <div className={`spinner-border text-${spinnerColor} ${spinnerSizeClass}`}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}

            {message && (
                <div className={`mt-3 text-${textColor}`}>
                    <p className="mb-0">{message}</p>
                </div>
            )}
        </div>
    );
};

 
export default Loader;