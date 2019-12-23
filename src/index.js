import {h, Lazy} from "hyperapp"
/// from hyperapp lib
const rawEvent = name => 
    (fx => action => [fx, { action: action }])
    ((dispatch, props) => {
        const listener = ev => dispatch(props.action, event)
        addEventListener(name, listener)
        return () => removeEventListener(name, listener)
    })


export const transitionSub = rawEvent("needupdate")(state => ({ ...state }))
const compareKey = (key1, key2) => key1 < key2 ? -1 : key1 === key2 ? 0 : 1

export const makeTransitionGroup = () => {
    const obj = {};

    const handleTransitionEnd = (state, key) => {
        if (!obj[key])
            return state
        if (obj[key].status === "leaving") {
            delete obj[key]
            return { ...state }
        }
        return state;
    }

    const itemProps = key => ({
        ontransitionend: [handleTransitionEnd, key]
    })

    const patchView = key => vdom => ({ ...vdom, key, props: { ...itemProps(key), ...vdom.props } })

    return ({ tag, props, items, getKey }, viewItem =>
        // dummy object to force the evaluation of the lazy view at each update
        Lazy({
            items: items, dummy: {}, view: ({ items }) => {
                let atLeastOneNew = false
                const itemKeys = {}
                items.forEach((item, i) => {
                    const key = getKey(item)
                    itemKeys[key] = true
                    if (key in obj) {
                        const status = obj[key].status
                        obj[key].item = item
                        obj[key].status = status === "entering" ? "entered" : status
                        if (status !== "leaving")
                            obj[key].index = i
                    }
                    else {
                        obj[key] = { item, index: i, status: "entering" }
                        atLeastOneNew = true
                    }
                })
                for (let key in obj) {
                    if (obj[key].status !== "leaving" && !(key in itemKeys)) {
                        obj[key].status = "leaving"
                    }
                }
                if (atLeastOneNew) {
                    window.dispatchEvent(new CustomEvent("needupdate"))
                }

                const entries = Object.entries(obj)
                entries.sort(([key1], [key2]) => compareKey(key1, key2))

                return h(tag, props, entries.map(([key, { item, index, status }]) => patchView(key)(viewItem(index, item, status))))
            }
        })
    )
}