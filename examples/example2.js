import {h, app} from "hyperapp"
import {makeTransitionGroup, transitionSub} from "../src/index"

//////////////////
/// example   ////
/////////////////

// you need to make one instance of makeTransitionGroup per use
// otherwise all transitionGroup will share the same state
const TransitionGroup = makeTransitionGroup()

const addItem = ({ i, items }) => ({ i: i + 1, items: [i].concat(items) })
const removeItem = ({ i, items }) => ({ i, items: items.filter((item, j) => j !== (items.length / 2 | 0)) })
const replaceItem = ({ i, items }) => ({ i: i + 1, items: items.map((item, j) => j === (items.length / 2 | 0) ? i : item) })
const shuffle = ({ i, items }) => ({ i, items: items.map((v, i) => items[(1 + i * 347) % items.length]) })
const removeTwoItems = ({ i, items }) => ({ i, items: items.filter((item, j) => j !== 1 && j !== 4) })
const clear = ({i}) => ({ i, items: [] })

const view = state =>
    <main>
        <TransitionGroup
            tag="div"
            props={{class: "ex3-container"}}
            items={state.items}
            classNames="ex3-item"
        >{(value, index) =>
            <div style={{left: (index * 50) + "px"}}>{value}</div>
        }
        </TransitionGroup>
        <div>
            <button onclick={addItem}>Add an item</button>
            <button onclick={removeItem}>Remove an item</button>
            <button onclick={replaceItem}>Replace an item</button>
            <button onclick={shuffle}>Shuffle</button>
            <button onclick={removeTwoItems}>Remove two items</button>
            <button onclick={clear}>Clear</button>
        </div>
    </main>

window.onload = () => app({
    init: { i: 0, items: [] },
    view,
    node: document.getElementById("app"),
    subscriptions: () => [transitionSub]
})