let leaveWarn = 'Leave from here?'
let select = document.getElementById('languages')

let info = document.getElementById('info')
info.innerHTML = `<b>Will be deleted via:</b> ${moment(document.post ? document.post.experienceTime : Date.now()).fromNow()}`

window.onload = () => {
    let arena = document.createElement('textarea')
    arena.value = document.post.content

    document.getElementById('table').appendChild(arena)
    document.editor = CodeMirror.fromTextArea(arena, {
        lineNumbers: true,
        readOnly: true,

        indentWithTabs: true,
        lineWrapping: true,

        mode: document.post.language,
        theme: 'material-palenight',
    })
}

function download() {
    let language = 'txt';
    switch (document.post.language) {
        case 'javascript':
            language = 'js'
            break

        case 'python':
            language = 'py'
            break
    }

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.post.content));
    element.setAttribute('download', `${document.post.id}.${language}`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}