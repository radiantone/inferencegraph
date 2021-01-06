# inferencegraph

A knowledge graph based forward chain inferencing engine in typescript/node.

# Overview

## Notes

This is 'in development' and is only a working draft at the moment, not a complete system. Updates will come regularly.

## Build

$ npm run build

## Run

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
        do:[],
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
        do:[],
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

## Brain

Brain is a container for knowledge graphs and high-level API over them

```
const brain = new Brain(kg, true);

const newFact = new Fact(new Factoid({
    'name':'fact1',
    'value':'value1'
}))

brain.assertFact(newFact);
```
