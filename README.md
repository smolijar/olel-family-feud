# Family Feud: TypeScript Edition
In this challenge, you’ll dive deep into the world of family relationships, unraveling the complex web of connections that bind our fictional family together. Your mission is to create TypeScript types that accurately describe various family relationships based on the provided data. You’ll be given information about parents and their children, and your goal is to implement types that can represent relationships such as siblings, parents, grandparents, and maybe more :slightly_smiling_face: The more relationships you implement, the better.

```ts
type ChildrenToFather = {
    Bob: 'George',
    Alice: 'George',
    Cindy: 'Bob',
    Dave: 'Bob',
    Eve: 'George',
}

type ChildrenToMother = {
    Bob: 'Mary',
    Cindy: 'Sue',
    Alice: 'Jane',
}

type i1 = Parents<'Alice'>
type i2 = GrandFather<'Cindy'>
type i3 = GrandMother<'Cindy'>
type i4 = Children<'Bob'>
type i6 = Siblings<'Bob'>
type i7 = Siblings<'Alice'>
```

## Solution

Mind that sex (to determine `Brothers` vs `Sisters`) is determined only if the member has any offspring (then we know, if it's "mother" or "father", safely assuming the sex). For members without offspring, sex is not assigned and will only appear in the "generic" variant (e.g. `Siblings` or `AuntOrUncle` etc.)

See the [usage](https://github.com/smolijar/olel-family-feud/blob/main/index.ts#L194-L242).
