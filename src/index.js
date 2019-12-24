import { h, Lazy } from "hyperapp"
/// from hyperapp lib
const rawEvent = name =>
    (fx => action => [fx, { action: action }])
        ((dispatch, props) => {
            const listener = ev => dispatch(props.action, event)
            addEventListener(name, listener)
            return () => removeEventListener(name, listener)
        })


export const transitionSub = rawEvent("needupdate")(state => ({ ...state }))
const compareKey = ([key1], [key2]) => key1 < key2 ? -1 : key1 === key2 ? 0 : 1
const compareIndex = ([k1, v1], [k2, v2]) => v1.index - v2.index

const addTransitionClasses = (classNames, status) => vdom => {
    if (!classNames || !vdom)
        return vdom
    let vdomCls = vdom.props.class
    vdomCls = vdomCls === undefined ? {} : typeof vdomCls === "string" ? { [vdomCls]: true } : vdomCls
    const trCls = status === "entering"
        ? `${classNames} ${classNames}-entering`
        : status === "entered"
            ? `${classNames} ${classNames}-entered`
            : `${classNames} ${classNames}-leaving`

    const newCls = { ...vdomCls, [trCls]: true }
    return { ...vdom, props: { ...vdom.props, class: newCls } }
}

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

    return ({ tag = "div", props, items, getKey = (x => x), sortBy = "key", classNames }, viewItem) =>
        // dummy object to force the evaluation of the lazy view at each update
        Lazy({
            items: items, dummy: {}, view: ({ items }) => {
                if (Array.isArray(viewItem))
                    viewItem = viewItem[0].name

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
                entries.sort(sortBy === "index" ? compareIndex : compareKey)

                return h(tag, props, entries.map(([key, { item, index, status }]) => 
                    addTransitionClasses(classNames, status)(patchView(key)(viewItem(item, index, status)))
                ))
            }
        })
}

export const makeTransition = () => {
    const cache = null
    const status = null
    const handleTransitionEnd = state => {
        if (cache === null)
            return state
        if (status === "leaving") {
            cache = null
            return { ...state }
        }
        return state;
    }

    const itemProps = {
        ontransitionend: [handleTransitionEnd, key]
    }

    const patchView = vdom => ({ ...vdom, props: { ...itemProps, ...vdom.props } })

    return ({ data }, view) =>
        // dummy object to force the evaluation of the lazy view at each update
        Lazy({
            data, dummy: {}, view: ({ data }) => {
                if (Array.isArray(view))
                    view = view[0].name
                if (data === null || data === undefined || data === false) {
                    status = "leaving"
                } else if (status === "entering") {
                    status = "entered"
                } else {
                    status = "entering"
                    cache = data
                    window.dispatchEvent(new CustomEvent("needupdate"))
                }
                return cache !== null && addTransitionClasses(classNames, status)(patchView(view(cache, status)))
            }
        })
}

export const fadeStyle = (status, duration) =>
    status === "entering" ? {
        opacity: 0
    } : status === "entered" ? {
        opacity: 1,
        transition: `opacity ${duration}ms`
    } : { // status === "leaving" 
                opacity: 0,
                transition: `opacity ${duration}ms`
            }

const patchFade = (status, duration) => vdom => {
    if (!vdom)
        return vdom
    const newStyle = {...vdom.props.style, ...fadeStyle(status, duration)}
    return {...vdom, props: {...props, style: newStyle}}
}

export const makeFadeTransition = () => {
    const transition = makeTransition()
    return ({ data, duration }, view) => transition({ data }, (cachedData, status) =>
        patchFade (status, duration) (view(cachedData))
    ) 
}