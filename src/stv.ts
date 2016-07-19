/// <reference path="../typings//globals/es6-shim/index.d.ts"/>
// references only necessary to make IDEs that don't respect typings.json happy

export interface Ballot {
  orderedPreferences: number[]
};

// TODO: user a candiate = number typedef?
// TODO: just take a numCandidates and then validate to make sure each ballot
//       only takes votes for candidates with a value <= numCandidates


export function getWinners(candidates: number[], ballots: Ballot[], seatsToFill: number): any[] {
  // TODO: validate inputs

  // The Droop quota is the most commonly used method to determine the number of votes to win
  // in a STV system. It is the smallest number that guarantees that no more candidates can be
  // selected than there are seats to fill. For example, right above 51% of the votes in an
  // election with a single winner. Votes above the quota are transfered to other candidates.
  const votesToWin = calculateDroopQuota(ballots.length, 1);
  console.log("votesToWin", votesToWin);

  // Running total of candidates already declared winners and losers. These are used to know
  // which candidates are already disqualified when spreading votes.
  let winners: number[] = [];
  let losers: number[] = [];

  let votesPerCandidate = calculateInitialVotesPerCandidate();
  console.log("votesPerCandidate: ", votesPerCandidate); // TODO get debugging set up :)

  while (winners.length < seatsToFill) {
    // Calculate winners and spread the votes from the winners until we need to spread votes
    // from the biggest loser.
    let winnersThisRound = calculateWinners();
    console.log("winnersThisRound", winnersThisRound);
    while (winnersThisRound.length !== 0) {
      spreadVotesFrom(winnersThisRound, votesToWin);
      winners = winners.concat(winnersThisRound);
      if (winners.length >= seatsToFill) {
        return winners.slice(0, seatsToFill);
      }
      winnersThisRound = calculateWinners();
    }
    // now calculate the biggest loser and spread votes from them
    const loser = calculateBiggestLoser();
    spreadVotesFrom([loser], 0);

    //const winnersThisRound = calculateWinnersThisRound(ballots, candidates, winners.concat(losers), votesToWin);
    //winners = winners.concat(winnersThisRound);
  }

  function calculateInitialVotesPerCandidate(): Map<number, number> {
    let votesPerCandidate = new Map<number, number>();
    candidates.forEach((candidate) => votesPerCandidate.set(candidate, 0));
    ballots.map(ballot => ballot.orderedPreferences[0])
      .filter(vote => vote !== undefined)
      .forEach(vote => votesPerCandidate.set(vote, votesPerCandidate.get(vote) + 1))
    return votesPerCandidate;
  }

  function calculateWinners(): number[] {
    // TODO type this more soundly with destructuring (spread operator I think)
    // TODO use Map.forEach
    return Array.from(votesPerCandidate.entries())
      .filter(candidateVotes => candidateVotes[1] >= votesToWin)
      //.filter(candidateVotes => { console.log(candidateVotes); return candidateVotes[1] > votesToWin; })
      .sort((a, b) => a[1] - b[1])
      .map(candidate => candidate[0])
  }

  // spreads votes from
  function spreadVotesFrom(candidates: number[], votesToLeave: number): void {
    const disqualifiedCandidates = winners.concat(losers);

    // calculate percentage of votes each candidate got that goes to another candidate
    candidates.forEach(candidate => {
      // assert votes >= votesToLeave

      const ballotsForThisCandidate = ballots.filter(ballot => {
        // only count ballots who's top remaining preference is this candidate
        return ballot.orderedPreferences
          .find((preference => disqualifiedCandidates.indexOf(preference) <= 0)) === candidate;
      });
      console.log("ballotsForThisCandidate", ballotsForThisCandidate);
      disqualifiedCandidates.push(candidate);
      const nextPrefs = ballotsForThisCandidate.map(ballot => {
        return ballot.orderedPreferences
          .find((preference => disqualifiedCandidates.indexOf(preference) <= 0));
      }).filter(nextPref => nextPref !== undefined); // TOOD: what to do with the undefineds in here?
      console.log("nextPrefs", nextPrefs);

      const votesToCandidate = nextPrefs.reduce((votesMap, nextVote) => {
        return votesMap.set(nextVote, (votesMap.get(nextVote) || 0) + 1);
      }, new Map<number, number>());

      console.log("votesToCandidate", votesToCandidate);
      let totalVotes = Array.from(votesToCandidate.values())
        .reduce((a, b) => a + b);

      let percentageToCandidate = new Map<number, number>();
      votesToCandidate.forEach((candidate, votes) => {
        percentageToCandidate.set(candidate, votes / totalVotes);
      });

      const votesToSpread = totalVotes - votesToLeave;
      percentageToCandidate.forEach((candidate, percentage) => {
        // fractions of votes are allowed
        votesPerCandidate.set(candidate, votesPerCandidate.get(candidate) + totalVotes * percentage);
      });
    });
  }

  function calculateBiggestLoser(): number {
    // TODO
    return 0;
  }

  return [];
}

function calculateDroopQuota(votesCast: number, seatsToFill: number): number {
  return Math.floor(votesCast / (seatsToFill + 1)) + 1;
}

function calculateWinnersThisRound(ballots: Ballot[], candidates: number[], disqualifiedCandidates: number[], votesToWin: number): number[] {
  const topPreferences: number[] = ballots.map((ballot) => {
    return ballot.orderedPreferences.find((preference) => disqualifiedCandidates.indexOf(preference) > 0);
  }).filter((topPreference) => topPreference != undefined);

  // TODO: just use an array for performance here
  let votesPerCandidate = new Map<number, number>();
  candidates.forEach((candidate) => votesPerCandidate.set(candidate, 0));

  topPreferences.forEach((vote) => votesPerCandidate.set(vote, votesPerCandidate.get(vote) + 1));

  return topPreferences.filter((votes) => votes >= votesToWin);
}
