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

  // Simple scenarios where one candidate wins the majority of first preference votes
  @test oneWinnerMultipleCandidatesOneRound() {
    const candidates3 = [1, 2, 3];
    const vote1: Ballot = { orderedPreferences: [1] };
    const vote123: Ballot = { orderedPreferences: [1, 2, 3] };
    const vote32: Ballot = { orderedPreferences: [3, 2] };

    expect(getWinners(candidates3, [vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates3, [vote123], 1)).to.deep.equal([1]);
    expect(getWinners(candidates3, [vote123, vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates3, [vote1, vote123, vote32], 1)).to.deep.equal([1]);
    expect(getWinners(candidates3, [vote32, vote123, vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates3, [vote32, vote123, vote32], 1)).to.deep.equal([3]);

    const candidates10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const vote10: Ballot = { orderedPreferences: [10] };
    const vote12345678910: Ballot = { orderedPreferences: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
    const vote10987654321: Ballot = { orderedPreferences: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] };
    const vote8642: Ballot = { orderedPreferences: [8, 6, 4, 2] };
    const vote3579: Ballot = { orderedPreferences: [3, 5, 7, 9] };

    expect(getWinners(candidates10, [vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates10, [vote12345678910], 1)).to.deep.equal([1]);
    expect(getWinners(candidates10, [vote12345678910, vote1], 1)).to.deep.equal([1]);
    expect(getWinners(candidates10, [vote12345678910, vote1, vote10987654321, vote32, vote123], 1)).to.deep.equal([1]);
    expect(getWinners(candidates10, [vote8642, vote32, vote3579, vote10987654321, vote1, vote8642], 1)).to.deep.equal([8]);
    expect(getWinners(candidates10, [vote12345678910, vote10987654321, vote10, vote32, vote8642], 1)).to.deep.equal([10]);
  }

  // Scenarios where the vote has to go multiple rounds due to candidates not getting to 51% on the first round
  @test oneWinnerMultipleCandidatesLoserElimination() {
    const candidates3 = [1, 2, 3];
    const vote1: Ballot = { orderedPreferences: [1] };
    const vote2: Ballot = { orderedPreferences: [2] };
    const vote123: Ballot = { orderedPreferences: [1, 2, 3] };
    const vote32: Ballot = { orderedPreferences: [3, 2] };

    expect(getWinners(candidates3, [vote1, vote32, vote2], 1)).to.deep.equal([2]);
  }

  // Scenarios where the votes only have to go one round to determine multiple winners
  @test multipleWinnersOneRound() {
    // TODO
  }

  // TOOD: what happens when you are spreading votes but nobody (or very few)
  //       ballots have a second choice after that candidate? (What is the term openSTV uses for that?)
}
