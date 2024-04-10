import * as React from 'react';
import { createPortal } from 'react-dom';

interface CustomTabProps {
    event: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomTab: React.FC<CustomTabProps> = ({event}) => {
    const [domReady, setDomReady] = React.useState(false)
    
    React.useEffect(() => {
        setDomReady(true);
    }, []);

    return domReady ? 
        createPortal(
            <button className='add-button add-button-animation' onClick={event}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>
        , document.querySelector('.chrome-tabs')) 
        : 
        null
    ;
}

export default CustomTab;