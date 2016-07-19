# Single Transferable Vote Ballot Counting
This package calculates the winners of an election using the single transferable vote (STV) voting system.

<!-- TODO: document js and ts API -->
<!-- TODO: document corner cases (like ties) and errors -->

## Contributing
Issues and Pull Requests are welcome.

Run `npm i; typings i` to install dependencies.
Then run `npm test` to run the unit tests.

## Background
Voting systems is a fascinating area of study that not many people think about.
It turns out there are a lot of possible voting systems besides the [first-past-the-post][post] voting system commonly used in Western Democracies.
Even more interesting, a voting system that is ideally fair in every scenario is [provably impossible][arrows].

If you want to learn more about STV, the [wikipedia page][stv] is helpful.
C.G.P Grey also has an excellent youtube series on [voting][cgpgrey] that ends with a [great explanation of STV][stvvideo].

[post]: https://en.wikipedia.org/wiki/First-past-the-post_voting
[arrows]: https://en.wikipedia.org/wiki/Arrow%27s_impossibility_theorem
[stv]: https://en.wikipedia.org/wiki/Single_transferable_vote
[cgpgrey]: http://www.cgpgrey.com/politics-in-the-animal-kingdom/
[stvvideo]: https://www.youtube.com/watch?v=l8XOZJkozfI
