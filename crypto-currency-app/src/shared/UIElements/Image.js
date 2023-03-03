import React from "react";

const Image = ({src, alt, height, width, className = ''}) => {
    return <img src={src} alt={alt} height={height} width={width} />;
}

export default Image;