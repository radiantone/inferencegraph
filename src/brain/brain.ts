export class Factoid extends Object {

  public name: string = '';
  public value: string = '';

   constructor(fact: Factoid) {
        super();
        this.name = fact.name;
        this.value = fact.value;
    }

}


export class When extends Object {

  public name: string = '';
  public value: string = '';
  public operator: string = '';

   constructor(when: When) {
        super();
        this.name = when.name;
        this.value = when.value;
        this.operator = when.operator;
    }

}

export class Fact extends Object {

    private _name: string;
    private _objectValue: object;
    private _stringValue: string;
    private _numberValue: number;
    private _booleanValue: boolean;

    constructor(factoid: Factoid) {
        super();
        this._name = factoid.name;
        this._stringValue = factoid.value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
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

    private _facts = {};

    constructor() {
        super();
    }

    // suppress - future use
    assertFacts(facts: Factoid[], suppress: boolean) {
        console.log("KnowledgeBase: Adding Facts");
        facts.forEach((fact: Factoid) => {
            const _fact = new Fact(fact)
            this.assertFact(_fact,suppress)
        })
    }

    // suppress - future use
    assertFact(fact: Fact, suppress: boolean) {
        //if (this._facts[fact.name] && this._facts[fact.name].objectValue === fact.objectValue) {
           // return; //return peacefully
            //throw new Error("Fact value is the same.");
        //}
        console.log("KnowledgeBase: Asserting fact: ", JSON.stringify(fact,undefined,2));
        this._facts[fact.name] = fact;
    }

    factIsTrue(when: When) {
        const operator = when.operator
        console.log('_facts',JSON.stringify(this._facts))
        console.log(when.name,this._facts[when.name].stringValue)
        console.log(this._facts[when.name].stringValue === when.value)
        if(!this._facts[when.name]) return false;

        // Determine operator and apply correct condition logic here
        if (operator === '=')
            return this._facts[when.name].stringValue === when.value
        if (operator === '!=')
            return this._facts[when.name].stringValue != when.value
    }

    printFacts() {
        console.log(JSON.stringify(this._facts, undefined, 2))
    }

    removeFact(fact: Fact) {
        delete this._facts[fact.name];
        console.log("Removed fact: ", fact);
        console.log("Remaining facts: ", this._facts);
    }

    get facts(): {} {
        return this._facts;
    }

}

export class Rule extends Object {

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
}

export class Graph extends Object {

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

    private readonly _kb: KnowledgeBase;
    private graphs: Graph[] = [];
    private rules: {} = {};

    constructor(kb) {
        super();
        this._kb = kb;
        console.log("KnowledegeGraph: Adding KnowledgeBase");
    }

    addGraph(graph: Graph) {
        this.graphs.push(graph);

        console.log("Graph: ",graph.graph);
        graph.graph.forEach(rule => {
            rule.when.forEach(when => {
                if(!this.rules[when['name']]) {
                    this.rules[when['name']] = [];
                }
                console.log("KnowledgeGraph: Adding rule: ",JSON.stringify(rule, undefined, 2));
                this.rules[when['name']].push(rule)
            })
        })
        console.log("KnowledegeGraph: Adding graph ", graph);
    }

    // suppress - future use
    resolveFact(fact: Fact, suppress: boolean) {
        console.log(JSON.stringify(fact))

        // Get all the rules linked to this fact name
        if(this.rules[fact.name] && !this.rules[fact.name].resolved) {

            var rules = this.rules[fact.name];

            // Resolve each rule, which triggers other rules
            rules.forEach(rule => {
                if (rule.resolved) return;
                console.log(fact['name']+":Rule:"+JSON.stringify(rule, undefined, 2));

                var whenTrue = true;

                // All when conditions must be true for this rule to fire
                rule['when'].forEach(when => {
                    if (!this._kb.factIsTrue(when)) whenTrue = false;
                });

                console.log("WHEN CONDITION IS: ",whenTrue)

                // If when conditions are true, then assert all the facts, which
                // themselves will be resolved 
                if(whenTrue && rule.assert) {
                    rule.resolved = true
                    rule.assert.forEach(assertion => {
                        const fact = new Fact(assertion);
                        try {
                            console.log("Firing rule: ",JSON.stringify(rule, undefined, 2));
                            this.assertFact(fact,suppress);
                        } catch (err) {
                            console.log(err);
                        }
                    })
                   
                }
            })
        }
    }

    mergeFact(fact: Fact) {

    }

    // suppress - future use
    assertFact(fact: Fact, suppress: boolean) {
        try {
            this._kb.assertFact(fact,suppress);
            this.resolveFact(fact, suppress)
        } catch (err) {
            console.log("assertFact Error: ",err);
        }
    }

    retractFact(fact: Fact) {

    }

    get kb(): KnowledgeBase {
        return this._kb;
    }
}

export class Brain {

    private _kg;
    private _suppress = false;

    // suppress - future use
    constructor(kg: KnowledgeGraph, suppress: boolean) {
        console.log("Brain: Adding KnowledgeGraph: ", kg);
        this._suppress = suppress;
        this._kg = kg
    }

    resolveFact(fact: Fact) {
        this._kg.resolveFact(fact);
    }

    assertFact(fact: Fact) {
        this._kg.assertFact(fact, this._suppress);
    }

    retractFact(fact: Fact) {

    }

    get kg() {
        return this._kg;
    }

}