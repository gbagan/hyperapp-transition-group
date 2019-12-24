# hyperapp-transition-group

A transition library for hyperapp inspired by react-transition-group and vue-transition-group

## How to use this library

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
- **tag**: (default "div") the tag name of the container vnode
- **props**: the properties of the container vnode
- **items**: an array from the state that we want to display
- **classNames**: (default undefined)
             If it is an non empty string, add the classes depending on the status to vdom returned by *viewItem*
- **getKey**: (default x => x)
          A function which returns a number or a string which identifies an element of the array *items*.  
          At any time, all elements of items must have a distinct key
- **sortBy**: "key" | "list" (default  "key")
          Determines in what order appear the elements of the array items in the function viewItem.
          If you want that respects the order of the array *items*, then use "list".
          It is nice if you only insert or add elements but you can have glitches on transitions if you permute elements.
          If you don't care about order, use "key".

the child of TransitionGroup is a function viewItem :: (index, item, status) => vdom which renders an element of the array *items*
- **index**: the index of the item in the array
- **item**: the element
- **status**: the status is a string that can be "entering" | "entered" | "leaving".
            If classNames is defined, you probably don't need this information              

Example:

```jsx
// assume your state
const state {
    rects: [{ id: 1, x: 100, y: 300}, {id: 2, x: 160, y: 20}],
    ...
 }

// then in your view, you can use TransitionGroup as follows
<TransitionGroup
    tag="svg"
    props={{class: "rects-container"}}
    items={state.rects}
    getKey={x => x.id}
>{(index, {x, y}, status) =>
     <rect x={x} y={y} class={`rects-item rects-item-${status}`}/>
}
</TransitionGroup>
```

In your css, you must define classes rects-item-entering, rects-item-entered, rects-item-leaving
```css
.rects-item-entering {
     opacity: 0;
}

.rects-item-entered {
    opacity: 1;
    transition: all linear 500ms
}

.rects-item-leaving {
    opacity: 0;
    transition: all linear 500ms
}
```

### Other functions

**makeTransition**: creates an instance of Transition

Transition is a lighter version of TransitionGroup for rendering only one element 

properties of TransitionGroup:
- **data**: the data we want to render
- **classNames**: (default undefined)
             If it is an non empty string, add the classes depending on the status to vdom returned by *view*

the child of TransitionGroup is a function viewItem :: (data), status) => vdom
- **data**: the cached data
- **status**: the status is a string that can be "entering" | "entered" | "leaving".
            If classNames is defined, you probably don't need this information  

**makeFadeTransition** creates an instance of FadeTransition

FadeTransition is a special instance of Transition

properties of TransitionGroup:
- **data**: the data we want to render
- **duration**: duration of the fade in/fade out

Notes:
- the vnode returned by the function *viewItem* must not be keyed. TransitionGroup does that for you
- if the transition-group is in a subtree which is skipped during the render (e.g. because it is inside a lazy view),
    then the vdom will not be updated
- you need to add the subscription transitionSub in your app


See a full example here
https://github.com/gbagan/hyperapp-transition-group/blob/master/examples/example2.js

[Demo](https://gbagan.github.io/hyperapp-transition-group/ex2.html)


## Planned features

- manage animations instead of transition

