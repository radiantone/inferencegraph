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
