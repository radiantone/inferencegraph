import { Graph, Fact, Factoid, KnowledgeBase, KnowledgeGraph, Brain, Rule } from '../brain/brain'

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

const graph = new Graph([
    new Rule({
        name: "rule1",
        when: [{
            name: 'fact1',
            value: 'value1',
            operator: '='
        }],
        do:[(function() {
            console.log("DO: fact1 is value!")
        })],
        retract:['fact1'],
        fire:{
            onFactAsserted: true,
            onFactResolved: true,
            onFactTrue: true,
            onFactFalse: false,
            onCompleted: true
        },
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

const graph2 = new Graph([
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
]);

// Holds the facts
const kb = new KnowledgeBase()
kb.assertFacts(facts, true);

// Holds the rules & the facts
const kg = new KnowledgeGraph(kb)
kg.addGraph(graph)
kg.addGraph(graph2)
console.log("Facts")
console.log("--------------")
kb.printFacts()
// Holds the knowledge
const brain = new Brain(kg, true);

const newFact = new Fact(new Factoid({
    'name':'fact1',
    'value':'value1'
}))

console.log("FACTS:",JSON.stringify(brain.knowledgeGraph.kb.facts, undefined, 2));

var plan = [];

brain.assertFact(newFact, plan);

console.log("PLAN:",plan);

plan.forEach( func => {
    func();  // Execute plan functions
})
kb.printFacts()
