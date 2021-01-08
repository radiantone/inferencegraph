/* eslint-disable @typescript-eslint/ban-types */
export class Factoid extends Object {

  public name = '';
  public value;

   constructor(fact: Factoid) {
        super();
        this.name = fact.name;
        this.value = fact.value;
    }

}

export class Callbacks extends Object {

    public onFactTrue: Function;
    public onFactFalse: Function;
    public onFactAsserted: Function;
    public onFactResolved: Function;
    public onResolveFact: Function;

}

export class When extends Object {

  public name = '';
  public value;
  public operator = '';

   constructor(when: When) {
        super();
        this.name = when.name;
        this.value = when.value;
        this.operator = when.operator;
    }

}

export class Fact extends Object {
    // Fact is a container for a name and a value

    private _name: string;
    private _objectValue: object;
    private _stringValue: string;
    private _numberValue: number;
    private _booleanValue: boolean;
    private _type: string;

    constructor(factoid: Factoid) {
        super();
        this._name = factoid.name;

        // Determine type and set appropriate variable
        this._type = typeof(factoid.value)
        console.log('_type:',this._type,' for ',factoid.value)

        switch(this._type) {
            case 'string':
                this._stringValue = factoid.value;
                break;
            case 'number':
                this._numberValue = factoid.value;
                break;
            case 'boolean':
                this._booleanValue = factoid.value;
                break;
            case 'object':
                this._objectValue = factoid.value;
                break;
        }
        
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get value(): any {
        // Based on type, return appropriate variable
        switch(this._type) {
            case 'string':
                return this._stringValue
            case 'number':
                return this._numberValue
            case 'boolean':
                return this._booleanValue
            case 'object':
                return this._objectValue
        }
    }

    get objectValue(): object {
        return this._objectValue;
    }

    set objectValue(value: object) {
        this._objectValue = value;
    }

    get stringValue(): string {
        return this._stringValue;
    }

    set stringValue(value: string) {
        this._stringValue = value;
    }

    get numberValue(): number {
        return this._numberValue;
    }

    set numberValue(value: number) {
        this._numberValue = value;
    }

    get booleanValue(): boolean {
        return this._booleanValue;
    }

    set booleanValue(value: boolean) {
        this._booleanValue = value;
    }

}

export class KnowledgeBase extends Object {
    // KnowledgeBase is a container for a collection of facts and operations on them

    private _facts = new Map();

    constructor() {
        super();
    }

    // suppress - future use
    assertFacts(facts: Factoid[], suppress: boolean):null {
        console.log("KnowledgeBase: Adding Facts");
        facts.forEach((fact: Factoid) => {
            const _fact = new Fact(fact)
            this.assertFact(_fact,suppress)
        })
        return
    }

    // suppress - future use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    assertFact(fact: Fact, suppress: boolean):null {
        console.log("KnowledgeBase: Asserting fact: ", JSON.stringify(fact,undefined,2));
        this._facts.set(fact.name, fact);
        return
    }

    factIsTrue(when: When):boolean {
        const operator = when.operator
        if(!this._facts.get(when.name)) return false;

        // Determine operator and apply correct condition logic here
        if (operator === '=')
            return this._facts.get(when.name).value === when.value
        if (operator === '!=')
            return this._facts.get(when.name).value != when.value
        if (operator === '>')
            return this._facts.get(when.name).value > when.value
        if (operator === '<')
            return this._facts.get(when.name).value < when.value
        if (operator === 'true')
            return this._facts.get(when.name).value
        if (operator === 'false')
            return !this._facts.get(when.name).value

    }

    printFacts():null {
        const jsonObject = {};  
        this._facts.forEach((value, key) => {  
            jsonObject[key] = value  
        });  
        console.log(JSON.stringify(jsonObject, undefined, 2))
        return
    }

    removeFact(fact: Fact):null {
        this._facts.delete(fact.name);
        console.log("Removed fact: ", fact);
        console.log("Remaining facts: ", this._facts);
        return
    }

    get facts(): {} {
        return this._facts;
    }

}

export class Rule extends Object {
    // Rule is a container for conditions, assertions and functions associated with facts
    // that are evaluated by the inference engine

    private _rule: Object;
    public resolved: boolean;

    constructor(rule:Object) {
        super();
        this._rule = rule;
    }

    get rule(): Object {
        return this._rule;
    }

    get when(): Object[] {
        return this._rule['when'];
    }

    get operator(): string {
        return this._rule['operator']
    }

    get assert(): string {
        return this._rule['assert']
    }

    get dos(): object[] {
        return this._rule['do']
    }
}

export class Graph extends Object {
    // Graph is a container for rules

    private readonly _graph: Rule[];

    constructor(graph: Rule[]) {
        super();
        this._graph = graph;
        console.log("Graph: ",graph)
    }

