type ChildrenToFather = {
    Bob: 'George',
    Alice: 'George',
    Cindy: 'Bob',
    Dave: 'Bob',
    Eve: 'George',

    // Extended testing dataset
    I: 'Father'
    Sibling: 'Father',
    Brother: 'Father',
    Sister: 'Father',
    Father: 'GrandFather (Fathers)',
    Mother: 'GrandFather (Mothers)',
    'GrandFather (Fathers)': 'GreatGrandFather (Fathers, Fathers)'

    Son: 'I',
    Daughter: 'I',

    StepSibling: 'Father',
    StepBrother: 'Father',
    StepSister: 'StepFather',

    Uncle: 'GrandFather (Fathers)',
    Aunt: 'GrandFather (Mothers)',
    'Cousin (Uncle child)': 'Uncle',

    'Brothers Child': 'Brother',
    'StepBrothers Child': 'StepBrother',

    'GrandSon (sons child)': 'Son',

}

type ChildrenToMother = {
    Bob: 'Mary',
    Cindy: 'Sue',
    Alice: 'Jane',

    // Extended testing dataset
    I: 'Mother',
    Sibling: 'Mother',
    Brother: 'Mother',
    Sister: 'Mother',
    Father: 'GrandMother (Fathers)',
    Uncle: 'GrandMother (Fathers)',
    Mother: 'GrandMother (Mothers)',

    Son: 'Wifu',
    Daughter: 'Wifu',

    StepSibling: 'StepMother',
    StepBrother: 'StepMother',
    StepSister: 'Mother',

    Aunt: 'GrandMother (Mothers)',
    'Cousin (Aunt child)': 'Aunt',

    'Sisters Child': 'Sister',
    'StepSisters Child': 'StepSister',
    'GrandSon (daughter child)': 'Daughter'
}

// Meta
type Values<T> = T extends Record<any, infer V> ? V : never
type Get<T, K> = K extends keyof T ? T[K] : never
type Expand<X> = X extends infer U ? { [k in keyof U as U[k] extends never ? never : k]: U[k] } : never

// General
type People = keyof ChildrenToFather | Values<ChildrenToFather> | keyof ChildrenToMother | Values<ChildrenToMother>
type ChildrenToParent = { [k in keyof ChildrenToFather | keyof ChildrenToMother]: Get<ChildrenToFather, k> | Get<ChildrenToMother, k> }

/** Determine sex (aka _assume gender_): Only available to people with offsprings (father M, mother F) */
type Sex<X> = X extends Values<ChildrenToMother> ? 'F' : X extends Values<ChildrenToFather> ? 'M' : never
type Genders = { [k in People]: Sex<k> }
type Females = Values<{ [k in keyof Genders]: 'F' extends Genders[k] ? k : never }>
type Males = Values<{ [k in keyof Genders]: 'M' extends Genders[k] ? k : never }>
type OnlyFemale<X> = X & Females
type OnlyMale<X> = X & Males

// Parental
type Mother<X extends People> = Get<ChildrenToMother, X>
type Father<X extends People> = Get<ChildrenToFather, X>
/**
 * @example
 * ```ts
 * type AliceParents = Parents<'Alice'> // also Parents<'Alice', 1>
 * type AliceGrandParents = Parents<'Alice', 2>
 * type AliceGreatGrandParents = Parents<'Alice', 3>
 * type AliceGreatGreatGreatGreatGrandParents = Parents<'Alice', 5>
 * ```
 */
type Parents<X extends People, GenerationsBack extends any[]['length'] = 1, _accumulator extends any[] = []> =
    `-${_accumulator['length']}` extends `${'-' | ''}${GenerationsBack}`
    ? X
    : Parents<Mother<X> | Father<X>, GenerationsBack, [0, ..._accumulator]>
type GrandFather<X extends People> = Father<Parents<X>>
type GreatGrandFather<X extends People> = Father<Parents<X, 2>>
type GrandMother<X extends People> = Mother<Parents<X>>

// Children
type Children1<X extends People> = keyof { [k in keyof ChildrenToParent as X extends ChildrenToParent[k] ? k : never]: X }
/**
 * @example
 * ```ts
 * type AliceChildren = Children<'Alice'> // also Children<'Alice', 1>
 * type AliceGrandChildren = Children<'Alice', 2>
 * type AliceGreatGrandChildren = Children<'Alice', 3>
 * type AliceGreatGreatGreatGreatGrandChildren = Children<'Alice', 5>
 * ```
 */
type Children<X extends People, Generations extends any[]['length'] = 1, _accumulator extends any[] = []> =
    `-${_accumulator['length']}` extends `${'-' | ''}${Generations}`
    ? X
    : Children<Children1<X> & People, Generations, [0, ..._accumulator]>

type Sons<X extends People> = OnlyMale<Children<X>>
type Daughters<X extends People> = OnlyFemale<Children<X>>

type GrandChildren<X extends People> = Children<X, 2>
type GrandSons<X extends People> = OnlyMale<GrandChildren<X>>
type GrandDaughters<X extends People> = OnlyFemale<GrandChildren<X>>

