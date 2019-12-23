import {h, app} from "hyperapp"
import {makeTransitionGroup, transitionSub} from "../src/index"

//////////////////
/// example   ////
/////////////////

// you need to make one instance of makeTransitionGroup per use
// otherwise all transitionGroup will share the same state
const transitionGroup = makeTransitionGroup()

const addItem = ({ i, items }) => ({ i: i + 1, items: [i].concat(items) })
const removeItem = ({ i, items }) => ({ i, items: items.filter((item, j) => j !== (items.length / 2 | 0)) })
const replaceItem = ({ i, items }) => ({ i: i + 1, items: items.map((item, j) => j === (items.length / 2 | 0) ? i : item) })
const shuffle = ({ i, items }) => ({ i, items: items.map((v, i) => items[(1 + i * 347) % items.length]) })
const removeTwoItems = ({ i, items }) => ({ i, items: items.filter((item, j) => j !== 1 && j !== 4) })
const clear = ({ i, items }) => ({ i, items: [] })

const view = state =>
    h("main", {}, [
        transitionGroup({
            tag: "div",
            props: {class: "ex3-container"},
            items: state.items,
            getKey: x => x
        }, (index, value, status) =>
            h("div", { style: { left: (index * 50) + "px" }, class: "ex3-item ex3-item-" + status }, value)
        ),
        h("div", {}, [
            h("button", { onclick: addItem }, "Add an item"),
            h("button", { onclick: removeItem }, "Remove an item"),
            h("button", { onclick: replaceItem }, "Replace an item"),
            h("button", { onclick: shuffle }, "Shuffle"),
            h("button", { onclick: removeTwoItems }, "Remove two items"),
            h("button", { onclick: clear }, "Clear"),
        ])
    ])

app({
    init: { i: 0, items: [] },
    view,
    node: document.getElementById("app"),
    subscriptions: () => [transitionSub] // shallow copy to force the render
})