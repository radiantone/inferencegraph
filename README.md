# inferencegraph

A knowledge graph based forward chain inferencing engine in typescript/node.

## Build

$ npm run build

# Run

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
- Automatic planning. Functional attributes of rules are built into a functional "plan" during inference chaining. Once the engine has compelted its inferences, an executable (and ordered) plan is returned that executes asynchronously returning Promises.

# Factoids

```
new Factoid({
        'name': 'fact1',
        'value': 'value0'
    })
```

# Facts

```
const newFact = new Fact(new Factoid({
    'name':'fact1',
    'value':'value1'
}))
```

# Rules

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

# KnowledgeBase

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

# KnowledgeGraph

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

const kg = new KnowledgeGraph(kb)
kg.addGraph(graph)
```

# Brain

```
const brain = new Brain(kg, true);

const newFact = new Fact(new Factoid({
    'name':'fact1',
    'value':'value1'
}))

brain.assertFact(newFact);
```
