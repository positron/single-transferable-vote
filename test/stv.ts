/// <reference path="../typings//globals/es6-shim/index.d.ts"/>
/// <reference path="../typings//globals/chai/index.d.ts"/>
/// <reference path="../typings//globals/mocha/index.d.ts"/>
// references only necessary to make IDEs that don't respect typings.json happy

import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import * as Chai from 'chai';

import { getWinners, Ballot } from '../src/stv';

const expect = Chai.expect;

@suite
class STV {
  @test emptyBallotInput() {
    // TODO: throw errors for invalid parameters
    //expect(getWinners([], [], 1)).to.deep.equal([]);
  }

  @test oneWinnerTwoCandidates() {
    const candidates = [1, 2];
    const vote1: Ballot = { orderedPreferences: [1] };
    const vote12: Ballot = { orderedPreferences: [1, 2] };
    const vote2: Ballot = { orderedPreferences: [2] };
    const vote21: Ballot = { orderedPreferences: [2, 1] };

    // Cases with 1 vote
    expect(getWinners(candidates, [vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote12], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote2], 1)).to.deep.equal([2]);
    expect(getWinners(candidates, [vote21], 1)).to.deep.equal([2]);

    // Multiple votes
    expect(getWinners(candidates, [vote1, vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote1, vote12], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote12, vote12], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote1, vote1, vote2], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote1, vote12, vote21], 1)).to.deep.equal([1]);
    expect(getWinners(candidates, [vote2, vote2], 1)).to.deep.equal([2]);
    expect(getWinners(candidates, [vote2, vote21], 1)).to.deep.equal([2]);
    expect(getWinners(candidates, [vote21, vote21], 1)).to.deep.equal([2]);
    expect(getWinners(candidates, [vote2, vote2, vote1], 1)).to.deep.equal([2]);
    expect(getWinners(candidates, [vote2, vote21, vote12], 1)).to.deep.equal([2]);

    // TODO: what should happen for [vote1, vote2] and [vote12, vote2]?
  }

  // TOOD: what happens when you are spreading votes but nobody (or very few)
  //       ballots have a second choice after that candidate?
}
