import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from 'react-chrome-tabs';
import { TabProperties } from 'react-chrome-tabs/dist/chrome-tabs'
import 'react-chrome-tabs/css/chrome-tabs.css';
import 'react-chrome-tabs/css/chrome-tabs-dark-theme.css';
import cn from 'classnames';
import TabPanel from './components/TabPanel';
import { createPortal } from 'react-dom';
import CustomTab from './components/CustomTab';

let isDark = true;

const loadTheme = async () => {
    isDark = await (window as any).api.theme();
}
  
loadTheme()

const App = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tabs, setTabs] = useState<TabProperties[]>([
        { id: "abc", title: "tab 1", active: true },
        { id: "abcd", title: "tab 2" },
        { id: "abcde", title: "tab 3" },
    ]);
    
    const [activeTab, setActiveTab] = useState('');

    // React.useEffect(() => {
    //     //Handle for add custom button for rendered element
    //     // if (!document.querySelector('#button-add')) {
    //     //     // const obj = document.querySelector('.chrome-tabs');
    //     //     // const addBtn = document.createElement("button");
    //     //     // addBtn.id = 'button-add';
    //     //     // addBtn.classList.add("button-test");
    //     //     // addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`
    //     //     // addBtn.addEventListener("click", addTab);

    //     //     // obj.prepend(addBtn);
    //     // }
    // }, []);

    useEffect(() => {
        try {
            //Handle for active tab
            const el = document.querySelector('.chrome-tab[active]').getAttribute('data-tab-id');
            if (el)
                setActiveTab(el);
            else
                setActiveTab('');
        } catch (error) {
            // console.log(error);
            setActiveTab('');
        }
        
    }, [tabs])

    const addTab = () => {
        setTabs(prevTabs => [
            ...prevTabs,
            {
                id: `tab-id-${crypto.randomUUID()}`,
                title: `New Tabs`,
                // favicon: tabs.length % 2 ? fb : google,
            },
        ]);
    };
    
    const active = (id: string) => {
        if (isEditing) return;
        setTabs(tabs.map((tab) => ({ ...tab, active: id === tab.id })));
    };
    
    const close = async (id: string) => {
        const result = await (window as any).api.msgbox();
        if (result.response === 1) return;

        setTabs(tabs.map((tab) => ({ ...tab, active: id === tab.id })).filter((tab) => tab.id !== id));
    };
    
    const reorder = (tabId: string, fromIndex: number, toIndex: number) => {
        const beforeTab = tabs.find(tab => tab.id === tabId);
        if (!beforeTab) {
            return;
        }
        let newTabs = tabs.filter(tab => tab.id !== tabId);
        newTabs.splice(toIndex, 0, beforeTab);

        setTabs(newTabs);
    };

    const oncontext = (id: string, event: MouseEvent) => {
        console.log(id);
    }

    const doubleclick = (tabId: string, event: MouseEvent) => {
        setIsEditing(true);
        const tabEL = tabs.find(x => x.id === tabId);

        const el = document.querySelector(`[data-tab-id=${tabId}]`);
        
        if (!el) return;
        const el_content = el?.querySelector('.chrome-tab-content');
    
        el!.querySelector('.chrome-tab-title')!.innerHTML = '';
    
        const edit_title = document.createElement('input');
        edit_title.className = 'edit-tab';
        edit_title.id = `edit-tab-${tabId}`;
        edit_title.value = tabEL?.title as string;

        const finishEdit = () => {
            setTabs(prevTabs => {
                return prevTabs.map(tab => {
                    if (tab.id === tabEL?.id) {
                        return { ...tab, title: edit_title.value };
                    }
                    return tab;
                });
            });
            setIsEditing(false);
            el!.querySelector('.chrome-tab-title')!.innerHTML = edit_title.value;
        };

        edit_title.addEventListener('keypress', (ev) => {
            if (ev.key === 'Enter') {
                finishEdit();
                edit_title.blur();
            }
        })
        edit_title.addEventListener('focusout', () => {
            finishEdit();
            edit_title.remove();
        })
    
        el_content?.appendChild(edit_title);
        edit_title.focus();
    }

    const closeAll = () => setTabs([]);
    
    return (
        <>
            <div className='relative'>
                <div className={cn('fixed', 'w-full', 'titlebar', isDark ? 'dark' : 'light')}>
                    <div  
                        style={{
                            width: "calc(100% - 165px)"
                        }}
                    >
                        <CustomTab event={addTab} />
                        <Tabs
                            darkMode={isDark}
                            onTabClose={close}
                            onTabReorder={reorder}
                            onTabActive={active}
                            onContextMenu={oncontext}
                            onDoubleClick={doubleclick}
                            tabs={tabs}
                        ></Tabs>
                        {/* {
                            const obj = document.querySelector('.chrome-tabs');
                            const addBtn = document.createElement("button");
                            addBtn.id = 'button-add';
                            addBtn.classList.add("button-test");
                            addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`
                            addBtn.addEventListener("click", addTab);
                        } */}
                        {/* {createPortal(
                            <button className='button-test'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                            </button>
                        , document.querySelector('.chrome-tabs'))} */}
                    </div>

                </div>
                <div id='container' className={cn('fixed', 'main-container', isDark ? 'dark' : 'light')} style={{
                    height: "calc(100% - 46px)",
                    bottom: 0
                }}>
                    {
                        tabs.map(tab => (
                            <TabPanel key={tab.id} index={tab.id} value={activeTab} />
                        ))
                    }
                </div>
            </div>


        </>
    );
}

let root: HTMLDivElement | null = document.getElementById("root") as HTMLDivElement | null;

if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
}

const dom = createRoot(root);

dom.render(<App />)