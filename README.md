# hyperapp-transition-group

A transition library for hyperapp inspired by react-transition-group and vue-transition-group

First you need to instantiate TransitionGroup with
```js
const TransitionGroup = makeTransitionGroup()
```
If you use TransitionGroup in several locations, you need an instance per location
```js
const TransitionGroup = makeTransitionGroup()
const TransitionGroup2 = makeTransitionGroup()
...
```


properties of TransitionGroup
- tag: the tag name of the container view (default "div")
- props: the properties of the container view
- items: an array from the state that we want to display
- getKey: a function which return a number or a string which identifies an element of items
          At any time, all elements of items must have a distinct key
          
the child of TransitionGroup is a function viewItem :: (index, item, status) => vdom which render an element of items
- index: the index of the item in the array
- item: the element
- status: the status is a string that can be "entering" | "entered" | "leaving"

Notes:
- the vnode returned by the functionItem must not be keyed. TransitionGroup does that for you
- if the transition-group is in a subtree which is skipped during the render (e.g. because it is inside a lazy view),
    then the vdom will not be updated
- you need to add the subscription transitionSub in your app

See example here:
https://github.com/gbagan/hyperapp-transition-group/blob/master/examples/example2.js

