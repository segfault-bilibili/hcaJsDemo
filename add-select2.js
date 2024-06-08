(async () => {
    let resp = await fetch(new URL('magireco-bgm.json', document.baseURI));
    let text = await resp.text();
    const magireco_bgm = JSON.parse(text);

    const jqUrl = new URL('lib/jquery-3.7.1.min.js', document.baseURI);
    const select2JsUrl = new URL('lib/select2-4.1.0-rc.0/js/select2.min.js', document.baseURI);
    const select2CssUrl = new URL('lib/select2-4.1.0-rc.0/css/select2.min.css', document.baseURI);
    const select2CssId = 'select2Css';

    if (document.getElementById(select2CssId)) return;

    await import(jqUrl);

    const head  = document.getElementsByTagName('head')[0];
    const link  = document.createElement('link');
    link.id   = select2CssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = select2CssUrl;
    link.media = 'all';
    head.appendChild(link);

    await import(select2JsUrl);

    const newH3 = document.createElement('h3');
    newH3.innerText = 'Choose a sample BGM to play';

    const select = document.createElement('select');
    select.name = 'bgm';
    select.id = 'bgm-selector';
    let option = document.createElement('option');
    option.value = '';
    option.innerText = 'Please select one';
    select.appendChild(option);
    magireco_bgm.forEach(group => {
        let optgroup = document.createElement('optgroup');
        optgroup.label = group.groupname;
        group.entries.forEach(entry => {
            let option = document.createElement('option');
            option.value = entry.filename;
            option.innerText = `${entry.filename} ${entry.desc}`;
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    });

    let h3 = document.getElementById('shutdownbtn');
    while (h3.tagName == null || h3.tagName.toLowerCase() !== 'h3') h3 = h3.nextSibling;

    document.body.insertBefore(newH3, h3);
    document.body.insertBefore(select, h3);
    document.body.insertBefore(document.createElement('br'), h3);
    document.body.insertBefore(document.createElement('hr'), h3);

    $('#bgm-selector').select2();

    if (magireco_bgm.find(group => group.entries.find(entry =>
        `#${entry.filename}` === window.location.hash
    ) != null) != null) {
        $('#bgm-selector').val(window.location.hash.replace(/^#/, ''));
        $('#bgm-selector').trigger('change');
    }

    $('#bgm-selector').on('change', (ev) => {
        let filename = ev.target.value;
        if (
            filename == null || filename === ''
            || `#${filename}` === window.location.hash
        ) return;
        window.location.hash = `#${filename}`;
    });
})();
