// Customizable search engines
const SEARCH_ENGINES = [
    {
        id: 'google',
        title: 'Google',
        searchUrl: 'https://www.google.com/search?q=%s'
    },
    {
        id: 'bing',
        title: 'Bing',
        searchUrl: 'https://www.bing.com/search?q=%s'
    },
    {
        id: 'yahoo',
        title: 'Yahoo',
        searchUrl: 'https://search.yahoo.com/search?p=%s'
    },
    {
        id: 'custom-site',
        title: 'Custom Site',
        searchUrl: 'https://example.com/search/%s',
        transform: (text) => text.trim().replace(/\s+/g, '-').toLowerCase()
    }
];

const PARENT_ID = 'search_selection_parent';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: PARENT_ID,
        title: 'Search with...',
        contexts: ['selection']
    });

    for (const engine of SEARCH_ENGINES) {
        chrome.contextMenus.create({
            id: engine.id,
            parentId: PARENT_ID,
            title: engine.title,
            contexts: ['selection']
        });
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!info.selectionText) return;
    const engine = SEARCH_ENGINES.find(e => e.id === info.menuItemId);
    if (engine) {
        let searchTerm = info.selectionText;
        if (engine.transform) {
            searchTerm = engine.transform(searchTerm);
        } else {
            searchTerm = encodeURIComponent(searchTerm);
        }
        const url = engine.searchUrl.replace('%s', searchTerm);
        chrome.tabs.create({ url });
    }
});
