import * as React from "react"

export function useTypewriter(text: string, start: boolean, speed = 40) {
    const [display, setDisplay] = React.useState("")
    const [cursor, setCursor] = React.useState(false)

    React.useEffect(() => {
        if (!start || !text) {
        setDisplay("")
        setCursor(false)
        return
        }
        let i = 0
        setDisplay("")
        setCursor(true)
        const typing = setInterval(() => {
        if (i < text.length) {
            setDisplay(text.slice(0, i + 1))
            i++
        } else {
            clearInterval(typing)
            setCursor(false)
        }
        }, speed)
        const blink = setInterval(() => {
        if (i >= text.length) {
            setCursor(false)
            return
        }
        setCursor((c) => !c)
        }, 450)
        return () => {
        clearInterval(typing)
        clearInterval(blink)
        }
    }, [text, start, speed])
    return { display, cursor }
}