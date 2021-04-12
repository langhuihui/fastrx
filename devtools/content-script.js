if (document instanceof HTMLDocument) {
    const source = ';window.__FASTRX_DEVTOOLS__=true'

    if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') > -1) {
        // eslint-disable-next-line no-eval
        window.eval(source) // in Firefox, this evaluates on the content window
    } else {
        const script = document.createElement('script')
        script.textContent = source
        document.documentElement.appendChild(script)
        script.parentNode.removeChild(script)
    }
}
