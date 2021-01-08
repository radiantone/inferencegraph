# inferencegraph

A knowledge graph based forward chain inferencing engine in typescript/node.

# Overview

## Notes

This is 'in development' and is only a working draft at the moment, not a complete system. Updates will come regularly. I have some interesting plans for this package.

## Install

\# From this cloned repo <br>
$ npm i

\# From your node project <br>
$ npm i inferencegraph

## Lint

\# Within this cloned repo <br>

$ npm run lint <br>

## Build

\# Within this cloned repo <br>

$ npm run build <br>
\# Clean build & test<br>
$ npm run clean && npm run build && npm run test

## Run

\# Within this cloned repo <br>

$ npm run test

# Design Goals

- Primitive typed fact values (string, boolean, number, object)
- Operator evaluation (=,!=,>,<,true,false)
- Cycle detection
- Composition based. Can create separate fact graphs and add them to a knowledge graph at different times
- Clean. Simple. Easy to understand
- Extensible
- Uses Classes. Typescript
- Powerful rules with conditions (when), assertions, retractions and functional side-effects (do's)
- Automatic planning. Functional attributes of rules are built into a functional "plan" during inference chaining. Once the engine has completed its inferences, an executable (and ordered) plan is returned that executes asynchronously returning Promises.
- Ability to solve inferencing logic problems. A more detailed logic problem example will be forthcoming.
- Low memory consumption, simple data structures
- Work in Node and in Browser

# Importing

From within your typescript module

```
import { Graph, Fact, Factoid, KnowledgeBase, KnowledgeGraph, Brain, Rule } from 'inferencegraph'
```

# Classes

## Factoids

An untyped data container

```
new Factoid({
        'name': 'barks',
        'value': true
    })
```

## Facts

A typed data container used with Knowledge Bases

```
const newFact = new Fact(new Factoid({
    'name':'barks',
    'value':true
}))
```

## Rules

Rule is a container for conditions, assertions and functions associated with facts that are evaluated by the inference engine. Each rule evaluates to either true or false based on it's when conditions, which all must be true for the rule to fire.

```
    new Rule({
        name: "dog",
        when: [{
            name:'hair',
            value: true,
            operator: '='
        },{
            name:'barks',
            value: true,
            operator: '='
        }],
        retract:[],
        fire:[],
        do:[(function(callbacks) {
            return "DO: It's a dog!"+JSON.stringify(callbacks)
        })],
        assert: [{
            name:'specie',
            value: 'dog'
        }]
    })

```

## KnowledgeBase

KnowledgeBase is a container for a collection of facts and operations on them

```
const corgiFacts = [ new Fact(new Factoid({
    'name':'hair',
    'value':true
})), new Fact(new Factoid({
    'name':'barks',
    'value':true
})), new Fact(new Factoid({
    'name':'fur',
    'value':'tan'
})), new Fact(new Factoid({
    'name':'legs',
    'value':'short'
}))]

const kb = new KnowledgeBase()
kb.assertFacts(corgiFacts, true);
```

## Graph

Graph is a container for rules

```
const graph = new Graph([
    new Rule({
        name: "dog",
        when: [{
            name:'hair',
            value: true,
            operator: '='
        },{
            name:'barks',
            value: true,
            operator: '='
        }],
        retract:[],
        fire:[],
        do:[(function(callbacks) { // Can receive callbacks object here, which might have other user data
            return "DO: It's a dog!"+JSON.stringify(callbacks)
        })],
        assert: [{
            name:'specie',
            value: 'dog'
        }]
    }),
    new Rule({
        name: "dalmation",
        when: [{
            name:'specie',
            value: 'dog',
            operator: '='
        },{
            name:'fur',
            value: 'spotted',
            operator: '='
        }],
        retract:[],
        fire:[],
        do:[(function(callbacks) { // Can receive callbacks object here, which might have other user data
            return "DO: It's a dalmation!"+JSON.stringify(callbacks)
        })],
        assert: [{
            name:'breed',
            value: 'dalmation'
        }]
    })
]);
```

## KnowledgeGraph

KnowledgeGraph is a container for graphs

```
const kg = new KnowledgeGraph(kb)
kg.addGraph(graph)
```

## Callbacks

Callbacks are optional, but will be invoked during inferencing to trigger your business logic if using Plans is not the desired course.<br>

Events

```
export class Callbacks extends Object {

    public onFactTrue: Function;
    public onFactFalse: Function;
    public onFactAsserted: Function;
    public onFactResolved: Function;
    public onResolveFact: Function;

}
```

Usage

```
var callbacks = new Callbacks();

callbacks.onFactTrue = (fact, rule, when) => {
    console.log("callback: onFactTrue: ",fact,rule,when)
}
callbacks.onFactFalse = (fact, rule, when) => {
    console.log("callback: onFactFalse: ",fact,rule,when)
}
callbacks.onFactResolved = (fact) => {
    console.log("callback: onFactResolved! ",fact)
}
brain.assertFact(newFact, plan,callbacks);
```

## Brain

Brain is a container for knowledge graphs and high-level API over them

```
const brain = new Brain(kg, true);

const newFact = new Fact(new Factoid({
    'name':'fur',
    'value':'spotted'
}))

var plan = [];

// Infer a plan stemming from this fact assertion
brain.assertFact(newFact, plan, callbacks);

console.log("PLAN:",plan);

plan.forEach( promise => {
    promise.then( (result) => {
        console.log("CALLBACK:", result)
    });  // Execute plan functions
})
```
