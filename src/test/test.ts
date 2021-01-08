import { Graph, Fact, Factoid, Callbacks, KnowledgeBase, KnowledgeGraph, Brain, Rule } from '../brain/brain'

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
        do:[(function() { // Can receive callbacks object here, which might have other user data
            return "DO: It's a dog!"
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
        do:[(function() { // Can receive callbacks object here, which might have other user data
            return "DO: It's a dalmation!"
        })],
        assert: [{
            name:'breed',
            value: 'dalmation'
        }]
    })
]);

const graph2 = new Graph([
    new Rule({
        name: "corgi",
        when: [{
            name:'specie',
            value: 'dog',
            operator: '='
        },{
            name:'legs',
            value: 'short',
            operator: '='
        },{
            name:'fur',
            value: 'tan',
            operator: '='
        }],
        retract:[],
        do:[(function() { // Can receive callbacks object here, which might have other user data
            return "DO: It's a corgi!"
        })],
        assert: [{
            name:'breed',
            value: 'corgi'
        }]
    })
]);

// Holds the facts
const kb = new KnowledgeBase()

// Holds the rules & the facts
const kg = new KnowledgeGraph(kb)
kg.addGraph(graph)
kg.addGraph(graph2)
console.log("Facts")
console.log("--------------")
kb.printFacts()
// Holds the knowledge
const brain = new Brain(kg);

kb.printFacts()

let plan = [];

const callbacks = new Callbacks();

callbacks.onFactTrue = (fact, rule, when) => {
    console.log("callback: onFactTrue: ", fact, rule, when)
}
callbacks.onFactFalse = (fact, rule, when) => {
    console.log("callback: onFactFalse: ", fact, rule, when)
}
callbacks.onFactResolved = (fact) => {
    console.log("callback: onFactResolved! ", fact)
}

const dogFacts = [ new Fact(new Factoid({
    'name':'hair',
    'value':true
})), new Fact(new Factoid({
    'name':'barks',
    'value':true
})), new Fact(new Factoid({
    'name':'fur',
    'value':'spotted'
}))]

brain.assertFacts(dogFacts, plan, callbacks);

console.log("PLAN:",plan);

plan.forEach( promise => {
    promise.then( (result) => {
        console.log("CALLBACK:", result)
    });  // Execute plan functions
})

kb.printFacts()

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

plan = []

brain.assertFacts(corgiFacts, plan, callbacks);

plan.forEach( promise => {
    promise.then( (result) => {
        console.log("CALLBACK:", result)
    });  // Execute plan functions
})

kb.printFacts()