    get graph(): Rule[] {
        return this._graph;
    }

}

export class KnowledgeGraph extends Object {
    // KnowledgeGraph is a container for graphs

    private readonly _kb: KnowledgeBase;
    private graphs: Graph[] = [];
    private rules = new Map();

    constructor(kb:KnowledgeBase) {
        super();
        this._kb = kb;
        console.log("KnowledegeGraph: Adding KnowledgeBase");
    }

    addGraph(graph: Graph):null {
        this.graphs.push(graph);

        console.log("Graph: ",graph.graph);
        graph.graph.forEach(rule => {
            rule.when.forEach(when => {
                if(!this.rules.get(when['name'])) {
                    this.rules.set(when['name'],[])
                }
                console.log("KnowledgeGraph: Adding rule: ",JSON.stringify(rule, undefined, 2));
                this.rules.get(when['name']).push(rule)
            })
        })
        console.log("KnowledegeGraph: Adding graph ", graph);
        return
    }

    // suppress - future use
    resolveFact(fact: Fact, suppress: boolean, plan: object[], callbacks: Callbacks):null {
        console.log(JSON.stringify(fact))

        // Get all the rules linked to this fact name
        if(this.rules.get(fact.name) && !this.rules.get(fact.name).resolved) {

            //var rules = this.rules[fact.name];
            const rules = this.rules.get(fact.name);

            // Resolve each rule, which triggers other rules
            rules.forEach(rule => {
                if (rule.resolved) return;
                console.log(fact['name']+":Rule:"+JSON.stringify(rule, undefined, 2));

                let whenTrue = true;

                // All when conditions must be true for this rule to fire
                rule['when'].forEach(when => {
                    if (!this._kb.factIsTrue(when)) whenTrue = false;
                    if(callbacks && callbacks['onFactTrue'] && whenTrue) {
                        new Promise((resolve) => {
                            resolve(callbacks.onFactTrue(fact, rule, when));
                        })
                    } else {
                        if(callbacks && callbacks['onFactFalse'] && !whenTrue) {
                            new Promise((resolve) => {
                                resolve(callbacks.onFactFalse(fact, rule, when));
                            })
                        }
                    }
                });
                
                console.log("WHEN CONDITION IS: ",whenTrue)

                // If when conditions are true, then assert all the facts, which
                // themselves will be resolved 
                if(whenTrue && rule.assert) {
                    rule.resolved = true
                    rule.dos.forEach(func => {
                        plan.push(new Promise((resolve) => {
                            resolve(func(callbacks))
                        }))
                    })
                    rule.assert.forEach(assertion => {
                        const fact = new Fact(assertion);
                        try {
                            console.log("Firing rule: ",JSON.stringify(rule, undefined, 2));
                            this.assertFact(fact,suppress, plan, callbacks);
                        } catch (err) {
                            console.log(err);
                        }
                    })
                   
                }
            })
            new Promise((resolve) => {
                resolve(callbacks.onFactResolved(fact));
            })
            return
        }
    }

    // suppress - future use
    assertFacts(facts: Fact[], suppress: boolean, plan: object[], callbacks: Callbacks):null {
        try {
            facts.forEach( fact => {
                this._kb.assertFact(fact,suppress);
                this.resolveFact(fact, suppress, plan, callbacks)
            })
        } catch (err) {
            console.log("assertFact Error: ",err);
        }
        return
    }

    // suppress - future use
    assertFact(fact: Fact, suppress: boolean, plan: object[], callbacks: Callbacks):null {
        try {
            this._kb.assertFact(fact,suppress);
            this.resolveFact(fact, suppress, plan, callbacks)
        } catch (err) {
            console.log("assertFact Error: ",err);
        }
        return
    }

    get kb(): KnowledgeBase {
        return this._kb;
    }
}

export class Brain {
    // Brain is a container for knowledge graphs and high-level API over them

    private _kg;
    private _suppress = false;

    // suppress - future use
    constructor(kg: KnowledgeGraph, suppress: boolean) {
        console.log("Brain: Adding KnowledgeGraph: ", kg);
        this._suppress = suppress;
        this._kg = kg
    }

    addKnowledgeGraph(graph: KnowledgeGraph):null {
        return this._kg.addGraph(graph)
    }

    resolveFact(fact: Fact):null {
        return this._kg.resolveFact(fact, true, []);
    }

    assertFacts(facts: Fact[], plan: object[], callbacks: object):null {
        return this._kg.assertFacts(facts, this._suppress, plan, callbacks);
    }

    assertFact(fact: Fact, plan: object[], callbacks: object):null {
        return this._kg.assertFact(fact, this._suppress, plan, callbacks);
    }

    get knowledgeGraph():KnowledgeGraph {
        return this._kg;
    }

}
