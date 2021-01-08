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
        'name': 'fact1',
        'value': 'value0'
    })
```

## Facts

A typed data container used with Knowledge Bases

```
const newFact = new Fact(new Factoid({
    'name':'fact1',
    'value':'value1'
}))
```

## Rules

Rule is a container for conditions, assertions and functions associated with facts that are evaluated by the inference engine. Each rule evaluates to either true or false based on it's when conditions, which all must be true for the rule to fire.

```
 new Rule({
        name: "rule2",
        when: [
            {
            name:'factB',
            value: 'valueB',
            operator: '='
        },
            {
            name:'fact3',
            value: 6,
            operator: '<'
        }],
        retract:[],
        fire:[],
        do:[],
        assert: [{
            name:'fact4',
            value: "I'm done!"
        },{
            name:'fact1',
            value: "value1"
        }]
    })

```

## KnowledgeBase

KnowledgeBase is a container for a collection of facts and operations on them

```
const facts = [
    new Factoid({
        'name': 'fact1',
        'value': 'value0'
    }),
    new Factoid({
        'name': 'fact2',
        'value': 'value2'
    }),
    new Factoid({
        'name': 'factB',
        'value': 'valueB'
    })
]

const kb = new KnowledgeBase()
kb.assertFacts(facts, true);
```

## Graph

Graph is a container for rules

```
const graph = new Graph([
    new Rule({
        name: "rule1",
        when: [{
            name: 'fact1',
            value: 'value1',
            operator: '='
        }],
        do:[(function() {
            console.log("DO: fact1 is value1!")
        })],
        retract:[],
        fire:[],
        assert: [{
            name:'fact2',
            value: 'Finished!'
        }]
    }),
    new Rule({
        name: "rule2",
        when: [{
            name:'fact2',
            value: 'Finished!',
            operator: '='
        }],
        retract:[],
        fire:[],
        do:[(function() {
            console.log("DO: fact2 is Finished!")
        })],
        assert: [{
            name:'fact3',
            value: 5
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
    'name':'fact1',
    'value':'value1'
}))

var plan = [];

// Infer a plan stemming from this fact assertion
brain.assertFact(newFact, plan, callbacks);

console.log("PLAN:",plan);

plan.forEach( func => {
    func();  // Execute plan functions
})
```
