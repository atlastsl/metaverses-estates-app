import {useState} from "react";
import DefaultAsset from "../../assets/logo_mel.png";


function Image({src,alt,className,style}: {src: string, alt: string, className?: string | null, style?: any | null}) {

    const [error,setError] = useState(false);

    function onError(){
        setError(true);
    }

    return(
        <img
            alt={alt}
            className={error ? "img-fluid rounded-circle" : (className != null ? className : "")}
            src={error ? DefaultAsset : src}
            style={error ? { maxWidth: "100%", maxHeight:"170px" } : (style != null ? style : {})}
            onError={onError}
        />
    )

}

export default Image