let leaveWarn = 'Do you really want to leave this page? All data will notbe saved';
let select = document.getElementById('languages')
let suplangs = [{
        name: 'Markdown',
        data: 'markdown'
    },
    {
        name: 'JavaScript',
        data: 'javascript'
    },
    {
        name: 'React (JSX)',
        data: 'jsx'
    },
    {
        name: 'Python',
        data: 'python'
    },
    {
        name: 'C++',
        data: 'clike'
    },
    {
        name: 'C#',
        data: 'clike'
    },
    {
        name: 'Java',
        data: 'clike'
    },
    {
        name: 'Go',
        data: 'go'
    },
    {
        name: 'Css',
        data: 'css'
    },
    {
        name: 'Vue',
        data: 'htmlmixed'
    },
    {
        name: 'YAML',
        data: 'yaml'
    },
    {
        name: 'SQL',
        data: 'sql'
    }
];

var info = document.getElementById('info');
info.innerHTML = `<b>Time:</b> ${new Date().toLocaleString()}`
setInterval(() => info.innerHTML = `<b>Time:</b> ${new Date().toLocaleString()}`, 1000)

function post() {
    if (document.editor.getValue().length == 0)
        return alert('Content cannot be empty')

    fetch(`${location.origin}/api/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: document.editor.getValue(),
            experienceTime: document.getElementById('experienceTime').value,
            language: suplangs.find(x => x.data.toLowerCase() == select.value.split('-').join('').toLowerCase()).data
        })
    }).then(response => response.json().then(response => {
        if (response.success) location.href = `/${response.id}`
        else alert(response.message)
    }))
}

function change(language) {
    let oldarena = document.getElementsByClassName('CodeMirror')[0]
    let arena = document.createElement('textarea')
    if (document.editor) arena.value = document.editor.getValue()

    if (oldarena) oldarena.remove()
    if (language) select.value = suplangs.find(x => x.name.toLowerCase() == language).data

    document.getElementById('table').appendChild(arena)
    document.editor = CodeMirror.fromTextArea(arena, {
        lineNumbers: true,
        readOnly: false,

        indentWithTabs: true,
        lineWrapping: true,

        mode: language ? suplangs.find(x => x.name.toLowerCase() == language.toLowerCase()).data : select.value,
        theme: 'material-palenight',
    })
}

for (const lang of suplangs) {
    let option = document.createElement('option')
    option.value = lang.data
    option.text = lang.name
    select.appendChild(option)

    var importtt = document.createElement('script');
    importtt.src = `/public/js/codemirror.${lang.data}.js`;
    document.head.appendChild(importtt);
}

window.onload = () => change('markdown')