import * as React from 'react';
import cn from 'classnames';

interface TabPanelProps {
    index: string;
    value?: string;
    visible?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({index, value}) => {
    return (
        <div
            role="tabpanel"
            className={cn('tab-panel')}
            style={{
                display: value !== index ? 'none' : 'block'
            }}
            id={`tab-id-view-${index}`}
            aria-labelledby={`tab-id-${index}`}
        >
            <webview 
                className="wview"
                id={`wview-${index}`}
                src="https://web.whatsapp.com/"
                
                partition={`persist:${index}`}></webview>
        </div>
    );
}

export default TabPanel;