type NieceOrNephew<X extends People> = Children<Siblings<X | Spouse<X>>>
type Nephew<X extends People> = OnlyMale<NieceOrNephew<X>>
type Niece<X extends People> = OnlyFemale<NieceOrNephew<X>>

type Siblings<X extends People> = Exclude<Children<Mother<X>> & Children<Father<X>>, X>
type Brothers<X extends People> = OnlyMale<Siblings<X>>
type Sisters<X extends People> = OnlyFemale<Siblings<X>>

type Spouse<X extends People> = Exclude<Parents<Children<X> & People>, X>

type StepParent<X extends People, PartnersOfMyParents = Spouse<Parents<X>>> = Exclude<PartnersOfMyParents, Parents<X>>
type StepFather<X extends People> = OnlyMale<StepParent<X>>
type StepMother<X extends People> = OnlyFemale<StepParent<X>>


type StepSiblings<X extends People> = Children<StepParent<X>>
type StepBrothers<X extends People> = OnlyMale<StepSiblings<X>>
type StepSisters<X extends People> = OnlyFemale<StepSiblings<X>>

type StepChildren<X extends People, ChildrenOfMyPartners = Children<Spouse<X>>> = Exclude<ChildrenOfMyPartners, Children<X>>
type StepSons<X extends People> = OnlyMale<StepChildren<X>>
type StepDaughters<X extends People> = OnlyFemale<StepChildren<X>>

type AuntOrUncle<
    X extends People,
    MyParentsSiblings extends People = Siblings<Parents<X>>,
    Result = MyParentsSiblings | Spouse<MyParentsSiblings>> = Expand<Result>
type Aunt<X extends People> = OnlyFemale<AuntOrUncle<X>>
type Uncle<X extends People> = OnlyMale<AuntOrUncle<X>>

type Cousin<X extends People, A extends People = AuntOrUncle<X> & People> = A extends never ? never : Children1<A>;

// Ancestry / blood
type Ancestors<
    X extends People,
    P = Parents<X>,
    Result = X extends never ? never : P | Ancestors<P & People>
> = Expand<Result>

type Descendants<
    X extends People,
    C = Children<X>,
    Result = X extends never ? never : C | Descendants<C & People>
> = Expand<Result>

type FamilyTree<
    X extends People,
    Flags extends 'ExcludeParents' | 'ExcludeChildren' | 'Nothing' = 'Nothing',
    Current = { spouses: Expand<Spouse<X>>, siblings: Expand<Siblings<X>> },
    Desc = Flags extends 'ExcludeChildren'
    ? {}
    : {
        [k in Children<X> as `Children with ${Exclude<Parents<k>, X> extends never ? '[unknown]' : Exclude<Parents<k>, X>}`]:
        k extends never ? 'k' : Expand<FamilyTree<k, 'ExcludeParents'>>
    },
    Ances = Flags extends 'ExcludeParents' ? {} : { mother: FamilyTree<Mother<X>, 'ExcludeChildren'>, father: FamilyTree<Father<X>, 'ExcludeChildren'> },
    Tree = Current & Desc & Ances,
    FilteredTree = { [k in keyof Tree as Tree[k] extends never ? never : k]: Tree[k] }
> =
    Expand<{ [n in X]: FilteredTree }>

// ------------------------------------------------------------------------------------

type i1 = Parents<'Alice'>
type i2 = GrandFather<'Cindy'>
type i3 = GrandMother<'Cindy'>
type i4 = Children<'Bob'>
type i6 = Siblings<'Bob'>
type i7 = Siblings<'Alice'>

type g1 = Genders
type g2 = People

type p1 = Mother<'I'>
type p2 = Father<'I'>
type p3 = Parents<'I'>
type p4 = Parents<'I', 2>
type p5 = GrandFather<'I'>
type p6 = GreatGrandFather<'I'>
type p7 = GrandMother<'I'>

type c1 = Children<'I'>
type c2 = Sons<'I'>
type c3 = Daughters<'I'>
type c4 = GrandChildren<'I'>
type c5 = NieceOrNephew<'I'>


type s1 = Siblings<'I'>
type s2 = Brothers<'I'>
type s3 = Sisters<'I'>

type sp1 = Spouse<'I'>

type stp1 = StepParent<'I'>
type stp2 = StepFather<'I'>
type stp3 = StepMother<'I'>

type ss1 = StepSiblings<'I'>
type ss2 = StepBrothers<'I'>
type ss3 = StepSisters<'I'>

type u1 = AuntOrUncle<'I'>
type u2 = Aunt<'I'>
type u3 = Uncle<'I'>
type u4 = Cousin<'I'>

type b1 = Ancestors<'I'>
type b2 = Descendants<'I'>


type f1 = FamilyTree<'I'>
type f2 = FamilyTree<'Son'>
type f3 = FamilyTree<'GrandSon (sons child)'>

type f4 = FamilyTree<'George'>
type f5 = FamilyTree<'I'>
type f6 = FamilyTree<'Bob'>
type f7 = FamilyTree<'Cindy' | 'Dave'>
